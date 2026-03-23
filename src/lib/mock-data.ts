import type { Agent, AgentStatus, DashboardSnapshot, Kpi } from "~/types/dashboard";

const FIRST_NAMES = [
  "Emma", "Liam", "Olivia", "Noah", "Ava",
  "Elijah", "Sophia", "James", "Isabella", "Lucas",
  "Mia", "Mason", "Charlotte", "Ethan", "Amelia",
  "Logan", "Harper", "Aiden", "Evelyn", "Jackson",
  "Luna", "Sebastian", "Ella", "Mateo", "Scarlett",
  "Henry", "Grace", "Owen", "Chloe", "Daniel",
  "Aria", "Alexander", "Penelope", "Michael", "Layla",
  "Benjamin", "Riley", "William", "Zoey", "Leo",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones",
  "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Anderson", "Taylor", "Thomas", "Moore", "Jackson",
  "Martin", "Lee", "Perez", "Thompson", "White",
  "Harris", "Sanchez", "Clark", "Ramirez", "Lewis",
  "Robinson", "Walker", "Young", "Allen", "King",
  "Wright", "Scott", "Torres", "Nguyen", "Hill",
  "Flores", "Green", "Adams", "Nelson", "Baker",
];

const STATUSES: AgentStatus[] = [
  "available",
  "on-call",
  "after-call-work",
  "offline",
  "break",
];

// Weighted distribution: agents are more likely to be available or on-call
const STATUS_WEIGHTS: AgentStatus[] = [
  "available", "available", "available",
  "on-call", "on-call", "on-call", "on-call",
  "after-call-work", "after-call-work",
  "offline",
  "break",
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAgent(id: number): Agent {
  return {
    id,
    name: `${FIRST_NAMES[id % FIRST_NAMES.length]} ${LAST_NAMES[id % LAST_NAMES.length]}`,
    status: pickRandom(STATUS_WEIGHTS),
    callsToday: randomInt(0, 45),
    handleTimeSeconds: randomInt(60, 600),
  };
}

function generateKpi(agents: Agent[]): Kpi {
  const totalCalls = agents.reduce((sum, a) => sum + a.callsToday, 0);
  const avgHandle = agents.length > 0
    ? agents.reduce((sum, a) => sum + a.handleTimeSeconds, 0) / agents.length
    : 0;

  return {
    totalCallsToday: totalCalls,
    avgHandleTimeSeconds: Math.round(avgHandle),
    avgWaitTimeSeconds: randomInt(15, 120),
    serviceLevelPercent: randomInt(75, 99),
    callsInQueue: randomInt(0, 12),
    abandonRatePercent: parseFloat((Math.random() * 8).toFixed(1)),
  };
}

export function generateDashboardSnapshot(agentCount = 40): DashboardSnapshot {
  const agents = Array.from({ length: agentCount }, (_, i) => generateAgent(i));
  return {
    kpi: generateKpi(agents),
    agents,
    timestamp: new Date().toISOString(),
  };
}
