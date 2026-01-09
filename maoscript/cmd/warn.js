const fs = require('fs');
const path = require('path');

module.exports = {
    name: "warn",
    category: "admin grup",
    role: 1, 
    description: "Sistem peringatan member (Auto Kick)",
    maoStart: async ({ hehe }) => {
        const { bot, chatId, args, msg, isOwner, config, isDiscord } = hehe;
        const dbPath = path.join(process.cwd(), 'maojson', 'mao_warn.json');
        
        if (!fs.existsSync(path.join(process.cwd(), 'maojson'))) fs.mkdirSync(path.join(process.cwd(), 'maojson'));
        let db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : {};

        const sub = args[0] ? args[0].toLowerCase() : null;

        if (sub === 'list') {
            let warnGroup = db[chatId] || {};
            let keys = Object.keys(warnGroup);
            if (!keys.length) return bot.sendMessage(chatId, "📭 Belum ada member yang kena peringatan.");
            
            let teks = "📝 **Daftar Warn di Sini**\n─────────────────\n";
            keys.forEach((uid, i) => {
                teks += `${i + 1}. ID: \`${uid}\` - [${warnGroup[uid].length}/3]\n`;
            });
            return bot.sendMessage(chatId, teks);
        }

        if (sub === 'reset') {
            if (!isOwner) return bot.sendMessage(chatId, "🚫 Khusus Owner.");
            db[chatId] = {};
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return bot.sendMessage(chatId, "✅ Data warn di sini telah direset.");
        }

        let targetId, reason, discordMember;

        if (isDiscord) {
            if (msg.reference) {
                const repliedMsg = await msg.channel.messages.fetch(msg.reference.messageId);
                targetId = repliedMsg.author.id;
                discordMember = msg.guild.members.cache.get(targetId);
                reason = args.join(" ") || "Tidak ada alasan";
            } else if (msg.mentions.users.size > 0) {
                targetId = msg.mentions.users.first().id;
                discordMember = msg.guild.members.cache.get(targetId);
                reason = args.slice(1).join(" ") || "Tidak ada alasan";
            } else {
                return bot.sendMessage(chatId, "⚠️ Tag atau reply orang yang mau di-warn!");
            }
            if (targetId === msg.client.user.id) return bot.sendMessage(chatId, "Mana bisa warn bot sendiri! 🗿");
        } else {
            if (msg.reply_to_message) {
                targetId = msg.reply_to_message.from.id;
                reason = args.join(" ") || "Tidak ada alasan";
            } else {
                return bot.sendMessage(chatId, "⚠️ Reply pesan orang yang mau di-warn!");
            }
            const me = await bot.getMe();
            if (targetId == me.id) return bot.sendMessage(chatId, "Gak bisa warn bot sendiri! 🗿");
        }

        if (!db[chatId]) db[chatId] = {};
        if (!db[chatId][targetId]) db[chatId][targetId] = [];

        db[chatId][targetId].push({
            reason: reason,
            date: new Date().toLocaleString()
        });

        const count = db[chatId][targetId].length;

        if (count >= 3) {
            delete db[chatId][targetId];
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            try {
                if (isDiscord) {
                    if (discordMember) await discordMember.kick(reason);
                } else {
                    await bot.banChatMember(chatId, targetId);
                    await bot.unbanChatMember(chatId, targetId);
                }
                return bot.sendMessage(chatId, `🚫 **BANNED (3/3)**\n─────────────────\nUser \`${targetId}\` telah dikeluarkan karena sudah 3x melanggar.\nAlasan terakhir: ${reason}`);
            } catch (e) {
                return bot.sendMessage(chatId, `⚠️ Gagal kick! Pastikan bot punya izin admin.`);
            }
        } else {
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return bot.sendMessage(chatId, `⚠️ **WARNING [${count}/3]**\n─────────────────\nUser: \`${targetId}\`\nAlasan: ${reason}`);
        }
    }
};