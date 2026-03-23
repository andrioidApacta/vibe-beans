---
# vibe-beans-tvbg
title: Create project vision
status: completed
type: task
priority: normal
created_at: 2026-03-23T09:08:07Z
updated_at: 2026-03-23T09:37:35Z
---

I want to create a dashboard that serves a scalable SVG in plain JavaScript (w. TypeScript types) 


## Summary of Changes

Built a call center dashboard using Astro 6 with SSR, plain TypeScript, Tailwind v4, and WebSocket for real-time mock data.

### Architecture
- **Astro middleware mode** + custom `server.ts` for HTTP + WebSocket on a single port
- **CustomEvent bus** for client-side decoupling (WS client dispatches, KPI/table modules subscribe)
- **Zod schemas** as single source of truth for all data shapes
- **SVG status indicators** as pure string functions shared between server and client

### Files Created
- `src/types/dashboard.ts` — Zod schemas + inferred types
- `src/lib/mock-data.ts` — Mock data generators (40 agents, realistic KPIs)
- `src/lib/svg.ts` — Status dot SVG functions with color-coded indicators
- `src/lib/format.ts` — Shared formatting utilities
- `src/lib/websocket-broadcaster.ts` — Timer-driven broadcast to WS clients (3s interval)
- `src/pages/index.astro` — Dashboard page with KPI cards + agent table
- `src/client/websocket-client.ts` — WS connection with reconnect backoff
- `src/client/kpi-updater.ts` — KPI card DOM updates with flash animation
- `src/client/agent-table.ts` — Agent table with 30s auto-pagination (10 per page)
- `src/client/index.ts` — Client entry point
- `src/styles/global.css` — Tailwind v4 theme tokens + animations
- `server.ts` — Production HTTP + WebSocket server entry
- `DECISIONS.md` — Architecture decision log

### How to Run
- `npm run dev` — Astro dev server (no WebSocket)
- `npm run preview` — Build + run with WebSocket support on port 4321
