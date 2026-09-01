import { generateObject } from "ai";
import type { z } from "zod";
import { resolveModelCandidates } from "./model";

export type AiResultProvider = "ollama" | "anthropic" | "mock";

export interface StructuredResult<T> {
  object: T;
  provider: AiResultProvider;
}

/**
 * Shared plumbing for every "ask the model for a typed object" call site:
 * walk the resolved provider candidates in order, ask for `schema` via
 * generateObject (so the shape is enforced, not scraped out of free text),
 * and fall back to `mock` untouched if every candidate fails or none are
 * configured. Callers only ever provide a schema, a prompt, and a mock.
 */
export async function generateStructured<T>(opts: {
  schema: z.ZodType<T>;
  prompt: string;
  mock: T;
}): Promise<StructuredResult<T>> {
  const candidates = await resolveModelCandidates();

  for (const candidate of candidates) {
    try {
      const { object } = await generateObject({
        model: candidate.model,
        schema: opts.schema,
        prompt: opts.prompt,
      });
      return { object, provider: candidate.provider };
    } catch {
      // Try the next candidate rather than failing the request.
    }
  }

  return { object: opts.mock, provider: "mock" };
}
