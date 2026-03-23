import type { Agent, DashboardSnapshot } from "~/types/dashboard";
import { statusDotSvg, statusLabels } from "~/lib/svg";
import { formatTime, escapeHtml } from "~/lib/format";

const PAGE_SIZE = 10;
const PAGINATION_INTERVAL_MS = 30_000;

let currentPage = 0;
let lastAgents: Agent[] = [];

function totalPages(): number {
  return Math.max(1, Math.ceil(lastAgents.length / PAGE_SIZE));
}

function renderPage(page: number) {
  const tbody = document.getElementById("agent-tbody");
  if (!tbody) return;

  const start = page * PAGE_SIZE;
  const pageAgents = lastAgents.slice(start, start + PAGE_SIZE);

  tbody.innerHTML = pageAgents
    .map(
      (agent) => `
    <tr class="border-t border-border" data-agent-id="${agent.id}">
      <td class="px-6 py-4 font-medium">${escapeHtml(agent.name)}</td>
      <td class="px-6 py-4">
        <span class="inline-flex items-center gap-2">
          ${statusDotSvg(agent.status)}
          ${statusLabels[agent.status]}
        </span>
      </td>
      <td class="px-6 py-4 text-right tabular-nums">${agent.callsToday}</td>
      <td class="px-6 py-4 text-right tabular-nums">${formatTime(agent.handleTimeSeconds)}</td>
    </tr>`,
    )
    .join("");

  const pageIndicator = document.getElementById("page-indicator");
  if (pageIndicator) {
    pageIndicator.textContent = `Side ${page + 1} af ${totalPages()}`;
  }

  const agentCount = document.getElementById("agent-count");
  if (agentCount) {
    agentCount.textContent = `${lastAgents.length} agenter i alt`;
  }

  updatePageDots(page);
}

function updatePageDots(activePage: number) {
  const container = document.getElementById("page-dots");
  if (!container) return;

  const pages = totalPages();
  container.innerHTML = Array.from({ length: pages }, (_, i) => {
    const active = i === activePage;
    return `<button class="w-2.5 h-2.5 rounded-full transition-colors ${active ? "bg-accent" : "bg-border"}" data-page="${i}" aria-label="Gå til side ${i + 1}"></button>`;
  }).join("");
}

function handlePageDotClick(event: Event) {
  const target = event.target as HTMLElement;
  const page = target.dataset.page;
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
