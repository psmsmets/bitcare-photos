# 🧩 Bitcare Photo Downloader — Chrome Extension

A user-friendly Chrome extension to **automatically download all photos** from your child's Bitcare profile — directly from the photos tab.

> ✅ The base script is stable.  
> 🧪 The Chrome extension is functional but still in development.

---

## 🔧 Features

- 📥 Download all photos in original quality
- 💾 Counter-based filenames per child (with local memory)
- ✅ Already-downloaded photos are marked with a check
- 📂 Smart detection of visible photos
- ✨ Works directly on Bitcare’s `#/photos` tab
- 🧊 Lightweight and simple UI
- 🧲 Auto-remembers progress per child

---

## 🚀 Getting Started

1. Clone the repository or download this folder as a ZIP.
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer Mode**
4. Click **Load unpacked** and select this `bitcare-photo-downloader/` folder.

---

## 📁 Folder Contents

| File              | Purpose                                 |
|-------------------|------------------------------------------|
| `manifest.json`   | Chrome extension metadata                |
| `content.js`      | The core logic injected into Bitcare     |
| `icon.png`        | Extension icon shown in Chrome UI        |
| `README.md`       | You're reading it 👋                     |

---

## 📌 Notes

- This extension **only activates** when visiting `https://app.bitcare.com/contacts/...#/photos`.
- Progress (downloaded photos & counters) is saved locally, per child name (used as prefix).
- The JavaScript logic is built upon the [manual version](../README.md) with enhancements.

---

## ✅ Status

| Component          | Status      |
|--------------------|-------------|
| Base Script        | ✅ Working  |
| Chrome Extension   | 🚧 In Progress |
| Multi-child Support | ✅ Done |
| Visual Overlay      | ✅ Replaced with ✅ badge |
| Dragging Menu       | ✅ Done |
| Real-time Counter   | ✅ Done |

---

## 📣 Feedback

If you have suggestions, ideas, or run into bugs — feel free to open an issue or contribute.

---

MIT Licensed.
