import { z } from "zod";

// What each AI task must return. The same schemas drive Claude's
// structured outputs and Gemini's response schema, so swapping providers
// never changes the shape the app receives.

export const Confidence = z.enum(["high", "medium", "low"]);
export type Confidence = z.infer<typeof Confidence>;

export const SubmitSuggestionSchema = z.object({
  department: z.string().describe("One of the firm's department names, exactly as listed"),
  docType: z.string().describe("One of the firm's document types, exactly as listed"),
  confidence: z.object({ department: Confidence, docType: Confidence }),
  reason: z.string().describe("One short sentence explaining the choice"),
});
export type SubmitSuggestion = z.infer<typeof SubmitSuggestionSchema>;

export const PublishSuggestionSchema = z.object({
  title: z.string().describe("Clean document title in Title Case, without version numbers or dates"),
  docType: z.string().describe("One of the firm's document types, exactly as listed"),
  effectiveDate: z.string().describe("Month the document takes effect, as YYYY-MM"),
  audience: z.enum(["staff", "manager", "partner"]),
  replacesId: z.string().nullable().describe("id of the published document this replaces, or null"),
  changeNote: z.string().describe("One sentence for the announcement: what is new or changed"),
  confidence: z.object({
    title: Confidence,
    docType: Confidence,
    effectiveDate: Confidence,
    audience: Confidence,
    replacesId: Confidence,
  }),
});
export type PublishSuggestion = z.infer<typeof PublishSuggestionSchema>;

export const ClientFileSuggestionSchema = z.object({
  client: z.string().describe("One of the client codes, exactly as listed"),
  year: z.number().int().describe("Engagement or tax year, e.g. 2026"),
  engagement: z.string().describe("One of the engagement types, exactly as listed"),
  docType: z.string().describe("One of the document types, exactly as listed"),
  detail: z.string().describe("Optional short detail such as a month (Dec) or account; empty if none"),
  confidence: z.object({ client: Confidence, year: Confidence, engagement: Confidence, docType: Confidence }),
});
export type ClientFileSuggestion = z.infer<typeof ClientFileSuggestionSchema>;

export const SensitivityCheckSchema = z.object({
  matchesAudience: z.boolean().describe("true if nothing in the document seems too sensitive for the chosen audience"),
  concerns: z.array(z.string()).describe("Short, specific reasons; empty when it matches"),
  suggestedAudience: z.enum(["staff", "manager", "partner"]),
});
export type SensitivityCheck = z.infer<typeof SensitivityCheckSchema>;
