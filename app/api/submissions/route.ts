import { actorFrom, getStore, handle, readJson } from "@/lib/publishing/http";
import { createSubmission, listSubmissions, ServiceError, type CreateSubmissionInput, type Scope } from "@/lib/publishing/service";

const SCOPES: Scope[] = ["mine", "review", "publish", "published"];

// GET /api/submissions?scope=mine|review|publish|published
export async function GET(request: Request) {
  return handle(() => {
    const scope = new URL(request.url).searchParams.get("scope") ?? "mine";
    if (!SCOPES.includes(scope as Scope)) throw new ServiceError("Unknown scope.");
    return { submissions: listSubmissions(getStore(), actorFrom(request), scope as Scope) };
  });
}

// POST /api/submissions: submit a draft or idea for review
export async function POST(request: Request) {
  return handle(async () => {
    const body = (await readJson(request)) as CreateSubmissionInput;
    return { submission: createSubmission(getStore(), actorFrom(request), body, new Date().toISOString()) };
  });
}
