import type { Actor, PublishDetails, Submission, SubmissionStatus } from "./types";

// The one path into the Published folder (Rise/Folio MVP, section 6).
// Pure functions, so the same rules run in tests and on the server.

export type WorkflowAction =
  | { type: "start_review" }
  | { type: "approve"; note?: string }
  | { type: "request_changes"; comment: string }
  | { type: "reject"; comment: string }
  | { type: "resubmit"; description?: string }
  | { type: "publish"; details: Omit<PublishDetails, "publishedBy" | "publishedAt"> }
  | { type: "unpublish"; comment?: string }
  // System only: a newer version was published
  | { type: "supersede"; byId: string };

export type ActionType = WorkflowAction["type"];

export class WorkflowError extends Error {}

type Rule = { from: SubmissionStatus[]; to: SubmissionStatus; allowed: (s: Submission, a: Actor) => boolean };

// Partners review, managers (the partners' assistants and admin staff)
// publish, and only the submitter resubmits. Nobody publishes an item that
// a partner has not approved, partners included.
const RULES: Record<ActionType, Rule> = {
  start_review: { from: ["submitted"], to: "under_review", allowed: (_, a) => a.role === "partner" },
  approve: { from: ["submitted", "under_review"], to: "approved", allowed: (_, a) => a.role === "partner" },
  request_changes: {
    from: ["submitted", "under_review"],
    to: "changes_requested",
    allowed: (_, a) => a.role === "partner",
  },
  reject: { from: ["submitted", "under_review"], to: "rejected", allowed: (_, a) => a.role === "partner" },
  resubmit: { from: ["changes_requested"], to: "submitted", allowed: (s, a) => s.submittedBy === a.name },
  publish: { from: ["approved"], to: "published", allowed: (_, a) => a.role === "manager" },
  unpublish: { from: ["published"], to: "unpublished", allowed: (_, a) => a.role === "manager" },
  supersede: { from: ["published"], to: "superseded", allowed: () => true },
};

// Actions a person can take from the UI. Supersede is automatic, so it is never listed.
const UI_ACTIONS: ActionType[] = ["start_review", "approve", "request_changes", "reject", "resubmit", "publish", "unpublish"];

export function availableActions(submission: Submission, actor: Actor): ActionType[] {
  return UI_ACTIONS.filter((type) => {
    const rule = RULES[type];
    return rule.from.includes(submission.status) && rule.allowed(submission, actor);
  });
}

function noteFor(action: WorkflowAction): string | undefined {
  switch (action.type) {
    case "approve":
      return action.note?.trim() || undefined;
    case "request_changes":
    case "reject":
    case "unpublish":
      return action.comment?.trim() || undefined;
    case "supersede":
      return `Replaced by ${action.byId}`;
    case "publish":
      return action.details.changeNote.trim() || undefined;
    default:
      return undefined;
  }
}

export function applyAction(submission: Submission, action: WorkflowAction, actor: Actor, now: string): Submission {
  const rule = RULES[action.type];
  if (!rule.from.includes(submission.status)) {
    throw new WorkflowError(`Cannot ${action.type.replace("_", " ")} a submission that is ${submission.status}.`);
  }
  if (!rule.allowed(submission, actor)) {
    throw new WorkflowError(`${actor.name} is not allowed to ${action.type.replace("_", " ")} this submission.`);
  }
  if ((action.type === "request_changes" || action.type === "reject") && !action.comment.trim()) {
    throw new WorkflowError("Add a comment so the submitter knows why.");
  }

  const next: Submission = {
    ...submission,
    status: rule.to,
    history: [...submission.history, { status: rule.to, by: actor.name, at: now, note: noteFor(action) }],
  };
  if (action.type === "approve") {
    next.approvedBy = actor.name;
    next.approvedAt = now;
    next.approvalNote = noteFor(action);
  }
  if (action.type === "resubmit" && action.description !== undefined) {
    next.description = action.description;
  }
  if (action.type === "publish") {
    next.publish = { ...action.details, publishedBy: actor.name, publishedAt: now };
  }
  return next;
}
