const fs = require('fs');
const path = require('path');

module.exports = {
    name: "noti",
    category: "owner",
    role: 2, // Khusus Owner
    description: "Kirim pengumuman ke semua grup",
    maoStart: async ({ hehe }) => {
        const { bot, chatId, args, isOwner, config } = hehe;

        if (!isOwner) return bot.sendMessage(chatId, "🚫 Fitur ini hanya untuk Owner!");

        const pesan = args.join(" ");
        if (!pesan) return bot.sendMessage(chatId, "⚠️ Masukkan pesan yang ingin dikirim!\nContoh: `-noti Halo semua, bot akan update.`");

        const groupDbPath = path.join(process.cwd(), 'maojson', 'group_settings.json');
        if (!fs.existsSync(groupDbPath)) return bot.sendMessage(chatId, "❌ Database grup tidak ditemukan.");

        const groupDb = JSON.parse(fs.readFileSync(groupDbPath, 'utf8'));
        const groups = Object.keys(groupDb);

        if (groups.length === 0) return bot.sendMessage(chatId, "❌ Tidak ada grup terdaftar.");

        await bot.sendMessage(chatId, `⏳ Sedang mengirim notifikasi ke *${groups.length}* grup...`, { parse_mode: 'Markdown' });

        let sukses = 0;
        let gagal = 0;

        for (const targetId of groups) {
            try {
                const teksNoti = `🔔 *PESAN DARI ADMIN*\n─────────────────\n${pesan}\n─────────────────`;
                await bot.sendMessage(targetId, teksNoti, { parse_mode: 'Markdown' });
                sukses++;
                // Kasih delay dikit biar gak kena spam limit dari Telegram
                await new Promise(resolve => setTimeout(resolve, 1000)); 
            } catch (e) {
                gagal++;
                console.error(`Gagal kirim ke ${targetId}:`, e.message);
            }
        }

        return bot.sendMessage(chatId, `✅ *Notifikasi Selesai!*\n\n🚀 Berhasil: ${sukses}\n❌ Gagal: ${gagal}`, { parse_mode: 'Markdown' });
    }
};