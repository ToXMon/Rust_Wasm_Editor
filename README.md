# VideoFlow - AI Video Editor

🎬 A lightning-fast Rust WebAssembly video editor for the browser with AI-powered features.

## 🚀 Live Demo

Try the app live at: [[https://YOUR_USERNAME.github.io/wasm_video_editor]](https://toxmon.github.io/Rust_Wasm_Editor/)

## ✨ Features

- 📹 Load video files from local filesystem
- ⏱️ Interactive video timeline with progress tracking
- ✂️ Basic editing operations:
  - Trim videos (set start and end times)
  - Cut segments
  - Merge videos (planned)
  - Export edited videos (planned)
- 🤖 AI-powered features:
  - Intelligent scene detection
  - Smart trim suggestions
  - Automatic video analysis
- 📱 Progressive Web App (PWA) support
- 🔧 Web-based interface with HTML/CSS/JavaScript
- ⚡ Rust WebAssembly backend for performance
- 🌐 Works entirely in your browser - no server needed

## Prerequisites

- Rust (latest stable version)
- wasm-pack (`cargo install wasm-pack`)
- Node.js and npm (for development dependencies)
- A modern web browser with WebAssembly support

## Setup

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the WebAssembly module:
   ```bash
   wasm-pack build --target web
   ```

4. Serve the files locally:
   ```bash
   python3 -m http.server 8080
   ```

5. Open your browser and navigate to `http://localhost:8080`

## Development

You can use the npm scripts for development:

```bash
# Build and serve in one command
npm run dev

# Just build the WASM module
npm run build

# Just serve the files
npm run serve
```

## Architecture

- **src/lib.rs**: Main Rust code with WebAssembly bindings
- **index.html**: Web interface with video controls
- **Cargo.toml**: Rust dependencies and project configuration
- **package.json**: Node.js dependencies and build scripts

## Current Status

This is a basic implementation that demonstrates:
- Loading video files in the browser
- Basic UI for video editing controls
- WebAssembly integration with JavaScript
- Timeline visualization

## Future Enhancements

- Actual video processing in Rust/WASM
- Advanced editing features (filters, effects)
- Multiple video track support
- Audio editing capabilities
- Export to different formats
- Drag and drop interface
- Undo/redo functionality

## License

MIT License
