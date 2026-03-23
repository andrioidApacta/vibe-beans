import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { handler as astroHandler } from "./dist/server/entry.mjs";
import { startBroadcast } from "./src/lib/websocket-broadcaster.ts";

const PORT = parseInt(process.env.PORT || "4321", 10);
const HOST = process.env.HOST || "0.0.0.0";

const server = createServer(astroHandler);

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  if (request.url === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

const stopBroadcast = startBroadcast(wss);

server.listen(PORT, HOST, () => {
  console.log(`Dashboard running at http://${HOST}:${PORT}`);
});

function shutdown() {
  stopBroadcast();
  wss.close();
  server.close();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
