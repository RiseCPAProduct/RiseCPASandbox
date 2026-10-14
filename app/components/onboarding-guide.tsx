"use client";

import { useStoredValue } from "../hooks/use-stored-value";

const STORAGE_KEY = "rise-onboarding-dismissed";

const STEPS = [
  { title: "Search everything", text: "Type in the search bar to find any document or folder across every department." },
  { title: "Narrow it down", text: "Use the filters, or click a Type, Department or Last Update in the table." },
  { title: "Browse a department", text: "Open a department card to see its Budget, Minutes, Projects and Published Documents." },
  { title: "Ask HR", text: "Ask the chatbot policy questions, like how much vacation you get." },
  { title: "Your OneDrive", text: "Use the OneDrive button at the top for your personal files." },
];

export default function OnboardingGuide() {
  const [dismissed, setDismissed] = useStoredValue(STORAGE_KEY);

  // undefined = storage not checked yet; render nothing to avoid a flash.
  if (dismissed === undefined) return null;

  if (dismissed === "1") {
    return (
      <button
        type="button"
        onClick={() => setDismissed(null)}
        className="rounded text-sm font-medium text-brand-green hover:underline"
      >
        Show getting started guide
      </button>
    );
  }

  return (
    <section aria-labelledby="getting-started" className="rounded-lg border border-brand-green/40 bg-brand-green/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <h2 id="getting-started" className="font-heading text-lg font-bold text-brand-charcoal">
          Getting started
        </h2>
        <button
          type="button"
          onClick={() => setDismissed("1")}
          aria-label="Dismiss getting started guide"
          className="rounded p-1 text-brand-charcoal hover:bg-brand-green/10"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <ol className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, i) => (
          <li key={step.title} className="text-sm">
            <p className="font-medium text-zinc-900">
              {i + 1}. {step.title}
            </p>
            <p className="mt-1 text-brand-charcoal">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
