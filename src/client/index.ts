import { connect } from "~/client/websocket-client";
import { initKpiUpdater } from "~/client/kpi-updater";
import { initAgentTable } from "~/client/agent-table";

initKpiUpdater();
initAgentTable();
connect();
