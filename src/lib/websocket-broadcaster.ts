import { WebSocketServer, WebSocket } from "ws";
import { generateDashboardSnapshot } from "~/lib/mock-data";

const BROADCAST_INTERVAL_MS = 3000;

export function startBroadcast(wss: WebSocketServer): () => void {
  const timer = setInterval(() => {
    const snapshot = generateDashboardSnapshot();
    const payload = JSON.stringify(snapshot);

    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    }
  }, BROADCAST_INTERVAL_MS);

  return () => clearInterval(timer);
}
