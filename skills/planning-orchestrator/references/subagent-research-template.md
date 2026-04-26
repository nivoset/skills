# Sub-Agent Research Template

Use this template when delegating narrow planning research:

```text
Sub-agent task: [focused investigation name]
Goal:
Find only the codebase facts needed to decompose this desired behavior:
[desired behavior]

Investigate:
- [specific paths, modules, flows, or concepts to inspect]
- [specific questions to answer]

Return only:
1. Relevant code references with file path and line number or range when available
2. Existing behavior discovered
3. Reuse opportunities
4. Required changes or gaps
5. Risks, coupling, or dependency concerns
6. Existing tests and missing test coverage
7. Open questions that cannot be answered from code

Do not return:
- Full source files
- Long explanations
- Speculation not tied to code evidence
- Implementation plans unless directly needed to split tickets
- Irrelevant findings
```

Main-thread compression rules:

- Keep code references, existing behavior, gaps, dependencies, risks, and test locations.
- Drop raw code snippets unless a short snippet is essential.
- Drop repeated findings, broad commentary, implementation chatter, and low-value speculation.
- Cap sub-agent summaries to top findings unless expansion is clearly needed.
