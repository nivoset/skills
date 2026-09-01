export type TicketRef = { system: string; ref: string };

export type TicketStatus = {
  label: string; // "In Progress", "Done", ...
  state: "todo" | "in-progress" | "done" | "blocked";
  url: string;
  updatedAt: string;
};

export interface TicketAdapter {
  readonly system: string; // "linear" | "jira" | "github" | "mock" | ...
  getStatus(ref: TicketRef): Promise<TicketStatus>;
}

const registry = new Map<string, TicketAdapter>();
export const registerAdapter = (a: TicketAdapter) => registry.set(a.system, a);
export const getAdapter = (system: string) => registry.get(system);
