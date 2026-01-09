const fs = require('fs');
const path = require('path');

module.exports = {
    name: "admin",
    category: "owner",
    role: 2, 
    description: "Tambah atau hapus Admin Bot (Tele/DC)",
    maoStart: async ({ hehe }) => {
        const { bot, chatId, args, config, isDiscord } = hehe;
        const action = args[0] ? args[0].toLowerCase() : null;
        let targetId = args[1];
        const settingsPath = path.join(process.cwd(), 'settings.js');

        if (!action || !['add', 'del'].includes(action)) {
            return bot.sendMessage(chatId, `❌ **Format Salah!**\n\nGunakan:\n- \`${config.prefix}admin add [ID]\`\n- \`${config.prefix}admin del [ID]\``);
        }

        if (isDiscord && hehe.msg.mentions.users.size > 0) {
            targetId = hehe.msg.mentions.users.first().id;
        }

        if (!targetId) {
            return bot.sendMessage(chatId, "❌ Masukkan ID atau mention orangnya!");
        }

        targetId = targetId.toString().replace(/[<@!>]/g, '');

        if (!Array.isArray(config.adminID)) config.adminID = [config.adminID.toString()];
        if (!Array.isArray(config.adminDc)) config.adminDc = config.adminDc ? [config.adminDc.toString()] : [];

        try {
            const platformKey = isDiscord ? 'adminDc' : 'adminID';
            const platformName = isDiscord ? 'Discord' : 'Telegram';

            if (action === 'add') {
                if (config[platformKey].includes(targetId)) {
                    return bot.sendMessage(chatId, `⚠️ ID \`${targetId}\` sudah ada di daftar admin ${platformName}.`);
                }
                config[platformKey].push(targetId);
                await saveSettings(settingsPath, config);
                await bot.sendMessage(chatId, `✅ Berhasil menambah \`${targetId}\` ke daftar Admin ${platformName}!`);
            } 
            
            else if (action === 'del') {
                if (!config[platformKey].includes(targetId)) {
                    return bot.sendMessage(chatId, `❌ ID \`${targetId}\` tidak ditemukan di daftar admin ${platformName}.`);
                }
                if (config[platformKey].indexOf(targetId) === 0) {
                    return bot.sendMessage(chatId, `❌ Tidak bisa menghapus Owner utama ${platformName}!`);
                }
                config[platformKey] = config[platformKey].filter(id => id !== targetId);
                await saveSettings(settingsPath, config);
                await bot.sendMessage(chatId, `✅ Berhasil menghapus \`${targetId}\` dari daftar Admin ${platformName}!`);
            }
        } catch (e) {
            await bot.sendMessage(chatId, `❌ Gagal: ${e.message}`);
        }
    }
};

async function saveSettings(filePath, config) {
    let content = fs.readFileSync(filePath, 'utf8');

    const adminIDStr = JSON.stringify(config.adminID);
    const adminDcStr = JSON.stringify(config.adminDc || []);

    content = content.replace(/adminID:\s*\[[\s\S]*?\]|adminID:\s*".*?"/g, `adminID: ${adminIDStr}`);
    
    if (content.includes('adminDc:')) {
        content = content.replace(/adminDc:\s*\[[\s\S]*?\]|adminDc:\s*".*?"/g, `adminDc: ${adminDcStr}`);
    } else {
        content = content.replace(/(adminID:.*?,)/, `$1\n    adminDc: ${adminDcStr},`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
}