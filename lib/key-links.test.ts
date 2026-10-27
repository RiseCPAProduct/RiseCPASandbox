import { describe, expect, it } from "vitest";
import { KEY_LINKS } from "./key-links";
import { placeholderDocuments } from "./placeholder-documents";

describe("KEY_LINKS", () => {
  it("is a short list", () => {
    expect(KEY_LINKS.length).toBeGreaterThanOrEqual(4);
    expect(KEY_LINKS.length).toBeLessThanOrEqual(6);
  });

  it("points every link at an existing, staff-visible document", () => {
    for (const link of KEY_LINKS) {
      const doc = placeholderDocuments.find((d) => d.id === link.documentId);
      expect(doc, link.documentId).toBeDefined();
      expect(doc?.visibility, link.documentId).toBe("staff");
    }
  });
});
