import type { AgentStatus } from "~/types/dashboard";

export const statusColors: Record<AgentStatus, string> = {
  available: "#34c759",
  "on-call": "#5856d6",
  "after-call-work": "#ff9f0a",
  offline: "#8e8e93",
  break: "#ff6b6b",
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
  return `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="5" cy="5" r="4.5" fill="${color}" opacity="0.15"/><circle cx="5" cy="5" r="3" fill="${color}"/></svg>`;
}

const RING_RADIUS = 28;
export const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function serviceLevelRingSvg(percent: number): string {
  const offset = RING_CIRCUMFERENCE * (1 - percent / 100);
  return `<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Serviceniveau ${percent}%"><circle cx="36" cy="36" r="${RING_RADIUS}" stroke="#f0f0f5" stroke-width="5" fill="none"/><circle cx="36" cy="36" r="${RING_RADIUS}" stroke="#34c759" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="${RING_CIRCUMFERENCE.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}" transform="rotate(-90 36 36)" style="transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" data-ring-progress/></svg>`;
}
