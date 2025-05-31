
# 🛡️ H-CopySentry Extension

![Developed](https://img.shields.io/badge/status-developed-brightgreen)
![Chrome Extension](https://img.shields.io/badge/platform-chrome-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-lightgrey)

**H-CopySentry** is a Chrome Extension designed to uphold **exam integrity** by silently encrypting and replacing copied text on exam-related web pages. This prevents students from easily copying and sharing exam questions or answers.

> 🔒 Built for educational institutions seeking to secure their online assessments.

---

## 🎯 Project Goals

- Ensure **academic honesty** in online testing environments
- Block meaningful use of copied content by **encrypting clipboard data**
- Provide a **transparent** user experience with no visible disruptions
- Offer a **lightweight**, **client-side only** solution (no server required)

---

## 📦 Features

- 🕵️ Monitors user `copy` events across all pages
- 🔐 Encrypts copied text using **AES-GCM (256-bit)**
- 🚫 Blocks excessively large selections (over 10,000 characters)
- 🧠 Operates invisibly — user still believes the copy was successful
- ⚡ Fully client-side: **no data sent externally**
- 🧩 Easy to deploy in any exam portal environment

---

## 🛠️ Installation (Development Mode)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/yourusername/H-CopySentry.git
   ```
2. Open Google Chrome and navigate to:
   ```
   chrome://extensions/
   ```
3. Enable **Developer Mode** (top right)
4. Click **Load unpacked** and select the folder where the extension code resides

---

## 📁 Folder Structure

```
H-CopySentry/
│
├── content.js           # Core logic for encryption and clipboard interception
├── manifest.json        # Chrome extension metadata and permissions
├── popup.html           # UI (if needed)
├── background.js        # Currently empty, reserved for future enhancements
├── assets/
│   └── icons/           # Icon images for extension branding
│
└── README.md            # You're reading it!
```

---

## 🔐 How It Works

1. On page load, a crypto key is generated using the Web Crypto API.
2. When a user tries to copy text (`Ctrl+C`, right-click > Copy, etc.), the extension intercepts the action.
3. If the text is under 10,000 characters:
   - It is encrypted using **AES-GCM**
   - The clipboard is overwritten with the **Base64-encoded encrypted string**
4. If text exceeds 10,000 characters:
   - The copy action is **cancelled silently** and clipboard is cleared

---

## 🧪 Testing

To test the extension:

1. Copy a short line of text from any webpage.
   - Open Developer Tools (F12) > Console
   - You should see: `Encrypted text set in clipboard: ...`
2. Paste into Notepad — the content will be unreadable (encrypted)
3. Try copying a very long paragraph (over 10k characters) — clipboard will be empty

---

## ❗ Permissions Used

- `"clipboardWrite"` — to modify clipboard data during copy
- `"storage"` — to persist protection status (enabled/disabled toggle)
- `"activeTab"` — to access current tab content if needed

---

## 🙋 Author

Developed by [Hasnain Sheikh](https://github.com/hasnainsheikh15) 🚀

Feel free to fork, modify, or contribute to this project.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> **Disclaimer**: Use of this extension in real exam settings must comply with institutional privacy and user consent policies.
