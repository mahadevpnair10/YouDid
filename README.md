# Browser Extension Template

A minimal Manifest V3 browser extension template with:
- `popup` UI
- `background` service worker
- `content` script

## Files

- `manifest.json` — extension metadata and permissions
- `popup.html` — popup user interface
- `popup.css` — popup styles
- `popup.js` — popup logic and messaging
- `background.js` — service worker handling runtime events
- `content.js` — page-level DOM interaction

## How to use

1. Open Chrome, Edge, or a Chromium-based browser.
2. Go to `chrome://extensions`.
3. Enable `Developer mode`.
4. Click `Load unpacked`.
5. Select this `browser-extension-template` folder.

## What it does

- The popup has two buttons:
  - **Send greeting to page**: sends a message through the background service worker to the active tab.
  - **Log background event**: sends a simple request to the background worker.
- The content script listens for the greeting message and displays a temporary banner on the page.
- The background service worker receives messages and forwards the page greeting to the active tab.

## Notes

- This template uses Manifest V3.
- The example uses plain HTML, CSS, and JavaScript for easy editing.
- You can extend `content.js` with page-specific logic or add more popup controls.
