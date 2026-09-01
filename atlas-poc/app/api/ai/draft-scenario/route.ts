import { NextRequest, NextResponse } from "next/server";
import { generateStructured } from "@/lib/ai/generateStructured";
import {
  draftScenarioPrompt,
  draftScenarioSchema,
  mockDraftScenario,
  renderGherkin,
} from "@/lib/ai/prompts";

/**
 * This is the one real AI SDK integration point in the POC: given a
 * contract's name and description, draft a first-pass Gherkin scenario.
 * The prompt/schema/mock live in lib/ai/prompts/draftScenario.ts — this
 * route is just wiring: call generateStructured, render the returned
 * object as Gherkin, respond.
 */
export async function POST(req: NextRequest) {
  const { contractName, description } = (await req.json()) as {
    contractName: string;
    description?: string;
  };

  const { object: scenario, provider } = await generateStructured({
    schema: draftScenarioSchema,
    prompt: draftScenarioPrompt(contractName, description),
    mock: mockDraftScenario(contractName),
  });

  return NextResponse.json({
    scenario,
    draft: renderGherkin(scenario),
    mocked: provider === "mock",
    provider,
  });
}
