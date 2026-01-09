const ms = require('ms');

module.exports = {
    name: "mute",
    category: "admin grup",
    role: 1,
    description: "Bungkam member dengan durasi (s, m, h, d)",
    maoStart: async ({ hehe }) => {
        const { bot, chatId, args, msg, config, isDiscord } = hehe;

        let targetId, targetName, discordMember;
        const duration = args[0];

        if (isDiscord) {
            if (msg.reference) {
                const repliedMsg = await msg.channel.messages.fetch(msg.reference.messageId);
                targetId = repliedMsg.author.id;
                discordMember = msg.guild.members.cache.get(targetId);
                targetName = repliedMsg.author.username;
            } else if (msg.mentions.users.size > 0) {
                targetId = msg.mentions.users.first().id;
                discordMember = msg.guild.members.cache.get(targetId);
                targetName = msg.mentions.users.first().username;
            } else {
                return bot.sendMessage(chatId, "⚠️ Tag atau reply orang yang mau di-mute!");
            }
        } else {
            if (msg.reply_to_message) {
                targetId = msg.reply_to_message.from.id;
                targetName = msg.reply_to_message.from.first_name;
            } else {
                return bot.sendMessage(chatId, "⚠️ Reply pesan orang yang mau di-mute!");
            }
        }

        if (!duration) return bot.sendMessage(chatId, `⚠️ Masukkan durasi!\nContoh: \`${config.prefix}mute 10m\``);

        const timeMs = ms(duration);
        if (!timeMs) return bot.sendMessage(chatId, "❌ Format waktu salah! Gunakan s, m, h, atau d.\nContoh: `10s`, `5m`, `1h`.");

        try {
            if (isDiscord) {
                if (!discordMember) return bot.sendMessage(chatId, "❌ User tidak ditemukan di server ini.");
                await discordMember.timeout(timeMs, `Dibuat bungkam oleh bot selama ${duration}`);
            } else {
                const untilDate = Math.floor((Date.now() + timeMs) / 1000);
                await bot.restrictChatMember(chatId, targetId, {
                    permissions: { can_send_messages: false },
                    until_date: untilDate
                });
            }

            return bot.sendMessage(chatId, `🔇 **MUTE SUCCESS**\n─────────────────\nUser: **${targetName}** (\`${targetId}\`)\nDurasi: **${duration}**\nStatus: Tidak bisa kirim pesan.`);
        } catch (e) {
            return bot.sendMessage(chatId, "❌ Gagal mute! Pastikan bot admin dan punya izin yang cukup.");
        }
    }
};