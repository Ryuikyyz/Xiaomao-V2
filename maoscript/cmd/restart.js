const fs = require('fs-extra');
const path = require('path');

module.exports = {
    name: "restart",
    role: 2,
    category: "owner",
    description: "Restart bot (Tele & Discord)",
    maoLoad: async (bot) => {
        const pathFile = path.join(process.cwd(), 'restart.txt');
        if (fs.existsSync(pathFile)) {
            try {
                const content = fs.readFileSync(pathFile, "utf-8");
                if (!content) return fs.unlinkSync(pathFile);
                
                // Format baru: [chatId] [time] [platform]
                const [chatId, time, platform] = content.split(" ");
                const detik = ((Date.now() - time) / 1000).toFixed(2);
                const teks = `✅ **Bot Berhasil Restart!**\n⏰ Waktu: \`${detik} detik\``;

                if (platform === 'discord') {
                    // Kita perlu nunggu Engine Discord ready sebentar
                    // Tapi karena maoLoad dipanggil di index.js awal, 
                    // Kita pake trik kirim via axios/manual ke Discord API atau 
                    // titip lewat global variable jika bot discord sudah ready.
                    // Cara paling simpel & aman: Kirim via HTTP Post (Webhook/API)
                    
                    // Namun, karena ini dijalankan saat index load, cara termudah adalah 
                    // Menggunakan pengecekan apakah bot discord sudah login.
                    // Untuk simpelnya, kita buat laporannya universal:
                    console.log(`✨ Bot Restarted in ${detik}s (Platform: ${platform})`);
                } else {
                    await bot.sendMessage(chatId, teks.replace(/\*\*/g, '*'), { parse_mode: 'Markdown' });
                }
                
                // Hapus file setelah lapor (Tele saja, untuk DC nanti kita handle di maodc)
                if (platform !== 'discord') fs.unlinkSync(pathFile);
            } catch (e) {
                if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
            }
        }
    },
    maoStart: async ({ hehe }) => {
        const { bot, chatId, isDiscord } = hehe;
        const pathFile = path.join(process.cwd(), 'restart.txt');
        try {
            if (fs.existsSync(pathFile)) return; 
            
            // Simpan platformnya juga (tele/discord)
            const platform = isDiscord ? 'discord' : 'telegram';
            fs.writeFileSync(pathFile, `${chatId} ${Date.now()} ${platform}`);
            
            const teks = isDiscord ? "**🔄 Sedang merestart...** Tunggu sebentar!" : "🔄 *Sedang merestart...* Tunggu sebentar!";
            await bot.sendMessage(chatId, teks, { parse_mode: 'Markdown' });
            
            setTimeout(() => {
                process.exit(2);
            }, 3000); // 3 detik aja cukup Wak biar gak kelamaan nunggu
        } catch (e) {
            await bot.sendMessage(chatId, "❌ Gagal merestart.");
        }
    }
};