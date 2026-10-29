"use client";

import { useEffect, useState } from "react";
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
import type { SensitivityCheck } from "@/lib/ai/schemas";
import type { PublishValues, Validated } from "@/lib/ai/tasks";
import { AUDIENCE_LABELS, type FirmConfig } from "@/lib/firm-config";
import type { Role } from "@/lib/placeholder-documents";
import { apiFetch } from "@/lib/publishing/client";
import { buildName, findReplacementCandidates, nextVersion } from "@/lib/publishing/naming";
import type { Submission } from "@/lib/publishing/types";
import { useDemoRole } from "../demo-role";
import { AiNote, ErrorBar, HistoryList, RoleGate, StatusBadge, useFirmConfig, useSubmissions, type ConfigState } from "./shared";

type ReplaceOption = { id: string; title: string; version: number; department: Submission["department"] };

const AUDIENCES = Object.keys(AUDIENCE_LABELS) as Role[];
const NEW_DOCUMENT = "new";

function thisMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

// Smart Publish (Rise/Folio MVP, section 7): AI pre-fills, the firm's
// template builds the name, and the publisher checks everything first.
function SmartPublish({
  submission,
  firm,
  onPublished,
}: {
  submission: Submission;
  firm: NonNullable<ConfigState>;
  onPublished: (fileName: string) => void;
}) {
  const { role, refreshLibrary } = useDemoRole();
  const config: FirmConfig = firm.config;
  const [options, setOptions] = useState<ReplaceOption[]>([]);
  const [title, setTitle] = useState(submission.title);
  const [docType, setDocType] = useState(submission.docType);
  const [effectiveDate, setEffectiveDate] = useState(thisMonth());
  const [audience, setAudience] = useState<Role>(config.defaultAudience);
  const [replacesId, setReplacesId] = useState(NEW_DOCUMENT);
  const [changeNote, setChangeNote] = useState(submission.description.split(". ")[0]);
  const [ai, setAi] = useState<{ filled: Set<string>; low: Set<string> }>({ filled: new Set(), low: new Set() });
  const [busy, setBusy] = useState<"ai" | "publish" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [check, setCheck] = useState<(SensitivityCheck & { audience: Role }) | null>(null);

  useEffect(() => {
    apiFetch<{ replacementOptions: ReplaceOption[] }>(`/api/submissions/${submission.id}`, role).then(
      (res) => setOptions(res.replacementOptions),
      (err: Error) => setError(err.message),
    );
  }, [submission.id, role]);

  async function prefill() {
    setBusy("ai");
    setError(null);
    try {
      const { suggestion } = await apiFetch<{ suggestion: Validated<PublishValues> }>("/api/ai/suggest-publish", role, {
        body: { id: submission.id },
      });
      const v = suggestion.values;
      if (v.title) setTitle(v.title);
      if (v.docType) setDocType(v.docType);
      if (v.effectiveDate) setEffectiveDate(v.effectiveDate);
      if (v.audience) setAudience(v.audience);
      setReplacesId(v.replacesId ?? NEW_DOCUMENT);
      if (v.changeNote) setChangeNote(v.changeNote);
      setAi({ filled: new Set([...Object.keys(v), "replacesId"]), low: new Set(suggestion.lowConfidence) });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function checkAudience() {
    setBusy("ai");
    setError(null);
    try {
      const res = await apiFetch<{ check: SensitivityCheck }>("/api/ai/sensitivity", role, {
        body: { id: submission.id, audience },
      });
      setCheck({ ...res.check, audience });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function publish() {
    setBusy("publish");
    setError(null);
    try {
      const res = await apiFetch<{ submission: Submission }>(`/api/submissions/${submission.id}`, role, {
        body: {
          type: "publish",
          details: {
            title,
            docType,
            effectiveDate,
            audience,
            changeNote,
            replacesId: replacesId === NEW_DOCUMENT ? undefined : replacesId,
          },
        },
      });
      refreshLibrary();
      onPublished(res.submission.publish?.fileName ?? title);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const aiProps = (key: string) =>
    ai.low.has(key)
      ? { validationState: "warning" as const, validationMessage: "AI was unsure here. Please check." }
      : ai.filled.has(key)
        ? { hint: "Suggested by AI" }
        : {};

  const replaced = options.find((o) => o.id === replacesId);
  const dept = config.departments.find((d) => d.name === submission.department);
  const preview = buildName(config.namingTemplate, {
    dept: dept?.code ?? submission.department,
    type: docType,
    title,
    version: nextVersion(replaced?.version),
    date: effectiveDate,
  });
  // Works without AI: a simple word match hints at what this replaces.
  const likely = findReplacementCandidates(title, submission.department, options)[0];

  return (
    <Card className="p-4!">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-heading text-lg font-bold text-brand-charcoal">Smart Publish: {submission.title}</h3>
        <StatusBadge status={submission.status} />
      </div>
      <p className="text-sm text-zinc-600">
        Approved by {submission.approvedBy}
        {submission.approvalNote && ` (${submission.approvalNote})`} · submitted by {submission.submittedBy}
        {submission.originalFileName && ` · file: ${submission.originalFileName}`}
      </p>
      <div className="mt-3 grid gap-3">
        <AiNote ai={firm.ai} />
        <div>
          <Button
            icon={busy === "ai" ? <Spinner size="tiny" /> : <Sparkle20Regular />}
            disabled={!firm.ai.available || busy !== null}
            onClick={prefill}
          >
            Pre-fill with AI
          </Button>
        </div>
        <Field label="Title" required {...aiProps("title")}>
          <Input value={title} onChange={(_, d) => setTitle(d.value)} maxLength={120} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Document type" {...aiProps("docType")}>
            <Dropdown value={docType} selectedOptions={[docType]} onOptionSelect={(_, d) => d.optionValue && setDocType(d.optionValue)}>
              {config.docTypes.map((t) => (
                <Option key={t} value={t}>
                  {t}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Field label="Effective month" {...aiProps("effectiveDate")}>
            <Input type="month" value={effectiveDate} onChange={(_, d) => d.value && setEffectiveDate(d.value)} />
          </Field>
          <Field label="Who can see it" {...aiProps("audience")}>
            <Dropdown
              value={AUDIENCE_LABELS[audience]}
              selectedOptions={[audience]}
              onOptionSelect={(_, d) => d.optionValue && setAudience(d.optionValue as Role)}
            >
              {AUDIENCES.map((a) => (
                <Option key={a} value={a}>
                  {AUDIENCE_LABELS[a]}
                </Option>
              ))}
            </Dropdown>
          </Field>
        </div>
        <div>
          <Button size="small" disabled={!firm.ai.available || busy !== null} onClick={checkAudience}>
            Check content against this audience with AI
          </Button>
          {/* Advisory only (Rise/Folio stretch feature): the publisher decides. */}
          {check && check.audience === audience && (
            <MessageBar layout="multiline" intent={check.matchesAudience ? "success" : "warning"} className="mt-2">
              <MessageBarBody>
                {check.matchesAudience
                  ? `Nothing stood out as too sensitive for ${AUDIENCE_LABELS[audience]}.`
                  : `Possible concerns for ${AUDIENCE_LABELS[audience]}: ${check.concerns.join("; ")}. Suggested audience: ${AUDIENCE_LABELS[check.suggestedAudience]}.`}
              </MessageBarBody>
            </MessageBar>
          )}
        </div>
        <Field
          label="Replaces an existing document?"
          {...aiProps("replacesId")}
          hint={
            !ai.filled.has("replacesId") && likely && replacesId === NEW_DOCUMENT
              ? `Possible match: ${likely.title} v${likely.version}`
              : aiProps("replacesId").hint
          }
        >
          <Dropdown
            value={replaced ? `${replaced.title} (v${replaced.version})` : "No, this is a new document"}
            selectedOptions={[replacesId]}
            onOptionSelect={(_, d) => d.optionValue && setReplacesId(d.optionValue)}
          >
            <Option value={NEW_DOCUMENT}>No, this is a new document</Option>
            {options.map((o) => (
              <Option key={o.id} value={o.id} text={`${o.title} (v${o.version})`}>
                {o.title} (v{o.version})
              </Option>
            ))}
          </Dropdown>
        </Field>
        <Field label="Change note for the announcement" {...aiProps("changeNote")}>
          <Textarea value={changeNote} onChange={(_, d) => setChangeNote(d.value)} maxLength={500} resize="vertical" />
        </Field>
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3 text-sm">
          <p>
            <span className="font-semibold">File name:</span> <code className="break-all">{preview}</code>
          </p>
          <p>
            <span className="font-semibold">Folder:</span> {submission.department} / {config.publishedFolder}
          </p>
          {replaced && <p>The current version (v{replaced.version}) will be retired automatically.</p>}
        </div>
        <ErrorBar message={error} />
        <div>
          <Button appearance="primary" disabled={busy !== null || !title.trim()} onClick={publish}>
            Publish
          </Button>
        </div>
      </div>
    </Card>
  );
}

function PublishedList() {
  const { role, refreshLibrary } = useDemoRole();
  const list = useSubmissions("published", role);
  const [error, setError] = useState<string | null>(null);
  async function unpublish(id: string) {
    try {
      await apiFetch(`/api/submissions/${id}`, role, { body: { type: "unpublish", comment: "Retired by publisher" } });
      list.reload();
      refreshLibrary();
    } catch (err) {
      setError((err as Error).message);
    }
  }
  return (
    <section aria-labelledby="published-heading" className="mt-8">
      <h2 id="published-heading" className="mb-3 font-heading text-xl font-bold text-brand-charcoal">
        Published documents
      </h2>
      <ErrorBar message={error ?? list.error} />
      <ul className="grid gap-2">
        {list.items.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center gap-2 rounded border border-zinc-200 bg-white p-3 text-sm">
            <code className="break-all">{s.publish?.fileName}</code>
            <span className="text-zinc-600">{s.publish && AUDIENCE_LABELS[s.publish.audience]}</span>
            <Button size="small" className="ml-auto" onClick={() => unpublish(s.id)}>
              Unpublish
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PublishQueue() {
  const { role } = useDemoRole();
  const [firm] = useFirmConfig();
  const list = useSubmissions(role === "manager" ? "publish" : "mine", role);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [published, setPublished] = useState<string | null>(null);
  const selected = list.items.find((s) => s.id === selectedId);

  return (
    <RoleGate allowed={["manager"]} message="The publish queue is for publishers (managers). Switch Viewing as to Manager to try it.">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section aria-labelledby="queue-heading">
          <h2 id="queue-heading" className="mb-3 font-heading text-xl font-bold text-brand-charcoal">
            Approved, ready to publish
          </h2>
          {published && (
            <MessageBar layout="multiline" intent="success" className="mb-3">
              <MessageBarBody>Published as {published}. Everyone who can see it has been notified.</MessageBarBody>
            </MessageBar>
          )}
          <ErrorBar message={list.error} />
          {list.loading ? (
            <Spinner size="small" label="Loading" />
          ) : list.items.length === 0 ? (
            <p className="text-sm text-zinc-600">Nothing approved is waiting.</p>
          ) : (
            <ul className="grid gap-2">
              {list.items.map((s) => (
                <li key={s.id}>
                  <Card
                    className="p-3!"
                    selected={s.id === selectedId}
                    onSelectionChange={() => {
                      setSelectedId(s.id);
                      setPublished(null);
                    }}
                  >
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-sm text-zinc-600">
                      {s.department} · {s.docType}
                    </p>
                    <HistoryList submission={s} />
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
        <div>
          {selected && firm ? (
            <SmartPublish
              key={selected.id}
              submission={selected}
              firm={firm}
              onPublished={(name) => {
                setPublished(name);
                setSelectedId(null);
                list.reload();
              }}
            />
          ) : (
            <p className="text-sm text-zinc-600">Choose an approved submission to publish it.</p>
          )}
        </div>
      </div>
      <PublishedList />
    </RoleGate>
  );
}
