import { describe, expect, it } from "vitest";
import { answerQuestion, FIJI_QUESTION } from "./mock-hr-policy";
import { placeholderDocuments } from "./placeholder-documents";

describe("answerQuestion", () => {
  it("answers the Fiji vacation question with the vacation policy and form", () => {
    const reply = answerQuestion(FIJI_QUESTION);
    expect(reply.topic).toBe("vacation");
    expect(reply.documentId).toBe("hr-3");
  });

  it("matches without caring about case", () => {
    expect(answerQuestion("HOW MUCH VACATION DO I GET?").topic).toBe("vacation");
  });

  it("answers bereavement and expense questions", () => {
    expect(answerQuestion("What's the bereavement leave allowance?").topic).toBe("bereavement");
    expect(answerQuestion("How do I submit an expense reimbursement?").topic).toBe("expenses");
  });

  it("falls back for off-topic questions", () => {
    const reply = answerQuestion("What's the weather like today?");
    expect(reply.topic).toBeUndefined();
    expect(reply.answer).toMatch(/vacation/i);
  });

  it("links only to documents that exist", () => {
    for (const q of [FIJI_QUESTION, "bereavement", "expense"]) {
      const { documentId } = answerQuestion(q);
      if (documentId) expect(placeholderDocuments.some((d) => d.id === documentId)).toBe(true);
    }
  });
});
