const fs = require('fs');
const path = require('path');

module.exports = {
    name: "thread",
    category: "utility",
    role: 0,
    description: "Cek ID dan Daftar Grup/Server",
    maoStart: async ({ hehe }) => {
        const { bot, chatId, args, isOwner, msg, config, isDiscord } = hehe;
        const subCommand = args[0] ? args[0].toLowerCase() : null;

        if (subCommand === 'id') {
            let type, id;
            if (isDiscord) {
                type = msg.guild ? "Server ID" : "DM ID";
                id = chatId;
            } else {
                type = msg.chat.type === 'private' ? "User ID" : "Group ID";
                id = chatId;
            }
            return bot.sendMessage(chatId, `🆔 **Info ID**\n─────────────────\n**Tipe:** ${type}\n**ID:** \`${id}\``);
        }

        if (subCommand === 'list') {
            if (!isOwner) return bot.sendMessage(chatId, "🚫 Fitur `list` cuma bisa diakses Owner!");

            if (isDiscord) {
                const guilds = msg.client.guilds.cache;
                if (guilds.size === 0) return bot.sendMessage(chatId, "📭 Bot belum masuk ke server manapun.");

                let teks = "📝 **Daftar Server Discord**\n─────────────────\n";
                let i = 1;
                guilds.forEach(guild => {
                    teks += `${i++}. **${guild.name}**\n   ID: \`${guild.id}\` | Member: \`${guild.memberCount}\`\n\n`;
                });
                teks += `Total: **${guilds.size}** Server`;
                return bot.sendMessage(chatId, teks);
            } else {
                const groupDbPath = path.join(process.cwd(), 'maojson', 'group_settings.json');
                if (!fs.existsSync(groupDbPath)) return bot.sendMessage(chatId, "📭 Database kosong.");

                const groupDb = JSON.parse(fs.readFileSync(groupDbPath, 'utf8'));
                const groups = Object.keys(groupDb);
                if (groups.length === 0) return bot.sendMessage(chatId, "📭 Daftar grup masih kosong.");

                await bot.sendMessage(chatId, "🔍 **Sedang mengambil nama grup...**");

                let teks = "📝 **Daftar Grup Telegram**\n─────────────────\n";
                for (let i = 0; i < groups.length; i++) {
                    const id = groups[i];
                    let name;
                    try {
                        const chatInfo = await bot.getChat(id);
                        name = chatInfo.title || "Private Chat";
                    } catch (e) {
                        name = "Bot Sudah Keluar/ID Salah";
                    }
                    const pfx = groupDb[id].prefix || config.prefix;
                    teks += `${i + 1}. **${name}**\n   ID: \`${id}\` | Pfx: \`${pfx}\`\n\n`;
                }
                teks += `Total: **${groups.length}** Grup`;
                return bot.sendMessage(chatId, teks);
            }
        }

        return bot.sendMessage(chatId, `❓ **Cara Pakai Thread**\n─────────────────\n1. \`${config.prefix}thread id\`\n2. \`${config.prefix}thread list\``);
    }
};