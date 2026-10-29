import type { Department, Role } from "./placeholder-documents";

// Everything firm-specific lives here, so another firm is a different
// config, not a code change (Rise/Folio MVP, sections 4 and 7).

export type DepartmentConfig = {
  name: Department;
  // Short code used in generated names, e.g. "HR" or "FIN"
  code: string;
  // Responsible partner who reviews this department's submissions
  leadPartner: string;
};

export type ClientConfig = {
  // Used in file names and folders, e.g. "ACME-LTD"
  code: string;
  name: string;
  // Relationship partner, manager and assigned staff. Only they (and
  // partners) see the client's files.
  team: string[];
};

// External (client) documents: lighter flow, no partner approval
// (Rise/Folio MVP, section 6).
export type ClientFilingConfig = {
  clients: ClientConfig[];
  engagementTypes: string[];
  docTypes: string[];
  // Tokens: {CLIENT} {YEAR} {ENGAGEMENT} {DOCTYPE} {DETAIL}
  namingTemplate: string;
  // AI on real client files is a firm boundary, so it starts off, and
  // when on it reads only the file name.
  aiEnabled: boolean;
};

export type FirmConfig = {
  firmId: string;
  firmName: string;
  departments: DepartmentConfig[];
  // Document types publishers choose from, written as they appear in names
  docTypes: string[];
  // Tokens: {DEPT} {TYPE} {TITLE} {VERSION} {DATE}
  namingTemplate: string;
  // Viewing tag a new publish starts with
  defaultAudience: Role;
  publishedFolder: string;
  // Per-firm AI toggle (section 10). Off means every form is filled by hand.
  aiEnabled: boolean;
  clientFiling: ClientFilingConfig;
};

export const AUDIENCE_LABELS: Record<Role, string> = {
  staff: "All staff",
  manager: "Managers & Partners",
  partner: "Partners only",
};

export const riseCpaConfig: FirmConfig = {
  firmId: "rise-cpa",
  firmName: "RISE CPA",
  departments: [
    { name: "HR", code: "HR", leadPartner: "Nolan Reyes" },
    { name: "Finance", code: "FIN", leadPartner: "Eric Lam" },
    { name: "Marketing", code: "MKT", leadPartner: "Trevor Hale" },
    { name: "Operations", code: "OPS", leadPartner: "Eric Lam" },
  ],
  docTypes: ["Policy", "ProcessDoc", "Form", "Template", "Guide", "Report"],
  namingTemplate: "{DEPT}_{TYPE}_{TITLE}_v{VERSION}_{DATE}",
  defaultAudience: "staff",
  publishedFolder: "Published Documents",
  aiEnabled: true,
  clientFiling: {
    clients: [
      { code: "ACME-LTD", name: "Acme Ltd.", team: ["Nolan Reyes", "Maya Chen", "Antonio Silva"] },
      { code: "NORTHWIND", name: "Northwind Farms", team: ["Eric Lam", "Maya Chen", "Priya Nair"] },
    ],
    engagementTypes: ["T1", "T2", "Audit", "Review", "Bookkeeping"],
    docTypes: ["Bank-Statements", "Invoices", "Tax-Slips", "Engagement-Letter", "Financial-Statements"],
    namingTemplate: "{CLIENT}_{YEAR}_{ENGAGEMENT}_{DOCTYPE}_{DETAIL}",
    aiEnabled: false,
  },
};

export function departmentConfig(config: FirmConfig, name: Department): DepartmentConfig | undefined {
  return config.departments.find((d) => d.name === name);
}
