import type { DashboardSnapshot, Kpi } from "~/types/dashboard";
import { formatTime } from "~/lib/format";

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
  // Force reflow so re-adding the class triggers the animation
  void (el as HTMLElement).offsetWidth;
  el.classList.add("kpi-flash");
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
  }) as EventListener);
}
