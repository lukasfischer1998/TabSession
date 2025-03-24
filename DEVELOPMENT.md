# Development Guide

## Prerequisites
- Node.js 16+
- npm 8+

## Quick Start
```bash
git clone https://github.com/yourusername/tab-session-manager.git
cd tab-session-manager
npm install
```

## Quick Start
- Install SASS compiler:

```bash
npm install -D sass
```
```json
"scripts": {
  "sass:build": "sass scss/popup.scss popup/styles/popup.css",
  "sass:watch": "sass --watch scss/popup.scss popup/styles/popup.css"
}
```
```bash
npm run sass:watch
```

Make changes - they'll auto-reload

## Quick Start

- Use Chrome's extension debugger
- Check console logs in popup.html
