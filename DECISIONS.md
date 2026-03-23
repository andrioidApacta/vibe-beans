# Decisions

- 2026-03-23 — `@astrojs/node` middleware mode for WebSocket support. Standalone mode cannot intercept HTTP upgrade events. Middleware mode lets `server.ts` control the HTTP server and attach `ws` to the same port.
- 2026-03-23 — Separate `ws` server on the same port (via `noServer: true` + `upgrade` event) instead of community adapter patches. More stable, fewer dependencies.
- 2026-03-23 — `CustomEvent` bus for client-side decoupling. WebSocket client dispatches `dashboard:update` events; KPI and table modules subscribe independently.
- 2026-03-23 — Zod schemas as single source of truth for data shapes. TypeScript types inferred from schemas.
- 2026-03-23 — SVG status indicators as pure string functions, shared between server render and client DOM updates.
- 2026-03-23 — Server-rendered initial state to avoid empty-dashboard flash on first load.
