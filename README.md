# AI-Powered Text Summarizer Chrome Extension

A powerful Chrome extension that uses AI to generate concise summaries of selected text in various styles and lengths.

## Features

- **Multiple Summarization Styles**
  - TL;DR: Quick summary of main points
  - Teaser: Engaging preview of the content
  - Key Points: Structured list of important information
  - Headline: Brief, attention-grabbing summary

- **Customizable Summary Length**
  - Short: Concise overview
  - Medium: Balanced summary
  - Long: Detailed summary

- **Smart Text Selection**
  - Works with selected text on any webpage
  - Supports text from input fields and textareas
  - Compatible with contenteditable areas

- **User-Friendly Interface**
  - Clean, intuitive popup interface
  - Loading animation during summarization
  - Easy one-click copy functionality
  - Shows source URL with summaries

- **Persistent Storage**
  - Saves your last summary
  - Remembers previous summarization settings
  - Displays last summary when no text is selected

## Installation

1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this folder (the one containing `manifest.json`)

## How to Use

1. **Basic Usage**
   - Select any text on a webpage
   - Click the extension icon
   - View your AI-generated summary in the popup
   - The summary includes the source URL for reference

2. **Customization**
   - Right-click the extension icon and select "Options"
   - Choose your preferred summarization style:
     - TL;DR
     - Teaser
     - Key Points
     - Headline
   - Select your desired summary length:
     - Short
     - Medium
     - Long

3. **Additional Features**
   - Click "Copy" to copy the summary to your clipboard
   - Previous summaries are saved and shown when no new text is selected
   - The title shows your current style and length settings (e.g., "TL;DR (Short)")

## Tips

- For best results, select complete paragraphs or articles
- Different summarization styles work better for different types of content
- Adjust the length based on your needs and the original text length
- Your last summary is always available, even without new text selection

## Technical Notes

- Uses `window.getSelection()` to capture text from web pages
- Falls back to focused inputs and contenteditable elements if no selection is found
- Stores settings and previous summaries in Chrome storage
- Some sites using shadow DOM or complex editors may not expose selection in the page context

## Support

If you find this extension helpful, consider [buying me a coffee](https://aqua-linet-16.tiiny.site).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
