# RISE CPA (Rise/Folio prototype)

A sandbox prototype of a publishing and findability app for RISE CPA, built with Next.js, Fluent UI React v9 and Tailwind CSS. All documents, people and policies are placeholder content.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Viewing as** in the header to switch between Staff, Manager and Partner.

Other scripts: `npm test` (Vitest), `npm run lint`, `npm run build`.

## AI

With no API key, the Publishing AI buttons use **demo AI**: scripted, keyword-based suggestions (`lib/ai/demo.ts`) so the showcase always works. The Settings page can still turn AI on and off.

To use real AI instead, create `.env.local` (never commit it) and restart `npm run dev`:

```
ANTHROPIC_API_KEY=your-key
# Optional: AI_MODEL=claude-haiku-5-5  (default claude-opus-5-5)
# Optional: AI_PROVIDER=demo  forces demo AI even with a key
```

To switch to Gemini Flash-Lite later, set `AI_PROVIDER=gemini` and `GEMINI_API_KEY`, then fill in `lib/ai/gemini.ts`. Nothing else changes.

## Project notes

Planning and decisions live in `docs/IMPLEMENTATION_PLAN.md` and `docs/DECISIONS.md`.
