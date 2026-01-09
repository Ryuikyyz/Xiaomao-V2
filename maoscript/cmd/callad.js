module.exports = {
    name: "callad",
    category: "umum",
    role: 0,
    description: "Kirim laporan atau pesan ke Admin Bot",
    maoStart: async ({ hehe }) => {
        const { bot, msg, args, config, chatId, senderId, isDiscord } = hehe;
        const laporan = args.join(" ");
        if (!laporan) return bot.sendMessage(chatId, "❌ Masukkan pesan laporan!");

        const adminIDs = isDiscord ? (config.adminDc || []) : (Array.isArray(config.adminID) ? config.adminID : [config.adminID]);
        let senderName = isDiscord ? msg.author.username : msg.from.first_name;
        let chatTitle = isDiscord ? (msg.guild ? msg.guild.name : "DM Discord") : (msg.chat.title || "Private Chat");

        let teks = `==📨 **PANGGILAN ADMIN** 📨==\n👤 Dari: ${senderName}\n🆔 ID User: \`${senderId}\`\n📍 Chat: ${chatTitle}\n` +
                   `─────────────────\n📝 Pesan: ${laporan}\n─────────────────\nID Chat: \`${chatId}\`\n💡 **Reply pesan ini** untuk membalas.`;

        for (const admin of adminIDs) {
            try {
                await bot.sendMessage(admin, teks);
            } catch (e) { console.log("Gagal ke admin:", admin); }
        }
        return bot.sendMessage(chatId, "✅ Laporan terkirim!");
    },

    maoReply: async ({ hehe }) => {
        const { bot, msg, config, chatId, isDiscord } = hehe;
        const replyMsg = isDiscord ? (msg.reference ? await msg.channel.messages.fetch(msg.reference.messageId) : null) : msg.reply_to_message;
        if (!replyMsg) return;

        const content = isDiscord ? replyMsg.content : (replyMsg.text || "");
        if (!content.includes("ID Chat:")) return;

        try {
            // Ambil ID Chat: support ID Telegram (-123) dan Discord (123)
            const parts = content.split("ID Chat:");
            const rawId = parts[1].split("\n")[0];
            const targetChatId = rawId.replace(/[`*]/g, "").trim(); // Cuma buang backtick dan bintang, spasi di-trim

            const admins = isDiscord ? (config.adminDc || []) : (Array.isArray(config.adminID) ? config.adminID : [config.adminID.toString()]);
            const senderId = isDiscord ? msg.author.id : msg.from.id;
            const isFromAdmin = admins.includes(senderId.toString());

            let teksBalasan = isFromAdmin ? `📍 **Balasan dari Admin:**\n` : `📝 **Feedback dari User:**\n`;
            if (!isFromAdmin) teksBalasan += `👤 Nama: ${isDiscord ? msg.author.username : msg.from.first_name}\n`;
            
            teksBalasan += `─────────────────\n${isDiscord ? msg.content : msg.text}\n─────────────────\n` +
                           `ID Chat: \`${chatId}\`\n💡 **Reply pesan ini** untuk membalas.`;

            await bot.sendMessage(targetChatId, teksBalasan);
            await bot.sendMessage(chatId, "🚀 **Pesan Terkirim!**");
        } catch (e) {
            await bot.sendMessage(chatId, "❌ Gagal: Target tidak ditemukan.");
        }
    }
};