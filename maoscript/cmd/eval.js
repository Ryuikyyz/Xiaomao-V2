module.exports = {
    name: "eval",
    category: "owner",
    role: 2,
    description: "Menjalankan kode JavaScript secara instan",
    maoStart: async ({ hehe }) => {
        const { bot, msg, args, body, commands, config, chatId, senderId, isOwner } = hehe;
        
        const code = body.split(/ +/).slice(1).join(" ");
        
        if (!code) return bot.sendMessage(chatId, "❌ Masukkan kode yang ingin dijalankan!");

        const print = (text) => {
            if (typeof text === "object") text = JSON.stringify(text, null, 2);
            if (typeof text === "undefined") text = "undefined";
            bot.sendMessage(chatId, `\`\`\`javascript\n${text}\n\`\`\``, { parse_mode: 'Markdown' });
        };

        try {
            const result = await eval(`(async () => { 
                ${code} 
            })()`);
            
            if (result !== undefined) {
                print(result);
            }
        } catch (err) {
            bot.sendMessage(chatId, `❌ *Error:* \n\`\`\`javascript\n${err.stack || err}\n\`\`\``, { parse_mode: 'Markdown' });
        }
    }
};