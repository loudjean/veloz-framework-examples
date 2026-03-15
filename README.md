# Veloz Framework Examples

Testing various frameworks with Veloz deploy.

## Frameworks

| Framework | Type | Status | URL | Notes |
|-----------|------|--------|-----|-------|
| Next.js | Full-stack | ⏳ Pending | - | App Router + TypeScript |
| Vue | SPA | ⏳ Pending | - | Vite + TypeScript |
| Svelte | SPA | ⏳ Pending | - | Vite + TypeScript |
| SvelteKit | Full-stack | ⏳ Pending | - | Minimal template |
| Hono | API | ⏳ Pending | - | Node adapter |
| Express | API | ⏳ Pending | - | Minimal setup |
| Fastify | API | ⏳ Pending | - | v5 |
| Astro | SSG | ⏳ Pending | - | Minimal template |
| Nuxt | Full-stack | ⏳ Pending | - | v4 minimal |
| Solid | SPA | ⏳ Pending | - | Vite + TypeScript |

## Deploy Commands

Each example can be deployed with:

```bash
cd <example-app>
npm install
veloz deploy -y
```

## Testing

To verify deployment:

```bash
curl https://<app-url>.veloz.app
curl https://<app-url>.veloz.app/health  # For API examples
```

## Issues Found

_(Will be updated during testing)_

## License

MIT
