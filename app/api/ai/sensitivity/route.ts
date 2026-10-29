import { z } from "zod";
import { checkSensitivity } from "@/lib/ai/tasks";
import { actorFrom, aiStatus, getStore, handle, readJson } from "@/lib/publishing/http";
import { getSubmission, parseOrThrow, ServiceError } from "@/lib/publishing/service";

const Body = z.object({ id: z.string(), audience: z.enum(["staff", "manager", "partner"]) });

// POST /api/ai/sensitivity: advisory check that the content suits the chosen audience
export async function POST(request: Request) {
  return handle(async () => {
    const store = getStore();
    if (actorFrom(request).role !== "manager") throw new ServiceError("Only publishers can run this check.", 403);
    const { provider, status } = aiStatus(store);
    if (!provider) throw new ServiceError(status.reason ?? "AI is not available.");
    const { id, audience } = parseOrThrow(Body, await readJson(request));
    const sub = getSubmission(store, id);
    const doc = { title: sub.title, description: sub.description, fileName: sub.originalFileName, excerpt: sub.excerpt };
    return { check: await checkSensitivity(provider, doc, audience) };
  });
}
