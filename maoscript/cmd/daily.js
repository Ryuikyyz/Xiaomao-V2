const fs = require('fs');
const path = require('path');

const jsonDir = path.join(process.cwd(), 'maojson');
if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir);

let discordWaiting = {}; 

module.exports = {
    name: "daily",
    category: "economy",
    role: 0,
    description: "Daily rewards (Tele: Button, DC: Keyword)",
    maoStart: async ({ hehe }) => {
        const { bot, chatId, senderId, config, isDiscord, isOwner } = hehe;
        const cooldownPath = path.join(jsonDir, 'cooldown_daily.json');
        
        if (!fs.existsSync(cooldownPath)) fs.writeFileSync(cooldownPath, '{}');
        const cooldowns = JSON.parse(fs.readFileSync(cooldownPath, 'utf8'));

        const lastClaim = cooldowns[senderId] || 0;
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (!isOwner && (now - lastClaim < oneDay)) {
            const remaining = oneDay - (now - lastClaim);
            const hours = Math.floor(remaining / (60 * 60 * 1000));
            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
            return bot.sendMessage(chatId, `⏳ **Sabar Bang!**\nAbang sudah ambil jatah hari ini. Tunggu **${hours} jam ${minutes} menit** lagi ya.`);
        }

        if (isDiscord) {
            discordWaiting[chatId + senderId] = true;
            let teks = `🎁 **Daily Reward (Discord)**\n─────────────────\nKetik **euro** untuk mengambil **5 Euro** gratis!`;
            if (isOwner) teks += `\n\n⭐ **Owner Mode:** Bebas claim berkali-kali!`;
            return bot.sendMessage(chatId, teks);
        } else {
            const opts = {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[{ text: "💰 Ambil 5 Euro", callback_data: `claim_daily_${senderId}` }]]
                }
            };
            let teks = "🎁 *Daily Reward*\n─────────────────\nKlik tombol di bawah untuk mengambil **5 Euro** gratis!";
            if (isOwner) teks += "\n\n⭐ *Owner Mode:* Anda bisa claim berkali-kali!";
            return bot.sendMessage(chatId, teks, opts);
        }
    },

    maoChat: async ({ hehe }) => {
        const { bot, chatId, senderId, body, isDiscord, isOwner } = hehe;
        
        if (isDiscord && body.toLowerCase().trim() === 'euro') {
            const key = chatId + senderId;
            
            if (discordWaiting[key]) {
                const dbPath = path.join(jsonDir, 'money.json');
                const cooldownPath = path.join(jsonDir, 'cooldown_daily.json');

                if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '{}');
                const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
                const cooldowns = JSON.parse(fs.readFileSync(cooldownPath, 'utf8'));

                if (!isOwner && (Date.now() - (cooldowns[senderId] || 0) < 86400000)) {
                    delete discordWaiting[key];
                    return;
                }

                db[senderId] = (db[senderId] || 0) + 5;
                cooldowns[senderId] = Date.now();
                fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
                fs.writeFileSync(cooldownPath, JSON.stringify(cooldowns, null, 2));

                delete discordWaiting[key];

                let resultTeks = `✅ **Claim Berhasil (Discord)!**\n─────────────────\nUang sebesar **5 Euro** telah masuk ke dompet kamu.`;
                if (isOwner) resultTeks += `\n\n🚀 **Owner Mode:** Claim sukses tanpa batas!`;
                
                return bot.sendMessage(chatId, resultTeks);
            }
        }
    },

    maoCallback: async ({ bot, callback, config }) => {
        const { data, from, message } = callback;
        const chatId = message.chat.id;
        const senderId = from.id;

        if (data.startsWith('claim_daily_')) {
            const targetUid = data.split('_')[2];
            if (senderId.toString() !== targetUid) return;

            const dbPath = path.join(jsonDir, 'money.json');
            const cooldownPath = path.join(jsonDir, 'cooldown_daily.json');
            
            const isAdmin = Array.isArray(config.adminID) ? config.adminID.includes(senderId.toString()) : senderId.toString() === config.adminID.toString();

            const db = JSON.parse(fs.readFileSync(dbPath, 'utf8') || '{}');
            const cooldowns = JSON.parse(fs.readFileSync(cooldownPath, 'utf8') || '{}');

            if (!isAdmin && (Date.now() - (cooldowns[senderId] || 0) < 86400000)) return;

            db[senderId] = (db[senderId] || 0) + 5;
            cooldowns[senderId] = Date.now();
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            fs.writeFileSync(cooldownPath, JSON.stringify(cooldowns, null, 2));

            try { await bot.deleteMessage(chatId, message.message_id); } catch (e) {}

            let resultTeks = `✅ *Claim Berhasil!*\n─────────────────\nUang sebesar **5 Euro** telah masuk ke dompet kamu.`;
            return bot.sendMessage(chatId, resultTeks, { parse_mode: 'Markdown' });
        }
    }
};