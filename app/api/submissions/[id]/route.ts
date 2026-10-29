import type { NextRequest } from "next/server";
import { actorFrom, getStore, handle, readJson } from "@/lib/publishing/http";
import { act, getSubmission, replacementOptions, ServiceError, type ActionInput } from "@/lib/publishing/service";
import { availableActions } from "@/lib/publishing/workflow";

// GET /api/submissions/:id: one submission, what the viewer may do next,
// and (for publishers) the published documents it could replace
export async function GET(request: NextRequest, ctx: RouteContext<"/api/submissions/[id]">) {
  return handle(async () => {
    const { id } = await ctx.params;
    const store = getStore();
    const actor = actorFrom(request);
    const submission = getSubmission(store, id);
    const involved = actor.role !== "staff" || submission.submittedBy === actor.name;
    if (!involved) throw new ServiceError("Submission not found.", 404);
    return {
      submission,
      actions: availableActions(submission, actor),
      replacementOptions: actor.role === "manager" ? replacementOptions(store, submission.department) : [],
    };
  });
}

// POST /api/submissions/:id: run one workflow action
export async function POST(request: NextRequest, ctx: RouteContext<"/api/submissions/[id]">) {
  return handle(async () => {
    const { id } = await ctx.params;
    const body = (await readJson(request)) as ActionInput;
    return { submission: act(getStore(), actorFrom(request), id, body, new Date().toISOString()) };
  });
}
