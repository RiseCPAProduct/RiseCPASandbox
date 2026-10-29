import { z } from "zod";
import type { ClientConfig } from "../firm-config";
import { parseOrThrow, ServiceError, type PublishingStore } from "./service";
import type { Actor } from "./types";

// Smart File for external (client) documents (Rise/Folio MVP, section 6):
// Received -> Filed -> Final. No partner approval, but the same naming
// engine idea, and only the client team can see a client's files.

export type ClientFileStatus = "filed" | "final";

export type ClientFile = {
  id: string;
  client: string;
  year: number;
  engagement: string;
  docType: string;
  detail: string;
  fileName: string;
  // Client / Year / Engagement
  folder: string;
  status: ClientFileStatus;
  // Every upload, oldest first. Replacing keeps the old ones as history.
  versions: { originalFileName: string; by: string; at: string }[];
};

export type ClientFileFields = { client: string; year: number; engagement: string; docType: string; detail?: string };

const safe = (text: string) =>
  text
    .split(/[^A-Za-z0-9-]+/)
    .filter(Boolean)
    .join("-");

export function buildClientFileName(template: string, fields: ClientFileFields): string {
  const values: Record<string, string> = {
    CLIENT: fields.client,
    YEAR: String(fields.year),
    ENGAGEMENT: fields.engagement,
    DOCTYPE: fields.docType,
    DETAIL: safe(fields.detail ?? ""),
  };
  return (
    template
      .replace(/\{([A-Z]+)\}/g, (match, token: string) => values[token] ?? match)
      // An empty token leaves a doubled or trailing separator behind
      .replace(/([_-]){2,}/g, "$1")
      .replace(/[_-]+$/, "")
  );
}

function clientFor(store: PublishingStore, code: string): ClientConfig {
  const client = store.config.clientFiling.clients.find((c) => c.code === code);
  if (!client) throw new ServiceError(`Unknown client "${code}".`);
  return client;
}

// Partners see every client; everyone else only clients whose team they are on.
function canSee(client: ClientConfig, actor: Actor): boolean {
  return actor.role === "partner" || client.team.includes(actor.name);
}

export function listClientFiles(store: PublishingStore, actor: Actor): ClientFile[] {
  return [...store.clientFiles.values()]
    .filter((f) => {
      const client = store.config.clientFiling.clients.find((c) => c.code === f.client);
      return client !== undefined && canSee(client, actor);
    })
    .sort((a, b) => (b.versions.at(-1)?.at ?? "").localeCompare(a.versions.at(-1)?.at ?? ""));
}

export const ClientFileInput = z.object({
  client: z.string(),
  year: z.number().int().min(2000).max(2100),
  engagement: z.string(),
  docType: z.string(),
  detail: z.string().trim().max(40).optional(),
  originalFileName: z.string().trim().min(1, "Choose a file.").max(200),
});
export type ClientFileInput = z.input<typeof ClientFileInput>;

// Files a client document. If a file with the same name exists, nothing
// changes and the existing file comes back as `duplicate`, so the person
// can confirm; with replace=true the upload becomes a new version.
export function fileClientDocument(
  store: PublishingStore,
  actor: Actor,
  input: ClientFileInput,
  now: string,
  replace = false,
): { file?: ClientFile; duplicate?: ClientFile } {
  const data = parseOrThrow(ClientFileInput, input);
  const rules = store.config.clientFiling;
  const client = clientFor(store, data.client);
  if (!canSee(client, actor)) throw new ServiceError("Only the client team can file documents for this client.", 403);
  if (!rules.engagementTypes.includes(data.engagement)) throw new ServiceError(`Unknown engagement "${data.engagement}".`);
  if (!rules.docTypes.includes(data.docType)) throw new ServiceError(`Unknown document type "${data.docType}".`);

  const fileName = buildClientFileName(rules.namingTemplate, data);
  const version = { originalFileName: data.originalFileName, by: actor.name, at: now };
  const existing = [...store.clientFiles.values()].find((f) => f.fileName === fileName);
  if (existing) {
    if (existing.status === "final") throw new ServiceError("That file is marked final and can't be replaced.");
    if (!replace) return { duplicate: existing };
    const updated = { ...existing, versions: [...existing.versions, version] };
    store.clientFiles.set(updated.id, updated);
    return { file: updated };
  }

  const file: ClientFile = {
    id: `cf-${store.nextId++}`,
    client: client.code,
    year: data.year,
    engagement: data.engagement,
    docType: data.docType,
    detail: data.detail ?? "",
    fileName,
    folder: `${client.code} / ${data.year} / ${data.engagement}`,
    status: "filed",
    versions: [version],
  };
  store.clientFiles.set(file.id, file);
  return { file };
}

// Engagement deliverable is done: lock the file from further changes.
export function markFinal(store: PublishingStore, actor: Actor, id: string): ClientFile {
  const file = store.clientFiles.get(id);
  const client = file && store.config.clientFiling.clients.find((c) => c.code === file.client);
  if (!file || !client || !canSee(client, actor)) throw new ServiceError("File not found.", 404);
  const updated: ClientFile = { ...file, status: "final" };
  store.clientFiles.set(id, updated);
  return updated;
}
