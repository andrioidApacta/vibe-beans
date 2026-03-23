import type { Agent, AgentStatus, DashboardSnapshot } from "~/types/dashboard";
import { formatTime, escapeHtml } from "~/lib/format";

export const statusColors: Record<AgentStatus, string> = {
  available: "#22c55e",
  "on-call": "#3b82f6",
  "after-call-work": "#f59e0b",
  offline: "#9ca3af",
  break: "#f97316",
};

export const statusLabels: Record<AgentStatus, string> = {
  available: "Available",
  "on-call": "On Call",
  "after-call-work": "After Call Work",
  offline: "Offline",
  break: "Break",
};

export function statusDotSvg(status: AgentStatus): string {
  const color = statusColors[status];
  const label = statusLabels[status];
  return `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>${label}</title><circle cx="6" cy="6" r="5" fill="${color}" /><circle cx="6" cy="6" r="5" fill="${color}" opacity="0.3"><animate attributeName="r" values="5;6;5" dur="2s" repeatCount="indefinite" /></circle></svg>`;
}

export const LAYOUT = {
  width: 1200,
  height: 720,
  margin: 20,
  kpi: {
    y: 0,
    cardWidth: 185,
    cardHeight: 100,
    gap: 10,
    labelFontSize: 11,
    valueFontSize: 26,
  },
  table: {
    y: 130,
    x: 0,
    width: 1200,
    titleBarHeight: 44,
    headerHeight: 36,
    rowHeight: 40,
    footerHeight: 40,
    cornerRadius: 12,
  },
  columns: {
    name: 30,
    status: 340,
    calls: 850,
    handleTime: 1130,
  },
} as const;

const KPI_CARDS = [
  { key: "totalCallsToday", label: "TOTAL CALLS" },
  { key: "avgHandleTimeSeconds", label: "AVG HANDLE TIME" },
  { key: "avgWaitTimeSeconds", label: "AVG WAIT TIME" },
  { key: "serviceLevelPercent", label: "SERVICE LEVEL" },
  { key: "callsInQueue", label: "CALLS IN QUEUE" },
  { key: "abandonRatePercent", label: "ABANDON RATE" },
] as const;

function formatKpiValue(key: string, kpi: DashboardSnapshot["kpi"]): string {
  const value = kpi[key as keyof typeof kpi];
  if (key === "avgHandleTimeSeconds" || key === "avgWaitTimeSeconds") {
    return formatTime(value);
  }
  if (key === "serviceLevelPercent" || key === "abandonRatePercent") {
    return `${value}%`;
  }
  return String(value);
}

export function kpiCardSvg(
  x: number,
  y: number,
  label: string,
  value: string,
  dataKey: string,
): string {
  const { cardWidth: w, cardHeight: h } = LAYOUT.kpi;
  return `<g data-kpi-card="${dataKey}">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="var(--color-surface)" stroke="var(--color-border)" stroke-width="1" />
    <text x="${x + 16}" y="${y + 30}" font-size="${LAYOUT.kpi.labelFontSize}" font-weight="500" fill="var(--color-text-secondary)" letter-spacing="0.05em">${label}</text>
    <text x="${x + 16}" y="${y + 68}" font-size="${LAYOUT.kpi.valueFontSize}" font-weight="700" fill="var(--color-text-primary)" data-kpi="${dataKey}">${value}</text>
  </g>`;
}

function statusDotInline(status: AgentStatus): string {
  const color = statusColors[status];
  return `<circle r="5" fill="${color}" /><circle r="5" fill="${color}" opacity="0.3"><animate attributeName="r" values="5;6;5" dur="2s" repeatCount="indefinite" /></circle>`;
}

export function agentRowSvg(agent: Agent, y: number): string {
  const { columns, table } = LAYOUT;
  const textY = y + LAYOUT.table.rowHeight / 2;

  return `<g data-agent-row="${agent.id}">
    <rect x="1" y="${y}" width="${table.width - 2}" height="${table.rowHeight}" fill="transparent" />
    <line x1="16" y1="${y + LAYOUT.table.rowHeight}" x2="${table.width - 16}" y2="${y + LAYOUT.table.rowHeight}" stroke="var(--color-border)" stroke-width="0.5" />
    <text x="${columns.name}" y="${textY}" font-size="14" font-weight="500" fill="var(--color-text-primary)" dominant-baseline="central">${escapeHtml(agent.name)}</text>
    <g transform="translate(${columns.status}, ${textY})">
      <g transform="translate(6, 0)">${statusDotInline(agent.status)}</g>
      <text x="20" y="0" font-size="14" fill="var(--color-text-primary)" dominant-baseline="central">${statusLabels[agent.status]}</text>
    </g>
    <text x="${columns.calls}" y="${textY}" font-size="14" fill="var(--color-text-primary)" text-anchor="end" dominant-baseline="central">${agent.callsToday}</text>
    <text x="${columns.handleTime}" y="${textY}" font-size="14" fill="var(--color-text-primary)" text-anchor="end" dominant-baseline="central">${formatTime(agent.handleTimeSeconds)}</text>
  </g>`;
}

export function paginationDotsSvg(
  totalPages: number,
  activePage: number,
  baseX: number,
  cy: number,
): string {
  const dotRadius = 4;
  const dotGap = 12;
  const dots: string[] = [];

  for (let i = 0; i < totalPages; i++) {
    const cx = baseX + i * dotGap;
    const fill = i === activePage ? "var(--color-accent)" : "var(--color-border)";
    dots.push(
      `<circle cx="${cx}" cy="${cy}" r="${dotRadius}" fill="${fill}" data-page="${i}" style="cursor:pointer"><title>Go to page ${i + 1}</title></circle>`,
    );
  }

  return dots.join("");
}

export function dashboardSvg(
  snapshot: DashboardSnapshot,
  pageSize: number,
): string {
  const { kpi, agents } = snapshot;
  const totalPages = Math.max(1, Math.ceil(agents.length / pageSize));
  const pageAgents = agents.slice(0, pageSize);
  const { table, columns } = LAYOUT;

  const kpiCards = KPI_CARDS.map((card, i) => {
    const x = LAYOUT.margin + i * (LAYOUT.kpi.cardWidth + LAYOUT.kpi.gap);
    const value = formatKpiValue(card.key, kpi);
    return kpiCardSvg(x, LAYOUT.kpi.y, card.label, value, card.key);
  }).join("\n");

  const tableTop = table.y;
  const headerY = tableTop + table.titleBarHeight;
  const firstRowY = headerY + table.headerHeight;
  const footerY = firstRowY + pageSize * table.rowHeight;
  const totalHeight = footerY + table.footerHeight;
  const headerTextY = headerY + table.headerHeight / 2;

  const agentRows = pageAgents
    .map((agent, i) => agentRowSvg(agent, firstRowY + i * table.rowHeight))
    .join("\n");

  const paginationBaseX = LAYOUT.width - LAYOUT.margin - totalPages * 12;
  const paginationDots = paginationDotsSvg(
    totalPages,
    0,
    paginationBaseX,
    footerY + table.footerHeight / 2,
  );

  return `<g id="kpi-section" aria-label="Key Performance Indicators">
    ${kpiCards}
  </g>
  <g id="agent-table-section" aria-label="Agent Status">
    <rect x="${table.x}" y="${tableTop}" width="${table.width}" height="${totalHeight - tableTop}" rx="${table.cornerRadius}" fill="var(--color-surface)" stroke="var(--color-border)" stroke-width="1" />
    <text x="${LAYOUT.margin + 10}" y="${tableTop + table.titleBarHeight / 2}" font-size="16" font-weight="600" fill="var(--color-text-primary)" dominant-baseline="central">Agent Status</text>
    <text x="${LAYOUT.width - LAYOUT.margin - 10}" y="${tableTop + table.titleBarHeight / 2}" font-size="13" fill="var(--color-text-secondary)" text-anchor="end" dominant-baseline="central" id="page-indicator">Page 1 of ${totalPages}</text>
    <line x1="0" y1="${headerY}" x2="${table.width}" y2="${headerY}" stroke="var(--color-border)" stroke-width="1" />
    <g aria-label="Column headers">
      <text x="${columns.name}" y="${headerTextY}" font-size="13" font-weight="500" fill="var(--color-text-secondary)" dominant-baseline="central">Agent</text>
      <text x="${columns.status}" y="${headerTextY}" font-size="13" font-weight="500" fill="var(--color-text-secondary)" dominant-baseline="central">Status</text>
      <text x="${columns.calls}" y="${headerTextY}" font-size="13" font-weight="500" fill="var(--color-text-secondary)" text-anchor="end" dominant-baseline="central">Calls Today</text>
      <text x="${columns.handleTime}" y="${headerTextY}" font-size="13" font-weight="500" fill="var(--color-text-secondary)" text-anchor="end" dominant-baseline="central">Avg Handle Time</text>
    </g>
    <line x1="0" y1="${firstRowY}" x2="${table.width}" y2="${firstRowY}" stroke="var(--color-border)" stroke-width="1" />
    <g id="agent-table-body">
      ${agentRows}
    </g>
    <line x1="16" y1="${footerY}" x2="${table.width - 16}" y2="${footerY}" stroke="var(--color-border)" stroke-width="1" />
    <g id="table-footer">
      <text x="${LAYOUT.margin + 10}" y="${footerY + table.footerHeight / 2}" font-size="13" fill="var(--color-text-secondary)" dominant-baseline="central" id="agent-count">${agents.length} agents total</text>
      <g id="page-dots">
        ${paginationDots}
      </g>
    </g>
  </g>`;
}
