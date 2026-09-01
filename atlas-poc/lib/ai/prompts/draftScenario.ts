import { z } from "zod";

/**
 * "Draft a scenario with AI" — app/api/ai/draft-scenario/route.ts.
 *
 * The model returns structured Given/When/Then steps instead of free-form
 * Gherkin text, so the app controls rendering (and can later re-render the
 * same object as a diff, a checklist, etc.) instead of parsing prose back
 * apart.
 */
export const draftScenarioSchema = z.object({
  title: z
    .string()
    .describe('Short scenario title, without a leading "Scenario:"'),
  given: z
    .array(z.string().min(1))
    .min(1)
    .describe('Precondition steps, without a leading "Given"/"And". No empty strings.'),
  when: z.string().min(1).describe('The single triggering action, without a leading "When"'),
  then: z
    .array(z.string().min(1))
    .min(1)
    .describe('Expected outcome steps, without a leading "Then"/"And". No empty strings.'),
});

export type DraftScenario = z.infer<typeof draftScenarioSchema>;

export function draftScenarioPrompt(contractName: string, description?: string) {
  return [
    `Draft one Gherkin scenario for the contract "${contractName}".`,
    `Description: ${description ?? "(none given)"}.`,
    `Pick a single happy-path or key-edge-case behavior. No source code,`,
    `no implementation detail — behavior only.`,
  ].join(" ");
}

export function mockDraftScenario(contractName: string): DraftScenario {
  return {
    title: `${contractName} — happy path (mock, needs review)`,
    given: [`the preconditions for "${contractName}" are met`],
    when: "it is invoked with a valid request",
    then: ["it completes and returns the expected result"],
  };
}

export function renderGherkin(scenario: DraftScenario): string {
  const lines = [`Scenario: ${scenario.title}`];
  scenario.given.forEach((step, i) =>
    lines.push(`  ${i === 0 ? "Given" : "And"} ${step}`)
  );
  lines.push(`  When ${scenario.when}`);
  scenario.then.forEach((step, i) =>
    lines.push(`  ${i === 0 ? "Then" : "And"} ${step}`)
  );
  return lines.join("\n");
}
