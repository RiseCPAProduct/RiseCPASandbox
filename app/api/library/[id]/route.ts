import type { NextRequest } from "next/server";
import { actorFrom, getStore, handle } from "@/lib/publishing/http";
import { documentRecord } from "@/lib/publishing/service";

// GET /api/library/:id: who submitted, approved and published a document
export async function GET(request: NextRequest, ctx: RouteContext<"/api/library/[id]">) {
  return handle(async () => {
    const { id } = await ctx.params;
    return { record: documentRecord(getStore(), actorFrom(request).role, id) };
  });
}
