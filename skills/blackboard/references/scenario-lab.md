# Scenario lab: ideation, failures, and complex cases

Use this reference when the user has a tangled scenario, an intermittent or hard-to-explain failure, competing explanations, or an idea they want to explore without prematurely choosing a solution.

## Start with the scenario

Capture:

- desired and observed behavior, in concrete terms;
- actors, systems, inputs, state, timing, and environment that may matter;
- exact steps, expected result, actual result, frequency, and impact when describing a failure;
- known-good comparison, recent changes, and available logs/artifacts;
- constraints, safety boundaries, and what would count as a useful answer.

Mark unknowns explicitly. Do not fill missing details with invented product behavior.

## Generate and test explanations

1. Generate a small, distinct set of plausible explanations. Label each as a hypothesis, not a conclusion.
2. For each, record supporting evidence, contrary evidence, confidence, and a discriminating observation or experiment.
3. Rank experiments by information gained, cost, safety, and reversibility. Prefer one-variable-at-a-time tests when practical; note interactions when isolation is impossible.
4. State the predicted result for each hypothesis before running the experiment. Record setup, exact action, observed result, and deviations.
5. Update confidence from the result. A failed reproduction does not prove the failure absent; record the conditions not tested.

## Failure reproduction checklist

- Establish a baseline and preserve the original report or artifact.
- Record exact versions, configuration, data shape, permissions, timing, and environment relevant to the case.
- Reduce to the smallest repeatable sequence without removing suspected causal conditions.
- Compare a failing case with a known-good case, changing one factor where possible.
- Repeat intermittent cases enough to report observed frequency and limits; do not call one success a fix.
- Separate “reproduced,” “not reproduced under these conditions,” “mitigated,” and “root cause confirmed.”
- For risky or destructive experiments, obtain authorization and use an isolated, recoverable setup.

## Complex scenario mapping

Map the sequence and state transitions, including alternate paths, boundaries, retries, fallbacks, timeouts, stale or duplicate input, recovery, and authorization where relevant. Identify actors and ownership at each transition. Mark cross-system assumptions and the evidence needed to verify them. Split scenarios when actors, permissions, or outcomes materially differ.

## Useful stopping points

End when the user’s requested outcome is met, or state what remains unknown and the next best experiment/question. Possible outcomes include a scenario map, hypothesis table, reproduction recipe, experiment result, decision brief, or optional plan. Do not turn exploration into delivery tickets unless requested.
