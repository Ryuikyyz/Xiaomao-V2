const axios = require('axios');

module.exports = {
    name: "tr",
    category: "utility",
    role: 0,
    description: "Translate teks",
    maoStart: async ({ hehe }) => {
        const { bot, chatId, args, msg, config } = hehe;

        let targetLang = 'id';
        let textToTranslate = "";

        if (msg.reply_to_message) {
            targetLang = args[0] || 'id';
            textToTranslate = msg.reply_to_message.text || msg.reply_to_message.caption;
        } else {
            if (args.length < 2) {
                return bot.sendMessage(chatId, `❌ *Format Salah!*\n\n\`${config.prefix}tr <bahasa> <teks>\`\nContoh: \`${config.prefix}tr en halo\``, { parse_mode: 'Markdown' });
            }
            targetLang = args[0];
            textToTranslate = args.slice(1).join(" ");
        }

        if (!textToTranslate) return bot.sendMessage(chatId, "❌ Teks tidak ditemukan.");

        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`;
            const res = await axios.get(url);
            
            const translatedText = res.data[0].map(item => item[0]).join('');
            const sourceLang = res.data[2];

            const resultMsg = `🌐 *TRANSLATE*\n─────────────────\n*Asal:* ${sourceLang.toUpperCase()} ➔ *Ke:* ${targetLang.toUpperCase()}\n─────────────────\n${translatedText}`;

            return bot.sendMessage(chatId, resultMsg, { 
                parse_mode: 'Markdown',
                reply_to_message_id: msg.message_id 
            });

        } catch (error) {
            return bot.sendMessage(chatId, "❌ Gagal menerjemahkan.");
        }
    }
};