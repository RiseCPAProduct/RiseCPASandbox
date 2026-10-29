import { actorFrom, aiStatus, clientAiStatus, getStore, handle, readJson } from "@/lib/publishing/http";
import { updateConfig, type ConfigInput, type PublishingStore } from "@/lib/publishing/service";

const view = (store: PublishingStore) => ({
  config: store.config,
  ai: aiStatus(store).status,
  clientAi: clientAiStatus(store).status,
});

// GET /api/config: the firm's publishing rules and whether AI is available
export async function GET() {
  return handle(() => view(getStore()));
}

// PUT /api/config: change the publishing rules (partners with admin ability)
export async function PUT(request: Request) {
  return handle(async () => {
    const store = getStore();
    updateConfig(store, actorFrom(request), (await readJson(request)) as ConfigInput);
    return view(store);
  });
}
