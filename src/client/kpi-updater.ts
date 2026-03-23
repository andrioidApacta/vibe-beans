import type { DashboardSnapshot, Kpi } from "~/types/dashboard";
import { formatTime } from "~/lib/format";
import { RING_CIRCUMFERENCE } from "~/lib/svg";

const formatters: Record<string, (kpi: Kpi) => string> = {
  totalCallsToday: (kpi) => String(kpi.totalCallsToday),
  avgHandleTimeSeconds: (kpi) => formatTime(kpi.avgHandleTimeSeconds),
  avgWaitTimeSeconds: (kpi) => formatTime(kpi.avgWaitTimeSeconds),
  serviceLevelPercent: (kpi) => `${kpi.serviceLevelPercent}%`,
  callsInQueue: (kpi) => String(kpi.callsInQueue),
  abandonRatePercent: (kpi) => `${kpi.abandonRatePercent}%`,
};

function flashElement(el: Element) {
  el.classList.remove("kpi-flash");
  void (el as HTMLElement).offsetWidth;
  el.classList.add("kpi-flash");
}

function updateRing(percent: number) {
  const ring = document.querySelector("[data-ring-progress]");
  if (!ring) return;

  const offset = RING_CIRCUMFERENCE * (1 - percent / 100);
  ring.setAttribute("stroke-dashoffset", offset.toFixed(2));
}

export function initKpiUpdater() {
  document.addEventListener("dashboard:update", ((
    event: CustomEvent<DashboardSnapshot>,
  ) => {
    const { kpi } = event.detail;

    for (const [key, format] of Object.entries(formatters)) {
      const el = document.querySelector(`[data-kpi="${key}"]`);
      if (!el) continue;

      const newValue = format(kpi);
      if (el.textContent !== newValue) {
        el.textContent = newValue;
        flashElement(el);
      }
    }

    updateRing(kpi.serviceLevelPercent);
  }) as EventListener);
}
