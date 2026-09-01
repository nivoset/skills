"use client";

import { Handle, Position } from "@xyflow/react";
import { useRouter } from "next/navigation";

export type GhostNodeData = {
  parentLabel: string; // which region/service this external node lives in
  name: string;
  href: string;
};

/**
 * Renders the other end of a graph connection that crosses out of the
 * current view — e.g. a "triggers" edge from a cart contract to a billing
 * contract while you're zoomed into the cart service. Clicking it jumps
 * straight to that node, the way clicking a place name on the edge of a
 * map pans you there.
 */
export default function GhostNode({ data }: { data: GhostNodeData }) {
  const router = useRouter();
  return (
    <div
      className="ghost-node"
      onClick={() => router.push(data.href)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(data.href);
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="ghost-label">{data.parentLabel}</div>
      <div>&#8599; {data.name}</div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}
