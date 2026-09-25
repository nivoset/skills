# Product strategy planning roster

Use above delivery planning, when the board must settle **what we are building, for whom, how much risk we accept, and which tradeoffs we choose** before committing to a delivery plan.

The central artifacts are a **product stance**, a **user stance**, a **security posture**, and **tradeoff records**. The controller frames and preserves tradeoffs; the user or named authority decides them.

## Core roster

| Role ID | Definitive goal | Trigger (board-observable) | Returns |
| --- | --- | --- | --- |
| `product-stance-lead` | Produce one evidence-backed product stance with outcome, success measures, positioning, and explicit non-goals. | No accepted outcome or success measure; a proposal changes who benefits or what "done" means. | `goal`, `non-goal`, `evaluation-criterion`, `hypothesis` artifacts. |
| `user-advocate` | Make every affected user and non-user group explicit, with needs, constraints, agency, accessibility, trust, and harms represented. | A goal lacks a named user; a design affects consent, control, or visibility of user data; a user group is implied but unexamined. | `behavior`, `finding`, user-group case families. |
| `premise-challenger` | Test every central assumption against disconfirming evidence and preserve at least one credible alternative or the evidence that rules it out. | A central `hypothesis` is accepted without disconfirming evidence, or the board converges quickly with no live alternative. | `challenge` events, `alternative` artifacts, evidence requests. |
| `viability-reviewer` | Bound build, operating, support, lock-in, and time-to-value costs for every live alternative. | An alternative lacks cost or operational evidence; a proposal adds an ongoing service or vendor. | `risk`, `constraint`, cost evidence. |
| `scope-guardian` | Keep only work that serves the accepted outcome; turn all other work into explicit non-goals or authorized deferrals. | Goals multiply without new user evidence; a stance tries to serve every user group. | `non-goal` and `deferred` proposals, `challenge` events. |
| `tradeoff-broker` | Give every material conflict a decision-ready record with options, evidence, reversibility, and named authority without choosing for that authority. | Two supported artifacts conflict, or any security, user, or product role flags a cost to another stance. | Tradeoff records (see below), `human-required` questions. |

## Security roster

Treat security as a family of domains, not one reviewer. Run an implication sweep across these domains for every material product change; mark each `required`, `covered`, `research`, `deferred`, or `not-applicable` with evidence.

| Role ID | Definitive goal | Trigger |
| --- | --- | --- |
| `appsec-reviewer` | Identify exploitable application and business-logic paths and give each material risk a disposition. | New input surface, workflow, or user-controlled content. |
| `identity-access-reviewer` | Prove that every identity lifecycle and privileged action has explicit least-privilege policy, recovery, and negative checks. | New role, permission, sharing model, or privileged action. |
| `privacy-reviewer` | Account for every personal-data flow with lawful purpose, minimization, consent, retention, deletion, and transfer disposition. | Any new or repurposed personal or sensitive data. |
| `data-protection-reviewer` | Give every classified data store and boundary evidence-backed encryption, key, backup, restore, and isolation controls. | New data store, tenant boundary, or data export path. |
| `infrastructure-reviewer` | Identify every infrastructure trust boundary and prove intended exposure, secret handling, permissions, and isolation. | New service, public endpoint, or infrastructure dependency. |
| `supply-chain-reviewer` | Establish trusted provenance and bounded access for every outside component, service, and build input. | New vendor, library, or build step with elevated access. |
| `abuse-trust-reviewer` | Identify credible misuse by legitimate or hostile users and give each material abuse path prevention, detection, or accepted-risk evidence. | Anything users can create, send, share, or automate at volume. |
| `compliance-reviewer` | Map every applicable legal, regulatory, audit, and contractual obligation to evidence and an owner. | Regulated data, regulated region, or a customer commitment is in scope. |
| `incident-readiness-reviewer` | Ensure every material failure or breach mode is detectable, owned, recoverable, and covered by disclosure obligations. | A new failure or breach mode exists with no detection or owner. |
| `ai-safety-reviewer` | Bound model misuse, adversarial input, data leakage, unsafe output, and automated-action risk with evidence-backed controls. | The idea includes model-driven output or actions. |

The output is a **security posture**: per domain, the accepted risk level, required controls, open research, and who accepted any residual risk.

## Tradeoff record

```yaml
- tradeoff_id: tradeoff-signup-friction
  question: How much verification do we require before first use?
  affected_ids: [goal-fast-activation, risk-account-abuse]
  options:
    - id: option-email-only
      summary: Email confirmation only
    - id: option-verified-phone
      summary: Phone verification before first use
  dimensions: [user-value, user-friction, security-risk, privacy-cost, build-cost, operating-cost, reversibility, time-to-value]
  assessment:
    option-email-only: {user-friction: low, security-risk: high, reversibility: high, evidence_ids: [evidence-abuse-rate]}
    option-verified-phone: {user-friction: high, privacy-cost: medium, reversibility: medium, evidence_ids: [evidence-drop-off]}
  strongest_case_for_each: {option-email-only: <summary>, option-verified-phone: <summary>}
  evidence_gaps: [<what would discriminate>]
  decision_authority: <named person or role>
  decision: null
  reopen_if: <condition>
```

Common tensions to expect:

- security vs. user friction;
- privacy vs. personalization or analytics;
- speed to market vs. security or compliance depth;
- serving one user group well vs. serving many adequately;
- build vs. buy (control vs. vendor data access and lock-in);
- reversibility vs. short-term cost.

## Coverage checks before `parent-ready`

- Product stance names the outcome, target users, success measures, and non-goals.
- User stance names each affected user group, including non-users harmed or affected, with their key needs and risks.
- Every security domain has a disposition with evidence; `not-applicable` cites why.
- Every material conflict between product, user, and security stances is a tradeoff record, decided or marked `human-required`.
- At least one live alternative was examined by `premise-challenger` and kept with its rejection rationale.

Hand the accepted stance, non-goals, security posture, and decided tradeoffs to a [delivery planning](delivery-planning.md) board as constraints.
