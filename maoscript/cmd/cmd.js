const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

module.exports = {
    name: "cmd",
    role: 2,
    category: "owner",
    description: "Install, Del, & List Command",
    maoStart: async ({ hehe }) => {
        const { bot, chatId, args, commands, msg, body, isDiscord } = hehe;
        const action = args[0];
        const cmdPath = path.join(process.cwd(), 'maoscript/cmd');

        if (!action) return bot.sendMessage(chatId, "💡 Gunakan: `install`, `del`, atau `list`.");

        if (action === 'list') {
            const files = fs.readdirSync(cmdPath).filter(f => f.endsWith('.js'));
            let teks = "📂 **Daftar Perintah:**\n\n";
            files.forEach((f, i) => { teks += `${i + 1}. \`${f}\`\n`; });
            return bot.sendMessage(chatId, teks);
        }

        if (action === 'del') {
            let name = args[1];
            if (!name) return bot.sendMessage(chatId, "❌ Masukkan nama file!");
            if (!name.endsWith('.js')) name += '.js';
            const fPath = path.join(cmdPath, name);

            if (!fs.existsSync(fPath)) return bot.sendMessage(chatId, "❌ File tidak ditemukan.");
            fs.unlinkSync(fPath);
            commands.delete(name.replace('.js', ''));
            return bot.sendMessage(chatId, `🗑️ File \`${name}\` berhasil dihapus.`);
        }

        if (action === 'install') {
            let name = args[1];
            if (!name) return bot.sendMessage(chatId, "❌ Nama filenya mana?");
            if (!name.endsWith('.js')) name += '.js';

            const fPath = path.join(cmdPath, name);
            let code = "";

            if (args[2] && args[2].startsWith('http')) {
                try {
                    const res = await axios.get(args[2]);
                    code = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
                } catch (e) {
                    return bot.sendMessage(chatId, "❌ Gagal ambil kode dari link.");
                }
            } else {
                if (isDiscord) {
                    if (msg.attachments.size > 0) {
                        const file = msg.attachments.first();
                        const res = await axios.get(file.url);
                        code = res.data;
                    } else {
                        code = body.split(args[1])[1]?.trim();
                    }
                } else {
                    const raw = body.split(args[1])[1];
                    if (raw && raw.trim().length > 5) {
                        code = raw.trim();
                    } else if (msg.reply_to_message && msg.reply_to_message.document) {
                        const link = await bot.getFileLink(msg.reply_to_message.document.file_id);
                        const res = await axios.get(link);
                        code = res.data;
                    }
                }
            }

            if (!code) return bot.sendMessage(chatId, "❌ Mana kodenya, Wak? Kirim teks atau lampirkan file.");

            code = code
                .replace(/[\u201C\u201D\u2018\u2019]/g, (m) => ({ '“': '"', '”': '"', "‘": "'", "’": "'" }[m]))
                .replace(/\u00A0/g, " ")
                .replace(/\u200B/g, "")
                .trim();

            try {
                fs.writeFileSync(fPath, code);
                const fullPath = path.resolve(fPath);
                
                if (require.cache[require.resolve(fullPath)]) {
                    delete require.cache[require.resolve(fullPath)];
                }

                try {
                    const testLoad = require(fullPath);
                    commands.set(name.replace('.js', ''), testLoad);
                    await bot.sendMessage(chatId, `✅ **Berhasil!**\n📄 File: \`${name}\` \n🚀 Status: Aktif.`);
                } catch (syntaxErr) {
                    if (fs.existsSync(fPath)) fs.unlinkSync(fPath);
                    return bot.sendMessage(chatId, `❌ **Syntax Error!**\nDetail: \`${syntaxErr.message}\``);
                }
            } catch (e) {
                await bot.sendMessage(chatId, `❌ Error System: ${e.message}`);
            }
        }
    }
};