import { actorFrom, getStore, handle } from "@/lib/publishing/http";
import { libraryFor, notificationsFor } from "@/lib/publishing/service";

// GET /api/library: published documents and announcements the viewer may see.
// Items above the viewer's level are never sent (hidden, not locked).
export async function GET(request: Request) {
  return handle(() => {
    const { role } = actorFrom(request);
    const store = getStore();
    return { items: libraryFor(store, role), notifications: notificationsFor(store, role) };
  });
}
