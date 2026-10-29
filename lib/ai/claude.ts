import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { AiError, type AiProvider, type StructuredRequest } from "./provider";

// Claude through the official SDK with structured outputs: the API is
// constrained to the zod schema, and the SDK parses and checks the result.
// Model: AI_MODEL, default claude-opus-5-5. Claude Haiku 5.5
// (claude-haiku-5-5) is the closest tier to Gemini Flash-Lite on cost and
// speed if you want a like-for-like comparison.
export class ClaudeProvider implements AiProvider {
  readonly name = "claude";
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model = "claude-opus-5-5") {
    this.client = new Anthropic({ apiKey, timeout: 60_000 });
    this.model = model;
  }

  async generate<T>({ system, prompt, schema }: StructuredRequest<T>): Promise<T> {
    const response = await this.client.beta.messages.parse({
      model: this.model,
      max_tokens: 4000,
      system,
      messages: [{ role: "user", content: prompt }],
      // Short extraction tasks: low effort keeps them fast and cheap.
      output_config: { effort: "low", format: betaZodOutputFormat(schema) },
      // If a safety classifier declines, the server retries on its default fallback model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    });
    if (response.stop_reason === "refusal") throw new AiError("The AI declined to suggest values for this document.");
    if (response.stop_reason === "max_tokens") throw new AiError("The AI answer was cut off.");
    if (response.parsed_output == null) throw new AiError("The AI answer did not match the expected format.");
    return response.parsed_output as T;
  }
}
