# Research basis

Why the skill's rules look the way they do. Grades: **[E]** empirical study, **[P]** codified practice (standards body, institution, production system), **[I]** inference for this skill, **[F]** folklore — directionally consistent but not evidence. No study has tested expert count or sidebar design on open-ended engineering design, so the numbers are triangulated defaults, not proven optima. The contribution ledger exists so a board can replace these defaults with its own data.

## The blackboard is a typed database run by a controller

- Hearsay-II (1971–76): about 15 knowledge sources in 5 groups. Sources never called each other (direct calls "reduce modularity"); each declared its own trigger and wrote typed hypotheses with 0–100 credibility, support links, attribution, and a `rejected` marker instead of deletion. The expert set kept changing; NOAH replaced two word-spotting sources mid-project. [P] Erman et al. 1980, https://nku.edu/~foxr/CSC425/hearsay2.pdf; Nii & Brown 1987, https://stacks.stanford.edu/file/druid:nh044zx3884/nh044zx3884.pdf
- Control was the hard part. The scheduler rated pending activations by their promised change ("response frame"), widened search only when competitors were rated about equally, and used a STOP source to halt. Opportunistic jumping halved processing at high levels but was "ineffective and harmful" at noisy low levels. [E] Erman et al. 1980
- BB1 put control on its own control blackboard with an explicit control plan. [P] Johnson & Hayes-Roth 1987, https://cdn.aaai.org/AAAI/1987/AAAI87-006.pdf
- GBB separated the board database from control; tuning the database alone gave large speedups. [P] Corkill et al. 1986
- Decomposition: design the board's levels first, then find sources that produce or check each level transition; alternative sources for the same subproblem add robustness; a missing source is a silent failure — dynamic control "does not guarantee the delivering of a solution." [P] Lalanda, PLoP 1997, https://Hillside.net/plop/plop97/Proceedings/lalanda.pdf
- Merge sources whose inputs and outputs overlap heavily; very narrow sources cost more to dispatch than they add. "Intuition is the primary criterion" for source design (Corkill 1989). [P] McManus, NASA, https://ntrs.nasa.gov/api/citations/20040121017/downloads/20040121017.pdf
- Ratings were unreliable: the correct word ranked about 4.5th of 20 candidates. [E] Erman et al. 1980 → prefer corroboration over single-expert confidence.

## LLM blackboards (2023–2026)

- LbMAS: generated experts plus fixed planner, critic, conflict-resolver, decider, cleaner; a control unit picks who acts each round (≤4 rounds); private spaces only for debate/verification. Removing the control unit raised MMLU tokens ~5.1M → ~18.8M with little accuracy change; the cleaner worked better deleting redundant messages from view than marking them. [E] arXiv 2507.01701
- Volunteer blackboard (Google/UMass): requests posted without a named recipient; helpers volunteer. Beat master-worker by ~14% (Claude 4 Opus) to ~57% relative. [E] arXiv 2510.01285
- Terrarium: scoped boards, append-only audit log; agents leak "private" data when asked; one adversarial agent can misalign the system. [E] arXiv 2510.14312
- MetaGPT: role subscriptions to a shared pool; structured documents instead of chat. [P] arXiv 2308.00352

## How many agents

- Anthropic research system: 1 agent for simple, 2–4 for comparisons, 10+ only for broad complex research; lead spawns 3–5 in parallel; ~15× chat tokens; vague delegation caused duplicated work; each subagent needs objective, output format, tool guidance, boundaries. [P] https://www.anthropic.com/engineering/multi-agent-research-system
- Google scaling study: +80.9% on parallelizable tasks, −39 to −70% on sequential planning; independent agents amplified errors 17.2× vs 4.4× centralized. [E] https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/
- AgentVerse: 2–4 agents; more reviewers made math worse; recruiter re-forms the team after evaluation. [E] arXiv 2308.10848
- DyLAN: trial run, agent-importance scores, keep top contributors; up to +25% on some MMLU subjects. [E] arXiv 2310.02170
- More Agents Is All You Need / MacNet: sampling-and-voting gains saturate logistically — evidence for voting, not for more distinct experts in deliberation. [E] arXiv 2402.05120, arXiv 2406.07155
- MAST: 41–86.7% failure rates across 7 frameworks; top causes are step repetition, not recognizing completion, weak verification; role specs +9.4%, verification +15.6%. [E] arXiv 2503.13657
- Debate or Vote: majority voting explains most debate gains; debate alone does not raise expected correctness. [E] arXiv 2508.17536
- Cognition: parallel agents without shared context make conflicting implicit decisions. [P] https://cognition.com/blog/dont-build-multi-agents

## Personas

- System-prompt personas did not improve factual accuracy (162 personas, 2,410 questions); automated best-persona selection was no better than random. [E] arXiv 2311.10054
- Multiple fine-grained task personas helped on GPT-4-class models only. [E] arXiv 2307.05300
- Persona choice steers which idea domains get covered. [E] arXiv 2512.04488
→ write goal contracts, not titles; use personas for coverage breadth, not accuracy.

## Human group size and review practice

- ~4 people max in one spontaneous conversation. [E] Dunbar, Duncan & Nettle 1995
- Member satisfaction crossover at 4.6 people (satisfaction, not performance). [E, secondhand] Hackman & Vidmar 1970
- 4-person teams used 45–54% more person-minutes than 2-person teams and underestimated more. [E] Staats, Milkman & Fox 2012
- Collective intelligence tracked social sensitivity and equal turn-taking, not the smartest member. [E] Woolley et al. 2010
- Effort loss grows with group size; smaller when contributions are identifiable. [E] Karau & Williams meta-analysis → attribute every entry.
- SEI ATAM: 3–5 evaluators with process roles; architect always present; 12–15 stakeholders only for scenario steps. [P]
- Fagan inspection: moderator, designer, coder, tester; 3–7 people; ≤2 hours. [P]
- NASA: charter and success criteria before choosing the board; independence. Apollo: subsystem reviews → integrated CDR; five-member change board. Skunk Works: restrict headcount "in an almost vicious manner." [P/historical]
- DACI/RAPID: exactly one decider, one driver; contributors have a voice, no vote; vetoes sparingly. [P]
- Assigned devil's advocates are weaker than authentic dissent. [E, effect sizes not retrieved] Nemeth
- Hidden-profile research: groups discuss shared information and miss unique facts. [E] Stasser & Titus
- Bain "Rule of 7", two-pizza teams [F]; Hong–Page "diversity trumps ability" is mathematically contested — don't cite it.

## Documentation and side conversations

- IBIS (Kunz & Rittel 1970), QOC, DRL: rationale capture failed in practice from capture cost and the Grudin asymmetry; live dialogue mapping worked because the record was a byproduct. IBIS maps lose chronology and attribution. [E/P] Buckingham Shum et al. 2005, KMI-05-18
- ADRs (Nygard 2011): title, context, decision, status, consequences; numbered, superseded not deleted. MADR 4.0 adds drivers, options, confirmation, decision-makers/consulted/informed. Y-statements (Zimmermann). [P] https://adr.github.io/madr/
- Google design docs: non-goals and alternatives considered. Uber RFCs: named approvers. Rust RFCs: summarize offline discussion back onto the thread; summary comment before final comment; merge/close/postpone. [P]
- Amazon: six-page memos read silently; one-way vs two-way doors; disagree and commit. [P]
- 1-2-4-All, Open Space "law of two feet" with mandatory harvest; parking lot with delete/defer/delegate. [P]
- "What stays in Slack is basically lost forever." [opinion] Durand 2021
