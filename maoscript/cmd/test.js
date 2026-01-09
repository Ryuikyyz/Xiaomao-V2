module.exports = {
    name: "test",
    version: "1.0.0",
    author: "Iky",
    description: "Cek status bot dan reaksi emoji",
    category: "utility",
    role: 1, // 0 = User Biasa, 1 = Owner/Admin

    /**
     * maoStart - Jalan saat user ngetik: /test
     */
    maoStart: async ({ hehe }) => {
        const { bot, chatId, msg, config } = hehe;

        // Berikan reaksi emoji ke pesan user (Fix 400 Bad Request)
        await bot.setMessageReaction(chatId, msg.message_id, "🔥");

        // Kirim pesan balasan
        const teks = `
🚀 *MaoTele Active*

• *Version:* 1.0.0
• *Status:* Online
• *Prefix:* ${config.prefix}
• *Nama:* ${msg.from.first_name}

Bot berjalan lancar anjaya! 🗿
        `.trim();

        await bot.sendMessage(chatId, teks, { parse_mode: 'Markdown' });
    },

    /**
     * maoChat - Jalan otomatis setiap ada pesan masuk (monitoring)
     */
    maoChat: async ({ hehe }) => {
        const { bot, msg } = hehe;
        
        // Contoh: Jika ada yang bilang "p", kasih reaksi tanpa ganggu command lain
        if (msg.text && msg.text.toLowerCase() === 'p') {
            bot.setMessageReaction(msg.chat.id, msg.message_id, "🗿");
        }
    }
};