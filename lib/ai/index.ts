import { ClaudeProvider } from "./claude";
import { DemoProvider } from "./demo";
import { GeminiProvider } from "./gemini";
import type { AiProvider } from "./provider";

// Picks the provider from the environment. This is the only place that
// knows which provider is in use:
//   AI_PROVIDER=claude (default) + ANTHROPIC_API_KEY [+ AI_MODEL]
//   AI_PROVIDER=gemini           + GEMINI_API_KEY    [+ GEMINI_MODEL]
//   AI_PROVIDER=demo, or no key  -> scripted answers for showcases (lib/ai/demo.ts)
export function getAiProvider(): AiProvider {
  if (process.env.AI_PROVIDER === "demo") return new DemoProvider();
  if (process.env.AI_PROVIDER === "gemini") {
    const key = process.env.GEMINI_API_KEY;
    return key ? new GeminiProvider(key, process.env.GEMINI_MODEL ?? "gemini-flash-lite-latest") : new DemoProvider();
  }
  const key = process.env.ANTHROPIC_API_KEY;
  return key ? new ClaudeProvider(key, process.env.AI_MODEL || undefined) : new DemoProvider();
}
