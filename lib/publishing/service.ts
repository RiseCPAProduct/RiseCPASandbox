import { z } from "zod";
import { departmentConfig, riseCpaConfig, type FirmConfig } from "../firm-config";
import { DEPARTMENTS, type Department, type DocumentItem, type Role } from "../placeholder-documents";
import { filterByRole } from "../search";
import type { ClientFile } from "./client-files";
import { buildName, nextVersion, validateTemplate } from "./naming";
import { seedClientFiles, seedSubmissions } from "./seed";
import type { Actor, Submission } from "./types";
import { applyAction, WorkflowError, type WorkflowAction } from "./workflow";

// The publishing back end. Route Handlers call these functions with the
// store; Supabase can replace PublishingStore later without touching them.

export type Notification = {
  id: string;
  submissionId: string;
  title: string;
  fileName: string;
  changeNote: string;
  department: Department;
  audience: Role;
  at: string;
};

export type PublishingStore = {
  config: FirmConfig;
  submissions: Map<string, Submission>;
  notifications: Notification[];
  clientFiles: Map<string, ClientFile>;
  nextId: number;
};

export class ServiceError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 403 | 404 = 400,
  ) {
    super(message);
  }
}

function notificationFor(sub: Submission, id: string): Notification {
  return {
    id,
    submissionId: sub.id,
    title: sub.publish!.title,
    fileName: sub.publish!.fileName,
    changeNote: sub.publish!.changeNote,
    department: sub.department,
    audience: sub.publish!.audience,
    at: sub.publish!.publishedAt,
  };
}

export function createStore(): PublishingStore {
  const submissions = seedSubmissions();
  // Earlier publishes count as already announced, newest first.
  const notifications = submissions
    .filter((s) => s.status === "published" && s.publish)
    .sort((a, b) => b.publish!.publishedAt.localeCompare(a.publish!.publishedAt))
    .map((s) => notificationFor(s, `note-seed-${s.id}`));
  return {
    config: structuredClone(riseCpaConfig),
    submissions: new Map(submissions.map((s) => [s.id, s])),
    notifications,
    clientFiles: new Map(seedClientFiles().map((f) => [f.id, f])),
    nextId: 1,
  };
}

// --- Input schemas (also used to parse request bodies) ---

const text = (max: number) => z.string().trim().max(max);

export const CreateSubmissionInput = z.object({
  title: text(120).min(1, "Add a title."),
  description: text(2000),
  department: z.string(),
  docType: z.string(),
  originalFileName: text(200).optional(),
  fileType: z.enum(["pdf", "word", "excel"]).optional(),
  excerpt: text(8000).optional(),
});
export type CreateSubmissionInput = z.input<typeof CreateSubmissionInput>;

export const PublishInput = z.object({
  title: text(120).min(1, "Add a title."),
  docType: z.string(),
  effectiveDate: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM for the effective date."),
  audience: z.enum(["staff", "manager", "partner"]),
  changeNote: text(500),
  replacesId: z.string().optional(),
});

export const ActionInput = z.discriminatedUnion("type", [
  z.object({ type: z.literal("start_review") }),
  z.object({ type: z.literal("approve"), note: text(300).optional() }),
  z.object({ type: z.literal("request_changes"), comment: text(1000) }),
  z.object({ type: z.literal("reject"), comment: text(1000) }),
  z.object({ type: z.literal("resubmit"), description: text(2000).optional() }),
  z.object({ type: z.literal("publish"), details: PublishInput }),
  z.object({ type: z.literal("unpublish"), comment: text(300).optional() }),
]);
export type ActionInput = z.input<typeof ActionInput>;

export function parseOrThrow<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) throw new ServiceError(result.error.issues[0]?.message ?? "Invalid request.");
  return result.data;
}

// --- Reads ---

export type Scope = "mine" | "review" | "publish" | "published";

const newestFirst = (a: Submission, b: Submission) =>
  (b.history.at(-1)?.at ?? "").localeCompare(a.history.at(-1)?.at ?? "");

export function listSubmissions(store: PublishingStore, actor: Actor, scope: Scope): Submission[] {
  const all = [...store.submissions.values()];
  let result: Submission[];
  switch (scope) {
    case "mine":
      result = all.filter((s) => s.submittedBy === actor.name);
      break;
    case "review":
      // One partner reviews every department in the demo; with real
      // sign-in this filters on responsiblePartner.
      if (actor.role !== "partner") throw new ServiceError("Only partners can see the review queue.", 403);
      result = all.filter((s) => s.status === "submitted" || s.status === "under_review");
      break;
    case "publish":
      if (actor.role !== "manager") throw new ServiceError("Only publishers can see the publish queue.", 403);
      result = all.filter((s) => s.status === "approved");
      break;
    case "published":
      if (actor.role !== "manager") throw new ServiceError("Only publishers can manage published documents.", 403);
      result = all.filter((s) => s.status === "published");
      break;
  }
  return result.sort(newestFirst);
}

export function getSubmission(store: PublishingStore, id: string): Submission {
  const sub = store.submissions.get(id);
  if (!sub) throw new ServiceError("Submission not found.", 404);
  return sub;
}

// Published documents in a department that a new publish could replace.
export function replacementOptions(store: PublishingStore, department: Department) {
  return [...store.submissions.values()]
    .filter((s) => s.status === "published" && s.department === department && s.publish)
    .map((s) => ({ id: s.id, title: s.publish!.title, version: s.publish!.version, department: s.department }));
}

// Published documents as search items, hidden entirely above the role's level.
export function libraryFor(store: PublishingStore, role: Role): DocumentItem[] {
  const items: DocumentItem[] = [...store.submissions.values()]
    .filter((s) => s.status === "published" && s.publish)
    .map((s) => ({
      id: s.id,
      name: s.publish!.fileName,
      type: s.fileType ?? "word",
      department: s.department,
      path: s.publish!.folder,
      published: s.publish!.publishedAt.slice(0, 7),
      modified: s.publish!.publishedAt.slice(0, 10),
      visibility: s.publish!.audience,
    }));
  return filterByRole(items, role);
}

export function notificationsFor(store: PublishingStore, role: Role): Notification[] {
  const visible = new Set(libraryFor(store, role).map((d) => d.id));
  return store.notifications.filter((n) => visible.has(n.submissionId));
}

export type DocumentRecord = {
  version: number;
  submittedBy: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  approvalNote?: string;
  publishedBy: string;
  publishedAt: string;
  changeNote: string;
  replaces?: string;
};

// Accountability record for one published document (Rise/Folio MVP,
// section 7). Documents above the viewer's level are "not found".
export function documentRecord(store: PublishingStore, role: Role, id: string): DocumentRecord {
  if (!libraryFor(store, role).some((d) => d.id === id)) throw new ServiceError("Document not found.", 404);
  const sub = getSubmission(store, id);
  const p = sub.publish!;
  const replaced = p.replacesId ? store.submissions.get(p.replacesId)?.publish : undefined;
  return {
    version: p.version,
    submittedBy: sub.submittedBy,
    submittedAt: sub.history[0].at,
    approvedBy: sub.approvedBy,
    approvedAt: sub.approvedAt,
    approvalNote: sub.approvalNote,
    publishedBy: p.publishedBy,
    publishedAt: p.publishedAt,
    changeNote: p.changeNote,
    replaces: replaced?.fileName,
  };
}

// --- Writes ---

export const ConfigInput = z.object({
  docTypes: z
    .array(z.string().trim().regex(/^[A-Za-z][A-Za-z0-9]{0,29}$/, "Type names are one word of letters and numbers, e.g. ProcessDoc."))
    .min(1, "Keep at least one document type.")
    .max(20),
  namingTemplate: z.string().trim().min(1).max(120),
  defaultAudience: z.enum(["staff", "manager", "partner"]),
  aiEnabled: z.boolean(),
  clientAiEnabled: z.boolean().optional(),
  leadPartners: z.record(z.string(), text(80).min(1, "Every department needs a lead partner.")),
});
export type ConfigInput = z.input<typeof ConfigInput>;

// Settings page (admin ability, given to partners in the demo). Changes
// apply to the next publish; names already published stay as they are.
export function updateConfig(store: PublishingStore, actor: Actor, input: ConfigInput): FirmConfig {
  if (actor.role !== "partner") throw new ServiceError("Only partners with admin ability can change settings.", 403);
  const data = parseOrThrow(ConfigInput, input);
  const templateErrors = validateTemplate(data.namingTemplate);
  if (templateErrors.length) throw new ServiceError(templateErrors.join(" "));
  store.config = {
    ...store.config,
    docTypes: [...new Set(data.docTypes)],
    namingTemplate: data.namingTemplate,
    defaultAudience: data.defaultAudience,
    aiEnabled: data.aiEnabled,
    clientFiling: { ...store.config.clientFiling, aiEnabled: data.clientAiEnabled ?? store.config.clientFiling.aiEnabled },
    departments: store.config.departments.map((d) => ({ ...d, leadPartner: data.leadPartners[d.name] ?? d.leadPartner })),
  };
  return store.config;
}

function checkDepartment(config: FirmConfig, name: string): Department {
  if (!(DEPARTMENTS as readonly string[]).includes(name) || !departmentConfig(config, name as Department)) {
    throw new ServiceError(`Unknown department "${name}".`);
  }
  return name as Department;
}

function checkType(config: FirmConfig, docType: string): string {
  if (!config.docTypes.includes(docType)) throw new ServiceError(`Unknown document type "${docType}".`);
  return docType;
}

export function createSubmission(store: PublishingStore, actor: Actor, input: CreateSubmissionInput, now: string): Submission {
  const data = parseOrThrow(CreateSubmissionInput, input);
  const department = checkDepartment(store.config, data.department);
  const sub: Submission = {
    id: `sub-n${store.nextId++}`,
    firmId: store.config.firmId,
    title: data.title,
    description: data.description,
    department,
    docType: checkType(store.config, data.docType),
    originalFileName: data.originalFileName || undefined,
    fileType: data.fileType,
    excerpt: data.excerpt || undefined,
    status: "submitted",
    submittedBy: actor.name,
    responsiblePartner: departmentConfig(store.config, department)!.leadPartner,
    history: [{ status: "submitted", by: actor.name, at: now }],
  };
  store.submissions.set(sub.id, sub);
  return sub;
}

// Runs one workflow step. Publishing is completed here, not in the browser:
// the server builds the name, version and folder from the firm's rules,
// retires the replaced document and announces the publish.
export function act(store: PublishingStore, actor: Actor, id: string, input: ActionInput, now: string): Submission {
  const data = parseOrThrow(ActionInput, input);
  const sub = getSubmission(store, id);
  let action: WorkflowAction;
  let replaced: Submission | undefined;

  if (data.type === "publish") {
    const d = data.details;
    if (d.replacesId) {
      replaced = getSubmission(store, d.replacesId);
      if (replaced.status !== "published" || replaced.department !== sub.department || !replaced.publish) {
        throw new ServiceError("The replaced document must be a published document in the same department.");
      }
    }
    const version = nextVersion(replaced?.publish?.version);
    const dept = departmentConfig(store.config, sub.department)!;
    action = {
      type: "publish",
      details: {
        title: d.title,
        docType: checkType(store.config, d.docType),
        effectiveDate: d.effectiveDate,
        audience: d.audience,
        version,
        fileName: buildName(store.config.namingTemplate, {
          dept: dept.code,
          type: d.docType,
          title: d.title,
          version,
          date: d.effectiveDate,
        }),
        folder: `${sub.department} / ${store.config.publishedFolder}`,
        changeNote: d.changeNote,
        replacesId: d.replacesId,
      },
    };
  } else {
    action = data;
  }

  let next: Submission;
  try {
    next = applyAction(sub, action, actor, now);
    if (replaced) {
      const retired = applyAction(replaced, { type: "supersede", byId: sub.id }, { name: "System", role: "partner" }, now);
      store.submissions.set(retired.id, retired);
    }
  } catch (error) {
    if (error instanceof WorkflowError) throw new ServiceError(error.message, 403);
    throw error;
  }
  store.submissions.set(next.id, next);

  if (next.status === "published" && next.publish) {
    store.notifications.unshift(notificationFor(next, `note-${store.notifications.length + 1}`));
  }
  return next;
}
