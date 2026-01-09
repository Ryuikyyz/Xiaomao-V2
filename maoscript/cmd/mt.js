const fs = require('fs');
const path = require('path');

module.exports = {
    name: "mt",
    category: "owner",
    role: 2,
    description: "Mengaktifkan/Matikan mode maintenance",
    maoStart: async ({ hehe }) => {
        const { bot, chatId, args, config } = hehe;
        const action = args[0] ? args[0].toLowerCase() : null;
        const settingsPath = path.join(process.cwd(), 'settings.js');

        if (action !== 'on' && action !== 'off') {
            return bot.sendMessage(chatId, "⚠️ Gunakan `-mt on` atau `-mt off` bang!");
        }

        const isMT = action === 'on';
        
        // Update di memori biar langsung ngefek
        config.isMaintenance = isMT;

        // Tulis ulang file settings.js agar tetap tersimpan saat restart
        let settingsContent = fs.readFileSync(settingsPath, 'utf8');
        settingsContent = settingsContent.replace(/isMaintenance: (true|false)/, `isMaintenance: ${isMT}`);
        fs.writeFileSync(settingsPath, settingsContent);

        const status = isMT ? "AKTIF (Hanya Owner yang bisa akses)" : "MATI (Semua user bisa akses)";
        return bot.sendMessage(chatId, `🛠️ *Mode Maintenance:* ${status}`, { parse_mode: 'Markdown' });
    }
};