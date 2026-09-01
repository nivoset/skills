export type Status = "solid" | "needs-refinement" | "not-started";

export type TicketRef = { system: string; ref: string };

export type LinkType = "depends-on" | "triggers" | "emits" | "consumes";

/** A raw graph edge as authored in a contract.yaml — item-to-item, not parent/child. */
export type RawLink = {
  /** Path of the target node, relative to the atlas/ root, e.g. "billing/create-subscription". */
  to: string;
  type: LinkType;
  label?: string;
};

export type Contract = {
  kind: "contract";
  id: string;
  path: string; // "<service>/<contractId>"
  serviceId: string;
  regionId: string;
  name: string;
  contractKind: "command" | "query" | "event";
  status: Status;
  description?: string;
  request?: unknown;
  response?: unknown;
  scenarios: Scenario[] | null; // null = no .feature file at all (not-started, nothing authored)
  tickets: TicketRef[];
  links: RawLink[];
};

export type Scenario = {
  name: string;
  steps: { keyword: string; text: string }[];
  notes: string[]; // gherkin comment lines, shown as refinement notes
};

export type Service = {
  kind: "service";
  id: string;
  path: string; // == id
  regionId: string;
  name: string;
  description?: string;
  status: Status; // explicit override; effectiveStatus is computed
  tickets: TicketRef[];
  contractIds: string[];
};

export type Region = {
  kind: "region";
  id: string;
  path: string; // == id
  name: string;
  description?: string;
  serviceIds: string[];
};

export type AtlasRepo = {
  systemName: string;
  systemDescription?: string;
  regions: Record<string, Region>;
  services: Record<string, Service>;
  contracts: Record<string, Contract>; // keyed by path "<service>/<contractId>"
};

/** A resolved edge at some zoom level, after rolling raw links up the hierarchy. */
export type GraphEdge = {
  id: string;
  from: string; // node path at this level
  to: string; // node path at this level
  type: LinkType;
  labels: string[]; // merged labels of the underlying raw links, deduped
  count: number; // how many underlying raw links this edge represents
};
