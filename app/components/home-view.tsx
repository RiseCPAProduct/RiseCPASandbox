"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, CardHeader, SearchBox } from "@fluentui/react-components";
import { Calendar20Regular, Link20Regular, Person20Regular } from "@fluentui/react-icons";
import { upcomingEvents } from "@/lib/calendar";
import { formatDayMonth } from "@/lib/format-date";
import { KEY_LINKS } from "@/lib/key-links";
import { mockEvents } from "@/lib/mock-events";
import { teamForRole } from "@/lib/mock-team";
import { DEMO_TODAY, mockUser } from "@/lib/mock-user";
import { placeholderDocuments } from "@/lib/placeholder-documents";
import { useDemoRole } from "./demo-role";
import DepartmentNav from "./department-nav";
import NewsBanner from "./news-banner";
import NewsHub from "./news-hub";

function searchHref(query: string): string {
  return `/search?${new URLSearchParams({ q: query })}`;
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-3 font-heading text-xl font-bold text-brand-charcoal">
      {children}
    </h2>
  );
}

// Home differs by role (Meeting 4, section 5): Staff get a few key links,
// managers and partners get department cards and their team.
export default function HomeView() {
  const router = useRouter();
  const { role } = useDemoRole();
  const [query, setQuery] = useState("");
  const team = teamForRole(role);
  const events = upcomingEvents(mockEvents, DEMO_TODAY, 3);

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(query.trim() ? searchHref(query.trim()) : "/search");
  }

  return (
    <div className="space-y-8">
      <NewsBanner />

      <div>
        <h1 className="font-heading text-3xl font-bold text-brand-charcoal">Welcome, {mockUser.firstName}</h1>
        <p className="mt-1 text-brand-charcoal">Everything you need at RISE CPA, in one place.</p>
        <form role="search" onSubmit={handleSearch} className="mt-4 flex gap-2">
          <SearchBox
            size="large"
            className="max-w-none! flex-1"
            aria-label="Search documents and folders"
            placeholder="Search all departments, e.g. budget, policy"
            value={query}
            onChange={(_, data) => setQuery(data.value)}
          />
          <Button appearance="primary" size="large" type="submit">
            Search
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {role === "staff" ? (
            <section aria-labelledby="key-links-heading">
              <SectionHeading id="key-links-heading">Key links</SectionHeading>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {KEY_LINKS.map((link) => {
                  const doc = placeholderDocuments.find((d) => d.id === link.documentId);
                  return (
                    <li key={link.documentId}>
                      <Link
                        href={searchHref(doc?.name ?? link.label)}
                        className="flex h-full items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm hover:border-brand-green"
                      >
                        <Link20Regular className="mt-0.5 shrink-0 text-brand-green" aria-hidden />
                        <span>
                          <span className="block font-semibold text-zinc-900">{link.label}</span>
                          <span className="block text-sm text-brand-charcoal">{link.description}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : (
            <>
              <section aria-labelledby="home-departments-heading">
                <SectionHeading id="home-departments-heading">Departments</SectionHeading>
                <DepartmentNav />
              </section>
              <section aria-labelledby="team-heading">
                <SectionHeading id="team-heading">My team</SectionHeading>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {team.map((member) => (
                    <li key={member.id}>
                      <Card className="h-full">
                        <CardHeader
                          image={<Person20Regular className="text-brand-green" aria-hidden />}
                          header={<span className="font-semibold">{member.name}</span>}
                          description={<span className="text-sm text-zinc-500">{member.title}</span>}
                        />
                        <p className="text-sm text-brand-charcoal">
                          <span className="font-semibold">Performance review: </span>
                          {member.reviewFile}
                        </p>
                        <p className="text-sm text-brand-charcoal">
                          <span className="font-semibold">Coaching notes: </span>
                          {member.coachingNotes}
                        </p>
                      </Card>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          <section id="news" aria-labelledby="news-heading" className="scroll-mt-4">
            <SectionHeading id="news-heading">Latest news</SectionHeading>
            <NewsHub limit={3} />
          </section>
        </div>

        <section aria-labelledby="events-heading" className="lg:self-start">
          <SectionHeading id="events-heading">Upcoming events</SectionHeading>
          <ul className="space-y-3">
            {events.map((event) => (
              <li key={event.id} className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
                <Calendar20Regular className="mt-0.5 shrink-0 text-brand-green" aria-hidden />
                <div>
                  <p className="font-semibold text-zinc-900">{event.title}</p>
                  <p className="text-sm text-brand-charcoal">
                    {formatDayMonth(event.date)}
                    {event.time && `, ${event.time}`}
                    {event.location && ` - ${event.location}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/calendar" className="mt-3 inline-block text-sm font-semibold text-brand-charcoal underline hover:text-brand-green">
            See the full calendar
          </Link>
        </section>
      </div>
    </div>
  );
}
