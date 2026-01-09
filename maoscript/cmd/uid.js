module.exports = {
    name: "uid",
    role: 0,
    category: "umum",
    maoStart: async ({ hehe }) => {
        const { bot, chatId, msg, args, isDiscord } = hehe;

        let targetId, targetName, targetUser, infoType;

        if (isDiscord) {
            if (msg.reference) {
                const repliedMsg = await msg.channel.messages.fetch(msg.reference.messageId);
                targetId = repliedMsg.author.id;
                targetName = repliedMsg.author.username;
                targetUser = repliedMsg.author.tag;
                infoType = "REPLY";
            } else if (msg.mentions.users.size > 0) {
                const mention = msg.mentions.users.first();
                targetId = mention.id;
                targetName = mention.username;
                targetUser = mention.tag;
                infoType = "TAG";
            } else if (args[0] && !isNaN(args[0])) {
                targetId = args[0];
                targetName = "Unknown";
                targetUser = "-";
                infoType = "MANUAL ID";
            } else {
                targetId = msg.author.id;
                targetName = msg.author.username;
                targetUser = msg.author.tag;
                infoType = "YOUR INFO";
            }
        } else {
            if (msg.reply_to_message) {
                const target = msg.reply_to_message.from;
                targetId = target.id;
                targetName = target.first_name;
                targetUser = target.username ? `@${target.username}` : "-";
                infoType = "REPLY";
            } else if (msg.entities && msg.entities.find(e => e.type === 'text_mention')) {
                const mention = msg.entities.find(e => e.type === 'text_mention');
                targetId = mention.user.id;
                targetName = mention.user.first_name;
                targetUser = "-";
                infoType = "TAG";
            } else if (args[0] && !isNaN(args[0])) {
                targetId = args[0];
                targetName = "Unknown";
                targetUser = "-";
                infoType = "MANUAL ID";
            } else {
                targetId = msg.from.id;
                targetName = msg.from.first_name;
                targetUser = msg.from.username ? `@${msg.from.username}` : "-";
                infoType = "YOUR INFO";
            }
        }

        let response = `🆔 **USER INFO (${infoType})**\n`;
        response += `\n👤 Nama: ${targetName}`;
        response += `\n🔢 ID: \`${targetId}\``;
        response += `\n🏷️ User: ${targetUser}`;

        return bot.sendMessage(chatId, response);
    }
};