"use client";

import { ReactFlow, Background, BackgroundVariant, Controls, Panel, type Edge, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import MapNode from "./MapNode";
import GhostNode from "./GhostNode";
import { EDGE_LOOK } from "@/lib/atlas/edgeStyle";
import type { LinkType } from "@/lib/atlas/types";

const nodeTypes = { card: MapNode, ghost: GhostNode };
const LINK_ORDER: LinkType[] = ["depends-on", "triggers", "emits", "consumes"];

export default function LevelCanvas({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  return (
    <div className="canvas-wrap">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.6} color="var(--canvas-dot)" />
        <Controls showInteractive={false} position="bottom-right" />

        <Panel position="top-left" className="map-hint">
          Click a solid card to zoom in. Dashed ghost cards jump straight to a
          connected node elsewhere on the map — the lines are real
          dependencies, not the folder hierarchy.
        </Panel>

        <Panel position="bottom-left" className="edge-legend">
          {LINK_ORDER.map((type) => {
            const look = EDGE_LOOK[type];
            return (
              <div className="edge-legend-item" key={type} title={look.description}>
                <span
                  className="edge-legend-line"
                  style={{
                    borderColor: look.color,
                    borderTopStyle: !look.dash ? "solid" : look.dash === "5 3" ? "dashed" : "dotted",
                  }}
                />
                <span>{type}</span>
              </div>
            );
          })}
        </Panel>
      </ReactFlow>
    </div>
  );
}
