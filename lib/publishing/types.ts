import type { Department, ItemType, Role } from "../placeholder-documents";

// Internal documents (Rise/Folio MVP, section 6):
// Submitted -> Under Review -> Approved -> Published, with Changes Requested
// going back to the submitter, Rejected closing it, and Superseded /
// Unpublished kept for history only.
export type SubmissionStatus =
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "rejected"
  | "approved"
  | "published"
  | "superseded"
  | "unpublished";

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  submitted: "Submitted",
  under_review: "Under partner review",
  changes_requested: "Changes requested",
  rejected: "Rejected",
  approved: "Approved",
  published: "Published",
  superseded: "Superseded",
  unpublished: "Unpublished",
};

// Who is acting. The demo role switcher stands in for sign-in.
export type Actor = { name: string; role: Role };

export type HistoryEntry = {
  status: SubmissionStatus;
  by: string;
  at: string;
  note?: string;
};

export type PublishDetails = {
  title: string;
  docType: string;
  // YYYY-MM
  effectiveDate: string;
  audience: Role;
  version: number;
  // Name built from the firm's template, e.g. HR_Policy_VacationPolicy_v2_2026-11
  fileName: string;
  folder: string;
  changeNote: string;
  replacesId?: string;
  publishedBy: string;
  publishedAt: string;
};

export type Submission = {
  id: string;
  firmId: string;
  title: string;
  description: string;
  department: Department;
  docType: string;
  // Original upload, if any. Ideas can be submitted without a file.
  originalFileName?: string;
  fileType?: ItemType;
  // Plain-text excerpt the AI may read (text files only in the prototype)
  excerpt?: string;
  status: SubmissionStatus;
  submittedBy: string;
  responsiblePartner: string;
  // Group approval note, e.g. "Approved at partners' meeting"
  approvalNote?: string;
  approvedBy?: string;
  approvedAt?: string;
  history: HistoryEntry[];
  publish?: PublishDetails;
};
