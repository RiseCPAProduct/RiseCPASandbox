import type { Metadata } from "next";
import CalendarMonth from "../components/calendar-month";
import NewsAccordion from "../components/news-accordion";

export const metadata: Metadata = { title: "Calendar - RISE CPA Intranet" };

export default function CalendarPage() {
  return (
    <div>
      <h1 className="mb-4 font-heading text-3xl font-bold text-brand-charcoal">Calendar</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CalendarMonth />
        </div>
        <section aria-labelledby="calendar-news-heading">
          <h2 id="calendar-news-heading" className="mb-3 font-heading text-xl font-bold text-brand-charcoal">
            News and blog posts
          </h2>
          <NewsAccordion />
        </section>
      </div>
    </div>
  );
}
