import type { Role } from "../placeholder-documents";
import { ROLE_HEADER } from "./demo-people";

// Browser-side helper for the publishing API. Sends the demo role and
// turns error responses into thrown Errors with the server's message.
export async function apiFetch<T>(path: string, role: Role, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const response = await fetch(path, {
    method: init.method ?? (init.body === undefined ? "GET" : "POST"),
    headers: { [ROLE_HEADER]: role, ...(init.body === undefined ? {} : { "content-type": "application/json" }) },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? `Request failed (${response.status}).`);
  return data;
}
