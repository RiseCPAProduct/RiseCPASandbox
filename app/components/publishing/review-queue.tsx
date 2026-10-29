"use client";

import { useState } from "react";
import { Button, Card, Field, Input, Spinner, Textarea } from "@fluentui/react-components";
import { apiFetch } from "@/lib/publishing/client";
import type { Submission } from "@/lib/publishing/types";
import type { ActionInput } from "@/lib/publishing/service";
import { useDemoRole } from "../demo-role";
import { ErrorBar, HistoryList, RoleGate, StatusBadge, useSubmissions } from "./shared";

// Partner review screen for one submission: approve with the group
// approval note, request changes, or reject (both need a comment).
function ReviewCard({ submission, onDone }: { submission: Submission; onDone: () => void }) {
  const { role } = useDemoRole();
  const [note, setNote] = useState("Approved at partners' meeting");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(action: ActionInput) {
    setBusy(true);
    setError(null);
    try {
      await apiFetch(`/api/submissions/${submission.id}`, role, { body: action });
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const s = submission;
  return (
    <Card className="p-4!">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold">{s.title}</h3>
        <StatusBadge status={s.status} />
      </div>
      <p className="text-sm text-zinc-600">
        {s.department} · {s.docType} · submitted by {s.submittedBy}
        {s.originalFileName && ` · file: ${s.originalFileName}`}
      </p>
      {s.description && <p className="mt-2 text-sm">{s.description}</p>}
      <HistoryList submission={s} />
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="grid content-start gap-2">
          <Field label="Group approval note">
            <Input value={note} onChange={(_, d) => setNote(d.value)} maxLength={300} />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button appearance="primary" disabled={busy} onClick={() => run({ type: "approve", note })}>
              Approve
            </Button>
            {s.status === "submitted" && (
              <Button disabled={busy} onClick={() => run({ type: "start_review" })}>
                Mark under review
              </Button>
            )}
          </div>
        </div>
        <div className="grid content-start gap-2">
          <Field label="Comment for the submitter" hint="Needed to request changes or reject.">
            <Textarea value={comment} onChange={(_, d) => setComment(d.value)} resize="vertical" />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button disabled={busy || !comment.trim()} onClick={() => run({ type: "request_changes", comment })}>
              Request changes
            </Button>
            <Button disabled={busy || !comment.trim()} onClick={() => run({ type: "reject", comment })}>
              Reject
            </Button>
          </div>
        </div>
      </div>
      <ErrorBar message={error} />
    </Card>
  );
}

export default function ReviewQueue() {
  const { role } = useDemoRole();
  // Other roles see the gate message, so don't ask for a queue they can't open.
  const list = useSubmissions(role === "partner" ? "review" : "mine", role);
  return (
    <RoleGate allowed={["partner"]} message="The review queue is for partners. Switch Viewing as to Partner to try it.">
      <section aria-labelledby="review-heading">
        <h2 id="review-heading" className="mb-3 font-heading text-xl font-bold text-brand-charcoal">
          Waiting for your review
        </h2>
        <ErrorBar message={list.error} />
        {list.loading ? (
          <Spinner size="small" label="Loading" />
        ) : list.items.length === 0 ? (
          <p className="text-sm text-zinc-600">Nothing is waiting for review.</p>
        ) : (
          <ul className="grid gap-3">
            {list.items.map((s) => (
              <li key={s.id}>
                <ReviewCard submission={s} onDone={list.reload} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </RoleGate>
  );
}
