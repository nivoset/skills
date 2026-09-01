import type { LanguageModel } from "ai";

/**
 * Every AI call site in the app resolves a model the same way, in the same
 * order, so adding a new call site never means re-deciding "which
 * provider". Each candidate is cheap to construct (no network call), so the
 * caller tries them in order with generateObject/generateText and only
 * moves to the next one if the call itself throws.
 */
export type AiProviderName = "ollama" | "anthropic";

export interface ModelCandidate {
  provider: AiProviderName;
  model: LanguageModel;
}

export async function resolveModelCandidates(): Promise<ModelCandidate[]> {
  const candidates: ModelCandidate[] = [];

  if (process.env.USE_OLLAMA !== "false") {
    const { createOpenAI } = await import("@ai-sdk/openai");
    const ollama = createOpenAI({
      baseURL: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1",
      apiKey: "ollama", // required by the client shape, ignored by Ollama
    });
    candidates.push({
      provider: "ollama",
      model: ollama(process.env.OLLAMA_MODEL ?? "ornith:9b"),
    });
  }

  if (process.env.ANTHROPIC_API_KEY) {
    const { anthropic } = await import("@ai-sdk/anthropic");
    candidates.push({
      provider: "anthropic",
      model: anthropic("claude-sonnet-4-5"),
    });
  }

  return candidates;
}
