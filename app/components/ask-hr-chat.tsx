"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { answerQuestion, SUGGESTED_QUESTIONS } from "@/lib/mock-hr-policy";
import { placeholderDocuments } from "@/lib/placeholder-documents";

type Message = {
  id: number;
  from: "user" | "bot";
  text: string;
  documentName?: string;
};

const GREETING: Message = {
  id: 0,
  from: "bot",
  text: "Hi! I can answer HR policy questions, like how much vacation you get or how to submit expenses.",
};

// Short pause so the scripted demo feels conversational.
const REPLY_DELAY_MS = 900;

type Props = {
  // Shows the linked document in the search table.
  onOpenDocument: (name: string) => void;
};

export default function AskHrChat({ onOpenDocument }: Props) {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const nextId = useRef(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, typing]);

  function ask(question: string) {
    const text = question.trim();
    if (!text || typing) return;
    setMessages((prev) => [...prev, { id: nextId.current++, from: "user", text }]);
    setDraft("");
    setTyping(true);
    timer.current = setTimeout(() => {
      const reply = answerQuestion(text);
      const documentName = placeholderDocuments.find((d) => d.id === reply.documentId)?.name;
      setMessages((prev) => [...prev, { id: nextId.current++, from: "bot", text: reply.answer, documentName }]);
      setTyping(false);
    }, REPLY_DELAY_MS);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    ask(draft);
  }

  return (
    <div className="flex h-[32rem] flex-col rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                m.from === "user" ? "bg-brand-green text-white" : "bg-zinc-100 text-zinc-900"
              }`}
            >
              <p>{m.text}</p>
              {m.documentName && (
                <button
                  type="button"
                  onClick={() => onOpenDocument(m.documentName!)}
                  className="mt-2 inline-flex items-center gap-1 rounded text-sm font-medium text-blue-600 hover:underline"
                >
                  Open {m.documentName}
                </button>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-500">
              <span className="sr-only">Ask HR is typing</span>
              <span className="inline-flex gap-1" aria-hidden="true">
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200 p-3">
        <div className="mb-2 flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => ask(q)}
              disabled={typing}
              className="rounded-full border border-brand-green/40 px-3 py-1 text-left text-xs text-brand-charcoal hover:bg-brand-green/10 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <label htmlFor="ask-hr-input" className="sr-only">
            Ask an HR policy question
          </label>
          <input
            id="ask-hr-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask an HR policy question"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-brand-charcoal outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/30"
          />
          <button
            type="submit"
            disabled={typing || !draft.trim()}
            className="rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-white hover:bg-brand-green/90 disabled:opacity-50"
          >
            Ask
          </button>
        </form>
        <p className="mt-2 text-xs text-zinc-400">
          Demo with placeholder policy content. Answers questions only; it can&apos;t book time off.
        </p>
      </div>
    </div>
  );
}
