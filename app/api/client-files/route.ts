import { fileClientDocument, listClientFiles, type ClientFileInput } from "@/lib/publishing/client-files";
import { actorFrom, getStore, handle, readJson } from "@/lib/publishing/http";

// GET /api/client-files: client files the viewer's client teams may see
export async function GET(request: Request) {
  return handle(() => {
    const store = getStore();
    const actor = actorFrom(request);
    const clients = store.config.clientFiling.clients
      .filter((c) => actor.role === "partner" || c.team.includes(actor.name))
      .map(({ code, name }) => ({ code, name }));
    return { files: listClientFiles(store, actor), clients };
  });
}

// POST /api/client-files: Smart File one upload. Returns { duplicate } instead
// of filing when the name already exists, unless replace is true.
export async function POST(request: Request) {
  return handle(async () => {
    const body = (await readJson(request)) as ClientFileInput & { replace?: boolean };
    return fileClientDocument(getStore(), actorFrom(request), body, new Date().toISOString(), body.replace === true);
  });
}
