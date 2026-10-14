// Fictional HR policy content for the scripted chatbot showcase.
// Not RISE CPA's real policy; there is no AI service behind it.

export type PolicyTopic = "vacation" | "bereavement" | "expenses";

type PolicyEntry = {
  topic: PolicyTopic;
  keywords: string[];
  answer: string;
  // Placeholder document to link from the answer
  documentId?: string;
};

export type ChatReply = {
  answer: string;
  topic?: PolicyTopic;
  documentId?: string;
};

export const FIJI_QUESTION = "I'm planning a vacation to Fiji. What's the vacation policy?";

export const SUGGESTED_QUESTIONS = [
  FIJI_QUESTION,
  "What's the bereavement leave allowance?",
  "How do I submit an expense reimbursement?",
];

const POLICIES: PolicyEntry[] = [
  {
    topic: "vacation",
    keywords: ["vacation", "holiday", "time off", "pto", "days off", "trip", "travel", "fiji"],
    answer:
      "Sounds like a great trip! Under the Employee Policy Manual (section 4.2), staff and co-op students get 3 weeks of paid vacation a year, managers get 4 weeks, and partners get 5 weeks. For time off longer than one week, submit a Vacation Request Form at least 4 weeks ahead so your manager can plan coverage. Up to 5 unused days carry over into the next year.",
    documentId: "hr-3",
  },
  {
    topic: "bereavement",
    keywords: ["bereavement", "funeral", "passed away", "death", "loss", "grief"],
    answer:
      "Bereavement leave is up to 5 paid days for an immediate family member and 2 paid days for an extended family member (Employee Policy Manual, section 5.1). Let your manager know as soon as you can; no form is needed.",
    documentId: "hr-2",
  },
  {
    topic: "expenses",
    keywords: ["expense", "reimburse", "reimbursement", "receipt", "mileage"],
    answer:
      "Fill in the Expense Reimbursement Form, attach your receipts, and send it to Finance within 60 days of the purchase. Approved expenses are paid in the next pay cycle.",
    documentId: "fin-3",
  },
];

const FALLBACK =
  "I can help with HR policy questions such as vacation, bereavement leave and expense reimbursements. Try one of the suggested questions, or search for the document above.";

// Picks the policy with the most keyword matches. Questions only:
// the bot never takes actions such as booking time off.
export function answerQuestion(text: string): ChatReply {
  const q = text.toLowerCase();
  let best: PolicyEntry | undefined;
  let bestScore = 0;
  for (const policy of POLICIES) {
    const score = policy.keywords.filter((k) => q.includes(k)).length;
    if (score > bestScore) {
      best = policy;
      bestScore = score;
    }
  }
  if (!best) return { answer: FALLBACK };
  return { answer: best.answer, topic: best.topic, documentId: best.documentId };
}
