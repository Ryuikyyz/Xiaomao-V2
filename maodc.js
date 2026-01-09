const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');

const startDiscord = (token, config, commands) => {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildMembers
        ],
        partials: [Partials.Channel, Partials.Message]
    });

    client.once('ready', async () => {
        console.log(`✅ [DISCORD] ${config.botName} Online: ${client.user.tag}`);
        const pathFile = path.join(process.cwd(), 'restart.txt');
        if (fs.existsSync(pathFile)) {
            try {
                const content = fs.readFileSync(pathFile, "utf-8");
                const [chatId, time, platform] = content.split(" ");
                if (platform === 'discord') {
                    const channel = await client.channels.fetch(chatId);
                    if (channel) {
                        const detik = ((Date.now() - time) / 1000).toFixed(2);
                        await channel.send(`✅ **Bot Berhasil Restart!**\n⏰ Waktu: \`${detik} detik\``);
                    }
                    fs.unlinkSync(pathFile);
                }
            } catch (e) {}
        }
    });

    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        const groupDbPath = path.join(process.cwd(), 'maojson', 'group_settings.json');
        let currentPrefix = config.prefix || "-";
        
        if (message.guild) {
            if (fs.existsSync(groupDbPath)) {
                const groupDb = JSON.parse(fs.readFileSync(groupDbPath, 'utf8'));
                if (groupDb[message.channel.id] && groupDb[message.channel.id].prefix) {
                    currentPrefix = groupDb[message.channel.id].prefix;
                }
            }
        }

        const adminList = Array.isArray(config.adminDc) ? config.adminDc.map(id => id.toString()) : [config.adminDc?.toString()];
        const isOwner = adminList.includes(message.author.id.toString());
        
        const args = message.content.trim().split(/ +/);
        const body = message.content.trim();

        const hehe = {
            bot: {
                sendMessage: async (id, text) => {
                    try {
                        let target = client.channels.cache.get(id) || await client.users.fetch(id).catch(() => null);
                        if (target) {
                            return await target.send(text.replace(/\*/g, '**'));
                        } else {
                            target = await client.channels.fetch(id).catch(() => null);
                            if (target) return await target.send(text.replace(/\*/g, '**'));
                        }
                    } catch (e) {
                        console.error("❌ Gagal kirim pesan DC:", e.message);
                    }
                }
            },
            msg: message,
            args: args,
            body: body,
            config: config,
            chatId: message.channel.id,
            senderId: message.author.id,
            isOwner: isOwner,
            isDiscord: true
        };

        const checkRole = require('./maolib/role');

        if (message.reference) {
            for (const [name, cmd] of commands) {
                if (cmd.maoReply) await cmd.maoReply({ hehe }).catch(() => {});
            }
        }

        for (const [name, cmd] of commands) {
            if (cmd.maoChat) await cmd.maoChat({ hehe }).catch(() => {});
        }

        if (!body.startsWith(currentPrefix)) return;

        if (body === currentPrefix) {
            return await message.channel.send(`👋 Hai! **${config.botName}** di sini.\nKetik \`${currentPrefix}menu\` untuk bantuan.`);
        }

        const commandName = args.shift().toLowerCase().slice(currentPrefix.length);
        const command = commands.get(commandName);

        if (command) {
            if (config.isMaintenance && !isOwner) {
                return await message.channel.send("⚠️ **Bot sedang maintenance!**");
            }

            const roleStatus = await checkRole(client, message, command.role || 0);
            if (!roleStatus.canAccess) {
                return await message.channel.send(roleStatus.msg);
            }

            if (command.maoStart) {
                try {
                    await command.maoStart({ hehe });
                } catch (e) {
                    console.log(`❌ Error DC Cmd: ${commandName}`, e.message);
                }
            }
        } else {
            return await message.channel.send(`❌ Command \`${commandName}\` tidak ditemukan!\nKetik \`${currentPrefix}menu\` untuk melihat daftar command.`);
        }
    });

    client.login(token).catch(() => {});
};

module.exports = startDiscord;