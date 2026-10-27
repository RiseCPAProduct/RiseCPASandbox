"use client";

import { useState } from "react";
import { Button } from "@fluentui/react-components";
import { ChevronLeft20Regular, ChevronRight20Regular } from "@fluentui/react-icons";
import { addMonths, buildMonthGrid, eventsOn } from "@/lib/calendar";
import { formatDayMonth, formatMonthYear } from "@/lib/format-date";
import { EVENT_TYPE_LABELS, mockEvents, type EventType } from "@/lib/mock-events";
import { DEMO_TODAY } from "@/lib/mock-user";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CHIP_STYLES: Record<EventType, string> = {
  social: "bg-amber-100 text-amber-900",
  firm: "bg-brand-green/20 text-zinc-900",
};

const [startYear, startMonth] = DEMO_TODAY.split("-").map(Number);

export default function CalendarMonth() {
  const [{ year, month }, setMonth] = useState({ year: startYear, month: startMonth });
  const [selected, setSelected] = useState(DEMO_TODAY);
  const grid = buildMonthGrid(year, month);
  const selectedEvents = eventsOn(mockEvents, selected);
  const monthLabel = formatMonthYear(`${year}-${month}`);

  function step(delta: number) {
    setMonth(addMonths(year, month, delta));
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <Button appearance="subtle" icon={<ChevronLeft20Regular />} aria-label="Previous month" onClick={() => step(-1)} />
        <h2 className="font-heading text-xl font-bold text-brand-charcoal" aria-live="polite">
          {monthLabel}
        </h2>
        <Button appearance="subtle" icon={<ChevronRight20Regular />} aria-label="Next month" onClick={() => step(1)} />
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div className="grid grid-cols-7 bg-zinc-100 text-center text-xs font-semibold text-brand-charcoal" aria-hidden="true">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>
        <ol className="grid grid-cols-7" aria-label={`${monthLabel} days`}>
          {grid.flat().map((day) => {
            const events = eventsOn(mockEvents, day.date);
            const isSelected = day.date === selected;
            const base = `flex min-h-16 flex-col gap-1 border-t border-l border-zinc-100 p-1 text-left text-xs sm:min-h-24 ${
              day.inMonth ? "" : "bg-zinc-50 text-zinc-400"
            }`;
            const label = (
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${day.date === DEMO_TODAY ? "bg-brand-charcoal text-white" : ""}`}>
                {day.day}
              </span>
            );
            return (
              <li key={day.date} className="contents">
                {events.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setSelected(day.date)}
                    aria-pressed={isSelected}
                    aria-label={`${formatDayMonth(day.date)}, ${events.length} ${events.length === 1 ? "event" : "events"}`}
                    className={`${base} hover:bg-brand-green/10 focus-visible:outline-2 focus-visible:outline-brand-green ${isSelected ? "bg-brand-green/15 ring-2 ring-inset ring-brand-green" : ""}`}
                  >
                    {label}
                    {events.map((event) => (
                      <span key={event.id} className={`hidden truncate rounded px-1 py-0.5 sm:block ${CHIP_STYLES[event.type]}`}>
                        {event.title}
                      </span>
                    ))}
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-green sm:hidden" aria-hidden="true" />
                  </button>
                ) : (
                  <div className={base}>{label}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <section aria-labelledby="day-heading" className="mt-4">
        <h3 id="day-heading" className="font-heading text-lg font-bold text-brand-charcoal">
          {formatDayMonth(selected)}
        </h3>
        {selectedEvents.length === 0 ? (
          <p className="mt-1 text-sm text-brand-charcoal">No events on this day. Pick a highlighted day to see its events.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {selectedEvents.map((event) => (
              <li key={event.id} className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
                <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${CHIP_STYLES[event.type]}`}>{EVENT_TYPE_LABELS[event.type]}</span>
                <p className="mt-1 font-semibold text-zinc-900">{event.title}</p>
                <p className="text-sm text-brand-charcoal">
                  {event.time ?? "All day"}
                  {event.location && ` - ${event.location}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
