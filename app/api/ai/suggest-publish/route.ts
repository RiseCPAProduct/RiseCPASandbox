import { suggestPublish } from "@/lib/ai/tasks";
import { actorFrom, aiStatus, getStore, handle, readJson } from "@/lib/publishing/http";
import { getSubmission, parseOrThrow, replacementOptions, ServiceError } from "@/lib/publishing/service";
import { z } from "zod";

const Body = z.object({ id: z.string() });

// POST /api/ai/suggest-publish: Smart Publish pre-fill for an approved submission
export async function POST(request: Request) {
  return handle(async () => {
    const store = getStore();
    if (actorFrom(request).role !== "manager") throw new ServiceError("Only publishers can use Smart Publish.", 403);
    const { provider, status } = aiStatus(store);
    if (!provider) throw new ServiceError(status.reason ?? "AI is not available.");
    const { id } = parseOrThrow(Body, await readJson(request));
    const sub = getSubmission(store, id);
    const suggestion = await suggestPublish(
      provider,
      {
        title: sub.title,
        description: sub.description,
        department: sub.department,
        docType: sub.docType,
        fileName: sub.originalFileName,
        excerpt: sub.excerpt,
      },
      store.config,
      replacementOptions(store, sub.department),
      new Date().toISOString().slice(0, 7),
    );
    return { suggestion, provider: provider.name };
  });
}
