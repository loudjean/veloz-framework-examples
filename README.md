# Veloz Framework Examples

Comprehensive testing of frameworks, runtimes, and binaries with Veloz deploy.

## JavaScript/TypeScript Frameworks

| Framework | Type | Status | Notes |
|-----------|------|--------|-------|
| Next.js | Full-stack | ⏳ | App Router + TypeScript |
| Vue | SPA | ⏳ | Vite + TypeScript |
| Svelte | SPA | ⏳ | Vite + TypeScript |
| SvelteKit | Full-stack | ⏳ | Minimal template |
| Nuxt | Full-stack | ⏳ | v4 minimal |
| Solid | SPA | ⏳ | Vite + TypeScript |
| Astro | SSG | ⏳ | Minimal template |

## API Frameworks (Node.js)

| Framework | Type | Status | Notes |
|-----------|------|--------|-------|
| Hono | API | ⏳ | Node adapter |
| Express | API | ⏳ | Minimal setup |
| Fastify | API | ⏳ | v5 |

## Alternative Runtimes

| Runtime | Type | Status | Notes |
|---------|------|--------|-------|
| Deno | API | ⏳ | Deno.serve |
| Bun | API | ⏳ | Bun.serve |

## Other Languages (Nixpacks)

| Language | Framework | Status | Notes |
|----------|-----------|--------|-------|
| Go | net/http | ⏳ | Standard library |
| Rust | Axum | ⏳ | Tokio runtime |
| Python | FastAPI | ⏳ | Uvicorn |
| Elixir | Plug | ⏳ | Cowboy |
| PHP | Native | ⏳ | PHP 8.1+ |

## Binary Tests (Nixpacks)

| Binary | Use Case | Status | Notes |
|--------|----------|--------|-------|
| Playwright | Browser automation | ⏳ | Chromium |
| Puppeteer | Browser automation | ⏳ | Chrome |
| FFmpeg | Video/audio processing | ⏳ | Full build |
| Whisper | Speech-to-text | ⏳ | OpenAI model |
| ImageMagick | Image processing | ⏳ | convert/mogrify |
| GraphicsMagick | Image processing | ⏳ | gm command |
| yt-dlp | Video download | ⏳ | With ffmpeg |
| wkhtmltopdf | HTML to PDF | ⏳ | Headless |
| Pandoc | Document conversion | ⏳ | With LaTeX |
| Tesseract | OCR | ⏳ | eng + por langs |
| SQLite | Database | ⏳ | better-sqlite3 |

## Special Cases

| Example | Type | Status | Notes |
|---------|------|--------|-------|
| Worker | Background job | ⏳ | ServiceType.WORKER |
| Volume Test | Persistent storage | ⏳ | /data volume |
| Static Site | HTML only | ⏳ | No build step |

## Edge Cases

| Example | Status | Notes |
|---------|--------|-------|
| Monorepo (Turborepo) | ⏳ | Workspace deploy |
| Custom Nixpacks | ⏳ | System packages |
| Heavy Deps | ⏳ | Native bindings (sharp) |

## Directory Structure

```
veloz-framework-examples/
├── nextjs-app/
├── vue-app/
├── svelte-app/
├── sveltekit-app/
├── nuxt-app/
├── solid-app/
├── astro-app/
├── hono-app/
├── express-app/
├── fastify-app/
├── deno-app/
├── bun-app/
├── go-app/
├── rust-axum/
├── python-fastapi/
├── elixir-app/
├── php-app/
├── binaries/
│   ├── playwright-test/
│   ├── puppeteer-test/
│   ├── ffmpeg-test/
│   ├── whisper-test/
│   ├── imagemagick-test/
│   ├── graphicsmagick-test/
│   ├── ytdlp-test/
│   ├── wkhtmltopdf-test/
│   ├── pandoc-test/
│   ├── tesseract-test/
│   └── sqlite-test/
├── edge-cases/
│   ├── monorepo-turborepo/
│   ├── custom-nixpacks/
│   └── heavy-deps/
├── worker-example/
├── volume-test/
└── static-site/
```

## Deploy Commands

```bash
cd <example-app>
npm install  # or pnpm/yarn/bun
veloz deploy -y
```

## Testing

```bash
# Web apps
curl https://<app-url>.veloz.app

# API apps  
curl https://<app-url>.veloz.app/health

# Binary tests
curl "https://ffmpeg-test.veloz.app/probe?url=https://example.com/video.mp4"
curl "https://tesseract-test.veloz.app/ocr?url=https://example.com/image.png"
```

## Issues Found

_(Will be updated during testing)_

## License

MIT
