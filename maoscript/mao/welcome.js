module.exports = {
    name: "welcome",
    maoEvent: async ({ hehe }) => {
        const { bot, msg, config } = hehe;

        // Cek apakah ada member baru
        if (msg.new_chat_members) {
            for (const member of msg.new_chat_members) {
                // Jangan sambut kalau yang join itu bot sendiri
                if (member.is_bot) continue;

                const nama = member.first_name;
                const grup = msg.chat.title;
                const teks = `👋 *Halo Member Baru!*\n─────────────────\nSelamat datang ${nama} di grup *${grup}*.\n\nSemoga betah ya bang! Jangan lupa baca peraturan grup. 🗿`;

                await bot.sendMessage(msg.chat.id, teks, { parse_mode: 'Markdown' });
            }
        }
    }
};