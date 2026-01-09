const mao = require('maotele');
const config = require('./settings');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const checkRole = require('./maolib/role');
const startDiscord = require('./maodc');

const bot = mao(config.botToken);
const commands = new Map();
const events = new Map();

const cmdPath = path.join(__dirname, 'maoscript/cmd');
if (fs.existsSync(cmdPath)) {
    fs.readdirSync(cmdPath).forEach(file => {
        if (file.endsWith('.js')) {
            try {
                const props = require(path.join(cmdPath, file));
                commands.set(props.name, props);
                if (props.name === 'restart' && props.maoLoad) props.maoLoad(bot);
            } catch (e) {
                console.log(`❌ Gagal memuat command ${file}:`, e.message);
            }
        }
    });
}

const eventPath = path.join(__dirname, 'maoscript/mao');
if (fs.existsSync(eventPath)) {
    fs.readdirSync(eventPath).forEach(file => {
        if (file.endsWith('.js')) {
            try {
                const props = require(path.join(eventPath, file));
                events.set(props.name, props);
            } catch (e) {
                console.log(`❌ Gagal memuat event ${file}:`, e.message);
            }
        }
    });
}

const listen = () => {
    let lastUpdateId = 0;
    const poll = async () => {
        try {
            if (!config.botToken) return;
            const res = await axios.get(`https://api.telegram.org/bot${config.botToken}/getUpdates`, {
                params: { offset: lastUpdateId + 1, timeout: 30 }
            });

            if (res.data.result && res.data.result.length > 0) {
                for (const update of res.data.result) {
                    lastUpdateId = update.update_id;
                    if (update.callback_query) {
                        const callback = update.callback_query;
                        for (const [name, cmd] of commands) {
                            if (cmd.maoCallback) await cmd.maoCallback({ bot, callback, config }).catch(e => {});
                        }
                        continue; 
                    }

                    const msg = update.message || update.edited_message;
                    if (!msg || !msg.chat) continue;

                    const chatId = msg.chat.id;
                    const body = (msg.text || "").trim();
                    const args = body.split(/ +/);
                    const groupDbPath = path.join(__dirname, 'maojson', 'group_settings.json');

                    let prefix = config.prefix || "-";
                    if (msg.chat.type !== 'private') {
                        if (!fs.existsSync(path.join(__dirname, 'maojson'))) fs.mkdirSync(path.join(__dirname, 'maojson'));
                        let gdb = fs.existsSync(groupDbPath) ? JSON.parse(fs.readFileSync(groupDbPath, 'utf8')) : {};
                        if (!gdb[chatId]) {
                            gdb[chatId] = { prefix: config.prefix };
                            fs.writeFileSync(groupDbPath, JSON.stringify(gdb, null, 2));
                        }
                        prefix = gdb[chatId].prefix || config.prefix;
                    }

                    const isOwner = msg.from && (Array.isArray(config.adminID) ? config.adminID.includes(msg.from.id.toString()) : msg.from.id.toString() === config.adminID.toString());
                    const hehe = { bot, msg, update, args, body, commands, config, events, chatId, senderId: msg.from ? msg.from.id : null, isOwner, isDiscord: false };

                    if (msg.reply_to_message) {
                        for (const [name, cmd] of commands) {
                            if (cmd.maoReply) await cmd.maoReply({ hehe }).catch(e => {});
                        }
                    }

                    for (const [name, event] of events) {
                        if (event.maoEvent) await event.maoEvent({ hehe }).catch(e => {});
                    }

                    if (!body.startsWith(prefix)) continue;

                    if (body === prefix) {
                        await bot.sendMessage(chatId, `👋 Hai! *${config.botName}* di sini.\nKetik \`${prefix}menu\` untuk bantuan.`, { parse_mode: 'Markdown' });
                        continue;
                    }

                    const commandName = args.shift().toLowerCase().slice(prefix.length);
                    const command = commands.get(commandName);

                    for (const [name, cmd] of commands) {
                        if (cmd.maoChat) await cmd.maoChat({ hehe }).catch(e => {});
                    }

                    if (command) {
                        if (config.isMaintenance && !isOwner) {
                            await bot.sendMessage(chatId, "⚠️ *Bot sedang maintenance!*", { parse_mode: 'Markdown' });
                            continue;
                        }
                        const roleStatus = await checkRole(bot, msg, command.role || 0);
                        if (!roleStatus.canAccess) {
                            await bot.sendMessage(chatId, roleStatus.msg, { parse_mode: 'Markdown' });
                            continue;
                        }
                        if (command.maoStart) await command.maoStart({ hehe }).catch(e => {});
                    } else {
                        await bot.sendMessage(chatId, `❌ Command \`${commandName}\` tidak ditemukan!\nKetik \`${prefix}menu\` untuk melihat daftar command.`, { parse_mode: 'Markdown' });
                    }
                }
            }
        } catch (e) {}
        setTimeout(poll, 1000);
    };
    poll();
};

console.log(`--- 🚀 ${config.botName.toUpperCase()} HYBRID SYSTEM ---`);
if (config.botToken && config.botToken.length > 10) {
    console.log("✅ [TELEGRAM] Layanan aktif.");
    listen();
}
if (config.TokenDc && config.TokenDc.length > 10) {
    console.log("✅ [DISCORD] Layanan aktif.");
    startDiscord(config.TokenDc, config, commands);
}