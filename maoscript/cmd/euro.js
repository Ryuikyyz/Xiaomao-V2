const fs = require('fs');
const path = require('path');

const jsonDir = path.join(process.cwd(), 'maojson');

module.exports = {
    name: "euro",
    category: "economy",
    role: 0,
    description: "Sistem ekonomi Euro (cek, add, reset)",
    maoStart: async ({ hehe }) => {
        const { bot, chatId, msg, args, senderId, isOwner, isDiscord } = hehe;
        const dbPath = path.join(jsonDir, 'money.json');

        // Pastikan folder dan file database ada
        if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });
        if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '{}');
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

        const subCommand = args[0] ? args[0].toLowerCase() : null;

        // --- FUNGSI MEMBERSIHKAN ID (Sangat Penting untuk Discord) ---
        const cleanId = (id) => id ? id.toString().replace(/[<@!>]/g, '') : null;

        // --- LOGIKA MENCARI TARGET DATA ---
        let targetId, targetName;

        if (isDiscord) {
            // Logika Discord
            if (msg.reference) { 
                const repliedMsg = await msg.channel.messages.fetch(msg.reference.messageId);
                targetId = cleanId(repliedMsg.author.id);
                targetName = repliedMsg.author.username;
            } else {
                // Ambil ID sendiri atau dari args[1] (jika mention manual)
                targetId = args[1] ? cleanId(args[1]) : cleanId(senderId);
                targetName = msg.author.username;
            }
        } else {
            // Logika Telegram
            if (msg.reply_to_message) {
                targetId = cleanId(msg.reply_to_message.from.id);
                targetName = msg.reply_to_message.from.first_name;
            } else {
                targetId = args[1] ? cleanId(args[1]) : cleanId(senderId);
                targetName = msg.from.first_name;
            }
        }

        // 1. FITUR ADD (KHUSUS OWNER)
        if (subCommand === 'add') {
            if (!isOwner) return bot.sendMessage(chatId, "🚫 Eitss, fitur ini cuma buat Owner bang!");
            
            let finalTarget;
            let amount;

            // Cek apakah ada reply atau mention
            const hasReply = isDiscord ? msg.reference : msg.reply_to_message;

            if (hasReply) {
                finalTarget = targetId;
                amount = parseInt(args[1]);
            } else {
                finalTarget = cleanId(args[1]);
                amount = parseInt(args[2]);
            }

            if (!finalTarget || isNaN(amount)) {
                return bot.sendMessage(chatId, "⚠️ *Format Salah!*\nGunakan: `-euro add [jumlah]` (reply) atau `-euro add [ID/Mention] [jumlah]`");
            }

            db[finalTarget] = (db[finalTarget] || 0) + amount;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return bot.sendMessage(chatId, `✅ Berhasil menambah \`${amount.toLocaleString()}\` Euro ke ID \`${finalTarget}\``);
        }

        // 2. FITUR RESET (KHUSUS OWNER)
        if (subCommand === 'reset') {
            if (!isOwner) return bot.sendMessage(chatId, "🚫 Fitur reset cuma buat Owner!");
            
            let finalTarget = args[1] ? cleanId(args[1]) : targetId;

            if (!finalTarget) return bot.sendMessage(chatId, "⚠️ Masukkan ID atau mention/reply orang yang mau direset!");

            db[finalTarget] = 0;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return bot.sendMessage(chatId, `🧹 Saldo ID \`${finalTarget}\` telah direset menjadi 0.`);
        }

        // 3. FITUR CEK SALDO (SEMUA USER)
        // Jika tidak ada subCommand, atau subCommand bukan add/reset, tampilkan saldo
        if (!subCommand || (subCommand !== 'add' && subCommand !== 'reset')) {
            const balance = db[targetId] || 0;
            return bot.sendMessage(chatId, `💶 *Dompet ${targetName}*\n─────────────────\nSaldo: \`${balance.toLocaleString()}\` Euro`);
        }
    }
};