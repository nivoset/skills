import type { Contract, Status } from "./types";

const MATURITY: Record<Status, number> = {
  "not-started": 0,
  "needs-refinement": 1,
  solid: 2,
};

export type StatusRollup = {
  dominant: Status; // the least-mature status among the children — what a collapsed shape is colored
  counts: Record<Status, number>; // the real mix, for the proportion strip
};

/**
 * A contract can't honestly be "solid" with zero scripted scenarios, no
 * matter what its yaml claims — this is the one automatic status inference
 * the POC applies. Everything else is the value authored in the file.
 */
export function inferContractStatus(c: Contract): Status {
  const hasScenarios = !!c.scenarios && c.scenarios.length > 0;
  if (!hasScenarios && c.status === "solid") return "needs-refinement";
  return c.status;
}

/** Same shape as a rollup's counts, for a leaf node that has no children to aggregate. */
export function singleStatusCounts(status: Status): Record<Status, number> {
  return { solid: 0, "needs-refinement": 0, "not-started": 0, [status]: 1 };
}

export function aggregateStatus(children: Status[]): StatusRollup {
  const counts: Record<Status, number> = { solid: 0, "needs-refinement": 0, "not-started": 0 };
  if (children.length === 0) return { dominant: "not-started", counts };

  let dominant: Status = children[0];
  for (const s of children) {
    counts[s]++;
    if (MATURITY[s] < MATURITY[dominant]) dominant = s;
  }
  return { dominant, counts };
}
