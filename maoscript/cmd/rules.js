const fs = require('fs');
const path = require('path');

module.exports = {
    name: "rules",
    category: "admin grup",
    role: 1,
    description: "Kelola aturan grup",
    maoStart: async ({ hehe }) => {
        const { bot, chatId, args, config, isOwner, msg } = hehe;
        const dbPath = path.join(process.cwd(), 'maojson', 'mao_rules.json');
        
        if (!fs.existsSync(path.join(process.cwd(), 'maojson'))) fs.mkdirSync(path.join(process.cwd(), 'maojson'));
        let db = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath, 'utf8')) : {};
        if (!db[chatId]) db[chatId] = [];

        const type = args[0] ? args[0].toLowerCase() : null;

        if (!type) {
            if (db[chatId].length === 0) return bot.sendMessage(chatId, `⚠️ Grup ini belum punya aturan. Gunakan \`${config.prefix}rules add <teks>\``);
            let teks = `📋 *ATURAN GRUP*\n─────────────────\n`;
            db[chatId].forEach((rule, i) => teks += `${i + 1}. ${rule}\n`);
            return bot.sendMessage(chatId, teks, { parse_mode: 'Markdown' });
        }

        const isAdmin = async () => {
            if (isOwner) return true;
            try {
                const member = await bot.getChatMember(chatId, msg.from.id);
                return ['administrator', 'creator'].includes(member.status);
            } catch (e) { return false; }
        };

        if (['add', '-a'].includes(type)) {
            if (!await isAdmin()) return bot.sendMessage(chatId, "❌ Hanya admin yang bisa tambah rules.");
            const content = args.slice(1).join(" ");
            if (!content) return bot.sendMessage(chatId, "⚠️ Masukkan isi aturannya.");
            db[chatId].push(content);
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return bot.sendMessage(chatId, "✅ Aturan berhasil ditambahkan.");
        }

        if (['delete', 'del', '-d'].includes(type)) {
            if (!await isAdmin()) return bot.sendMessage(chatId, "❌ Hanya admin yang bisa hapus rules.");
            const index = parseInt(args[1]) - 1;
            if (isNaN(index) || !db[chatId][index]) return bot.sendMessage(chatId, "⚠️ Nomor aturan tidak valid.");
            const removed = db[chatId].splice(index, 1);
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return bot.sendMessage(chatId, `🗑️ Aturan nomor ${index + 1} dihapus: _${removed}_`, { parse_mode: 'Markdown' });
        }

        if (['reset', '-r'].includes(type)) {
            if (!await isAdmin()) return bot.sendMessage(chatId, "❌ Hanya admin yang bisa reset rules.");
            db[chatId] = [];
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return bot.sendMessage(chatId, "✅ Semua aturan grup telah dihapus.");
        }

        if (['edit', '-e'].includes(type)) {
            if (!await isAdmin()) return bot.sendMessage(chatId, "❌ Hanya admin yang bisa edit rules.");
            const index = parseInt(args[1]) - 1;
            const newContent = args.slice(2).join(" ");
            if (isNaN(index) || !db[chatId][index] || !newContent) return bot.sendMessage(chatId, "⚠️ Format salah. Contoh: `-rules edit 1 Jangan Spam`.");
            db[chatId][index] = newContent;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return bot.sendMessage(chatId, `✅ Aturan nomor ${index + 1} berhasil diubah.`);
        }
        
        return bot.sendMessage(chatId, `❓ *Bantuan Rules*\n\n1. \`${config.prefix}rules\` (Lihat)\n2. \`${config.prefix}rules add <teks>\` (Tambah)\n3. \`${config.prefix}rules del <nomor>\` (Hapus)\n4. \`${config.prefix}rules edit <nomor> <teks baru>\` (Edit)\n5. \`${config.prefix}rules reset\` (Hapus semua)`, { parse_mode: 'Markdown' });
    }
};