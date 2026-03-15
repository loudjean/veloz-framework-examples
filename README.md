# Veloz Framework Examples

Testing various frameworks and edge cases with Veloz deploy.

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
| Custom Nixpacks | ⏳ | ffmpeg + imagemagick |
| Heavy Deps | ⏳ | Sharp (native bindings) |

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

# Volume test
curl -X POST https://<app-url>.veloz.app/increment
curl https://<app-url>.veloz.app
```

## Issues Found

_(Will be updated during testing)_

## License

MIT
