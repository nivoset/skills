import { notFound } from "next/navigation";
import type { Edge, Node } from "@xyflow/react";
import { loadAtlasRepo } from "@/lib/atlas/read";
import { aggregateStatus, inferContractStatus, singleStatusCounts } from "@/lib/atlas/aggregate";
import { buildContractEdges, buildRegionEdges, buildServiceEdges, edgesTouching } from "@/lib/atlas/graph";
import { toFlowEdge } from "@/lib/atlas/edgeStyle";
import type { MapNodeData } from "@/components/map/MapNode";
import type { GhostNodeData } from "@/components/map/GhostNode";
import LevelCanvas from "@/components/map/LevelCanvas";
import ContractDetail from "@/components/detail/ContractDetail";
import TopBar, { type Crumb } from "@/components/TopBar";
import "@/lib/adapters/mock-adapter";

function card(id: string, x: number, y: number, data: MapNodeData): Node {
  return { id, type: "card", position: { x, y }, data: data as any };
}
function ghost(id: string, x: number, y: number, data: GhostNodeData): Node {
  return { id, type: "ghost", position: { x, y }, data: data as any };
}

const COL_PRIMARY = 40;
const COL_GHOST = 500;
const ROW = 200;

export default async function AtlasPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path } = await params;
  const segs = path ?? [];
  const repo = loadAtlasRepo();

  const crumbs: Crumb[] = [{ name: repo.systemName, href: "/atlas" }];

  // ---------- L0 — system: regions as territory ----------
  if (segs.length === 0) {
    const regionEdges = buildRegionEdges(repo);
    const nodes: Node[] = Object.values(repo.regions).map((region, i) => {
      const statuses = region.serviceIds.flatMap((sid) =>
        repo.services[sid].contractIds.map((cid) => inferContractStatus(repo.contracts[`${sid}/${cid}`]))
      );
      const rollup = aggregateStatus(statuses);
      return card(region.id, COL_PRIMARY, i * ROW + 20, {
        kind: "Region",
        name: region.name,
        description: region.description,
        dominant: rollup.dominant,
        counts: rollup.counts,
        href: `/atlas/${region.id}`,
      });
    });
    const edges: Edge[] = regionEdges.map(toFlowEdge);

    return (
      <div className="shell">
        <TopBar crumbs={crumbs} />
        <p className="overview-copy">
          Widest view — two regions, each an aggregate of the services inside it. The
          connecting line is a real graph edge, rolled up from a contract-level link two
          levels down. Click a region to zoom in.
        </p>
        <LevelCanvas nodes={nodes} edges={edges} />
      </div>
    );
  }

  // ---------- L1 — region: services as settlements ----------
  const region = repo.regions[segs[0]];
  if (!region) notFound();
  crumbs.push({ name: region.name, href: `/atlas/${region.id}` });

  if (segs.length === 1) {
    const primaryIds = new Set(region.serviceIds);
    const serviceEdges = buildServiceEdges(repo);
    const relevant = edgesTouching(serviceEdges, primaryIds);

    const externalIds = new Set<string>();
    for (const e of relevant) {
      if (!primaryIds.has(e.from)) externalIds.add(e.from);
      if (!primaryIds.has(e.to)) externalIds.add(e.to);
    }

    const nodes: Node[] = region.serviceIds.map((sid, i) => {
      const service = repo.services[sid];
      const statuses = service.contractIds.map((cid) => inferContractStatus(repo.contracts[`${sid}/${cid}`]));
      const rollup = aggregateStatus(statuses);
      return card(sid, COL_PRIMARY, i * ROW + 20, {
        kind: "Service",
        name: service.name,
        description: service.description,
        dominant: rollup.dominant,
        counts: rollup.counts,
        href: `/atlas/${region.id}/${sid}`,
      });
    });

    [...externalIds].forEach((sid, i) => {
      const service = repo.services[sid];
      const parentRegion = repo.regions[service.regionId];
      nodes.push(
        ghost(sid, COL_GHOST, i * ROW + 20, {
          parentLabel: `${parentRegion.name} region`,
          name: service.name,
          href: `/atlas/${parentRegion.id}/${sid}`,
        })
      );
    });

    const edges: Edge[] = relevant.map(toFlowEdge);

    return (
      <div className="shell">
        <TopBar crumbs={crumbs} />
        <p className="overview-copy">{region.description}</p>
        <LevelCanvas nodes={nodes} edges={edges} />
      </div>
    );
  }

  // ---------- L2 — service: contracts as cards ----------
  const service = repo.services[segs[1]];
  if (!service || service.regionId !== region.id) notFound();
  crumbs.push({ name: service.name, href: `/atlas/${region.id}/${service.id}` });

  if (segs.length === 2) {
    const primaryPaths = new Set(service.contractIds.map((cid) => `${service.id}/${cid}`));
    const contractEdges = buildContractEdges(repo);
    const relevant = edgesTouching(contractEdges, primaryPaths);

    const externalPaths = new Set<string>();
    for (const e of relevant) {
      if (!primaryPaths.has(e.from)) externalPaths.add(e.from);
      if (!primaryPaths.has(e.to)) externalPaths.add(e.to);
    }

    const nodes: Node[] = service.contractIds.map((cid, i) => {
      const path = `${service.id}/${cid}`;
      const contract = repo.contracts[path];
      const status = inferContractStatus(contract);
      return card(path, COL_PRIMARY, i * ROW + 20, {
        kind: contract.contractKind,
        name: contract.name,
        description: contract.description,
        dominant: status,
        counts: singleStatusCounts(status),
        href: `/atlas/${region.id}/${service.id}/${cid}`,
      });
    });

    [...externalPaths].forEach((path, i) => {
      const contract = repo.contracts[path];
      const parentService = repo.services[contract.serviceId];
      nodes.push(
        ghost(path, COL_GHOST, i * ROW + 20, {
          parentLabel: parentService.name,
          name: contract.name,
          href: `/atlas/${contract.regionId}/${contract.serviceId}/${contract.id}`,
        })
      );
    });

    const edges: Edge[] = relevant.map(toFlowEdge);

    return (
      <div className="shell">
        <TopBar crumbs={crumbs} />
        <p className="overview-copy">{service.description}</p>
        <LevelCanvas nodes={nodes} edges={edges} />
      </div>
    );
  }

  // ---------- L3 — contract: behavior, no source shown ----------
  const contractId = segs[2];
  const contract = repo.contracts[`${service.id}/${contractId}`];
  if (!contract) notFound();
  crumbs.push({ name: contract.name, href: `/atlas/${region.id}/${service.id}/${contract.id}` });

  return (
    <div className="shell">
      <TopBar crumbs={crumbs} />
      <ContractDetail repo={repo} contract={contract} regionId={region.id} />
    </div>
  );
}
