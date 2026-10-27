// Placeholder firm and social events for the Calendar tab. All fictional.

export type EventType = "social" | "firm";

export type CalendarEvent = {
  id: string;
  title: string;
  // YYYY-MM-DD
  date: string;
  type: EventType;
  time?: string;
  location?: string;
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  social: "Social",
  firm: "Firm",
};

export const mockEvents: CalendarEvent[] = [
  { id: "ev-1", title: "Partner meeting", date: "2026-10-15", type: "firm", time: "9:00 am", location: "Boardroom" },
  { id: "ev-2", title: "Halloween potluck", date: "2026-10-30", type: "social", time: "12:00 pm", location: "Kitchen" },
  { id: "ev-3", title: "All-staff town hall", date: "2026-11-04", type: "firm", time: "10:00 am", location: "Boardroom and Teams" },
  { id: "ev-4", title: "Monthly bowling night", date: "2026-11-06", type: "social", time: "6:30 pm", location: "Strike Zone Lanes" },
  { id: "ev-5", title: "Remembrance Day (office closed)", date: "2026-11-11", type: "firm" },
  { id: "ev-6", title: "CPD session: GST/HST update", date: "2026-11-13", type: "firm", time: "1:00 pm", location: "Training room" },
  { id: "ev-7", title: "Lunch and learn: Excel shortcuts", date: "2026-11-18", type: "social", time: "12:00 pm", location: "Kitchen" },
  { id: "ev-8", title: "Year-end planning kickoff", date: "2026-11-20", type: "firm", time: "9:30 am", location: "Boardroom" },
  { id: "ev-9", title: "Charity food drive drop-off", date: "2026-11-24", type: "social", location: "Front desk" },
  { id: "ev-10", title: "Christmas party RSVP deadline", date: "2026-11-27", type: "social" },
];
