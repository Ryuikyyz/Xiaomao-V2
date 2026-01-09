const fs = require('fs');
const path = require('path');
const axios = require('axios');

function getAllCommands() {
    let cmdDir = path.join(process.cwd(), 'maoscript', 'cmd');
    if (!fs.existsSync(cmdDir)) cmdDir = path.join(process.cwd(), 'cmd');
    if (!fs.existsSync(cmdDir)) return [];

    const files = fs.readdirSync(cmdDir).filter(file => file.endsWith('.js'));
    const commands = [];
    for (const file of files) {
        try {
            const fullPath = path.join(cmdDir, file);
            delete require.cache[require.resolve(fullPath)];
            const cmd = require(fullPath);
            if (cmd.name && cmd.category) commands.push(cmd);
        } catch (e) {}
    }
    return commands;
}

module.exports = {
    name: "menu",
    category: "umum",
    role: 0,
    description: "Menu Adaptive (Tele: Halaman, Discord: Code Block Full)",
    maoStart: async ({ hehe }) => {
        const { bot, chatId, config, senderId, isDiscord } = hehe;
        
        const commands = getAllCommands();
        const categories = {};
        commands.forEach((cmd) => {
            const cat = cmd.category.toUpperCase();
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd.name);
        });

        const sortedCats = Object.keys(categories).sort();

        if (isDiscord) {
            let teks = "```ansi\n"; 
            teks += `[1;34m───  ${(config.botName || "MAOMAO BOT").toUpperCase()} (DISCORD)  ───[0m\n`;
            
            sortedCats.forEach(cat => {
                teks += `\n[1;33m╭──  ${cat}[0m\n`;
                const cmdList = categories[cat].map(c => `│ • ${config.prefix || "."}${c}`).join('\n');
                teks += `${cmdList}\n[1;33m╰──────────────[0m\n`;
            });
            
            teks += `\n[1;32m🔗 Owner:[0m ${config.OwnerTg || "t.me/KyysStoreID"}\n`;
            teks += "```";
            
            return bot.sendMessage(chatId, teks);
        }

        const perPage = 3;
        const totalHal = Math.ceil(sortedCats.length / perPage);
        const pageCats = sortedCats.slice(0, perPage);

        let teksTele = `╭───  *${config.botName || "Xiaomao V2"}* ───\n`;
        pageCats.forEach(cat => {
            teksTele += `│\n├─  *${cat}*\n`;
            const cmdList = categories[cat].map(c => `│  • ${config.prefix || "."}${c}`).join('\n');
            teksTele += `${cmdList}\n`;
        });
        teksTele += `│\n╰──────────────────\n`;
        teksTele += `Hal: 1 / ${totalHal}`;

        const navRow = [];
        if (totalHal > 1) {
            navRow.push({ text: "Selanjutnya ➡️", callback_data: `menu_hal_1_${senderId}` });
        }

        let ownerLink = config.OwnerTg || "t.me/KyysStoreID";
        if (!ownerLink.startsWith('http')) ownerLink = `https://${ownerLink}`;
        const ownerRow = [{ text: "👤 Owner Maotele v2", url: ownerLink }];

        const keyboard = [];
        if (navRow.length > 0) keyboard.push(navRow);
        keyboard.push(ownerRow);

        return bot.sendMessage(chatId, teksTele, { 
            parse_mode: 'Markdown', 
            reply_markup: { inline_keyboard: keyboard } 
        });
    },

    maoCallback: async ({ bot, callback, config }) => {
        const { data, message, from } = callback;
        if (!data.startsWith('menu_hal_')) return;

        const parts = data.split('_');
        const targetPage = parseInt(parts[2]);
        const ownerId = parts[3];

        if (from.id.toString() !== ownerId) {
            return axios.post(`https://api.telegram.org/bot${config.botToken}/answerCallbackQuery`, {
                callback_query_id: callback.id,
                text: "❌ Buka menu sendiri, Wak! 🗿",
                show_alert: true
            });
        }

        const commands = getAllCommands();
        const categories = {};
        commands.forEach((cmd) => {
            const cat = cmd.category.toUpperCase();
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd.name);
        });

        const sortedCats = Object.keys(categories).sort();
        const perPage = 3;
        const totalHal = Math.ceil(sortedCats.length / perPage);
        
        if (targetPage >= totalHal && totalHal > 0) return;

        const start = targetPage * perPage;
        const pageCats = sortedCats.slice(start, start + perPage);

        let teks = `╭───  *${config.botName || "Xiaomao V2"}* ───\n`;
        pageCats.forEach(cat => {
            teks += `│\n├─  *${cat}*\n`;
            const cmdList = categories[cat].map(c => `│  • ${config.prefix || "."}${c}`).join('\n');
            teks += `${cmdList}\n`;
        });
        teks += `│\n╰──────────────────\n`;
        teks += `Hal: ${targetPage + 1} / ${totalHal}`;

        const navRow = [];
        if (targetPage > 0) {
            navRow.push({ text: "⬅️ Sebelumnya", callback_data: `menu_hal_${targetPage - 1}_${ownerId}` });
        }
        if (targetPage < totalHal - 1) {
            navRow.push({ text: "Selanjutnya ➡️", callback_data: `menu_hal_${targetPage + 1}_${ownerId}` });
        }

        let ownerLink = config.OwnerTg || "t.me/KyysStoreID";
        if (!ownerLink.startsWith('http')) ownerLink = `https://${ownerLink}`;
        const ownerRow = [{ text: "👤 Owner Maotele v2 👑", url: ownerLink }];

        const keyboard = [];
        if (navRow.length > 0) keyboard.push(navRow);
        keyboard.push(ownerRow);

        try {
            await axios.post(`https://api.telegram.org/bot${config.botToken}/editMessageText`, {
                chat_id: message.chat.id,
                message_id: message.message_id,
                text: teks,
                parse_mode: 'Markdown',
                reply_markup: { inline_keyboard: keyboard }
            });
            await axios.post(`https://api.telegram.org/bot${config.botToken}/answerCallbackQuery`, { callback_query_id: callback.id });
        } catch (e) {
            console.log("Error Update Menu:", e.message);
        }
    }
};