import { AUDIENCE_LABELS, type ClientFilingConfig, type FirmConfig } from "../firm-config";
import type { Department, Role } from "../placeholder-documents";
import { findReplacementCandidates } from "../publishing/naming";
import { AiError, type AiProvider, type StructuredRequest } from "./provider";
import type { ClientFileSuggestion, Confidence, PublishSuggestion, SensitivityCheck, SubmitSuggestion } from "./schemas";
import type { DocumentInput, ReplacementOption } from "./tasks";

// Scripted AI for showcases without an API key. Each task passes the
// answer this file builds from simple keyword rules; the answer then goes
// through the same schema and validators as a real model's answer, so the
// forms, Settings switches and low-confidence highlights all behave the same.

export class DemoProvider implements AiProvider {
  readonly name = "demo";

  // A short pause so the "thinking" state shows, as it would with a model
  constructor(private delayMs = 700) {}

  async generate<T>(request: StructuredRequest<T>): Promise<T> {
    if (!request.demo) throw new AiError("This task has no demo answer.");
    if (this.delayMs > 0) await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    return request.schema.parse(request.demo());
  }
}

const DEPARTMENT_TERMS: Record<string, string[]> = {
  HR: ["vacation", "leave", "holiday", "hire", "hiring", "onboarding", "employee", "employees", "handbook", "benefits", "bereavement", "conduct", "harassment", "recruiting", "training", "sick"],
  Finance: ["budget", "budgets", "expense", "expenses", "invoice", "invoices", "tax", "forecast", "revenue", "financial", "reimbursement", "payroll", "mileage", "billing"],
  Marketing: ["brand", "branding", "logo", "social", "campaign", "newsletter", "website", "marketing", "linkedin", "proposal"],
  Operations: ["laptop", "computer", "remote", "desktop", "vpn", "ticket", "software", "password", "printer", "office", "network", "security", "backup", "client", "file"],
};

const TYPE_TERMS: Record<string, string[]> = {
  Policy: ["policy", "policies", "rules", "code of conduct"],
  ProcessDoc: ["process", "procedure", "procedures", "sop", "workflow"],
  Form: ["form", "forms", "request", "application", "claim", "checklist"],
  Template: ["template", "templates", "letterhead"],
  Guide: ["guide", "how-to", "how to", "manual", "instructions"],
  Report: ["report", "budget", "forecast", "summary", "minutes", "results", "analysis"],
};

// Content that usually belongs to a narrower audience than All staff
const RESTRICTED_TERMS: { term: string; audience: Role }[] = [
  { term: "salary", audience: "manager" },
  { term: "salaries", audience: "manager" },
  { term: "pay bands", audience: "manager" },
  { term: "compensation", audience: "manager" },
  { term: "bonus", audience: "manager" },
  { term: "bonuses", audience: "manager" },
  { term: "payroll", audience: "manager" },
  { term: "performance review", audience: "manager" },
  { term: "disciplinary", audience: "manager" },
  { term: "termination", audience: "manager" },
  { term: "profit share", audience: "partner" },
  { term: "profit sharing", audience: "partner" },
  { term: "partner draws", audience: "partner" },
  { term: "capital account", audience: "partner" },
  { term: "equity", audience: "partner" },
  { term: "partnership agreement", audience: "partner" },
];

const AUDIENCE_RANK: Record<Role, number> = { staff: 0, manager: 1, partner: 2 };

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const MONTH_WORDS = MONTHS.flatMap((m) => (m === "may" ? [m] : [m, m.slice(0, 3)])).concat("sept");

function hasTerm(text: string, term: string): boolean {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`).test(text);
}

function textOf(doc: DocumentInput): string {
  return [doc.title, doc.description, doc.fileName, doc.excerpt].filter(Boolean).join(" ").toLowerCase();
}

// The option whose terms appear most often in the text; ties go to the
// first option, and no hits at all means low confidence.
function bestMatch(text: string, terms: Record<string, string[]>, options: string[]): { value?: string; hits: string[] } {
  let best: { value?: string; hits: string[] } = { hits: [] };
  for (const option of options) {
    const hits = (terms[option] ?? []).filter((t) => hasTerm(text, t));
    if (hits.length > best.hits.length) best = { value: option, hits };
  }
  return best;
}

const confidence = (found: boolean): Confidence => (found ? "high" : "low");

export function demoSubmit(doc: DocumentInput, config: FirmConfig): SubmitSuggestion {
  const text = textOf(doc);
  const departments = config.departments.map((d) => d.name);
  const dept = bestMatch(text, DEPARTMENT_TERMS, departments);
  const type = bestMatch(text, TYPE_TERMS, config.docTypes);
  const hits = [...dept.hits, ...type.hits];
  return {
    department: dept.value ?? departments[0],
    docType: type.value ?? config.docTypes[0],
    confidence: { department: confidence(!!dept.value), docType: confidence(!!type.value) },
    reason: hits.length
      ? `Mentions ${hits.map((h) => `"${h}"`).join(", ")}.`
      : "No clear keywords, so this is a guess. Please check both fields.",
  };
}

// "vacation_policy_DRAFT v4 2026-10" -> "Vacation Policy"
function cleanTitle(title: string): string {
  const cleaned = title
    .replace(/\.[a-z0-9]{2,4}$/i, "")
    .replace(/\b\d{4}-\d{1,2}(-\d{1,2})?\b/g, " ")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .replace(/\bv\d+\b/gi, " ")
    .replace(/\b(draft|final|new|updated|copy|edits?)\b/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => (w.length <= 4 && w === w.toUpperCase() ? w : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ");
  return cleaned || title.trim();
}

function firstSentence(text: string): string {
  const sentence = text.trim().split(/(?<=\.)\s/)[0] ?? "";
  return sentence && !sentence.endsWith(".") ? `${sentence}.` : sentence;
}

function effectiveMonth(text: string): string | undefined {
  const match = text.match(new RegExp(`\\b(${MONTH_WORDS.join("|")})\\.?\\s+(\\d{4})\\b`));
  if (!match) return undefined;
  const month = MONTHS.findIndex((m) => m.startsWith(match[1].slice(0, 3))) + 1;
  return `${match[2]}-${String(month).padStart(2, "0")}`;
}

function restrictedHits(text: string): { term: string; audience: Role }[] {
  return RESTRICTED_TERMS.filter(({ term }) => hasTerm(text, term));
}

function requiredAudience(hits: { audience: Role }[]): Role {
  return hits.reduce<Role>((max, h) => (AUDIENCE_RANK[h.audience] > AUDIENCE_RANK[max] ? h.audience : max), "staff");
}

export function demoPublish(
  doc: DocumentInput & { department: Department; docType: string },
  config: FirmConfig,
  candidates: ReplacementOption[],
  thisMonth: string,
): PublishSuggestion {
  const text = textOf(doc);
  const title = cleanTitle(doc.title);
  const keywordType = bestMatch(text, TYPE_TERMS, config.docTypes).value;
  const docType = config.docTypes.includes(doc.docType) ? doc.docType : (keywordType ?? config.docTypes[0]);
  const month = effectiveMonth(text);
  const restricted = restrictedHits(text);
  const replaced = findReplacementCandidates(
    title,
    doc.department,
    candidates.map((c) => ({ ...c, department: doc.department })),
  )[0];
  const summary = firstSentence(doc.description);
  return {
    title,
    docType,
    effectiveDate: month ?? thisMonth,
    audience: requiredAudience(restricted),
    replacesId: replaced?.id ?? null,
    changeNote:
      summary || (replaced ? `Version ${replaced.version + 1} of the ${replaced.title}.` : `New ${docType.toLowerCase()}: ${title}.`),
    confidence: {
      title: "high",
      docType: config.docTypes.includes(doc.docType) || keywordType ? "high" : "low",
      effectiveDate: month ? "high" : "medium",
      audience: restricted.length ? "high" : "medium",
      replacesId: replaced ? "high" : "medium",
    },
  };
}

const ENGAGEMENT_TERMS: Record<string, string[]> = {
  T1: ["t1", "personal"],
  T2: ["t2", "corporate"],
  Audit: ["audit"],
  Review: ["review"],
  Bookkeeping: ["bookkeeping", "books", "ledger"],
};

// Checked in order, so "financial statements" wins over "statements"
const CLIENT_DOC_TERMS: [string, string[]][] = [
  ["Financial-Statements", ["financial statements", "financial statement", "fs"]],
  ["Bank-Statements", ["bank statements", "bank statement", "bank"]],
  ["Invoices", ["invoices", "invoice"]],
  ["Tax-Slips", ["tax slips", "slips", "slip", "t4", "t4a", "t5"]],
  ["Engagement-Letter", ["engagement letter", "letter", "el"]],
];

export function demoClientFile(
  fileName: string,
  rules: ClientFilingConfig,
  visibleClients: string[],
  thisYear: number,
): ClientFileSuggestion {
  const text = fileName.toLowerCase().replace(/\.[a-z0-9]{2,4}$/, "").replace(/[_\-.]+/g, " ");
  const clients = rules.clients.filter((c) => visibleClients.includes(c.code));
  const client = clients.find(
    (c) =>
      hasTerm(text, c.code.toLowerCase().replace(/-/g, " ")) ||
      c.name
        .toLowerCase()
        .split(/[^a-z]+/)
        .some((word) => word.length >= 4 && hasTerm(text, word)),
  );
  const year = text.match(/\b(20\d{2})\b/);
  const engagement = bestMatch(text, ENGAGEMENT_TERMS, rules.engagementTypes).value;
  const docType = CLIENT_DOC_TERMS.find(([type, terms]) => rules.docTypes.includes(type) && terms.some((t) => hasTerm(text, t)))?.[0];
  const monthWord = MONTH_WORDS.find((m) => hasTerm(text, m));
  return {
    client: client?.code ?? clients[0]?.code ?? "",
    year: year ? Number(year[1]) : thisYear,
    engagement: engagement ?? rules.engagementTypes[0],
    docType: docType ?? rules.docTypes[0],
    detail: monthWord ? monthWord[0].toUpperCase() + monthWord.slice(1, 3) : "",
    confidence: {
      client: confidence(!!client),
      year: confidence(!!year),
      engagement: confidence(!!engagement),
      docType: confidence(!!docType),
    },
  };
}

export function demoSensitivity(doc: DocumentInput, audience: Role): SensitivityCheck {
  const tooNarrow = restrictedHits(textOf(doc)).filter((h) => AUDIENCE_RANK[h.audience] > AUDIENCE_RANK[audience]);
  if (!tooNarrow.length) return { matchesAudience: true, concerns: [], suggestedAudience: audience };
  return {
    matchesAudience: false,
    concerns: tooNarrow.map((h) => `Mentions "${h.term}", which is usually for ${AUDIENCE_LABELS[h.audience]}.`),
    suggestedAudience: requiredAudience(tooNarrow),
  };
}
