# Final Quality Checklist

Verify all of the following before finalizing:

- The main thread stayed focused on orchestration.
- Research was compressed to useful specifics only.
- No question was asked that codebase research could answer.
- Ticket titles describe user or stakeholder value.
- Every leaf ticket is independently testable.
- Every leaf ticket has one primary plain-English `Given/When/Then` acceptance test unless more than one scenario is required to remove ambiguity.
- Acceptance tests avoid implementation details and vague assertions.
- Dependencies are explicit only where real blocking exists.
- Assumptions and open questions are labeled clearly.
- Large or ambiguous work is split further instead of hidden inside one ticket.
