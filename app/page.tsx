import HubShell from "./components/hub-shell";
import NewsBanner from "./components/news-banner";
import NewsHub from "./components/news-hub";

// Placeholder for the signed-in user's personal OneDrive.
const ONEDRIVE_URL = "https://onedrive.live.com";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <NewsBanner />
      <header className="bg-brand-charcoal">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center">
            <span className="font-heading text-xl font-bold tracking-wide text-white">
              RISE <span className="text-brand-green">CPA</span>
            </span>
            <span className="ml-3 border-l border-white/30 pl-3 text-sm text-white/80">Intranet</span>
          </div>
          <a
            href={ONEDRIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 18a5 5 0 0 1-.6-9.96A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9H7z" />
            </svg>
            My OneDrive
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <HubShell news={<NewsHub />} />
        <p className="mt-10 text-xs text-zinc-400">Sandbox prototype. All documents, people and policies shown are placeholder content.</p>
      </main>
    </div>
  );
}
