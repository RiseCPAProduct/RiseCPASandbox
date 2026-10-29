import type { AiProvider, StructuredRequest } from "./provider";

// SWAP POINT for Gemini Flash-Lite (Good Company version, Rise/Folio MVP
// section 10). Set AI_PROVIDER=gemini and GEMINI_API_KEY in .env.local,
// then replace the body of generate() with the call below. Tasks, schemas,
// validators, routes and UI stay the same.
//
//   npm install --save-exact @google/genai
//
//   import { GoogleGenAI } from "@google/genai";
//   import { z } from "zod";
//   const ai = new GoogleGenAI({ apiKey });
//   const response = await ai.models.generateContent({
//     model,                                   // GEMINI_MODEL, e.g. a current Flash-Lite id
//     contents: prompt,
//     config: {
//       systemInstruction: system,
//       responseMimeType: "application/json",
//       responseJsonSchema: z.toJSONSchema(schema),
//     },
//   });
//   return schema.parse(JSON.parse(response.text ?? ""));
//
// Check the @google/genai docs for the current model id and option names
// before enabling; they are not verified in this prototype.
export class GeminiProvider implements AiProvider {
  readonly name = "gemini";

  constructor(
    private apiKey: string,
    private model: string,
  ) {}

  async generate<T>(request: StructuredRequest<T>): Promise<T> {
    void request;
    throw new Error(`Gemini (${this.model}) is not wired up yet. See lib/ai/gemini.ts.`);
  }
}
