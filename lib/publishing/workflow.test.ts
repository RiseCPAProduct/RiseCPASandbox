import { describe, expect, it } from "vitest";
import type { Actor, PublishDetails, Submission } from "./types";
import { applyAction, availableActions, WorkflowError } from "./workflow";

const staff: Actor = { name: "Antonio", role: "staff" };
const partner: Actor = { name: "Nolan Reyes", role: "partner" };
const manager: Actor = { name: "Maya Chen", role: "manager" };
const NOW = "2026-10-28T10:00:00.000Z";

function submission(overrides: Partial<Submission> = {}): Submission {
  return {
    id: "sub-1",
    firmId: "rise-cpa",
    title: "Vacation policy update",
    description: "Adds carry-over rules",
    department: "HR",
    docType: "Policy",
    status: "submitted",
    submittedBy: "Antonio",
    responsiblePartner: "Nolan Reyes",
    history: [{ status: "submitted", by: "Antonio", at: NOW }],
    ...overrides,
  };
}

const details: Omit<PublishDetails, "publishedBy" | "publishedAt"> = {
  title: "Vacation Policy",
  docType: "Policy",
  effectiveDate: "2026-11",
  audience: "staff",
  version: 1,
  fileName: "HR_Policy_VacationPolicy_v1_2026-11",
  folder: "HR / Published Documents",
  changeNote: "Adds carry-over rules",
};

describe("applyAction", () => {
  it("lets a partner start review, then approve with a group note", () => {
    const reviewing = applyAction(submission(), { type: "start_review" }, partner, NOW);
    expect(reviewing.status).toBe("under_review");
    const approved = applyAction(reviewing, { type: "approve", note: "Approved at partners' meeting" }, partner, NOW);
    expect(approved.status).toBe("approved");
    expect(approved.approvedBy).toBe("Nolan Reyes");
    expect(approved.approvalNote).toBe("Approved at partners' meeting");
    expect(approved.history.map((h) => h.status)).toEqual(["submitted", "under_review", "approved"]);
  });

  it("lets a partner approve straight from submitted", () => {
    expect(applyAction(submission(), { type: "approve" }, partner, NOW).status).toBe("approved");
  });

  it("sends changes back to the submitter, who can resubmit", () => {
    const changes = applyAction(submission(), { type: "request_changes", comment: "Add the cap" }, partner, NOW);
    expect(changes.status).toBe("changes_requested");
    expect(changes.history.at(-1)?.note).toBe("Add the cap");
    const again = applyAction(changes, { type: "resubmit", description: "Now with a cap" }, staff, NOW);
    expect(again.status).toBe("submitted");
    expect(again.description).toBe("Now with a cap");
  });

  it("only lets the original submitter resubmit", () => {
    const changes = submission({ status: "changes_requested" });
    expect(() => applyAction(changes, { type: "resubmit" }, { name: "Someone", role: "staff" }, NOW)).toThrow(
      WorkflowError,
    );
  });

  it("requires a comment to request changes or reject", () => {
    expect(() => applyAction(submission(), { type: "reject", comment: " " }, partner, NOW)).toThrow(WorkflowError);
  });

  it("closes a rejected submission", () => {
    const rejected = applyAction(submission(), { type: "reject", comment: "Duplicate" }, partner, NOW);
    expect(rejected.status).toBe("rejected");
    expect(availableActions(rejected, partner)).toEqual([]);
  });

  it("only publishes approved submissions, and only by a manager", () => {
    expect(() => applyAction(submission(), { type: "publish", details }, manager, NOW)).toThrow(WorkflowError);
    const approved = submission({ status: "approved" });
    expect(() => applyAction(approved, { type: "publish", details }, partner, NOW)).toThrow(WorkflowError);
    expect(() => applyAction(approved, { type: "publish", details }, staff, NOW)).toThrow(WorkflowError);
    const published = applyAction(approved, { type: "publish", details }, manager, NOW);
    expect(published.status).toBe("published");
    expect(published.publish).toMatchObject({ ...details, publishedBy: "Maya Chen", publishedAt: NOW });
  });

  it("does not let staff or managers review", () => {
    expect(() => applyAction(submission(), { type: "approve" }, staff, NOW)).toThrow(WorkflowError);
    expect(() => applyAction(submission(), { type: "approve" }, manager, NOW)).toThrow(WorkflowError);
  });

  it("lets a manager unpublish a published document", () => {
    const published = submission({ status: "published" });
    expect(applyAction(published, { type: "unpublish", comment: "Retired" }, manager, NOW).status).toBe("unpublished");
  });

  it("marks a replaced document superseded (system only)", () => {
    const published = submission({ status: "published" });
    expect(applyAction(published, { type: "supersede", byId: "sub-2" }, { name: "System", role: "partner" }, NOW).status).toBe(
      "superseded",
    );
  });
});

describe("availableActions", () => {
  it("lists what each role can do next", () => {
    expect(availableActions(submission(), partner)).toEqual(["start_review", "approve", "request_changes", "reject"]);
    expect(availableActions(submission(), staff)).toEqual([]);
    expect(availableActions(submission({ status: "approved" }), manager)).toEqual(["publish"]);
    expect(availableActions(submission({ status: "changes_requested" }), staff)).toEqual(["resubmit"]);
  });
});
