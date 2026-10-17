# Authentication and permissions change overlay

Use when identity, sessions, roles, permissions, privileged access, account recovery, or policy behavior changes. The central artifact is an access matrix linked to enforcement points, lifecycle behavior, negative checks, rollout, detection, and named decision authority.

## Triggered roles

| Role ID | Definitive goal (why this player matters) | Trigger | Returns / evidence | Blocks readiness when |
| --- | --- | --- | --- | --- |
| `authentication-lifecycle-reviewer` | Defines every identity and session transition, including account recovery and revocation. | Enrollment, login, session, credential, federation, recovery, or account state changes. | Lifecycle model and checks for expiry, revocation, recovery, and failure. | A transition or recovery path is undefined. |
| `authorization-policy-reviewer` | Makes policy explicit and confirms every access channel enforces it. | A role, permission, resource relation, tenant boundary, policy, or enforcement channel changes. | Subject/action/resource/context matrix, precedence, default-deny, enforcement-point inventory, allow and deny checks. | Any affected cell or enforcement point is ambiguous. |
| `privileged-access-reviewer` | Adds ownership, expiry, approval, and auditability to elevated access. | Admin, support, service, impersonation, delegated, or emergency access appears. | Least-privilege findings, approval, expiry, review, and audit requirements. | Privileged access lacks owner, expiry, review, or traceability. |
| `identity-data-privacy-reviewer` | Prevents identity attributes and access history from becoming unnecessary exposure. | Identity attributes, memberships, or access history are stored or exposed. | Minimization, retention, deletion, disclosure, and isolation evidence. | Sensitive identity data lacks an authorized handling decision. |
| `auth-abuse-recovery-reviewer` | Challenges account recovery, invitation, credential, and elevation paths as an attacker would. | A flow adds or changes an unauthenticated entry, credential attempt, recovery, invitation, or elevation path. | Abuse cases, rate/lockout controls, safe account-recovery checks, and residual-risk record. | Material abuse has neither mitigation nor accepted residual risk. |
| `auth-rollout-recovery-planner` | Prevents rollout or rollback from preserving unintended access. | The board's affected set includes existing users, sessions, policies, credentials, or integrations. | Cohorts, staged gates, emergency revocation, rollback, and rehearsal evidence. | Rollback could retain unintended access or break account recovery. |
| `auth-observability-incident-reviewer` | Makes incorrect grants, denial spikes, and suspicious access detectable and attributable. | A new incorrect-grant, denial, or breach mode is recorded. | Redacted audit events, metrics, alerts, response owner, and post-release checks. | Harmful access cannot be detected and attributed. |

## Role relationships

Lifecycle and policy specialists split `identity-access-reviewer` and `security-reviewer` work for this scope. Privacy, abuse, rollout, and observability specialists respectively replace overlapping `privacy-reviewer`, `abuse-trust-reviewer`, `release-reviewer`, and `observability-reviewer`/`incident-readiness-reviewer` work. Reuse `end-user-advocate` for visible denials, lockouts, and recovery failures, and `tradeoff-broker` for security, privacy, friction, compatibility, or emergency-access conflicts.

## Validation additions

For each applicable matrix cell, add ask-linked checks for allowed, denied, expired, revoked, stale-claim, cross-tenant, and recovery behavior. Shared evidence may cover an equivalence class only when a common enforcement mechanism and its boundaries are demonstrated; denied and cross-boundary cases are never sampled away. Validate existing-identity migration, emergency revocation, audit completeness, safe user messaging, and detection in a release rehearsal.

## Implication sweeps

Cover all principal types, roles, resource classes, actions, policy contexts, tenant boundaries, lifecycle states, privileged paths, and enforcement channels.

## Tradeoffs

- Stronger verification vs. user friction and recovery burden.
- Fine-grained policy vs. comprehensibility and auditability.
- Emergency access speed vs. approval and least privilege.

Only the named authority accepts residual risk.
