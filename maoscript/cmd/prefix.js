const fs = require('fs');
const path = require('path');

const jsonDir = path.join(process.cwd(), 'maojson');
const groupDbPath = path.join(jsonDir, 'group_settings.json');

module.exports = {
    name: "prefix",
    category: "utility",
    role: 0,
    description: "Cek atau ganti prefix bot (Global/Grup)",
    
    maoStart: async ({ hehe }) => {
        const { bot, chatId, args, config, isOwner, msg, isDiscord } = hehe;
        const settingsPath = path.join(process.cwd(), 'settings.js');

        if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir);
        if (!fs.existsSync(groupDbPath)) fs.writeFileSync(groupDbPath, '{}');

        const subCommand = args[0] ? args[0].toLowerCase() : null;

        // --- FITUR 1: PREFIX BOX (KHUSUS GRUP/SERVER) ---
        if (subCommand === 'box') {
            let isGroup = false;
            let isAdminGrup = false;

            if (isDiscord) {
                // Logika Discord
                isGroup = msg.guild !== null;
                // Cek apakah user punya permission Manage Guild (Admin)
                isAdminGrup = msg.member && msg.member.permissions.has("ManageGuild");
            } else {
                // Logika Telegram
                isGroup = msg.chat.type !== 'private';
                const chatMember = await bot.getChatMember(chatId, msg.from.id);
                isAdminGrup = ['administrator', 'creator'].includes(chatMember.status);
            }

            if (!isGroup) return bot.sendMessage(chatId, "❌ Fitur `prefix box` cuma bisa di dalam grup/server, Bang!");
            if (!isAdminGrup && !isOwner) return bot.sendMessage(chatId, "🚫 Cuma Admin atau Owner yang bisa ganti prefix grup!");

            const newPrefix = args[1];
            if (!newPrefix) return bot.sendMessage(chatId, `⚠️ Masukkan prefix barunya!\nContoh: \`${config.prefix}prefix box +\``);

            const groupDb = JSON.parse(fs.readFileSync(groupDbPath, 'utf8'));
            groupDb[chatId] = { prefix: newPrefix };
            fs.writeFileSync(groupDbPath, JSON.stringify(groupDb, null, 2));

            return bot.sendMessage(chatId, `✅ **Berhasil!** Prefix khusus di sini diganti menjadi: \`${newPrefix}\``);
        }

        // --- FITUR 2: GANTI UNIVERSAL (OWNER ONLY) ---
        if (subCommand && !['box'].includes(subCommand)) {
            if (!isOwner) return bot.sendMessage(chatId, "🚫 Cuma Owner yang bisa ganti prefix global!");
            
            const newGlobal = args[0];
            config.prefix = newGlobal;
            
            try {
                let settingsContent = fs.readFileSync(settingsPath, 'utf8');
                settingsContent = settingsContent.replace(/prefix:\s*["'].*?["']/, `prefix: "${newGlobal}"`);
                fs.writeFileSync(settingsPath, settingsContent);
                return bot.sendMessage(chatId, `🌍 **Prefix Global** diganti menjadi: \`${newGlobal}\``);
            } catch (e) {
                return bot.sendMessage(chatId, "❌ Gagal mengupdate file settings.js");
            }
        }

        // --- FITUR 3: CEK PREFIX SAAT INI ---
        const groupDb = JSON.parse(fs.readFileSync(groupDbPath, 'utf8'));
        const currentPrefix = (groupDb[chatId] && groupDb[chatId].prefix) ? groupDb[chatId].prefix : config.prefix;
        
        return bot.sendMessage(chatId, `📍 Prefix di sini: \`${currentPrefix}\``);
    },

    maoChat: async ({ hehe }) => {
        const { bot, chatId, body, config } = hehe;
        // Jika user cuma ketik "prefix" tanpa simbol apapun
        if (body.toLowerCase().trim() === 'prefix') {
            const groupDb = fs.existsSync(groupDbPath) ? JSON.parse(fs.readFileSync(groupDbPath, 'utf8')) : {};
            const pfx = (groupDb[chatId] && groupDb[chatId].prefix) ? groupDb[chatId].prefix : config.prefix;
            return bot.sendMessage(chatId, `📍 Prefix di sini: \`${pfx}\``);
        }
    }
};