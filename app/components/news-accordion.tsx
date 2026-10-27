"use client";

import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from "@fluentui/react-components";
import { formatMonthYear } from "@/lib/format-date";
import { mockNews, NEWS_TYPE_LABELS, sortNewest } from "@/lib/mock-news";

// News and blog posts beside the calendar, expandable as in the lo-fi.
export default function NewsAccordion() {
  return (
    <Accordion collapsible multiple className="rounded-lg border border-zinc-200 bg-white">
      {sortNewest(mockNews).map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionHeader expandIconPosition="end">
            <span>
              <span className="block text-xs text-zinc-500">
                {NEWS_TYPE_LABELS[item.type]} - {formatMonthYear(item.date)}
              </span>
              <span className="block font-medium">{item.title}</span>
            </span>
          </AccordionHeader>
          <AccordionPanel>
            <p className="pb-3 text-sm text-brand-charcoal">{item.summary}</p>
            <p className="pb-3 text-xs text-zinc-500">Posted by {item.postedBy}</p>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
