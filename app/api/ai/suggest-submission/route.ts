import { suggestSubmission } from "@/lib/ai/tasks";
import { aiStatus, getStore, handle, readJson } from "@/lib/publishing/http";
import { parseOrThrow, ServiceError } from "@/lib/publishing/service";
import { z } from "zod";

const Body = z.object({
  title: z.string().trim().min(1, "Add a title first.").max(120),
  description: z.string().trim().max(2000),
  fileName: z.string().trim().max(200).optional(),
  excerpt: z.string().trim().max(8000).optional(),
});

// POST /api/ai/suggest-submission: AI suggests department and type
export async function POST(request: Request) {
  return handle(async () => {
    const store = getStore();
    const { provider, status } = aiStatus(store);
    if (!provider) throw new ServiceError(status.reason ?? "AI is not available.");
    const doc = parseOrThrow(Body, await readJson(request));
    return { suggestion: await suggestSubmission(provider, doc, store.config), provider: provider.name };
  });
}
