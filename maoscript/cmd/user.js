module.exports = {
    name: "user",
    version: "1.1.0",
    author: "Iky",
    category: "admin grup",
    role: 1,
    description: "Manajemen grup/server: invite, kick, add (admin), del (admin)",
    maoStart: async ({ hehe }) => {
        const { bot, chatId, msg, args, isDiscord, config } = hehe;
        const action = args[0] ? args[0].toLowerCase() : null;

        if (!action || !['invite', 'kick', 'add', 'del'].includes(action)) {
            return bot.sendMessage(chatId, `❌ **Format Salah!**\n\nGunakan:\n- \`${config.prefix}user invite\`\n- \`${config.prefix}user kick\` (reply/tag)\n- \`${config.prefix}user add\` (admin)\n- \`${config.prefix}user del\` (admin)`);
        }

        let targetId;
        let discordMember = null;

        if (isDiscord) {
            if (msg.reference) {
                const repliedMsg = await msg.channel.messages.fetch(msg.reference.messageId);
                targetId = repliedMsg.author.id;
                discordMember = msg.guild.members.cache.get(targetId);
            } else if (msg.mentions.users.size > 0) {
                targetId = msg.mentions.users.first().id;
                discordMember = msg.guild.members.cache.get(targetId);
            } else if (args[1] && !isNaN(args[1])) {
                targetId = args[1];
                discordMember = msg.guild.members.cache.get(targetId);
            }
        } else {
            if (msg.reply_to_message) {
                targetId = msg.reply_to_message.from.id;
            } else if (args[1] && !isNaN(args[1])) {
                targetId = args[1];
            } else if (msg.entities) {
                const mention = msg.entities.find(e => e.type === 'mention' || e.type === 'text_mention');
                if (mention && mention.user) targetId = mention.user.id;
            }
        }

        try {
            if (action === 'invite') {
                if (isDiscord) {
                    const invite = await msg.channel.createInvite({ maxAge: 86400, maxUses: 5 });
                    return bot.sendMessage(chatId, `✅ **Invite Link Berhasil Dibuat!**\n🔗 ${invite.url}\n*(Berlaku 24 jam)*`);
                } else {
                    const link = await bot.exportChatInviteLink(chatId);
                    return bot.sendMessage(chatId, `✅ **Invite Link Grup:**\n🔗 ${link}`);
                }
            }

            if (!targetId) return bot.sendMessage(chatId, "❌ Target tidak ditemukan! Tag atau reply orangnya.");

            if (action === 'kick') {
                if (isDiscord) {
                    if (!discordMember) return bot.sendMessage(chatId, "❌ User tidak ada di server ini.");
                    await discordMember.kick();
                    return bot.sendMessage(chatId, `🚀 User \`${targetId}\` berhasil ditendang dari server!`);
                } else {
                    await bot.banChatMember(chatId, targetId);
                    await bot.unbanChatMember(chatId, targetId);
                    return bot.sendMessage(chatId, `🚀 User \`${targetId}\` berhasil ditendang dari grup!`);
                }
            }

            if (action === 'add') {
                if (isDiscord) {
                    return bot.sendMessage(chatId, "⚠️ Fitur promote admin di Discord harus dilakukan manual via Role.");
                } else {
                    await bot.promoteChatMember(chatId, targetId, {
                        can_change_info: true,
                        can_delete_messages: true,
                        can_invite_users: true,
                        can_restrict_members: true,
                        can_pin_messages: true,
                        can_promote_members: false
                    });
                    return bot.sendMessage(chatId, `✅ ID \`${targetId}\` sekarang jadi Admin!`);
                }
            }

            if (action === 'del') {
                if (isDiscord) {
                    return bot.sendMessage(chatId, "⚠️ Fitur demote admin di Discord harus dilakukan manual via Role.");
                } else {
                    await bot.promoteChatMember(chatId, targetId, {
                        can_change_info: false,
                        can_delete_messages: false,
                        can_invite_users: false,
                        can_restrict_members: false,
                        can_pin_messages: false,
                        can_promote_members: false
                    });
                    return bot.sendMessage(chatId, `✅ Jabatan admin ID \`${targetId}\` dicabut!`);
                }
            }
        } catch (e) {
            return bot.sendMessage(chatId, `❌ **Gagal:** Pastikan bot adalah Admin dan memiliki izin yang cukup.`);
        }
    }
};