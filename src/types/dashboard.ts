import { z } from "zod";

export const AgentStatusSchema = z.enum([
  "available",
  "on-call",
  "after-call-work",
  "offline",
  "break",
]);

export const AgentSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: AgentStatusSchema,
  callsToday: z.number(),
  handleTimeSeconds: z.number(),
});

export const KpiSchema = z.object({
  totalCallsToday: z.number(),
  avgHandleTimeSeconds: z.number(),
  avgWaitTimeSeconds: z.number(),
  serviceLevelPercent: z.number(),
  callsInQueue: z.number(),
  abandonRatePercent: z.number(),
});

export const DashboardSnapshotSchema = z.object({
  kpi: KpiSchema,
  agents: z.array(AgentSchema),
  timestamp: z.string(),
});

export type AgentStatus = z.infer<typeof AgentStatusSchema>;
export type Agent = z.infer<typeof AgentSchema>;
export type Kpi = z.infer<typeof KpiSchema>;
export type DashboardSnapshot = z.infer<typeof DashboardSnapshotSchema>;
