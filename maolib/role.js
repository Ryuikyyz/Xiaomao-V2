const settings = require('../settings');
const { PermissionsBitField } = require('discord.js');

module.exports = async (bot, msg, requiredRole) => {
    const isDiscord = !!msg.author;
    const userId = (isDiscord ? msg.author.id : msg.from.id).toString();
    const chatId = isDiscord ? msg.channel.id : msg.chat.id;
    const isPrivate = isDiscord ? !msg.guild : msg.chat.type === 'private';

    let adminList = isDiscord ? (settings.adminDc || []) : (settings.adminID || []);
    if (!Array.isArray(adminList)) adminList = [adminList.toString()];
    adminList = adminList.map(id => id.toString());

    const isOwnerBot = adminList.includes(userId);
    if (isOwnerBot) return { canAccess: true };
    if (requiredRole === 0) return { canAccess: true };

    if (isPrivate && requiredRole > 0) {
        return { 
            canAccess: false, 
            msg: "⚠️ Command ini khusus untuk digunakan di dalam grup/server bang! 🗿" 
        };
    }

    try {
        let isAdminGrup = false;

        if (isDiscord) {
            if (!msg.guild) return { canAccess: false, msg: "❌ Server tidak ditemukan." };
            
            let member = msg.member;
            if (!member) {
                member = await msg.guild.members.fetch(userId).catch(() => null);
            }

            if (member) {
                isAdminGrup = member.permissions.has(PermissionsBitField.Flags.Administrator) || 
                              member.permissions.has(PermissionsBitField.Flags.ManageGuild) ||
                              msg.guild.ownerId === userId;
            }
        } else {
            const member = await bot.getChatMember(chatId, userId).catch(() => null);
            if (member) {
                isAdminGrup = ['administrator', 'creator'].includes(member.status);
            }
        }

        if (requiredRole === 1) {
            if (isAdminGrup) return { canAccess: true };
            return { 
                canAccess: false, 
                msg: "⚠️ Command ini khusus untuk *Admin* atau *Owner Bot* saja bang! 🗿" 
            };
        }

        if (requiredRole === 2) {
            return { 
                canAccess: false, 
                msg: "🚫 Eitss, gak bisa! Command ini khusus *Owner Bot* doang. Lu siapa? 🤨" 
            };
        }

        return { canAccess: true };
    } catch (e) {
        return { 
            canAccess: false, 
            msg: "❌ Gagal memverifikasi akses." 
        };
    }
};