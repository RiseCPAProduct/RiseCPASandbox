"use client";

import { Button } from "@fluentui/react-components";
import { ONBOARDING_DAYS } from "@/lib/onboarding";
import { useOnboarding } from "./onboarding-tour";

function status(day: number | undefined, dismissed: boolean): string {
  if (day === undefined) return "Checking...";
  if (dismissed) return `Day ${day}. "Don't show again" was chosen, so the tour won't open by itself.`;
  if (day > ONBOARDING_DAYS) return `Day ${day}. The first month is over, so the tour won't open by itself.`;
  return `Day ${day} of ${ONBOARDING_DAYS}. The tour opens by itself once a day until day ${ONBOARDING_DAYS}.`;
}

export function ShowTourButton() {
  const { openTour } = useOnboarding();
  return (
    <Button appearance="primary" onClick={openTour}>
      Show the welcome tour
    </Button>
  );
}

// Meeting controls to show the first-month rule without waiting 30 days.
export function OnboardingDemoControls() {
  const { resetOnboarding, pretendDay31, day, dismissed } = useOnboarding();
  return (
    <div className="rounded-lg border border-dashed border-brand-green bg-white p-4">
      <p className="text-sm font-semibold text-zinc-900">Onboarding demo controls</p>
      <p className="mt-1 text-sm text-brand-charcoal" aria-live="polite">
        {status(day, dismissed)}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={resetOnboarding}>Reset onboarding</Button>
        <Button onClick={pretendDay31}>Pretend it&apos;s day 31</Button>
      </div>
    </div>
  );
}
