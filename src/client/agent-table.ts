import type { Agent, DashboardSnapshot } from "~/types/dashboard";
import { agentRowSvg, paginationDotsSvg, LAYOUT } from "~/lib/svg";

const PAGE_SIZE = 10;
const PAGINATION_INTERVAL_MS = 30_000;

let currentPage = 0;
let lastAgents: Agent[] = [];

function totalPages(): number {
  return Math.max(1, Math.ceil(lastAgents.length / PAGE_SIZE));
}

function firstRowY(): number {
  return LAYOUT.table.y + LAYOUT.table.titleBarHeight + LAYOUT.table.headerHeight;
}

function footerY(): number {
  return firstRowY() + PAGE_SIZE * LAYOUT.table.rowHeight;
}

function renderPage(page: number) {
  const tbody = document.getElementById("agent-table-body");
  if (!tbody) return;

  const start = page * PAGE_SIZE;
  const pageAgents = lastAgents.slice(start, start + PAGE_SIZE);
  const rowStartY = firstRowY();

  tbody.innerHTML = pageAgents
    .map((agent, i) => agentRowSvg(agent, rowStartY + i * LAYOUT.table.rowHeight))
    .join("");

  const pageIndicator = document.getElementById("page-indicator");
  if (pageIndicator) {
    pageIndicator.textContent = `Page ${page + 1} of ${totalPages()}`;
  }

  const agentCount = document.getElementById("agent-count");
  if (agentCount) {
    agentCount.textContent = `${lastAgents.length} agents total`;
  }

  updatePageDots(page);
}

function updatePageDots(activePage: number) {
  const container = document.getElementById("page-dots");
  if (!container) return;

  const pages = totalPages();
  const paginationBaseX = LAYOUT.width - LAYOUT.margin - pages * 12;
  const cy = footerY() + LAYOUT.table.footerHeight / 2;

  container.innerHTML = paginationDotsSvg(pages, activePage, paginationBaseX, cy);
}

function handlePageDotClick(event: Event) {
  const target = event.target as SVGElement;
  const page = target.dataset?.page;
  if (page === undefined) return;

  currentPage = parseInt(page, 10);
  renderPage(currentPage);
}

export function initAgentTable() {
  document.addEventListener("dashboard:update", ((
    event: CustomEvent<DashboardSnapshot>,
  ) => {
    lastAgents = event.detail.agents;
    renderPage(currentPage);
  }) as EventListener);

  const dotsContainer = document.getElementById("page-dots");
  if (dotsContainer) {
    dotsContainer.addEventListener("click", handlePageDotClick);
  }

  setInterval(() => {
    if (lastAgents.length === 0) return;
    currentPage = (currentPage + 1) % totalPages();
    renderPage(currentPage);
  }, PAGINATION_INTERVAL_MS);
}
