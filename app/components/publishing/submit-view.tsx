"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Button,
  Card,
  Dropdown,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Option,
  Spinner,
  Textarea,
} from "@fluentui/react-components";
import { Sparkle20Regular } from "@fluentui/react-icons";
import type { SubmitValues, Validated } from "@/lib/ai/tasks";
import type { ItemType } from "@/lib/placeholder-documents";
import { apiFetch } from "@/lib/publishing/client";
import type { Submission } from "@/lib/publishing/types";
import { useDemoRole } from "../demo-role";
import { AiNote, ErrorBar, HistoryList, StatusBadge, useFirmConfig, useSubmissions } from "./shared";

const TEXT_EXTENSIONS = ["txt", "md", "csv"];
const EXCERPT_LIMIT = 8000;

function fileTypeOf(name: string): ItemType | undefined {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx", "txt", "md", "rtf"].includes(ext)) return "word";
  if (["xls", "xlsx", "csv"].includes(ext)) return "excel";
  return undefined;
}

type AiFlags = { filled: Set<string>; low: Set<string>; reason?: string };
const NO_FLAGS: AiFlags = { filled: new Set(), low: new Set() };

// Shows whether a field was pre-filled by AI and whether to double-check it.
function aiField(flags: AiFlags, key: string) {
  if (flags.low.has(key)) {
    return { validationState: "warning" as const, validationMessage: "AI was unsure here. Please check." };
  }
  if (flags.filled.has(key)) return { hint: "Suggested by AI" };
  return {};
}

function SubmitForm({ onSubmitted }: { onSubmitted: () => void }) {
  const { role } = useDemoRole();
  const [firm] = useFirmConfig();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState<{ name: string; type?: ItemType; excerpt?: string } | null>(null);
  const [flags, setFlags] = useState<AiFlags>(NO_FLAGS);
  const [busy, setBusy] = useState<"ai" | "submit" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (!picked) return setFile(null);
    const ext = picked.name.split(".").pop()?.toLowerCase() ?? "";
    // The prototype only reads plain-text files. Word and PDF text
    // extraction is a back-end job for the real version.
    const excerpt = TEXT_EXTENSIONS.includes(ext) ? (await picked.text()).slice(0, EXCERPT_LIMIT) : undefined;
    setFile({ name: picked.name, type: fileTypeOf(picked.name), excerpt });
  }

  async function suggest() {
    setBusy("ai");
    setError(null);
    try {
      const { suggestion } = await apiFetch<{ suggestion: Validated<SubmitValues> }>("/api/ai/suggest-submission", role, {
        body: { title, description, fileName: file?.name, excerpt: file?.excerpt },
      });
      if (suggestion.values.department) setDepartment(suggestion.values.department);
      if (suggestion.values.docType) setDocType(suggestion.values.docType);
      setFlags({
        filled: new Set(Object.keys(suggestion.values)),
        low: new Set(suggestion.lowConfidence),
        reason: suggestion.reason,
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy("submit");
    setError(null);
    try {
      const { submission } = await apiFetch<{ submission: Submission }>("/api/submissions", role, {
        body: {
          title,
          description,
          department,
          docType,
          originalFileName: file?.name,
          fileType: file?.type,
          excerpt: file?.excerpt,
        },
      });
      setDone(`Sent to ${submission.responsiblePartner} for review.`);
      setTitle("");
      setDescription("");
      setDepartment("");
      setDocType("");
      setFile(null);
      setFlags(NO_FLAGS);
      onSubmitted();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const config = firm?.config;
  const lead = config?.departments.find((d) => d.name === department)?.leadPartner;

  return (
    <Card className="p-4!">
      <h2 className="font-heading text-xl font-bold text-brand-charcoal">Submit a draft or idea</h2>
      <p className="text-sm text-zinc-600">
        It goes to the department&apos;s lead partner for review. Nothing reaches the Published folder without approval.
      </p>
      <form onSubmit={submit} className="mt-3 grid gap-3">
        <AiNote ai={firm?.ai} />
        <Field label="Title" required>
          <Input value={title} onChange={(_, d) => setTitle(d.value)} maxLength={120} />
        </Field>
        <Field label="What is it, and why is it needed?">
          <Textarea value={description} onChange={(_, d) => setDescription(d.value)} maxLength={2000} resize="vertical" />
        </Field>
        <Field label="File (optional)" hint="Ideas can be submitted without a file. Text files (.txt, .md, .csv) are read for AI suggestions.">
          <input
            type="file"
            onChange={handleFile}
            className="text-sm file:mr-3 file:rounded file:border file:border-zinc-300 file:bg-white file:px-3 file:py-1"
          />
        </Field>
        <div>
          <Button
            icon={busy === "ai" ? <Spinner size="tiny" /> : <Sparkle20Regular />}
            disabled={!firm?.ai.available || !title.trim() || busy !== null}
            onClick={suggest}
          >
            Suggest department and type with AI
          </Button>
          {flags.reason && <p className="mt-1 text-sm text-zinc-600">AI: {flags.reason}</p>}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Department" required hint={lead ? `Reviewed by ${lead}` : undefined} {...aiField(flags, "department")}>
            <Dropdown
              placeholder="Choose a department"
              value={department}
              selectedOptions={department ? [department] : []}
              onOptionSelect={(_, d) => d.optionValue && setDepartment(d.optionValue)}
            >
              {config?.departments.map((d) => (
                <Option key={d.name} value={d.name}>
                  {d.name}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Field label="Document type" required {...aiField(flags, "docType")}>
            <Dropdown
              placeholder="Choose a type"
              value={docType}
              selectedOptions={docType ? [docType] : []}
              onOptionSelect={(_, d) => d.optionValue && setDocType(d.optionValue)}
            >
              {config?.docTypes.map((t) => (
                <Option key={t} value={t}>
                  {t}
                </Option>
              ))}
            </Dropdown>
          </Field>
        </div>
        <ErrorBar message={error} />
        {done && (
          <MessageBar layout="multiline" intent="success">
            <MessageBarBody>{done}</MessageBarBody>
          </MessageBar>
        )}
        <div>
          <Button type="submit" appearance="primary" disabled={!title.trim() || !department || !docType || busy !== null}>
            Submit for review
          </Button>
        </div>
      </form>
    </Card>
  );
}

function Resubmit({ submission, onDone }: { submission: Submission; onDone: () => void }) {
  const { role } = useDemoRole();
  const [description, setDescription] = useState(submission.description);
  const [error, setError] = useState<string | null>(null);
  async function resubmit() {
    try {
      await apiFetch(`/api/submissions/${submission.id}`, role, { body: { type: "resubmit", description } });
      onDone();
    } catch (err) {
      setError((err as Error).message);
    }
  }
  return (
    <div className="mt-3 grid gap-2">
      <Field label="Revise and resubmit">
        <Textarea value={description} onChange={(_, d) => setDescription(d.value)} resize="vertical" />
      </Field>
      <ErrorBar message={error} />
      <div>
        <Button appearance="primary" onClick={resubmit}>
          Resubmit
        </Button>
      </div>
    </div>
  );
}

function MySubmissions({ list }: { list: ReturnType<typeof useSubmissions> }) {
  return (
    <section aria-labelledby="mine-heading">
      <h2 id="mine-heading" className="mb-3 font-heading text-xl font-bold text-brand-charcoal">
        My submissions
      </h2>
      <ErrorBar message={list.error} />
      {list.loading ? (
        <Spinner size="small" label="Loading" />
      ) : list.items.length === 0 ? (
        <p className="text-sm text-zinc-600">Nothing submitted yet.</p>
      ) : (
        <ul className="grid gap-3">
          {list.items.map((s) => (
            <li key={s.id}>
              <Card className="p-4!">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{s.title}</p>
                  <StatusBadge status={s.status} />
                </div>
                <p className="text-sm text-zinc-600">
                  {s.department} · {s.docType} · reviewer {s.responsiblePartner}
                  {s.publish && ` · published as ${s.publish.fileName}`}
                </p>
                <HistoryList submission={s} />
                {s.status === "changes_requested" && <Resubmit submission={s} onDone={list.reload} />}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function SubmitView() {
  const { role } = useDemoRole();
  const list = useSubmissions("mine", role);
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <SubmitForm onSubmitted={list.reload} />
      <MySubmissions list={list} />
    </div>
  );
}
