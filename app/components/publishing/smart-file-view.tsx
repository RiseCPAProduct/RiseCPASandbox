"use client";

import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { Badge, Button, Card, Dropdown, Field, Input, MessageBar, MessageBarBody, Option, Spinner } from "@fluentui/react-components";
import { Sparkle20Regular } from "@fluentui/react-icons";
import type { ClientFileValues, Validated } from "@/lib/ai/tasks";
import { buildClientFileName, type ClientFile } from "@/lib/publishing/client-files";
import { apiFetch } from "@/lib/publishing/client";
import { useDemoRole } from "../demo-role";
import { AiNote, ErrorBar, useFirmConfig } from "./shared";

type Client = { code: string; name: string };
const THIS_YEAR = new Date().getFullYear();

// Smart File for client documents (Rise/Folio MVP, section 6): no partner
// approval, the firm's client template builds the name, a duplicate check
// asks before replacing, and only the client team sees the files.
export default function SmartFileView() {
  const { role } = useDemoRole();
  const [firm] = useFirmConfig();
  const [data, setData] = useState<{ role: string; files: ClientFile[]; clients: Client[] } | null>(null);
  const [fileName, setFileName] = useState("");
  const [client, setClient] = useState("");
  const [year, setYear] = useState(String(THIS_YEAR));
  const [engagement, setEngagement] = useState("");
  const [docType, setDocType] = useState("");
  const [detail, setDetail] = useState("");
  const [ai, setAi] = useState<{ filled: Set<string>; low: Set<string> }>({ filled: new Set(), low: new Set() });
  const [duplicate, setDuplicate] = useState<ClientFile | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    apiFetch<{ files: ClientFile[]; clients: Client[] }>("/api/client-files", role).then(
      (res) => setData({ role, ...res }),
      (err: Error) => setError(err.message),
    );
  }, [role]);
  useEffect(load, [load]);

  const rules = firm?.config.clientFiling;
  const current = data?.role === role ? data : null;

  function pick(e: ChangeEvent<HTMLInputElement>) {
    setFileName(e.target.files?.[0]?.name ?? "");
    setDuplicate(null);
    setMessage(null);
  }

  async function suggest() {
    setBusy(true);
    setError(null);
    try {
      const { suggestion } = await apiFetch<{ suggestion: Validated<ClientFileValues> }>("/api/ai/suggest-client-file", role, {
        body: { fileName },
      });
      const v = suggestion.values;
      if (v.client) setClient(v.client);
      if (v.year) setYear(String(v.year));
      if (v.engagement) setEngagement(v.engagement);
      if (v.docType) setDocType(v.docType);
      if (v.detail !== undefined) setDetail(v.detail);
      setAi({ filled: new Set(Object.keys(v)), low: new Set(suggestion.lowConfidence) });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function file(replace = false) {
    setBusy(true);
    setError(null);
    try {
      const res = await apiFetch<{ file?: ClientFile; duplicate?: ClientFile }>("/api/client-files", role, {
        body: { client, year: Number(year), engagement, docType, detail, originalFileName: fileName, replace },
      });
      if (res.duplicate) {
        setDuplicate(res.duplicate);
      } else if (res.file) {
        setDuplicate(null);
        setMessage(`Filed as ${res.file.fileName} in ${res.file.folder}.`);
        setFileName("");
        setAi({ filled: new Set(), low: new Set() });
        load();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function finalize(id: string) {
    try {
      await apiFetch(`/api/client-files/${id}`, role, { body: {} });
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const aiProps = (key: string) =>
    ai.low.has(key)
      ? { validationState: "warning" as const, validationMessage: "AI was unsure here. Please check." }
      : ai.filled.has(key)
        ? { hint: "Suggested by AI from the file name" }
        : {};

  const preview =
    rules && client && engagement && docType
      ? buildClientFileName(rules.namingTemplate, { client, year: Number(year), engagement, docType, detail })
      : null;
  const ready = Boolean(preview && fileName && /^\d{4}$/.test(year));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <Card className="p-4!">
        <h2 className="font-heading text-xl font-bold text-brand-charcoal">File a client document</h2>
        <p className="text-sm text-zinc-600">No partner approval. Only the client&apos;s team can see it.</p>
        <div className="mt-3 grid gap-3">
          <AiNote ai={firm?.clientAi} />
          <Field label="File" required>
            <input
              type="file"
              onChange={pick}
              className="text-sm file:mr-3 file:rounded file:border file:border-zinc-300 file:bg-white file:px-3 file:py-1"
            />
          </Field>
          <div>
            <Button
              icon={busy ? <Spinner size="tiny" /> : <Sparkle20Regular />}
              disabled={!firm?.clientAi.available || !fileName || busy}
              onClick={suggest}
            >
              Suggest from file name
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Client" required {...aiProps("client")}>
              <Dropdown
                placeholder="Choose a client"
                value={current?.clients.find((c) => c.code === client)?.name ?? ""}
                selectedOptions={client ? [client] : []}
                onOptionSelect={(_, d) => d.optionValue && setClient(d.optionValue)}
              >
                {current?.clients.map((c) => (
                  <Option key={c.code} value={c.code}>
                    {c.name}
                  </Option>
                ))}
              </Dropdown>
            </Field>
            <Field label="Year" required {...aiProps("year")}>
              <Input value={year} onChange={(_, d) => setYear(d.value)} inputMode="numeric" maxLength={4} />
            </Field>
            <Field label="Engagement" required {...aiProps("engagement")}>
              <Dropdown
                placeholder="Choose"
                value={engagement}
                selectedOptions={engagement ? [engagement] : []}
                onOptionSelect={(_, d) => d.optionValue && setEngagement(d.optionValue)}
              >
                {rules?.engagementTypes.map((t) => (
                  <Option key={t} value={t}>
                    {t}
                  </Option>
                ))}
              </Dropdown>
            </Field>
            <Field label="Document type" required {...aiProps("docType")}>
              <Dropdown
                placeholder="Choose"
                value={docType}
                selectedOptions={docType ? [docType] : []}
                onOptionSelect={(_, d) => d.optionValue && setDocType(d.optionValue)}
              >
                {rules?.docTypes.map((t) => (
                  <Option key={t} value={t}>
                    {t}
                  </Option>
                ))}
              </Dropdown>
            </Field>
          </div>
          <Field label="Detail (optional)" hint="e.g. Dec, or an account name" {...aiProps("detail")}>
            <Input value={detail} onChange={(_, d) => setDetail(d.value)} maxLength={40} />
          </Field>
          {preview && (
            <p className="rounded border border-zinc-200 bg-zinc-50 p-3 text-sm">
              <span className="font-semibold">File name:</span> <code className="break-all">{preview}</code>
            </p>
          )}
          {duplicate && (
            <MessageBar layout="multiline" intent="warning">
              <MessageBarBody>
                This looks like an existing file ({duplicate.fileName}, {duplicate.versions.length} version
                {duplicate.versions.length === 1 ? "" : "s"}). Replace it? The old version stays in its history.
                <span className="mt-2 flex gap-2">
                  <Button size="small" appearance="primary" onClick={() => file(true)}>
                    Replace
                  </Button>
                  <Button size="small" onClick={() => setDuplicate(null)}>
                    Cancel
                  </Button>
                </span>
              </MessageBarBody>
            </MessageBar>
          )}
          {message && (
            <MessageBar layout="multiline" intent="success">
              <MessageBarBody>{message}</MessageBarBody>
            </MessageBar>
          )}
          <ErrorBar message={error} />
          <div>
            <Button appearance="primary" disabled={!ready || busy} onClick={() => file()}>
              File it
            </Button>
          </div>
        </div>
      </Card>

      <section aria-labelledby="client-files-heading">
        <h2 id="client-files-heading" className="mb-3 font-heading text-xl font-bold text-brand-charcoal">
          My clients&apos; files
        </h2>
        {!current ? (
          <Spinner size="small" label="Loading" />
        ) : current.files.length === 0 ? (
          <p className="text-sm text-zinc-600">No files for your clients yet.</p>
        ) : (
          <ul className="grid gap-2">
            {current.files.map((f) => (
              <li key={f.id} className="rounded border border-zinc-200 bg-white p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <code className="break-all font-semibold">{f.fileName}</code>
                  <Badge appearance="tint" color={f.status === "final" ? "success" : "informative"}>
                    {f.status === "final" ? "Final" : "Filed"}
                  </Badge>
                </div>
                <p className="text-zinc-600">
                  {f.folder} · {f.versions.length} version{f.versions.length === 1 ? "" : "s"}, last by {f.versions.at(-1)?.by}
                </p>
                {f.status === "filed" && (
                  <Button size="small" className="mt-2" onClick={() => finalize(f.id)}>
                    Mark final
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
