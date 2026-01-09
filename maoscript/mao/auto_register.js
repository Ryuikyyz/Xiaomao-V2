const fs = require('fs');
const path = require('path');

module.exports = {
    name: "auto_admin_register",
    maoEvent: async ({ hehe }) => {
        const { bot, msg, config, update } = hehe;
        const groupDbPath = path.join(process.cwd(), 'maojson', 'group_settings.json');

        // Mencari update status member (khusus bot sendiri)
        // Note: Gunakan my_chat_member jika tersedia di library, 
        // tapi kita pakai logika status check di sini.
        
        const myChatMember = msg.chat_member || update.my_chat_member;
        if (myChatMember) {
            const botInfo = await bot.getMe();
            
            // Cek apakah yang berubah statusnya adalah bot ini
            if (myChatMember.new_chat_member.user.id === botInfo.id) {
                const newStatus = myChatMember.new_chat_member.status;

                // Jika status berubah jadi administrator
                if (newStatus === 'administrator') {
                    if (!fs.existsSync(path.join(process.cwd(), 'maojson'))) {
                        fs.mkdirSync(path.join(process.cwd(), 'maojson'));
                    }

                    let groupDb = fs.existsSync(groupDbPath) ? JSON.parse(fs.readFileSync(groupDbPath, 'utf8')) : {};

                    // Daftarkan ke JSON
                    groupDb[msg.chat.id] = { 
                        name: msg.chat.title || "Unknown Group",
                        prefix: config.prefix,
                        joinedAt: new Date().toLocaleString()
                    };
                    fs.writeFileSync(groupDbPath, JSON.stringify(groupDb, null, 2));

                    const teks = `🚀 *Bot Aktif! Memberi Salam...*\n─────────────────\nTerima kasih sudah menjadikanku Admin di *${msg.chat.title}*.\n\nSekarang aku bisa menjalankan semua fituku dengan lancar di grup ini.\n\nPrefix: \`${config.prefix}\`\nKetik \`${config.prefix}menu\` untuk bantuan.`;
                    
                    await bot.sendMessage(msg.chat.id, teks, { parse_mode: 'Markdown' });
                }
            }
        }
    }
};