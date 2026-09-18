# SpeedReader

SpeedReader is a desktop app for speed reading selected text from any supported application.

The idea is simple: select text, press a global shortcut, and the app opens a focused overlay that shows one word at a time. This reduces eye movement and helps the user read more quickly without leaving their current workflow.

## What the app does

- Runs quietly in the background
- Reads text selected in another app
- Opens a centered reading overlay
- Displays one word at a time
- Supports pause, resume, speed changes, restart, and navigation
- Keeps reading text local to the machine
- Works as a lightweight desktop utility rather than a browser app

## Core workflow

1. Select text in any supported desktop app.
2. Press the configured shortcut.
3. SpeedReader captures the selection.
4. A reading overlay opens.
5. Words are displayed one at a time.
6. The user can control playback while reading.

## Tech stack

- Tauri
- React
- TypeScript
- pnpm

## Project goals

- Minimal distraction while reading
- Fast startup and light background operation
- Clear keyboard and pointer controls
- Reading flow built around selected text, not manual copy and paste
- A clean desktop experience for reading articles, notes, and other text quickly

## Development

```bash
pnpm install
pnpm tauri dev
```

For production build:

```bash
pnpm tauri build
```

## Notes

This project is designed as a desktop application first, not a web app. The focus is on instant text-to-reading flow, a clutter-free overlay, and a native background experience.
