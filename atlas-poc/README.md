# Atlas — POC

A runnable proof of concept for the zoomable, map-style architecture planner
from the spec doc: Next.js + the AI SDK on top, a git-backed `/atlas`
content directory underneath (this repo's `atlas/` folder is the "fake
repo" — a small subscription storefront called Nimbus Commerce).

## Run it

```
npm install
npm run dev
```

Then open http://localhost:3000/atlas.

## What's actually implemented

- **Four zoom levels**, navigated by clicking (not continuous scroll-zoom —
  see "Scope decisions" below): regions → services → contracts → a single
  contract's behavior. The URL encodes position, e.g.
  `/atlas/platform/billing/create-subscription`, so any view is a
  shareable link.
- **Graph connections, independent of the hierarchy.** Any contract can
  declare `links:` to any other contract (see
  `atlas/cart/contracts/checkout/contract.yaml`), typed as
  `depends-on` / `triggers` / `emits` / `consumes`. Those are the *only*
  edges hand-authored — service-to-service and region-to-region edges are
  *derived* by rolling the contract-level links up the hierarchy
  (`lib/atlas/graph.ts`), the same way status rolls up. Zoom out and a
  link between two contracts becomes a link between their services, then
  between their regions, deduped and merged automatically.
- **Status maturity** (solid / needs-refinement / not-started), aggregated
  upward: a region or service is colored by the *least* mature thing
  inside it, plus a proportion strip showing the real mix
  (`lib/atlas/aggregate.ts`). One inference rule is applied automatically:
  a contract with zero scripted scenarios can't read as "solid" even if
  its yaml claims it, so it's clamped to "needs-refinement".
- **No source code, ever.** The deepest view shows a contract's request/
  response schema as a plain field table, and its behavior as rendered
  Gherkin (`Given`/`When`/`Then`), parsed from real `.feature` files by a
  minimal reader in `lib/atlas/read.ts`. Nothing in the UI reads or
  renders application source.
- **A ticket adapter interface** (`lib/adapters/ticket-adapter.ts`) with a
  mock implementation wired in (`lib/adapters/mock-adapter.ts`) — a real
  Linear/Jira/GitHub adapter is a drop-in implementation of the same
  interface, nothing else in the app changes.
- **One real AI SDK call site** (`app/api/ai/draft-scenario/route.ts`): a
  "Draft a scenario with AI" button on every contract page. No
  `ANTHROPIC_API_KEY` is set anywhere in this POC, so it falls back to a
  canned draft — set the env var and the real `generateText()` call
  (already written, just gated behind the key check) takes over.

## Scope decisions worth knowing about

- **Zoom is click-to-drill, not continuous.** True magic-zoom — one
  camera, content re-rendering continuously as you scroll — is a bigger
  build than a POC needs to prove the idea. Each level is its own page
  with real mouse-wheel pan/zoom *within* it (via `@xyflow/react`), and
  moving between levels is a click + navigation. The URL-as-position and
  representation-swap parts of the idea are both fully real; only the
  "one continuous camera" part is simulated by discrete steps.
- **The fake repo is small on purpose** — 2 regions, 4 services, 8
  contracts — deliberately mixed maturity so every state (solid,
  needs-refinement, not-started, no scenarios at all) shows up somewhere.
  Look at `atlas/` directly to see the git-backed data model this is all
  reading.
- **No auth, no multi-user sync** — left open in the spec doc, still open
  here.

## Project layout

```
atlas/                the fake repo — edit these files and refresh
app/atlas/[[...path]] the zoom-level route (region → service → contract)
app/api/ai/…           the one AI SDK route
components/map/        xyflow canvas + node renderers (region/service/contract cards, ghost nodes for cross-links)
components/detail/      the L3 contract page (schema, gherkin, links, AI button)
lib/atlas/              read the repo, aggregate status, roll up graph edges
lib/adapters/           ticket adapter interface + mock implementation
```
