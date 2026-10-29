"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from "@fluentui/react-components";
import { addDays, daysBetween, localToday } from "@/lib/dates";
import { ONBOARDING_DAYS, shouldShowOnboarding } from "@/lib/onboarding";
import { useStoredValue } from "../hooks/use-stored-value";

const FIRST_SEEN_KEY = "rise-onboarding-first-seen";
const DISMISSED_KEY = "rise-onboarding-dismissed";
// The tour opens by itself at most once a day, so reloading doesn't nag.
const LAST_SHOWN_KEY = "rise-onboarding-last-shown";

export const TOUR_STEPS = [
  { title: "Home", text: "Your starting point: what was just published, then key links or your departments and team." },
  { title: "Search", text: "Find any document or folder across every department. Filter by department, folder, type or year, and select a file to see its details." },
  { title: "Departments", text: "Open a department from the cards or the menu button at the top left, then jump straight to its Budget, Minutes, Projects or Published Documents." },
  { title: "Publishing", text: "Submit a draft or idea, partners approve it, and a publisher files it with the right name, folder and audience. AI pre-fills the forms." },
  { title: "Help", text: "The full guide to the hub. You can reopen this tour from there at any time." },
  { title: "Ask HR", text: "Ask HR policy questions with the button in the bottom-right corner." },
];

type Onboarding = {
  openTour: () => void;
  resetOnboarding: () => void;
  pretendDay31: () => void;
  // Day of the first month (1 = first visit), or undefined until storage is read
  day: number | undefined;
  dismissed: boolean;
};

const OnboardingContext = createContext<Onboarding | null>(null);

// Shows the welcome tour automatically during a user's first month, until
// "Don't show again" (Meeting 4, section 2). Storage is per browser in the
// sandbox; docs/FEASIBILITY.md covers per-user storage.
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [firstSeen, setFirstSeen] = useStoredValue(FIRST_SEEN_KEY);
  const [dismissedValue, setDismissed] = useStoredValue(DISMISSED_KEY);
  const [lastShown, setLastShown] = useStoredValue(LAST_SHOWN_KEY);
  const [forced, setForced] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (firstSeen === null) setFirstSeen(localToday());
  }, [firstSeen, setFirstSeen]);

  const ready = firstSeen !== undefined && dismissedValue !== undefined && lastShown !== undefined;
  const dismissed = dismissedValue === "1";
  const today = localToday();
  const auto = ready && lastShown !== today && shouldShowOnboarding({ firstSeen, today, dismissed });
  const open = forced || auto;
  const day = ready && firstSeen ? daysBetween(firstSeen, today) + 1 : undefined;

  const value = useMemo<Onboarding>(
    () => ({
      openTour: () => {
        setStep(0);
        setForced(true);
      },
      resetOnboarding: () => {
        setFirstSeen(null);
        setDismissed(null);
        setLastShown(null);
        setStep(0);
      },
      pretendDay31: () => {
        setFirstSeen(addDays(localToday(), -ONBOARDING_DAYS));
        setDismissed(null);
        setForced(false);
      },
      day,
      dismissed,
    }),
    [day, dismissed, setFirstSeen, setDismissed, setLastShown],
  );

  function close() {
    setLastShown(today);
    setForced(false);
  }

  const last = step === TOUR_STEPS.length - 1;
  const current = TOUR_STEPS[step];

  return (
    <OnboardingContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={(_, data) => !data.open && close()}>
        <DialogSurface aria-describedby="tour-step-text">
          <DialogBody>
            <DialogTitle>Welcome to the RISE CPA hub</DialogTitle>
            <DialogContent>
              <p className="text-xs font-semibold text-zinc-500">
                Step {step + 1} of {TOUR_STEPS.length}
              </p>
              <h3 className="mt-1 font-heading text-lg font-bold text-brand-charcoal">{current.title}</h3>
              <p id="tour-step-text" className="mt-1 text-brand-charcoal">
                {current.text}
              </p>
            </DialogContent>
            <DialogActions fluid className="flex-wrap">
              <Button
                appearance="subtle"
                onClick={() => {
                  setDismissed("1");
                  close();
                }}
              >
                Don&apos;t show again
              </Button>
              <Button onClick={close}>Close</Button>
              <Button disabled={step === 0} onClick={() => setStep(step - 1)}>
                Back
              </Button>
              <Button appearance="primary" onClick={() => (last ? close() : setStep(step + 1))}>
                {last ? "Finish" : "Next"}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): Onboarding {
  const value = useContext(OnboardingContext);
  if (!value) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return value;
}
