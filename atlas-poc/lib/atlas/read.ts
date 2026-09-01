import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { AtlasRepo, Contract, Region, Scenario, Service } from "./types";

// This whole file only runs server-side (it touches the filesystem), which
// is exactly the point being demonstrated: the "repo" is just files, read
// straight off disk with no database in front of it.
const ATLAS_ROOT = path.join(process.cwd(), "atlas");

function readYaml(filePath: string): any {
  return yaml.load(fs.readFileSync(filePath, "utf8"));
}

function readJsonRef(baseDir: string, ref: string): unknown {
  const resolved = path.join(baseDir, ref);
  return JSON.parse(fs.readFileSync(resolved, "utf8"));
}

/**
 * Minimal Gherkin reader — enough to pull Scenario names, Given/When/Then
 * steps, and trailing "# refinement note" comments out of a .feature file.
 * It intentionally does not understand Background, tags, Scenario Outline
 * tables, or Doc Strings: a POC-scoped parser, not a Cucumber replacement.
 */
function parseFeature(text: string): Scenario[] {
  const scenarios: Scenario[] = [];
  let current: Scenario | null = null;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith("#")) {
      const note = line.replace(/^#+\s*/, "");
      current?.notes.push(note);
      continue;
    }
    if (line.startsWith("Feature:")) continue;

    const scenarioMatch = line.match(/^Scenario(?: Outline)?:\s*(.*)$/);
    if (scenarioMatch) {
      current = { name: scenarioMatch[1], steps: [], notes: [] };
      scenarios.push(current);
      continue;
    }

    const stepMatch = line.match(/^(Given|When|Then|And|But)\s+(.*)$/);
    if (stepMatch && current) {
      current.steps.push({ keyword: stepMatch[1], text: stepMatch[2] });
    }
  }

  return scenarios;
}

export function loadAtlasRepo(): AtlasRepo {
  const systemDoc = readYaml(path.join(ATLAS_ROOT, "system.yaml"));

  const regions: Record<string, Region> = {};
  const services: Record<string, Service> = {};
  const contracts: Record<string, Contract> = {};

  for (const r of systemDoc.regions as any[]) {
    regions[r.id] = {
      kind: "region",
      id: r.id,
      path: r.id,
      name: r.name,
      description: r.description,
      serviceIds: r.services,
    };

    for (const serviceId of r.services as string[]) {
      const serviceDir = path.join(ATLAS_ROOT, serviceId);
      const serviceDoc = readYaml(path.join(serviceDir, "service.yaml"));
      const contractsDir = path.join(serviceDir, "contracts");
      const contractIds: string[] = [];

      if (fs.existsSync(contractsDir)) {
        for (const entry of fs.readdirSync(contractsDir, { withFileTypes: true })) {
          if (!entry.isDirectory()) continue;
          const contractId = entry.name;
          const contractDir = path.join(contractsDir, contractId);
          const contractDoc = readYaml(path.join(contractDir, "contract.yaml"));

          let scenarios: Scenario[] | null = null;
          if (contractDoc.scenarios) {
            const featurePath = path.join(contractDir, contractDoc.scenarios);
            if (fs.existsSync(featurePath)) {
              scenarios = parseFeature(fs.readFileSync(featurePath, "utf8"));
            }
          }

          const request = contractDoc.request?.$ref
            ? readJsonRef(contractDir, contractDoc.request.$ref)
            : undefined;
          const response = contractDoc.response?.$ref
            ? readJsonRef(contractDir, contractDoc.response.$ref)
            : undefined;

          const contractPath = `${serviceId}/${contractId}`;
          contracts[contractPath] = {
            kind: "contract",
            id: contractId,
            path: contractPath,
            serviceId,
            regionId: r.id,
            name: contractDoc.name ?? contractId,
            contractKind: contractDoc.kind ?? "command",
            status: contractDoc.status ?? "not-started",
            description: contractDoc.description,
            request,
            response,
            scenarios,
            tickets: contractDoc.tickets ?? [],
            links: contractDoc.links ?? [],
          };
          contractIds.push(contractId);
        }
      }

      services[serviceId] = {
        kind: "service",
        id: serviceId,
        path: serviceId,
        regionId: r.id,
        name: serviceDoc.name ?? serviceId,
        description: serviceDoc.description,
        status: serviceDoc.status ?? "not-started",
        tickets: serviceDoc.tickets ?? [],
        contractIds,
      };
    }
  }

  return {
    systemName: systemDoc.name ?? "System",
    systemDescription: systemDoc.description,
    regions,
    services,
    contracts,
  };
}
