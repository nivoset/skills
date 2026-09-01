import type { AtlasRepo, Contract } from "@/lib/atlas/types";
import { inferContractStatus } from "@/lib/atlas/aggregate";
import { getAdapter } from "@/lib/adapters/ticket-adapter";
import AiDraftButton from "./AiDraftButton";

function SchemaTable({ title, schema }: { title: string; schema: any }) {
  const props = schema?.properties ?? {};
  const required: string[] = schema?.required ?? [];
  const names = Object.keys(props);
  if (names.length === 0) return null;
  return (
    <>
      <div className="section-label">{title}</div>
      <table className="schema-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {names.map((n) => (
            <tr key={n}>
              <td>{n}</td>
              <td>{props[n].enum ? props[n].enum.join(" | ") : props[n].type}</td>
              <td className="req-badge">{required.includes(n) ? "required" : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default async function ContractDetail({
  repo,
  contract,
  regionId,
}: {
  repo: AtlasRepo;
  contract: Contract;
  regionId: string;
}) {
  const status = inferContractStatus(contract);
  const service = repo.services[contract.serviceId];

  const outgoing = contract.links.map((l) => ({
    dir: "to" as const,
    type: l.type,
    label: l.label,
    target: repo.contracts[l.to],
    targetPath: l.to,
  }));
  const incoming = Object.values(repo.contracts)
    .flatMap((c) =>
      c.links
        .filter((l) => l.to === contract.path)
        .map((l) => ({ dir: "from" as const, type: l.type, label: l.label, target: c, targetPath: c.path }))
    );
  const allLinks = [...outgoing, ...incoming];

  const ticketBadges = await Promise.all(
    contract.tickets.map(async (t) => {
      const adapter = getAdapter(t.system);
      const status = adapter ? await adapter.getStatus(t) : null;
      return { ref: t, status };
    })
  );

  return (
    <div className="detail">
      <div className="kind-tag">
        {contract.contractKind} &middot; {service.name}
      </div>
      <div className="detail-header">
        <h1>{contract.name}</h1>
        <span className={`status-pill ${status}`}>{status.replace("-", " ")}</span>
      </div>
      {contract.description && <p style={{ color: "var(--ink-soft)" }}>{contract.description}</p>}

      {ticketBadges.length > 0 && (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.6rem" }}>
          {ticketBadges.map(
            ({ ref, status }) =>
              status && (
                <a key={ref.ref} className="ticket-badge" href={status.url} target="_blank" rel="noreferrer">
                  <span className={`tdot ${status.state}`} />
                  {ref.system}/{ref.ref} &middot; {status.label}
                </a>
              )
          )}
        </div>
      )}

      {!!(contract.request || contract.response) && (
        <>
          <SchemaTable title="Request" schema={contract.request} />
          <SchemaTable title="Response" schema={contract.response} />
        </>
      )}

      {allLinks.length > 0 && (
        <>
          <div className="section-label">Graph connections</div>
          <ul className="links-list">
            {allLinks.map((l, i) => (
              <li key={i} className="link-row">
                <span className="link-dir">{l.dir === "to" ? "→ to" : "← from"}</span>
                <span className="link-type">{l.type}</span>
                <a href={`/atlas/${l.target.regionId}/${l.target.serviceId}/${l.target.id}`}>
                  {l.target.name}
                </a>
                {l.label && <span style={{ color: "var(--ink-faint)", fontSize: "0.8rem" }}>&mdash; {l.label}</span>}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="section-label">Behavior</div>
      {contract.scenarios && contract.scenarios.length > 0 ? (
        contract.scenarios.map((s, i) => (
          <div className="scenario" key={i}>
            <h3>{s.name}</h3>
            {s.steps.map((step, j) => (
              <div className="step-line" key={j}>
                <span className="kw">{step.keyword}</span> {step.text}
              </div>
            ))}
            {s.notes.length > 0 && (
              <div className="scenario-note">{s.notes.join(" ")}</div>
            )}
          </div>
        ))
      ) : (
        <div className="empty-behavior">
          No scenarios written yet — this is the floor of the map, and right now it's bare rock.
        </div>
      )}

      <AiDraftButton contractName={contract.name} description={contract.description} />
    </div>
  );
}
