import { z } from "zod";
import { suggestClientFile } from "@/lib/ai/tasks";
import { actorFrom, clientAiStatus, getStore, handle, readJson } from "@/lib/publishing/http";
import { parseOrThrow, ServiceError } from "@/lib/publishing/service";

const Body = z.object({ fileName: z.string().trim().min(1).max(200) });

// POST /api/ai/suggest-client-file: Smart File pre-fill from the file name only
export async function POST(request: Request) {
  return handle(async () => {
    const store = getStore();
    const actor = actorFrom(request);
    const { provider, status } = clientAiStatus(store);
    if (!provider) throw new ServiceError(status.reason ?? "AI is not available.");
    const { fileName } = parseOrThrow(Body, await readJson(request));
    const visible = store.config.clientFiling.clients
      .filter((c) => actor.role === "partner" || c.team.includes(actor.name))
      .map((c) => c.code);
    return { suggestion: await suggestClientFile(provider, fileName, store.config.clientFiling, visible) };
  });
}
