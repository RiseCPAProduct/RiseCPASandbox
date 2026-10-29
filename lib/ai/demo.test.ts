import { describe, expect, it } from "vitest";
import { riseCpaConfig } from "../firm-config";
import { demoClientFile, demoPublish, demoSensitivity, demoSubmit, DemoProvider } from "./demo";
import { SubmitSuggestionSchema } from "./schemas";
import { suggestSubmission } from "./tasks";

const rules = riseCpaConfig.clientFiling;

describe("demoSubmit", () => {
  it("picks the department and type from keywords", () => {
    const answer = demoSubmit(
      { title: "Vacation carry-over rules", description: "Updates the vacation policy for unused days." },
      riseCpaConfig,
    );
    expect(answer).toMatchObject({ department: "HR", docType: "Policy", confidence: { department: "high", docType: "high" } });
  });

  it("finds Finance reports and Operations guides", () => {
    expect(demoSubmit({ title: "2027 budget forecast", description: "" }, riseCpaConfig)).toMatchObject({
      department: "Finance",
      docType: "Report",
    });
    expect(demoSubmit({ title: "Remote desktop how-to", description: "Steps to connect from a laptop." }, riseCpaConfig)).toMatchObject({
      department: "Operations",
      docType: "Guide",
    });
  });

  it("still answers with low confidence when nothing matches", () => {
    const answer = demoSubmit({ title: "Misc notes", description: "" }, riseCpaConfig);
    expect(riseCpaConfig.docTypes).toContain(answer.docType);
    expect(answer.confidence).toEqual({ department: "low", docType: "low" });
  });
});

describe("demoPublish", () => {
  const candidates = [
    { id: "pub-fin-expense", title: "Expense Reimbursement Form", version: 2 },
    { id: "pub-fin-budget", title: "Annual Budget", version: 1 },
  ];
  const doc = {
    title: "Expense form with 2026 mileage rates",
    description: "Updates the expense reimbursement form with the 2026 per-kilometre rates and a meal cap.",
    fileName: "Expense form NEW (final) v2.pdf",
    department: "Finance" as const,
    docType: "Form",
  };

  it("cleans the title, keeps the type, uses this month and picks the document it replaces", () => {
    const answer = demoPublish(doc, riseCpaConfig, candidates, "2026-10");
    expect(answer).toMatchObject({
      title: "Expense Form With 2026 Mileage Rates",
      docType: "Form",
      effectiveDate: "2026-10",
      audience: "staff",
      replacesId: "pub-fin-expense",
    });
    expect(answer.changeNote).toContain("2026 per-kilometre rates");
  });

  it("strips draft words, versions and dates from the title", () => {
    const answer = demoPublish({ ...doc, title: "vacation_policy_DRAFT v4 2026-10" }, riseCpaConfig, [], "2026-10");
    expect(answer.title).toBe("Vacation Policy");
    expect(answer.replacesId).toBeNull();
  });

  it("reads an effective month from the text", () => {
    const answer = demoPublish({ ...doc, description: "Takes effect January 2027." }, riseCpaConfig, [], "2026-10");
    expect(answer.effectiveDate).toBe("2027-01");
  });

  it("narrows the audience for pay or partner content", () => {
    expect(demoPublish({ ...doc, description: "Salary bands by level." }, riseCpaConfig, [], "2026-10").audience).toBe("manager");
    expect(demoPublish({ ...doc, description: "Partner profit share split." }, riseCpaConfig, [], "2026-10").audience).toBe("partner");
  });
});

describe("demoClientFile", () => {
  it("reads client, year, engagement, type and month from the file name", () => {
    expect(demoClientFile("acme T2 bank statements dec 2025.pdf", rules, ["ACME-LTD", "NORTHWIND"], 2026)).toMatchObject({
      client: "ACME-LTD",
      year: 2025,
      engagement: "T2",
      docType: "Bank-Statements",
      detail: "Dec",
      confidence: { client: "high", year: "high", engagement: "high", docType: "high" },
    });
  });

  it("tells financial statements from bank statements, and falls back to this year", () => {
    expect(demoClientFile("Northwind audit financial statements.pdf", rules, ["NORTHWIND"], 2026)).toMatchObject({
      client: "NORTHWIND",
      year: 2026,
      engagement: "Audit",
      docType: "Financial-Statements",
      confidence: { year: "low" },
    });
  });

  it("never suggests a client the person is not on the team for", () => {
    const answer = demoClientFile("acme invoices.pdf", rules, ["NORTHWIND"], 2026);
    expect(answer.client).toBe("NORTHWIND");
    expect(answer.confidence.client).toBe("low");
  });
});

describe("demoSensitivity", () => {
  it("flags pay data tagged All staff and suggests a narrower audience", () => {
    const check = demoSensitivity({ title: "2027 salary bands", description: "Salary ranges for each level." }, "staff");
    expect(check.matchesAudience).toBe(false);
    expect(check.suggestedAudience).toBe("manager");
    expect(check.concerns[0]).toContain("salary");
  });

  it("passes a plain policy", () => {
    expect(demoSensitivity({ title: "Vacation policy", description: "Carry-over rules." }, "staff")).toEqual({
      matchesAudience: true,
      concerns: [],
      suggestedAudience: "staff",
    });
  });

  it("accepts restricted content when the audience is already narrow enough", () => {
    expect(demoSensitivity({ title: "Salary bands", description: "" }, "partner").matchesAudience).toBe(true);
  });
});

describe("DemoProvider", () => {
  it("returns the task's demo answer through the task's schema and validators", async () => {
    const result = await suggestSubmission(
      new DemoProvider(0),
      { title: "Vacation carry-over rules", description: "" },
      riseCpaConfig,
    );
    expect(result.values).toEqual({ department: "HR", docType: "Policy" });
    expect(result.lowConfidence).toEqual([]);
  });

  it("refuses a request without a demo answer", async () => {
    await expect(
      new DemoProvider(0).generate({ system: "", prompt: "", schema: SubmitSuggestionSchema }),
    ).rejects.toThrow("demo");
  });
});
