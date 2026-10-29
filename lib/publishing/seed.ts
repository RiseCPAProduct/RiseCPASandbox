import type { ClientFile } from "./client-files";
import type { Submission } from "./types";

// Fictional starting state for the demo, so every queue has something in it.
// Published items came through the pipeline earlier; the rest are in flight.

const published = (
  id: string,
  department: Submission["department"],
  title: string,
  docType: string,
  version: number,
  month: string,
  fileType: Submission["fileType"],
): Submission => {
  const dept = { HR: "HR", Finance: "FIN", Marketing: "MKT", Operations: "OPS" }[department];
  const at = `${month}-15T15:00:00.000Z`;
  return {
    id,
    firmId: "rise-cpa",
    title,
    description: `${title}, version ${version}.`,
    department,
    docType,
    fileType,
    status: "published",
    submittedBy: "Maya Chen",
    responsiblePartner: "Nolan Reyes",
    approvedBy: "Nolan Reyes",
    approvedAt: at,
    approvalNote: "Approved at partners' meeting",
    history: [
      { status: "submitted", by: "Maya Chen", at },
      { status: "approved", by: "Nolan Reyes", at, note: "Approved at partners' meeting" },
      { status: "published", by: "Maya Chen", at },
    ],
    publish: {
      title,
      docType,
      effectiveDate: month,
      audience: "staff",
      version,
      fileName: `${dept}_${docType}_${title.replace(/[^A-Za-z0-9]/g, "")}_v${version}_${month}`,
      folder: `${department} / Published Documents`,
      changeNote: `Version ${version} of the ${title}.`,
      publishedBy: "Maya Chen",
      publishedAt: at,
    },
  };
};

export function seedSubmissions(): Submission[] {
  return [
    published("pub-hr-vacation", "HR", "Vacation Policy", "Policy", 3, "2025-06", "pdf"),
    published("pub-fin-expense", "Finance", "Expense Reimbursement Form", "Form", 2, "2025-01", "pdf"),
    published("pub-ops-ticket", "Operations", "IT Service Ticket Guide", "Guide", 1, "2026-02", "pdf"),
    {
      id: "sub-1",
      firmId: "rise-cpa",
      title: "Vacation carry-over rules",
      description:
        "Adds a rule that staff can carry up to 5 unused vacation days into the next year, with partner approval for more.",
      department: "HR",
      docType: "Policy",
      originalFileName: "vacation-policy-carryover-draft.docx",
      fileType: "word",
      status: "submitted",
      submittedBy: "Antonio Silva",
      responsiblePartner: "Nolan Reyes",
      history: [{ status: "submitted", by: "Antonio Silva", at: "2026-10-20T14:10:00.000Z" }],
    },
    {
      id: "sub-2",
      firmId: "rise-cpa",
      title: "Expense form with 2026 mileage rates",
      description: "Updates the expense reimbursement form with the 2026 per-kilometre rates and a meal cap.",
      department: "Finance",
      docType: "Form",
      originalFileName: "Expense form NEW (final) v2.pdf",
      fileType: "pdf",
      status: "approved",
      submittedBy: "Priya Nair",
      responsiblePartner: "Eric Lam",
      approvedBy: "Eric Lam",
      approvedAt: "2026-10-22T16:00:00.000Z",
      approvalNote: "Approved at partners' meeting, Oct 22",
      history: [
        { status: "submitted", by: "Priya Nair", at: "2026-10-15T09:00:00.000Z" },
        { status: "under_review", by: "Eric Lam", at: "2026-10-16T09:00:00.000Z" },
        { status: "approved", by: "Eric Lam", at: "2026-10-22T16:00:00.000Z", note: "Approved at partners' meeting, Oct 22" },
      ],
    },
    {
      id: "sub-3",
      firmId: "rise-cpa",
      title: "Client onboarding checklist",
      description: "Idea: one checklist for opening a new client file, so every team does it the same way.",
      department: "Operations",
      docType: "Guide",
      status: "changes_requested",
      submittedBy: "Antonio Silva",
      responsiblePartner: "Eric Lam",
      history: [
        { status: "submitted", by: "Antonio Silva", at: "2026-10-10T11:00:00.000Z" },
        {
          status: "changes_requested",
          by: "Eric Lam",
          at: "2026-10-12T10:00:00.000Z",
          note: "Good idea. Please add the engagement letter step and who signs off.",
        },
      ],
    },
  ];
}

// A client file Antonio's team can't see, to show "hidden, not locked".
export function seedClientFiles(): ClientFile[] {
  return [
    {
      id: "cf-seed-1",
      client: "NORTHWIND",
      year: 2026,
      engagement: "Audit",
      docType: "Engagement-Letter",
      detail: "",
      fileName: "NORTHWIND_2026_Audit_Engagement-Letter",
      folder: "NORTHWIND / 2026 / Audit",
      status: "final",
      versions: [{ originalFileName: "Northwind EL signed.pdf", by: "Priya Nair", at: "2026-09-02T14:00:00.000Z" }],
    },
  ];
}
