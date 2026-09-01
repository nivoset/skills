"use client";

import { Handle, Position } from "@xyflow/react";
import { useRouter } from "next/navigation";
import type { Status } from "@/lib/atlas/types";

export type MapNodeData = {
  kind: string; // "Region" | "Service" | "Contract"
  name: string;
  description?: string;
  dominant: Status;
  counts: Record<Status, number>;
  href: string;
};

const ORDER: Status[] = ["solid", "needs-refinement", "not-started"];

export default function MapNode({ data }: { data: MapNodeData }) {
  const router = useRouter();
  const total = data.counts.solid + data.counts["needs-refinement"] + data.counts["not-started"];

  return (
    <div
      className={`map-node dominant-${data.dominant}`}
      onClick={() => router.push(data.href)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(data.href);
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="node-kind">{data.kind}</div>
      <div className="node-name">{data.name}</div>
      {data.description && <div className="node-desc">{data.description}</div>}
      {total > 0 && (
        <div
          className="mix-strip"
          title={ORDER.map((s) => `${s}: ${data.counts[s]}`).join(", ")}
        >
          {ORDER.filter((s) => data.counts[s] > 0).map((s) => (
            <div key={s} className={`mix-seg ${s}`} style={{ flex: data.counts[s] }} />
          ))}
        </div>
      )}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}
