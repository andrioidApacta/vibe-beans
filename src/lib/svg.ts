import type { AgentStatus } from "~/types/dashboard";

export const statusColors: Record<AgentStatus, string> = {
  available: "#22c55e",
  "on-call": "#3b82f6",
  "after-call-work": "#f59e0b",
  offline: "#9ca3af",
  break: "#f97316",
};

export const statusLabels: Record<AgentStatus, string> = {
  available: "Ledig",
  "on-call": "I opkald",
  "after-call-work": "Efterbehandling",
  offline: "Offline",
  break: "Pause",
};

export function statusDotSvg(status: AgentStatus): string {
  const color = statusColors[status];
  const label = statusLabels[status];
  return `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><title>${label}</title><circle cx="6" cy="6" r="5" fill="${color}" /><circle cx="6" cy="6" r="5" fill="${color}" opacity="0.3"><animate attributeName="r" values="5;6;5" dur="2s" repeatCount="indefinite" /></circle></svg>`;
}
