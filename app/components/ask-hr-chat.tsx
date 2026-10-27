"use client";

import { useEffect, useReducer, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { Button, Input } from "@fluentui/react-components";
import { ArrowReset20Regular, Chat24Regular, Dismiss20Regular } from "@fluentui/react-icons";
import { chatReducer, INITIAL_CHAT } from "@/lib/chat";

// Short pause so the scripted demo feels conversational.
const REPLY_DELAY_MS = 900;

// Floating Ask HR button on every tab (Meeting 4, section 6). Scripted
// showcase only: no AI service, answers questions, takes no actions.
export default function AskHrChat() {
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useReducer(chatReducer, INITIAL_CHAT);
  const [draft, setDraft] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typing = state.pending !== undefined;

  useEffect(() => {
    if (!typing) return;
    const timer = setTimeout(() => dispatch({ type: "reply" }), REPLY_DELAY_MS);
    return () => clearTimeout(timer);
  }, [typing]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [state.messages, typing]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  function ask(text: string) {
    if (typing) return;
    dispatch({ type: "send", text });
    setDraft("");
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    ask(draft);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
    }
  }

  return (
    <>
      <Button
        ref={buttonRef}
        appearance="primary"
        shape="circular"
        size="large"
        icon={<Chat24Regular />}
        aria-expanded={open}
        aria-controls="ask-hr-panel"
        onClick={() => (open ? close() : setOpen(true))}
        className={`fixed! right-4 bottom-4 z-40 shadow-lg ${open ? "max-sm:hidden!" : ""}`}
      >
        Ask HR
      </Button>

      {open && (
        <div
          id="ask-hr-panel"
          role="dialog"
          aria-labelledby="ask-hr-title"
          onKeyDown={handleKeyDown}
          className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col rounded-t-xl border border-zinc-200 bg-white shadow-2xl sm:inset-x-auto sm:right-4 sm:bottom-20 sm:h-[34rem] sm:max-h-[calc(100dvh-6rem)] sm:w-96 sm:rounded-xl"
        >
          <div className="flex items-center gap-2 border-b border-zinc-200 px-3 py-2">
            <h2 id="ask-hr-title" className="flex-1 font-heading text-lg font-bold text-brand-charcoal">
              Ask HR
            </h2>
            <Button appearance="subtle" size="small" icon={<ArrowReset20Regular />} onClick={() => dispatch({ type: "reset" })}>
              Clear chat
            </Button>
            <Button appearance="subtle" icon={<Dismiss20Regular />} aria-label="Close Ask HR" onClick={close} />
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {state.messages.map((m) => (
              <div key={m.id} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.from === "user" ? "bg-brand-green-dark text-white" : "bg-zinc-100 text-zinc-900"}`}>
                  <p>{m.text}</p>
                  {m.documentName && (
                    <Link
                      href={`/search?${new URLSearchParams({ q: m.documentName })}`}
                      onClick={() => setOpen(false)}
                      className="mt-2 inline-block font-semibold text-blue-700 underline"
                    >
                      Open {m.documentName}
                    </Link>
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
            {state.messages.length === 1 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {state.suggestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => ask(q)}
                    disabled={typing}
                    className="rounded-full border border-brand-green/60 px-3 py-1 text-left text-xs text-brand-charcoal hover:bg-brand-green/10 disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                ref={inputRef}
                className="min-w-0 flex-1"
                aria-label="Ask an HR policy question"
                placeholder="Ask an HR policy question"
                autoComplete="off"
                value={draft}
                onChange={(_, data) => setDraft(data.value)}
              />
              <Button type="submit" appearance="primary" disabled={typing || !draft.trim()}>
                Ask
              </Button>
            </form>
            <p className="mt-2 text-xs text-zinc-500">
              Demo with placeholder policy content. Answers questions only; it can&apos;t book time off.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
