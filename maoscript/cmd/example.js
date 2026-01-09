module.exports = {
    name: "example",
    category: "utility",
    role: 0,
    description: "Template pembuatan command bot",
    
    // 1. MAOSTART: Dipanggil saat user mengetik {prefix}example
    maoStart: async ({ hehe }) => {
        const { bot, chatId, args, config } = hehe;
        let teks = `📖 *TEMPLATE COMMAND BOT*\n─────────────────\n`;
        teks += `Ketik \`${config.prefix}example code\` untuk melihat kode lengkap.\n\n`;
        teks += `*Fungsi Utama:*\n`;
        teks += `• \`maoStart\`: Respon command utama.\n`;
        teks += `• \`maoChat\`: Respon setiap ada chat masuk.\n`;
        teks += `• \`maoReply\`: Respon saat pesan direply.\n`;
        teks += `• \`maoLoad\`: Fungsi saat bot baru dinyalakan.`;
        
        if (args[0] === 'code') {
            const code = "```javascript\n" +
            "module.exports = {\n" +
            "    name: \"nama_cmd\",\n" +
            "    category: \"kategori\",\n" +
            "    role: 0, // 0: User, 1: Admin, 2: Owner\n" +
            "    description: \"Deskripsi command\",\n\n" +
            "    // Command Utama\n" +
            "    maoStart: async ({ hehe }) => {\n" +
            "        const { bot, chatId, args } = hehe;\n" +
            "        await bot.sendMessage(chatId, \"Respon Start!\");\n" +
            "    },\n\n" +
            "    // Monitor Setiap Chat\n" +
            "    maoChat: async ({ hehe }) => {\n" +
            "        const { body } = hehe;\n" +
            "        if (body === 'p') console.log('Ada yang p');\n" +
            "    },\n\n" +
            "    // Respon Reply\n" +
            "    maoReply: async ({ hehe }) => {\n" +
            "        const { bot, chatId } = hehe;\n" +
            "        await bot.sendMessage(chatId, \"Kamu mereply pesan ini!\");\n" +
            "    }\n" +
            "};\n```";
            return bot.sendMessage(chatId, code, { parse_mode: 'Markdown' });
        }

        return bot.sendMessage(chatId, teks, { parse_mode: 'Markdown' });
    }
};