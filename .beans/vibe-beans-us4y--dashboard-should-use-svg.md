---
# vibe-beans-us4y
title: Dashboard should use SVG
status: completed
type: task
priority: normal
created_at: 2026-03-23T09:54:00Z
updated_at: 2026-03-23T10:14:15Z
---

The current dashboard uses HTML, I'd like for it to use SVG instead

## Tasks
- [x] Extend src/lib/svg.ts with layout constants and SVG builder functions
- [x] Update src/styles/global.css for SVG-compatible animations
- [x] Rewrite src/pages/index.astro main content as SVG
- [x] Update src/client/kpi-updater.ts for SVG DOM
- [x] Rewrite src/client/agent-table.ts for SVG rendering
- [x] Build and verify

## Summary of Changes

Converted the call center dashboard from HTML elements to SVG rendering.

### What changed
- **src/lib/svg.ts** — Added layout constants, `kpiCardSvg()`, `agentRowSvg()`, `paginationDotsSvg()`, and `dashboardSvg()` builder functions that produce the full dashboard as SVG markup
- **src/pages/index.astro** — Replaced HTML KPI grid and agent table with a single `<svg>` element using `dashboardSvg()` for server rendering
- **src/client/kpi-updater.ts** — Flash animation now targets the SVG `<rect>` behind each KPI card via `fill` animation instead of `background-color`
- **src/client/agent-table.ts** — Renders SVG `<g>` groups instead of HTML table rows; pagination dots are SVG `<circle>` elements
- **src/styles/global.css** — Updated `kpi-flash-anim` keyframes from `background-color` to `fill`; added SVG hover styles for agent rows and reduced-motion rules
- **DECISIONS.md** — Documented the SVG rendering decision

### What stayed the same
- Header (HTML application chrome)
- WebSocket connection and broadcast mechanism
- CustomEvent bus pattern
- Zod schemas and data types
- Server architecture
