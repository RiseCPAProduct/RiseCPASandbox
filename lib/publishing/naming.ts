import type { Department } from "../placeholder-documents";

// The naming engine. AI extracts values; these rules build the name
// (Rise/Folio MVP, section 10), so names stay consistent with or without AI.

export const NAME_TOKENS = ["DEPT", "TYPE", "TITLE", "VERSION", "DATE"] as const;

export type NameFields = {
  dept: string;
  type: string;
  title: string;
  version: number;
  // YYYY-MM
  date: string;
};

// "IT service-ticket guide" -> "ITServiceTicketGuide". Only the first
// letter of each word changes, so acronyms and "ProcessDoc" keep their capitals.
export function toNamePart(text: string): string {
  return text
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
}

export function buildName(template: string, fields: NameFields): string {
  const values: Record<(typeof NAME_TOKENS)[number], string> = {
    DEPT: fields.dept,
    TYPE: toNamePart(fields.type),
    TITLE: toNamePart(fields.title),
    VERSION: String(fields.version),
    DATE: fields.date,
  };
  return template.replace(/\{([A-Z]+)\}/g, (match, token: string) =>
    token in values ? values[token as keyof typeof values] : match,
  );
}

// Problems with a template, empty when it is valid. Checked on the server
// before a firm's settings are saved.
export function validateTemplate(template: string): string[] {
  const errors: string[] = [];
  if (/[\\/:*?"<>|]/.test(template)) errors.push('File names cannot contain \\ / : * ? " < > |.');
  for (const [, token] of template.matchAll(/\{([^}]*)\}/g)) {
    if (!(NAME_TOKENS as readonly string[]).includes(token)) errors.push(`Unknown token {${token}}.`);
  }
  if (!template.includes("{TITLE}")) errors.push("The template must include {TITLE}.");
  return errors;
}

export function nextVersion(replacedVersion: number | undefined): number {
  return (replacedVersion ?? 0) + 1;
}

// Type words match many documents, so they count for half.
const GENERIC_WORDS = new Set(["form", "policy", "guide", "template", "report", "checklist", "manual"]);
const weight = (w: string) => (GENERIC_WORDS.has(w) ? 0.5 : 1);
const sum = (ws: string[]) => ws.reduce((total, w) => total + weight(w), 0);

const STOP_WORDS = new Set(["a", "an", "and", "the", "of", "for", "to", "new", "updated", "update", "draft", "v"]);

function words(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 1 && !STOP_WORDS.has(w) && !/^v?\d+$/.test(w)),
  );
}

export type ReplacementCandidate = { id: string; title: string; department: Department };

// Published documents in the same department that a new title probably
// replaces, best match first. Works without AI; AI can then pick from these.
export function findReplacementCandidates<T extends ReplacementCandidate>(
  title: string,
  department: Department,
  published: T[],
): T[] {
  const target = words(title);
  return published
    .filter((doc) => doc.department === department)
    .map((doc) => {
      const own = words(doc.title);
      const shared = sum([...own].filter((w) => target.has(w)));
      return { doc, score: own.size ? shared / sum([...own]) : 0 };
    })
    .filter(({ score }) => score >= 0.3)
    .sort((a, b) => b.score - a.score)
    .map(({ doc }) => doc);
}
