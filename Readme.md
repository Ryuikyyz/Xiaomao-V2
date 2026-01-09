# 🐱 Xiaomao-V2 (Hybrid Bot)

Xiaomao-V2 adalah bot hybrid modern yang berjalan di dua platform sekaligus: **Telegram** dan **Discord**. Dibangun dengan Node.js untuk memberikan pengalaman manajemen bot yang ringan, cepat, dan stabil.

---

## 🚀 Fitur Utama

* **Dual Platform**: Aktif di Telegram dan Discord hanya dengan satu kali run.
* **Adaptive Menu**:
    * **Telegram**: Sistem halaman (pagination) dengan tombol navigasi.
    * **Discord**: Tampilan profesional menggunakan ANSI Code Block agar rapi dan berwarna.
* **Smart Role System**: Proteksi akses command berdasarkan Owner, Admin Grup/Server, atau User Umum.
* **Dynamic Command Manager**:
    * install: Tambah/update fitur langsung dari chat tanpa matiin bot.
    * del: Hapus fitur yang tidak diinginkan lewat chat.
    * list: Cek semua file command yang terpasang.
* **Hybrid Callad**: Fitur laporan user/panggilan admin yang bisa saling balas antar platform.
* **Auto Restart**: Bot otomatis hidup kembali jika terjadi error atau crash (menggunakan run.sh).

---

## 🛠️ Persiapan Sebelum Install

Pastikan kamu sudah menyiapkan:

1. **Node.js v16+**: Wajib terinstall.
2. **Bot Token Telegram**: Ambil di [@BotFather](https://t.me/BotFather).
3. **Bot Token Discord**: Ambil di [Discord Developer Portal](https://discord.com/developers/applications).
    * PENTING: Di bagian Bot, aktifkan semua Privileged Gateway Intents (Presence, Server Members, Message Content).
4. **Admin ID**: Ambil ID akun kamu di Telegram dan Discord untuk akses Owner.

---

## 📦 Cara Penginstalan (Step by Step)

### 1. Clone Repository
```bash 
git clone https://github.com/ikyStarboy/Xiaomao-V2
```

### 2. Masuk ke direktori
```bash
 cd Xiaomao-V2
 ```

### 3. Install Dependencies
```bash
npm install
```

### 4. Konfigurasi Bot
Edit file settings.js:
```bash
module.exports = {
    botToken: "TOKEN_TELE_MU",
    TokenDc: "TOKEN_DISCORD_MU",
    adminID: ["ID_USER_TELE_MU"],
    adminDc: ["ID_USER_DISCORD_MU"],
    botName: "Xiaomao Bot",
    OwnerTg: "t.me/KyysStoreID",
    prefix: "-",
    isMaintenance: false
};
```

### 5. Berikan Izin Script Shell
```bash 
chmod +x run.sh
```
### 6. Jalankan Bot
```bash 
npm start
```
---

## 🌐 Hosting yang Disarankan

Untuk menjaga bot tetap online 24/7, gunakan layanan berikut:
* VPS (Ubuntu/Debian): Rekomendasi utama (Gunakan pm2 atau screen).
* Panel Pterodactyl: Sangat mudah digunakan untuk manajemen bot.
* [Termux](https://f-droid.org/repo/com.termux_1022.apk): Bisa digunakan di Android (Gunakan tsu agar bot tidak mati saat HP standby).

---

## 👨‍💻 Kontributor

* [ikyStarboy](https://github.com/ikyStarboy) - GitHub
* [Gemini Ai](gemini.google.com) - Assistant Developer

---

## ⚠️ Lisensi & Catatan

* Projek ini bersifat Open Source.
* Dilarang keras memperjualbelikan script ini tanpa izin.
* Gunakan dengan bijak dan jangan melanggar TOS Telegram/Discord.

**Copyright © 2026 iky x gemini**