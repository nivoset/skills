import type { Edge } from "@xyflow/react";
import type { GraphEdge, LinkType } from "./types";

/**
 * The visual language for every connection on the map, in one place, so
 * the canvas lines and the legend that explains them can never drift apart.
 */
export const EDGE_LOOK: Record<LinkType, { color: string; dash?: string; description: string }> = {
  "depends-on": {
    color: "var(--structural)",
    description: "calls or reads from another contract synchronously",
  },
  triggers: {
    color: "var(--accent)",
    dash: "5 3",
    description: "kicks off another contract as a direct next step",
  },
  emits: {
    color: "var(--accent)",
    dash: "2 3",
    description: "publishes a domain event for others to react to",
  },
  consumes: {
    color: "var(--structural)",
    dash: "2 3",
    description: "reacts to an event published elsewhere",
  },
};

export function toFlowEdge(e: GraphEdge): Edge {
  const look = EDGE_LOOK[e.type];
  const label = e.labels.length > 0 ? e.labels.join(" · ") : e.type;
  return {
    id: e.id,
    source: e.from,
    target: e.to,
    type: "smoothstep",
    label: e.count > 1 ? `${label} (${e.count})` : label,
    labelBgPadding: [6, 3],
    labelBgBorderRadius: 6,
    labelStyle: { fill: "var(--ink-soft)", fontFamily: "IBM Plex Mono, monospace", fontSize: 11 },
    labelBgStyle: { fill: "var(--paper-raised)", stroke: "var(--line)" },
    style: { stroke: look.color, strokeDasharray: look.dash, strokeWidth: 1.6 },
    markerEnd: { type: "arrowclosed" as any, color: look.color, width: 16, height: 16 },
  };
}
