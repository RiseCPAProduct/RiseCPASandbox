import { beforeEach, describe, expect, it } from "vitest";
import { buildClientFileName, fileClientDocument, listClientFiles, markFinal } from "./client-files";
import { DEMO_PEOPLE } from "./demo-people";
import { createStore, ServiceError, type PublishingStore } from "./service";

const staff = DEMO_PEOPLE.staff;
const manager = DEMO_PEOPLE.manager;
const partner = DEMO_PEOPLE.partner;
const outsider = { name: "Sam Ortiz", role: "staff" as const };
const NOW = "2026-10-28T10:00:00.000Z";

let store: PublishingStore;
beforeEach(() => {
  store = createStore();
});

const input = {
  client: "ACME-LTD",
  year: 2026,
  engagement: "T2",
  docType: "Bank-Statements",
  detail: "Dec",
  originalFileName: "scan0042.pdf",
};

describe("buildClientFileName", () => {
  it("fills the client template and drops an empty detail", () => {
    expect(buildClientFileName("{CLIENT}_{YEAR}_{ENGAGEMENT}_{DOCTYPE}_{DETAIL}", input)).toBe(
      "ACME-LTD_2026_T2_Bank-Statements_Dec",
    );
    expect(buildClientFileName("{CLIENT}_{YEAR}_{ENGAGEMENT}_{DOCTYPE}_{DETAIL}", { ...input, detail: "" })).toBe(
      "ACME-LTD_2026_T2_Bank-Statements",
    );
  });

  it("strips characters that are not safe in file names from the detail", () => {
    expect(buildClientFileName("{CLIENT}_{DETAIL}", { ...input, detail: "Dec / Jan?" })).toBe("ACME-LTD_Dec-Jan");
  });
});

describe("fileClientDocument", () => {
  it("files into Client / Year / Engagement with no approval step", () => {
    const result = fileClientDocument(store, staff, input, NOW);
    expect(result.duplicate).toBeUndefined();
    expect(result.file).toMatchObject({
      fileName: "ACME-LTD_2026_T2_Bank-Statements_Dec",
      folder: "ACME-LTD / 2026 / T2",
      status: "filed",
    });
  });

  it("asks before replacing a file with the same name, then keeps the old version in history", () => {
    fileClientDocument(store, staff, input, NOW);
    const again = fileClientDocument(store, staff, { ...input, originalFileName: "scan0043.pdf" }, NOW);
    expect(again.file).toBeUndefined();
    expect(again.duplicate?.fileName).toBe("ACME-LTD_2026_T2_Bank-Statements_Dec");
    const replaced = fileClientDocument(store, staff, { ...input, originalFileName: "scan0043.pdf" }, NOW, true);
    expect(replaced.file?.versions.map((v) => v.originalFileName)).toEqual(["scan0042.pdf", "scan0043.pdf"]);
  });

  it("only lets the client team file, and rejects unknown clients", () => {
    expect(() => fileClientDocument(store, outsider, input, NOW)).toThrow(ServiceError);
    expect(() => fileClientDocument(store, staff, { ...input, client: "NOPE" }, NOW)).toThrow(ServiceError);
  });

  it("locks a file once it is marked final", () => {
    const { file } = fileClientDocument(store, staff, input, NOW);
    markFinal(store, manager, file!.id);
    expect(() => fileClientDocument(store, staff, input, NOW, true)).toThrow(/final/);
  });
});

describe("listClientFiles", () => {
  it("shows a client's files to its team and partners only (hidden, not locked)", () => {
    fileClientDocument(store, staff, input, NOW);
    expect(listClientFiles(store, staff).length).toBe(1);
    // Partners also see the seeded Northwind file, which Antonio is not on
    expect(listClientFiles(store, partner).length).toBe(2);
    expect(listClientFiles(store, outsider)).toEqual([]);
  });
});
