// Placeholder content for sandboxing only. Every item is fictional;
// no real RISE CPA documents or data are used.

export type Department = "HR" | "Finance" | "Marketing" | "Operations";

export type ItemType = "folder" | "pdf" | "word" | "excel";

// Lowest role allowed to see an item. Restricted items are hidden
// entirely from lower roles, never shown as locked.
export type Role = "staff" | "manager" | "partner";

// The client's standard structure inside every department.
export const STANDARD_FOLDERS = ["Budget", "Minutes", "Projects", "Published Documents"] as const;
export type StandardFolder = (typeof STANDARD_FOLDERS)[number];

export type DocumentItem = {
  id: string;
  name: string;
  type: ItemType;
  department: Department;
  // Folder path from the department root, using the client's standard
  // structure: Budget / Minutes / Projects / Published Documents.
  path: string;
  // Month the item was first published (YYYY-MM)
  published: string;
  // Last update (YYYY-MM-DD); drives the Year filter
  modified: string;
  visibility: Role;
};

export const placeholderDocuments: DocumentItem[] = [
  // HR
  { id: "hr-1", name: "Published Documents", type: "folder", department: "HR", path: "HR", published: "2024-02", modified: "2025-06-12", visibility: "staff" },
  { id: "hr-2", name: "Employee Policy Manual v7", type: "pdf", department: "HR", path: "HR / Published Documents", published: "2024-09", modified: "2026-09-07", visibility: "staff" },
  { id: "hr-3", name: "Vacation Request Form", type: "word", department: "HR", path: "HR / Published Documents", published: "2024-05", modified: "2026-04-13", visibility: "staff" },
  { id: "hr-4", name: "Performance Review Scorecard Template", type: "excel", department: "HR", path: "HR / Published Documents", published: "2025-11", modified: "2026-06-16", visibility: "staff" },
  { id: "hr-5", name: "HR Budget 2026", type: "excel", department: "HR", path: "HR / Budget", published: "2025-12", modified: "2026-01-12", visibility: "staff" },
  { id: "hr-6", name: "Partner Compensation Summary 2026", type: "excel", department: "HR", path: "HR / Budget", published: "2026-02", modified: "2026-08-14", visibility: "partner" },
  { id: "hr-7", name: "Staff Coaching Notes Q3", type: "word", department: "HR", path: "HR / Projects", published: "2026-07", modified: "2026-09-30", visibility: "manager" },

  // Finance
  { id: "fin-1", name: "Budget", type: "folder", department: "Finance", path: "Finance", published: "2024-03", modified: "2025-07-20", visibility: "staff" },
  { id: "fin-2", name: "Department Budgets 2026", type: "excel", department: "Finance", path: "Finance / Budget", published: "2026-02", modified: "2026-07-20", visibility: "staff" },
  { id: "fin-3", name: "Expense Reimbursement Form", type: "pdf", department: "Finance", path: "Finance / Published Documents", published: "2024-06", modified: "2025-01-31", visibility: "staff" },
  { id: "fin-4", name: "Q2 Finance Meeting Minutes", type: "word", department: "Finance", path: "Finance / Minutes", published: "2026-07", modified: "2026-07-08", visibility: "staff" },
  { id: "fin-5", name: "Partner Meeting Minutes September", type: "word", department: "Finance", path: "Finance / Minutes", published: "2026-09", modified: "2026-09-22", visibility: "partner" },

  // Marketing
  { id: "mkt-1", name: "Marketing Budget 2026", type: "excel", department: "Marketing", path: "Marketing / Budget", published: "2025-12", modified: "2026-01-23", visibility: "staff" },
  { id: "mkt-2", name: "RISE CPA Letterhead Template", type: "word", department: "Marketing", path: "Marketing / Published Documents", published: "2024-04", modified: "2025-11-03", visibility: "staff" },
  { id: "mkt-3", name: "Brand Guidelines", type: "pdf", department: "Marketing", path: "Marketing / Published Documents", published: "2025-08", modified: "2026-03-17", visibility: "staff" },

  // Operations
  { id: "ops-1", name: "Operations Budget 2026", type: "excel", department: "Operations", path: "Operations / Budget", published: "2026-01", modified: "2026-01-23", visibility: "staff" },
  { id: "ops-2", name: "Fax Cover Sheet", type: "word", department: "Operations", path: "Operations / Published Documents", published: "2024-01", modified: "2024-10-17", visibility: "staff" },
  { id: "ops-3", name: "Office Move Project", type: "folder", department: "Operations", path: "Operations / Projects", published: "2025-10", modified: "2026-1-24", visibility: "staff" },
];
