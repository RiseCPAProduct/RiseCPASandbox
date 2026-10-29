import type { z } from "zod";

// One interface for every AI provider. A task sends a system prompt, a user
// prompt and a zod schema, and gets back JSON that already matches the
// schema. Server-only: keys never reach the browser.
export type StructuredRequest<T> = {
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  // Scripted answer for the demo provider (lib/ai/demo.ts); real providers ignore it
  demo?: () => T;
};

export interface AiProvider {
  readonly name: string;
  generate<T>(request: StructuredRequest<T>): Promise<T>;
}

// Thrown when the provider answers but the answer can't be used (refusal,
// truncated or unparseable output). Network and auth errors pass through.
export class AiError extends Error {}
