import type { NextRequest } from "next/server";
import { markFinal } from "@/lib/publishing/client-files";
import { actorFrom, getStore, handle } from "@/lib/publishing/http";

// POST /api/client-files/:id: mark the file final (locked)
export async function POST(request: NextRequest, ctx: RouteContext<"/api/client-files/[id]">) {
  return handle(async () => {
    const { id } = await ctx.params;
    return { file: markFinal(getStore(), actorFrom(request), id) };
  });
}
