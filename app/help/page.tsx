import type { Metadata } from "next";
import { OnboardingDemoControls, ShowTourButton } from "../components/help-tour-controls";

export const metadata: Metadata = { title: "Help - RISE CPA Intranet" };

const SECTIONS = [
  {
    id: "home",
    title: "Home",
    body: [
      "Home is your starting point. Staff see a short list of key links: the Employee Policy Manual, SOPs, how-to guides and the IT Service Ticket Guide. Managers and partners see department cards and a My Team section with performance reviews and coaching notes.",
      "What's new at the top lists the latest documents published through the Publishing tab, with what changed.",
    ],
  },
  {
    id: "search",
    title: "Search",
    body: [
      "Type part of a name to search every department at once. Upper and lower case don't matter.",
      "Narrow the results with the Department, Folder, Type and Year modified filters, or click a Type, Department or Last Update in the table to filter by it. Clear filters resets them.",
      "Select a file name to open its overview, with its location, published month and last update, before you open it. The address bar keeps your search, so you can bookmark or share it, and Back undoes the last filter.",
    ],
  },
  {
    id: "departments",
    title: "Departments",
    body: [
      "Open the Departments tab, or the menu button at the top left on any tab, to see every department you have access to.",
      "Each department has the same four folders: Budget, Minutes, Projects and Published Documents. Pick one to go straight to it. The breadcrumb at the top of the page shows where you are.",
    ],
  },
  {
    id: "publishing",
    title: "Publishing",
    body: [
      "Publishing is the one way into the Published Documents folder. Anyone can submit a draft or an idea; the responsible partner approves it, asks for changes or rejects it; then a manager publishes it with the firm's name, folder and audience.",
      "Suggest with AI pre-fills the forms, and a person always checks and approves. In this prototype the AI is a scripted demo. Smart File files client documents by their file name, and partners can change the publishing rules and turn AI on or off in Settings.",
    ],
  },
  {
    id: "ask-hr",
    title: "Ask HR",
    body: [
      "The Ask HR button in the bottom-right corner opens a chat for HR policy questions, such as vacation, bereavement leave or expenses. It answers questions only and can't book time off. Clear chat starts over. In this prototype the answers are scripted placeholder content.",
    ],
  },
  {
    id: "roles",
    title: "What you can see",
    body: [
      "You only see the documents your role allows. Restricted items are hidden completely, not greyed out. For the demo, change the role with Viewing as in the header.",
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      <nav aria-labelledby="toc-heading" className="lg:sticky lg:top-4 lg:self-start">
        <h2 id="toc-heading" className="mb-2 text-sm font-semibold text-zinc-900">
          On this page
        </h2>
        <ul className="space-y-1 text-sm">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-brand-charcoal underline-offset-2 hover:text-zinc-900 hover:underline">
                {s.title}
              </a>
            </li>
          ))}
          <li>
            <a href="#tour" className="text-brand-charcoal underline-offset-2 hover:text-zinc-900 hover:underline">
              Welcome tour
            </a>
          </li>
        </ul>
      </nav>

      <div className="space-y-8 lg:col-span-3">
        <div>
          <h1 className="font-heading text-3xl font-bold text-brand-charcoal">Help</h1>
          <p className="mt-1 text-brand-charcoal">A guide to every part of the RISE CPA hub.</p>
        </div>

        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-heading`} className="scroll-mt-4">
            <h2 id={`${s.id}-heading`} className="font-heading text-xl font-bold text-brand-charcoal">
              {s.title}
            </h2>
            {s.body.map((p) => (
              <p key={p} className="mt-2 text-zinc-800">
                {p}
              </p>
            ))}
          </section>
        ))}

        <section id="tour" aria-labelledby="tour-heading" className="scroll-mt-4 space-y-3">
          <h2 id="tour-heading" className="font-heading text-xl font-bold text-brand-charcoal">
            Welcome tour
          </h2>
          <p className="text-zinc-800">
            The welcome tour opens by itself during your first month. Reopen it here at any time.
          </p>
          <ShowTourButton />
          <OnboardingDemoControls />
        </section>
      </div>
    </div>
  );
}
