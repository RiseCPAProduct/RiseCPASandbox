import { answerQuestion, SUGGESTED_QUESTIONS } from "./mock-hr-policy";
import { placeholderDocuments } from "./placeholder-documents";

export type ChatMessage = {
  id: number;
  from: "user" | "bot";
  text: string;
  documentName?: string;
};

export type ChatState = {
  messages: ChatMessage[];
  suggestions: string[];
  // The question waiting for an answer; the UI shows a typing indicator.
  pending?: string;
  nextId: number;
};

export type ChatAction = { type: "send"; text: string } | { type: "reply" } | { type: "reset" };

export const INITIAL_CHAT: ChatState = {
  messages: [
    {
      id: 0,
      from: "bot",
      text: "Hi! I can answer HR policy questions, like how much vacation you get or how to submit expenses.",
    },
  ],
  suggestions: SUGGESTED_QUESTIONS,
  nextId: 1,
};

// "send" and "reply" are separate so the UI can pause between them and
// show the typing indicator. There is no edit action (Meeting 4, section 6).
export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "send": {
      const text = action.text.trim();
      if (!text || state.pending !== undefined) return state;
      return {
        ...state,
        messages: [...state.messages, { id: state.nextId, from: "user", text }],
        pending: text,
        nextId: state.nextId + 1,
      };
    }
    case "reply": {
      if (state.pending === undefined) return state;
      const reply = answerQuestion(state.pending);
      const documentName = placeholderDocuments.find((d) => d.id === reply.documentId)?.name;
      return {
        ...state,
        messages: [...state.messages, { id: state.nextId, from: "bot", text: reply.answer, documentName }],
        pending: undefined,
        nextId: state.nextId + 1,
      };
    }
    case "reset":
      return INITIAL_CHAT;
  }
}
