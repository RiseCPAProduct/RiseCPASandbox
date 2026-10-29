import { daysBetween } from "./dates";

// The first month: the day of the first visit is day 1, so the tour still
// shows on day 30 and stops from day 31.
export const ONBOARDING_DAYS = 30;

type OnboardingInput = {
  // YYYY-MM-DD of the first visit, or null if this is the first visit
  firstSeen: string | null;
  today: string;
  // "Don't show again" was chosen
  dismissed: boolean;
};

export function shouldShowOnboarding({ firstSeen, today, dismissed }: OnboardingInput): boolean {
  if (dismissed) return false;
  if (!firstSeen) return true;
  return daysBetween(firstSeen, today) < ONBOARDING_DAYS;
}
