import SearchBar from "./components/search-bar";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <header className="bg-brand-charcoal">
        <div className="mx-auto flex max-w-3xl items-center px-4 py-4">
          <span className="font-heading text-xl font-bold tracking-wide text-white">
            RISE <span className="text-brand-green">CPA</span>
          </span>
          <span className="ml-3 border-l border-white/30 pl-3 text-sm text-white/80">Intranet</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <h1 className="font-heading text-3xl font-bold text-brand-charcoal">Find a document</h1>
        <p className="mb-6 mt-2 text-brand-charcoal">
          Search documents and folders across every department, or narrow results by department, type and year.
        </p>
        <SearchBar />
        <p className="mt-8 text-xs text-zinc-400">Sandbox prototype. All documents shown are placeholder content.</p>
      </main>
    </div>
  );
}
