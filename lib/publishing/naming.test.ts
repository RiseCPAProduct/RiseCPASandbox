import { describe, expect, it } from "vitest";
import { buildName, findReplacementCandidates, nextVersion, toNamePart, validateTemplate } from "./naming";

describe("toNamePart", () => {
  it("turns a title into PascalCase with no spaces or symbols", () => {
    expect(toNamePart("Employee handbook")).toBe("EmployeeHandbook");
    expect(toNamePart("  vacation & leave: policy (2026) ")).toBe("VacationLeavePolicy2026");
    expect(toNamePart("IT service-ticket guide")).toBe("ITServiceTicketGuide");
  });
});

describe("buildName", () => {
  it("fills the firm's template", () => {
    expect(
      buildName("{DEPT}_{TYPE}_{TITLE}_v{VERSION}_{DATE}", {
        dept: "HR",
        type: "ProcessDoc",
        title: "Employee Handbook",
        version: 8,
        date: "2027-01",
      }),
    ).toBe("HR_ProcessDoc_EmployeeHandbook_v8_2027-01");
  });

  it("works with a different firm's template", () => {
    expect(buildName("{TITLE} ({DEPT}) {DATE}", { dept: "FIN", type: "Form", title: "expense form", version: 1, date: "2026-11" })).toBe(
      "ExpenseForm (FIN) 2026-11",
    );
  });
});

describe("validateTemplate", () => {
  it("requires a title token and rejects unknown tokens", () => {
    expect(validateTemplate("{DEPT}_{TITLE}")).toEqual([]);
    expect(validateTemplate("{DEPT}_{TYPE}")).toEqual(["The template must include {TITLE}."]);
    expect(validateTemplate("{TITLE}_{OWNER}")).toEqual(["Unknown token {OWNER}."]);
  });

  it("rejects characters that are not allowed in file names", () => {
    expect(validateTemplate("{TITLE}/{DEPT}")).toEqual(['File names cannot contain \\ / : * ? " < > |.']);
  });
});

describe("nextVersion", () => {
  it("starts at 1 and bumps the replaced document's version", () => {
    expect(nextVersion(undefined)).toBe(1);
    expect(nextVersion(7)).toBe(8);
  });
});

describe("findReplacementCandidates", () => {
  const published = [
    { id: "a", title: "Vacation Policy", department: "HR" as const },
    { id: "b", title: "Expense Reimbursement Form", department: "Finance" as const },
    { id: "c", title: "Vacation Request Form", department: "HR" as const },
  ];

  it("ranks published documents in the same department by shared words", () => {
    expect(findReplacementCandidates("Updated vacation policy", "HR", published).map((c) => c.id)).toEqual(["a", "c"]);
  });

  it("ignores other departments and weak matches", () => {
    expect(findReplacementCandidates("Brand guidelines", "HR", published)).toEqual([]);
    expect(findReplacementCandidates("Expense form", "HR", published)).toEqual([]);
  });
});
