import { registerAdapter, type TicketAdapter, type TicketStatus } from "./ticket-adapter";

// Stands in for Linear/Jira/GitHub while only the adapter interface is
// designed. Swapping in a real one later means implementing TicketAdapter
// against a real API — nothing in the map or the canvas has to change.
const STATES: TicketStatus["state"][] = ["todo", "in-progress", "done", "blocked"];
const LABELS: Record<TicketStatus["state"], string> = {
  todo: "Todo",
  "in-progress": "In Progress",
  done: "Done",
  blocked: "Blocked",
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export const mockAdapter: TicketAdapter = {
  system: "mock",
  async getStatus(ref) {
    const state = STATES[hash(ref.ref) % STATES.length];
    return {
      label: LABELS[state],
      state,
      url: `https://example.com/mock-tracker/${ref.ref}`,
      updatedAt: new Date(2026, 7, (hash(ref.ref) % 27) + 1).toISOString(),
    };
  },
};

registerAdapter(mockAdapter);
