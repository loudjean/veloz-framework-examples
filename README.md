# Veloz Framework Examples

Testing various frameworks, languages, and binaries with [Veloz](https://onveloz.com) deploy.

> **Repo:** [`loudjean/veloz-framework-examples`](https://github.com/loudjean/veloz-framework-examples)

---

## Test Results

### Frameworks & Languages

| Framework | Type | Status | URL | Notes |
|-----------|------|--------|-----|-------|
| Express | Node.js API | ✅ PASS | [Link](https://veloz-framework-examples.runveloz.com) | Works out of the box |
| Fastify | Node.js API | ✅ PASS | [Link](https://veloz-framework-examples-fastify-app.runveloz.com) | Works out of the box |
| Hono | Node.js API | ✅ PASS | [Link](https://veloz-framework-examples-hono-app.runveloz.com) | Works out of the box |
| Next.js | SSR/SSG | ✅ PASS | [Link](https://veloz-framework-examples-nextjs-app.runveloz.com) | Remove `pnpm-workspace.yaml` if not monorepo |
| Nuxt | SSR/SSG | ✅ PASS | [Link](https://veloz-framework-examples-nuxt-app.runveloz.com) | Works out of the box |
| Vue (Vite) | SPA | ✅ PASS | [Link](https://veloz-framework-examples-vue-web.runveloz.com) | Needs `npx serve` workaround (see [SPA Findings](#spa-findings)) |
| Svelte (Vite) | SPA | ✅ PASS | [Link](https://veloz-framework-examples-svelte-app.runveloz.com) | Pin Vite ≤6 + `npx serve` workaround |
| Go | API | ✅ PASS | [Link](https://veloz-framework-examples-go-app.runveloz.com) | Needs `CGO_ENABLED=0` or include `gcc` |
| Rust (Axum) | API | ✅ PASS | [Link](https://veloz-framework-examples-rust-axum.runveloz.com) | Build ~10s, musl target |
| Python (FastAPI) | API | ✅ PASS | [Link](https://veloz-framework-examples-python-fastapi.runveloz.com) | Auto-detected |
| Elixir (Phoenix) | API | ✅ PASS | [Link](https://veloz-framework-examples-elixir-app-2.runveloz.com) | Needs explicit `nixpacks.toml` |
| PHP | Web | ✅ PASS | [Link](https://veloz-framework-examples-php-v4.runveloz.com) | Needs explicit `nixpacks.toml` (PHP 8.3+) |
| SvelteKit | SSR | ❌ FAIL | — | Build fails (not retried) |
| Astro | SSG | ❌ FAIL | — | Build fails (not retried) |

### Binaries (via Nixpacks)

| Binary | Version | Status | Notes |
|--------|---------|--------|-------|
| FFmpeg | 7.1 | ✅ PASS | Full codec support |
| ImageMagick | 7.x | ✅ PASS | `convert` deprecated, use `magick` |
| Tesseract | 5.5.0 | ✅ PASS | OCR works |
| Pandoc | 3.1.11.1 | ✅ PASS | Document conversion |
| yt-dlp | 2025.01.15 | ✅ PASS | Video metadata/download |
| SQLite | better-sqlite3 | ✅ PASS | Native bindings work |
| Playwright | 🔜 | — | Not yet tested |
| Puppeteer | 🔜 | — | Not yet tested |
| Whisper | 🔜 | — | Not yet tested |
| wkhtmltopdf | 🔜 | — | Not yet tested |
| GraphicsMagick | 🔜 | — | Not yet tested |

### Pending Tests

| Item | Type |
|------|------|
| Solid | SPA |
| Deno | Runtime |
| Bun | Runtime |
| Static Site | HTML |
| Worker (background job) | Edge case |
| Volume (persistent storage) | Edge case |
| Monorepo (Turborepo) | Edge case |
| Custom Nixpacks | Edge case |
| Heavy Deps | Edge case |

---

## Key Findings

### 1. ESM Works ✅

Apps with `"type": "module"` work fine on Veloz. No need for CommonJS.

Earlier tests that seemed to fail were caused by malformed template literals in auto-generated test code — not a Veloz issue.

### 2. Node Apps Need a Build Script

Veloz auto-detects and **requires** `npm run build`. If your app doesn't need a build step, add a dummy:

```json
{
  "scripts": {
    "build": "echo 'No build needed'"
  }
}
```

### 3. Custom Binaries Need Node Explicitly

When using custom `nixPkgs` in `nixpacks.toml`, you must include Node.js explicitly:

```toml
[phases.setup]
nixPkgs = ["nodejs_20", "npm-9_x", "ffmpeg-full"]
```

### 4. SPA Findings

#### Bug: Caddy `NIXPACKS_SPA_OUTPUT_DIR` Not Set

When Nixpacks detects a Vite SPA (Vue, Svelte, etc.), it generates a Caddy-based Dockerfile. The Caddyfile uses `{$NIXPACKS_SPA_OUTPUT_DIR}` but the `ARG` in the Dockerfile has **no default value**, so Caddy serves from the project root instead of `dist/`. This causes:

- `.js` files served with `text/html` MIME type
- App fails to load in browser

**Server-side fix committed** ([`f601a33`](https://github.com/PierreAndreis/veloz/commit/f601a33)) — adds `detectSpaOutputDir()` and patches the Caddyfile + Dockerfile with the correct output dir. **Pending server deploy.**

**Current workaround:** Use `npx serve` in `nixpacks.toml`:

```toml
[start]
cmd = "npx --yes serve dist -s -l 3000"
```

#### Bug: Vite 8 + Rolldown Native Bindings

Vite 8 uses Rolldown internally, which requires platform-specific native bindings (`@rolldown/binding-linux-x64-gnu`). Nixpacks' Docker `--mount=type=cache` for npm doesn't properly resolve optional platform-specific deps.

**Workaround:** Pin Vite to v6 (which doesn't use Rolldown):

```json
{
  "devDependencies": {
    "vite": "^6.0.0"
  }
}
```

### 5. Next.js: Remove `pnpm-workspace.yaml`

If deploying a standalone Next.js app (not part of a monorepo), **remove `pnpm-workspace.yaml`** from the root. Otherwise Nixpacks treats it as a workspace project and fails with:

```
ERR_PNPM_WORKSPACE_PKG_NOT_FOUND
```

### 6. Go: CGO Requires GCC or Disable

Go apps with CGO dependencies need either `gcc` in nixPkgs or `CGO_ENABLED=0`:

```toml
[phases.setup]
nixPkgs = ["go", "gcc"]

[phases.build]
cmds = ["CGO_ENABLED=0 go build -o out"]

[start]
cmd = "./out"
```

### 7. Elixir: Explicit nixpacks.toml Required

Nixpacks auto-detection uses `elixir_1_14` which **doesn't exist** in current nixpkgs. You must specify packages explicitly:

```toml
[phases.setup]
nixPkgs = ["elixir", "erlang", "gcc"]

[phases.install]
cmds = ["mix local.hex --force", "mix local.rebar --force", "mix deps.get"]

[phases.build]
cmds = ["MIX_ENV=prod mix compile"]

[start]
cmd = "MIX_ENV=prod mix run --no-halt"
```

### 8. PHP: Explicit nixpacks.toml Required (8.3+)

PHP auto-detection fails. PHP 8.1 is **EOL in nixpacks** — use PHP 8.3+:

```toml
[phases.setup]
nixPkgs = ["php83", "php83Packages.composer"]

[phases.install]
cmds = ["composer install --ignore-platform-reqs || true"]

[start]
cmd = "php -S 0.0.0.0:3000 -t public"
```

### 9. Caddy + Node.js Nix Conflicts

You **cannot** include `caddy` alongside `nodejs_22`/`npm-9_x` in `nixpkgs.toml` — it causes nix profile conflicts. Use the `npx serve` workaround instead for SPAs.

### 10. Port Convention

All apps must listen on port **3000** (Veloz default).

---

## Usage

```bash
# Clone
git clone https://github.com/loudjean/veloz-framework-examples
cd veloz-framework-examples

# Deploy any example
cd express-app
veloz deploy

# Deploy as a new service in an existing project
veloz deploy --new
```

## Project Structure

```
veloz-framework-examples/
├── express-app/          # Node.js Express API
├── fastify-app/          # Node.js Fastify API
├── hono-app/             # Node.js Hono API
├── nextjs-app/           # Next.js (App Router)
├── nuxt-app/             # Nuxt 3
├── vue-app/              # Vue 3 + Vite SPA
├── svelte-app/           # Svelte 5 + Vite SPA
├── sveltekit-app/        # SvelteKit (failed)
├── astro-app/            # Astro (failed)
├── solid-app/            # Solid.js (pending)
├── go-app/               # Go API
├── rust-axum/            # Rust Axum API
├── python-fastapi/       # Python FastAPI
├── elixir-app/           # Elixir/Phoenix
├── php-app/              # PHP
├── deno-app/             # Deno (pending)
├── bun-app/              # Bun (pending)
├── static-site/          # Static HTML (pending)
├── esm-test/             # ESM module test
├── worker-example/       # Background worker (pending)
├── volume-test/          # Persistent storage (pending)
├── edge-cases/           # Edge case tests
└── binaries/
    ├── ffmpeg-test/
    ├── imagemagick-test/
    ├── tesseract-test/
    ├── pandoc-test/
    ├── ytdlp-test/
    ├── sqlite-test/
    ├── playwright-test/
    ├── puppeteer-test/
    ├── whisper-test/
    ├── wkhtmltopdf-test/
    └── graphicsmagick-test/
```

## Links

- [Veloz](https://onveloz.com)
- [Veloz CLI](https://www.npmjs.com/package/veloz)
- [Nixpacks Providers](https://nixpacks.com/docs/providers)
