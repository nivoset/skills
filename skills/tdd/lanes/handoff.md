# TDD lane handoff

Every lane returns this compact record to the parent. Do not paste full transcripts.

```yaml
status: passed|failed|blocked
lane: inventory|red|red-verifier|green|reviewer|refactor|close
behavior_id: stable-row-id
changed_paths: []
commands:
  - command: exact command
    exit_status: 0
    result: concise result
findings: []
inventory_updates: []
next_action: concise parent action
blocker:
  owner: none or named decision owner
  reason: none or exact blocker
  recovery: none or next recovery step
```

Rules:

- Report paths relative to the repository.
- Include the exact failing assertion for a red result.
- Include no secrets or full request/response bodies.
- `passed` means the lane's own acceptance checks passed; it does not approve the whole task.
- `blocked` is not approval and must include a recovery action.
