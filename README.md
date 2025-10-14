# Selected Text — First 10 Words Extension

This Chrome extension extracts the currently selected text from the active page (or falls back to the focused input/textarea or first contenteditable) and displays the first 10 words.

Installation
1. Open chrome://extensions
2. Enable "Developer mode"
3. Click "Load unpacked" and select this folder (the one containing `manifest.json`)

Usage
- Select text on a page (or place the cursor in an input/textarea), click the extension icon, then click "Get First 10 Words of Selection".
- Click "Copy" to copy the result to clipboard.

Notes
- The extension uses `window.getSelection()` in the page context; if no selection is found it checks for focused inputs and common contenteditable elements.
- Some sites using shadow DOM or complex editors may not expose selection in the page context.
- You can adjust the word count by editing `popup.js` and changing the number passed to `firstNWords`.
