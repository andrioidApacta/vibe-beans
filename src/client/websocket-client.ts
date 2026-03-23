import { DashboardSnapshotSchema } from "~/types/dashboard";

const MAX_RECONNECT_DELAY_MS = 30_000;
const BASE_RECONNECT_DELAY_MS = 1_000;

function getWsUrl(): string {
  const path = document.body.dataset.wsUrl ?? "/ws";
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${location.host}${path}`;
}

function updateConnectionStatus(connected: boolean) {
  const el = document.getElementById("connection-status");
  if (!el) return;

  const dot = el.querySelector("[data-status-dot]");
  if (dot) {
    dot.className = `w-2 h-2 rounded-full ${connected ? "bg-status-available" : "bg-status-offline"}`;
  }
  const label = el.querySelector("[data-status-label]");
  if (label) {
    label.textContent = connected ? "Forbundet" : "Afbrudt";
  }
}

export function connect() {
  let reconnectAttempts = 0;

  function createConnection() {
    const ws = new WebSocket(getWsUrl());

    ws.addEventListener("open", () => {
      reconnectAttempts = 0;
      updateConnectionStatus(true);
    });

    ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data as string);
        const result = DashboardSnapshotSchema.safeParse(data);
        if (!result.success) {
          console.warn("Invalid dashboard snapshot:", result.error);
          return;
        }
        document.dispatchEvent(
          new CustomEvent("dashboard:update", { detail: result.data }),
        );
      } catch {
        console.warn("Failed to parse WebSocket message");
      }
    });

    ws.addEventListener("close", () => {
      updateConnectionStatus(false);
      scheduleReconnect();
    });

    ws.addEventListener("error", () => {
      ws.close();
    });
  }

  function scheduleReconnect() {
    const delay = Math.min(
      BASE_RECONNECT_DELAY_MS * 2 ** reconnectAttempts,
      MAX_RECONNECT_DELAY_MS,
    );
    reconnectAttempts++;
    setTimeout(createConnection, delay);
  }

  createConnection();
}
