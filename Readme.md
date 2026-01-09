<img src="https://i.ibb.co/RQ28H2p/banner.png" alt="banner">
<h1 align="center"><img src="./dashboard/images/logo-non-bg.png" width="22px"> Xiaomao V2 - Chatbot Telegram & discord</h1>

<p align="center">
	<a href="https://nodejs.org/dist/v16.20.0">
		<img src="https://img.shields.io/badge/Nodejs%20Support-16.x-brightgreen.svg?style=flat-square" alt="Nodejs Support v16.x">
	</a>
  <img alt="size" src="https://img.shields.io/github/repo-size/ntkhang03/Goat-Bot-V2.svg?style=flat-square&label=size">
  <img alt="code-version" src="https://img.shields.io/badge/dynamic/json?color=brightgreen&label=code%20version&prefix=v&query=%24.version&url=https://github.com/Ryuikyyz/Xiaomao-V2/raw/main/package.json&style=flat-square">
  <img alt="visitors" src="https://visitor-badge.laobi.icu/badge?style=flat-square&page_id=ntkhang3.Goat-Bot-V2">
  <img alt="size" src="https://img.shields.io/badge/license-MIT-green?style=flat-square&color=brightgreen">
</p>

- [📝 **Note**](#-note)
- [🚧 **Requirement**](#-requirement)
- [📝 **Tutorial**](#-tutorial)
- [💡 **How it works?**](#-how-it-works)
- [🔔 **How to get notification when have new update?**](#-how-to-get-notification-when-have-new-update)
- [🆙 **How to Update**](#-how-to-update)
- [🛠️ **How to create new commands**](#️-how-to-create-new-commands)
- [💭 **Support**](#-support)
- [📚 **Support Languages in source code**](#-support-languages-in-source-code)
- [📌 **Common Problems**](#-common-problems)
- [❌ **DO NOT USE THE ORIGINAL UNDERGRADUATE VERSION**](#-do-not-use-the-original-undergraduate-version)
- [📸 **Screenshots**](#-screenshots)
- [✨ **Copyright (C)**](#-copyright-c)
- [📜 **License**](#-license)

<hr>

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

#-license ⚠️ Lisensi & Catatan

* Projek ini bersifat Open Source.
* Dilarang keras memperjualbelikan script ini tanpa izin.
* Gunakan dengan bijak dan jangan melanggar TOS Telegram/Discord.

**Copyright © 2026 iky x gemini**