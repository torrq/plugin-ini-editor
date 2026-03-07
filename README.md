# OSRO Revo plugin.ini Editor

A desktop app for editing the OSRO Revo plugin.ini configuration file used by Ragnarok Online clients.

Built with Tauri (Rust backend) + React + Tailwind CSS.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Rust](https://rustup.rs/) (stable toolchain)
- [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) — select **"Desktop development with C++"** during install
- WebView2 — usually already present on Windows 10/11

> **Note:** After installing Rust, `cargo` may not be in your PATH until you restart your terminal.
> If you get "cargo not found", run this in PowerShell and reopen the window:
> ```powershell
> [Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";$env:USERPROFILE\.cargo\bin", "User")
> ```

---

## Setup

```bash
# 1. Install JS dependencies
npm install

# 2. Run in development mode (hot reload)
npm run tauri dev

# 3. Build a distributable .exe
npx tauri build
```

The built executable will be at `src-tauri/target/release/plugin-ini-editor.exe`.
Installers (NSIS/MSI) will be in `src-tauri/target/release/bundle/`.

> **First build takes a while** (~10 min) as Cargo compiles all dependencies from scratch.
> Subsequent builds are much faster.

---

## Features

- **Open / Save / Save As** — reads and writes plugin.ini preserving section headers
- **Command Status** — toggles and numeric fields for all overlay settings
- **Client** — window lock, server ping, login video toggles with troubleshooting hints
- **Fonts** — UI font + screen render font configuration
- **Turbo Hotkeys** — click-to-bind key capture for all 4 BTN_ID slots
- **Global Configs** — dead cell drawing, fade percent slider, AOE indicator
- **Cell Colors** — ARGB color pickers for square, circle, and dead cell overlays
- **Images** — filename inputs with Browse buttons for all skill image mappings
- **AOE Timings** — duration editor for all timed AOE skills
- **AOE Colors** — searchable, filterable grid of ARGB color pickers for 60+ skills

---

## Notes

- The app preserves original section headers when saving (e.g. `[ Turbo Hotkeys ]` stays as-is)
- Comments in the original file are stripped on save — keep a backup if you rely on them
- Changes are not auto-saved; use the Save button in the top bar
