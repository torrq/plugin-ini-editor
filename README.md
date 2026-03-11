# OSRO Plugin

A desktop app for editing the OSRO Revo plugin.ini file.

Built with Tauri (Rust backend) + React + Tailwind CSS.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Rust](https://rustup.rs/) (stable toolchain)
- [Tauri v1 prerequisites for Windows](https://tauri.app/v1/guides/getting-started/prerequisites/#setting-up-windows)
  - Microsoft C++ Build Tools
  - WebView2 (usually already installed on Windows 10/11)

---

## Setup

```bash
# 1. Install JS dependencies
npm install

# 2. Run in development mode (hot reload)
npm run tauri dev

# 3. Build a distributable .exe
npm run tauri build
```

The built executable will be in `src-tauri/target/release/`.

---

## Features

- **Open / Save / Save As** — reads and writes plugin.ini preserving section headers
- **Command Status** — toggles and numeric fields for all overlay settings
- **Client** — window lock, server ping, login video toggles with troubleshooting hints
- **Fonts** — UI font + screen render font configuration
- **Turbo Hotkeys** — key + suffix editor for all 4 BTN_ID slots
- **Global Configs** — dead cell drawing, fade percent slider, AOE indicator
- **Cell Colors** — ARGB color pickers for square, circle, and dead cell overlays
- **Images** — filename inputs with Browse buttons for all skill image mappings
- **AOE Timings** — duration editor for all timed AOE skills
- **AOE Colors** — searchable, filterable grid of ARGB color pickers for 60+ skills

---

## Notes

- The app preserves original section headers when saving (e.g. `[ Turbo Hotkeys ]` stays as-is)
- Comments in the original file are stripped on save — keep a backup if you rely on them
- Changes are not auto-saved; use Ctrl+S equivalent or the Save button
