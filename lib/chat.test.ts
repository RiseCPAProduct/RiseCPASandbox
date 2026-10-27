import { describe, expect, it } from "vitest";
import { chatReducer, INITIAL_CHAT } from "./chat";
import { FIJI_QUESTION, SUGGESTED_QUESTIONS } from "./mock-hr-policy";

describe("chatReducer", () => {
  it("starts with the greeting and the suggested questions", () => {
    expect(INITIAL_CHAT.messages).toHaveLength(1);
    expect(INITIAL_CHAT.messages[0].from).toBe("bot");
    expect(INITIAL_CHAT.suggestions).toEqual(SUGGESTED_QUESTIONS);
    expect(INITIAL_CHAT.pending).toBeUndefined();
  });

  it("send adds the user message and waits for the answer", () => {
    const state = chatReducer(INITIAL_CHAT, { type: "send", text: `  ${FIJI_QUESTION}  ` });
    expect(state.messages.at(-1)).toMatchObject({ from: "user", text: FIJI_QUESTION });
    expect(state.pending).toBe(FIJI_QUESTION);
  });

  it("reply adds the matched answer with its linked document", () => {
    const sent = chatReducer(INITIAL_CHAT, { type: "send", text: FIJI_QUESTION });
    const state = chatReducer(sent, { type: "reply" });
    expect(state.messages.at(-1)).toMatchObject({ from: "bot", documentName: "Vacation Request Form" });
    expect(state.pending).toBeUndefined();
  });

  it("ignores blank messages and sends while an answer is pending", () => {
    expect(chatReducer(INITIAL_CHAT, { type: "send", text: "   " })).toBe(INITIAL_CHAT);
    const sent = chatReducer(INITIAL_CHAT, { type: "send", text: "vacation" });
    expect(chatReducer(sent, { type: "send", text: "expenses" })).toBe(sent);
  });

  it("reset returns the empty state with the suggested questions", () => {
    const sent = chatReducer(INITIAL_CHAT, { type: "send", text: "vacation" });
    const replied = chatReducer(sent, { type: "reply" });
    expect(chatReducer(replied, { type: "reset" })).toEqual(INITIAL_CHAT);
  });

  it("gives every message a unique id", () => {
    let state = INITIAL_CHAT;
    for (const text of ["vacation", "expense"]) {
      state = chatReducer(chatReducer(state, { type: "send", text }), { type: "reply" });
    }
    const ids = state.messages.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
