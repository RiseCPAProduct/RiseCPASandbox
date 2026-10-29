import Anthropic from "@anthropic-ai/sdk";
import { getAiProvider } from "../ai";
import { AiError, type AiProvider } from "../ai/provider";
import { actorFromRole, ROLE_HEADER } from "./demo-people";
import { createStore, ServiceError, type PublishingStore } from "./service";
import type { Actor } from "./types";

// Shared plumbing for the Route Handlers in app/api/.

// One in-memory store per server process. Kept on globalThis so dev-mode
// hot reloads don't wipe it. Restarting the server resets the demo.
const globalStore = globalThis as unknown as { __publishingStore?: PublishingStore };
export function getStore(): PublishingStore {
  globalStore.__publishingStore ??= createStore();
  return globalStore.__publishingStore;
}

// Demo only: the role comes from the "Viewing as" switcher. With real
// sign-in this reads the session instead, and nothing else changes.
export function actorFrom(request: Request): Actor {
  return actorFromRole(request.headers.get(ROLE_HEADER));
}

export type AiStatus = { available: boolean; provider?: string; reason?: string };

export function aiStatus(store: PublishingStore): { status: AiStatus; provider: AiProvider | null } {
  if (!store.config.aiEnabled) return { status: { available: false, reason: "AI is turned off in Settings." }, provider: null };
  const provider = getAiProvider();
  if (!provider) return { status: { available: false, reason: "No AI key is configured on the server." }, provider: null };
  return { status: { available: true, provider: provider.name }, provider };
}

// Client files have their own toggle, off by default (Rise/Folio MVP, section 6).
export function clientAiStatus(store: PublishingStore): { status: AiStatus; provider: AiProvider | null } {
  if (!store.config.clientFiling.aiEnabled) {
    return { status: { available: false, reason: "AI on client files is turned off in Settings." }, provider: null };
  }
  const provider = getAiProvider();
  if (!provider) return { status: { available: false, reason: "No AI key is configured on the server." }, provider: null };
  return { status: { available: true, provider: provider.name }, provider };
}

export async function handle(run: () => Promise<unknown> | unknown): Promise<Response> {
  try {
    return Response.json(await run());
  } catch (error) {
    if (error instanceof ServiceError) return Response.json({ error: error.message }, { status: error.status });
    if (error instanceof AiError) return Response.json({ error: error.message }, { status: 502 });
    if (error instanceof Anthropic.APIError) {
      console.error("AI provider error", error.status, error.message);
      const message =
        error instanceof Anthropic.AuthenticationError
          ? "The AI key was rejected."
          : error instanceof Anthropic.RateLimitError
            ? "The AI service is busy. Try again in a minute."
            : "The AI service had a problem. Fill the form by hand or try again.";
      return Response.json({ error: message }, { status: 502 });
    }
    console.error(error);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ServiceError("The request body must be JSON.");
  }
}
