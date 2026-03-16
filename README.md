# Veloz Framework Examples

Testing various frameworks and binaries with [Veloz](https://onveloz.com) deploy.

## Test Results ✅

### Frameworks

| Framework | Type | Status | Notes |
|-----------|------|--------|-------|
| Express | Node API | ✅ PASS | Works out of box |
| Fastify | Node API | ✅ PASS | Works out of box |
| Hono | Node API | ✅ PASS | Works out of box |
| Go | API | ✅ PASS | Needs `CGO_ENABLED=0` |
| Rust Axum | API | ✅ PASS | Build in ~10s, musl target |
| Python FastAPI | API | ✅ PASS | Auto-detected |

### Binaries (via Nixpacks)

| Binary | Version | Status | Notes |
|--------|---------|--------|-------|
| FFmpeg | 7.1 | ✅ PASS | Full codec support |
| ImageMagick | 7.x | ✅ PASS | `convert` deprecated, use `magick` |
| Tesseract | 5.5.0 | ✅ PASS | OCR works |
| Pandoc | 3.1.11.1 | ✅ PASS | Document conversion |
| yt-dlp | 2025.01.15 | ✅ PASS | Video metadata/download |
| SQLite | better-sqlite3 | ✅ PASS | Native bindings work |

### Pending Tests

| Framework/Binary | Status |
|------------------|--------|
| Next.js | 🔜 |
| Vue | 🔜 |
| Svelte/SvelteKit | 🔜 |
| Nuxt | 🔜 |
| Astro | 🔜 |
| Playwright | 🔜 |
| Puppeteer | 🔜 |
| Whisper | 🔜 |

## Key Learnings

### 1. ESM Causes Startup Crashes
Apps with `"type": "module"` in package.json crash on startup.
**Fix**: Use CommonJS (`require()`) instead.

### 2. Custom Binaries Need Node Explicitly
When using custom `nixPkgs`, include Node:
```toml
[phases.setup]
nixPkgs = ["nodejs_20", "npm-9_x", "ffmpeg-full"]
```

### 3. Node Apps Need Build Script
Veloz auto-detects and requires `npm run build`. Add dummy if not needed:
```json
"scripts": { "build": "echo 'No build needed'" }
```

### 4. Go CGO Requires GCC or Disable
```toml
[phases.setup]
nixPkgs = ["go", "gcc"]

[phases.build]
cmds = ["CGO_ENABLED=0 go build -o out"]
```

## Usage

```bash
# Clone
git clone https://github.com/loudjean/veloz-framework-examples
cd veloz-framework-examples

# Deploy any example
cd express-app
veloz deploy
```

## Links

- [Veloz](https://onveloz.com)
- [Nixpacks Providers](https://nixpacks.com/docs/providers)
