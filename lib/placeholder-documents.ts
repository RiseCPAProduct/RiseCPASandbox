// Placeholder content for sandboxing only. Every item is fictional;
// no real RISE CPA documents or data are used.

export type Department = "HR" | "Finance" | "Marketing" | "Operations";

export type ItemType = "folder" | "pdf" | "word" | "excel";

export type DocumentItem = {
  id: string;
  name: string;
  type: ItemType;
  department: Department;
  // Folder path from the department root, using the client's standard
  // structure: Budget / Minutes / Projects / Published Documents.
  path: string;
  // ISO date (YYYY-MM-DD)
  modified: string;
};

export const placeholderDocuments: DocumentItem[] = [
  // HR
  { id: "hr-1", name: "Published Documents", type: "folder", department: "HR", path: "HR", modified: "2025-06-12" },
  { id: "hr-2", name: "Employee Policy Manual v7", type: "pdf", department: "HR", path: "HR / Published Documents", modified: "2026-09-07" },
  { id: "hr-3", name: "Vacation Request Form", type: "word", department: "HR", path: "HR / Published Documents", modified: "2026-04-13" },
  { id: "hr-4", name: "Performance Review Scorecard Template", type: "excel", department: "HR", path: "HR / Published Documents", modified: "2026-06-16" },
  { id: "hr-5", name: "HR Budget 2026", type: "excel", department: "HR", path: "HR / Budget", modified: "2026-01-12" },

  // Finance
  { id: "fin-1", name: "Budget", type: "folder", department: "Finance", path: "Finance", modified: "2026-08-30" },
  { id: "fin-2", name: "Department Budgets 2026", type: "excel", department: "Finance", path: "Finance / Budget", modified: "2026-07-20" },
  { id: "fin-3", name: "Expense Reimbursement Form", type: "pdf", department: "Finance", path: "Finance / Published Documents", modified: "2025-01-31" },
  { id: "fin-4", name: "Q2 Finance Meeting Minutes", type: "word", department: "Finance", path: "Finance / Minutes", modified: "2026-07-08" },

  // Marketing
  { id: "mkt-1", name: "Marketing Budget 2026", type: "excel", department: "Marketing", path: "Marketing / Budget", modified: "2026-01-23" },
  { id: "mkt-2", name: "RISE CPA Letterhead Template", type: "word", department: "Marketing", path: "Marketing / Published Documents", modified: "2025-11-03" },
  { id: "mkt-3", name: "Brand Guidelines", type: "pdf", department: "Marketing", path: "Marketing / Published Documents", modified: "2026-03-17" },

  // Operations
  { id: "ops-1", name: "Operations Budget 2026", type: "excel", department: "Operations", path: "Operations / Budget", modified: "2026-01-23" },
  { id: "ops-2", name: "Fax Cover Sheet", type: "word", department: "Operations", path: "Operations / Published Documents", modified: "2024-10-17" },
  { id: "ops-3", name: "Office Move Project", type: "folder", department: "Operations", path: "Operations / Projects", modified: "2026-1-24" },
];