module.exports = {
    name: "leave",
    maoEvent: async ({ hehe }) => {
        const { bot, msg } = hehe;

        // Cek apakah ada member keluar
        if (msg.left_chat_member) {
            const member = msg.left_chat_member;
            
            // Jangan kirim pesan kalau bot yang dikeluarkan
            if (member.id === (await bot.getMe()).id) return;

            const nama = member.first_name;
            const teks = `🏃 *Member Keluar*\n─────────────────\nSi ${nama} barusan keluar atau dikick dari grup. Selamat tinggal kawan! 👋`;

            await bot.sendMessage(msg.chat.id, teks, { parse_mode: 'Markdown' });
        }
    }
};