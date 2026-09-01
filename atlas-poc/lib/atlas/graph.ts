import type { AtlasRepo, GraphEdge } from "./types";

/**
 * Graph connections are authored once, at contract granularity (see the
 * `links:` field in any contract.yaml), and every other zoom level's edges
 * are *derived* from those — the same way status rolls up. Zoom out and a
 * contract-to-contract link becomes a service-to-service link; zoom out
 * again and it becomes a region-to-region link. Nobody hand-maintains three
 * copies of the same relationship at three levels of granularity.
 */
export function buildContractEdges(repo: AtlasRepo): GraphEdge[] {
  const edges: GraphEdge[] = [];
  let i = 0;
  for (const contract of Object.values(repo.contracts)) {
    for (const link of contract.links) {
      edges.push({
        id: `edge-c-${i++}`,
        from: contract.path,
        to: link.to,
        type: link.type,
        labels: link.label ? [link.label] : [],
        count: 1,
      });
    }
  }
  return edges;
}

function rollup(edges: GraphEdge[], toParent: (nodePath: string) => string): GraphEdge[] {
  const merged = new Map<string, GraphEdge>();
  for (const e of edges) {
    const from = toParent(e.from);
    const to = toParent(e.to);
    if (from === to) continue; // now internal to one parent — collapses away, doesn't dangle off itself
    const key = `${from}=>${to}:${e.type}`;
    const existing = merged.get(key);
    if (existing) {
      existing.count += e.count;
      for (const l of e.labels) if (!existing.labels.includes(l)) existing.labels.push(l);
    } else {
      merged.set(key, { id: key, from, to, type: e.type, labels: [...e.labels], count: e.count });
    }
  }
  return [...merged.values()];
}

export function buildServiceEdges(repo: AtlasRepo): GraphEdge[] {
  return rollup(buildContractEdges(repo), (p) => repo.contracts[p]?.serviceId ?? p);
}

export function buildRegionEdges(repo: AtlasRepo): GraphEdge[] {
  return rollup(buildServiceEdges(repo), (p) => repo.services[p]?.regionId ?? p);
}

/** Edges where at least one end is inside this set of node paths. */
export function edgesTouching(edges: GraphEdge[], nodePaths: Set<string>): GraphEdge[] {
  return edges.filter((e) => nodePaths.has(e.from) || nodePaths.has(e.to));
}
