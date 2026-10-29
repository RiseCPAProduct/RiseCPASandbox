"use client";

import { useState } from "react";
import { Button, Card, Dropdown, Field, Input, MessageBar, MessageBarBody, Option, Spinner, Switch } from "@fluentui/react-components";
import { AUDIENCE_LABELS, type FirmConfig } from "@/lib/firm-config";
import type { Role } from "@/lib/placeholder-documents";
import { apiFetch } from "@/lib/publishing/client";
import { buildName, validateTemplate } from "@/lib/publishing/naming";
import { useDemoRole } from "../demo-role";
import { ErrorBar, RoleGate, useFirmConfig } from "./shared";

const AUDIENCES = Object.keys(AUDIENCE_LABELS) as Role[];

// Publishing rules editor (Rise/Folio MVP, sections 4 and 7): document
// types, naming template with a live preview, default audience, lead
// partners and the AI toggle. The server checks everything again on save.
function SettingsForm({ config, onSaved }: { config: FirmConfig; onSaved: () => void }) {
  const { role } = useDemoRole();
  const [docTypes, setDocTypes] = useState(config.docTypes.join(", "));
  const [template, setTemplate] = useState(config.namingTemplate);
  const [audience, setAudience] = useState<Role>(config.defaultAudience);
  const [aiEnabled, setAiEnabled] = useState(config.aiEnabled);
  const [clientAiEnabled, setClientAiEnabled] = useState(config.clientFiling.aiEnabled);
  const [leads, setLeads] = useState<Record<string, string>>(
    Object.fromEntries(config.departments.map((d) => [d.name, d.leadPartner])),
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const templateErrors = validateTemplate(template);
  const types = docTypes
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const preview = buildName(template, {
    dept: config.departments[0]?.code ?? "HR",
    type: types[0] ?? "Policy",
    title: "Employee Handbook",
    version: 8,
    date: "2027-01",
  });

  async function save() {
    setError(null);
    setSaved(false);
    try {
      await apiFetch("/api/config", role, {
        method: "PUT",
        body: { docTypes: types, namingTemplate: template, defaultAudience: audience, aiEnabled, clientAiEnabled, leadPartners: leads },
      });
      setSaved(true);
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <Card className="p-4!">
      <div className="grid gap-4">
        <Field
          label="Naming template"
          hint={templateErrors.length ? undefined : "Tokens: {DEPT} {TYPE} {TITLE} {VERSION} {DATE}"}
          validationState={templateErrors.length ? "error" : "none"}
          validationMessage={templateErrors.join(" ") || undefined}
        >
          <Input value={template} onChange={(_, d) => setTemplate(d.value)} maxLength={120} />
        </Field>
        <p className="text-sm">
          <span className="font-semibold">Preview:</span> <code className="break-all">{preview}</code>
        </p>
        <Field label="Document types" hint="Comma-separated, one word each, e.g. ProcessDoc">
          <Input value={docTypes} onChange={(_, d) => setDocTypes(d.value)} />
        </Field>
        <Field label="Default audience for new publishes">
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
        <fieldset className="grid gap-2 sm:grid-cols-2">
          <legend className="mb-1 text-sm font-semibold">Lead partner per department (reviews its submissions)</legend>
          {config.departments.map((d) => (
            <Field key={d.name} label={`${d.name} (${d.code})`}>
              <Input value={leads[d.name] ?? ""} onChange={(_, v) => setLeads({ ...leads, [d.name]: v.value })} />
            </Field>
          ))}
        </fieldset>
        <Switch
          checked={aiEnabled}
          onChange={(_, d) => setAiEnabled(d.checked)}
          label="AI suggestions (pre-fills forms; a person always checks and approves)"
        />
        <Switch
          checked={clientAiEnabled}
          onChange={(_, d) => setClientAiEnabled(d.checked)}
          label="AI on client files (Smart File; reads the file name only, never the contents)"
        />
        <ErrorBar message={error} />
        {saved && (
          <MessageBar layout="multiline" intent="success">
            <MessageBarBody>Saved. New rules apply to the next publish; published names don&apos;t change.</MessageBarBody>
          </MessageBar>
        )}
        <div>
          <Button appearance="primary" disabled={templateErrors.length > 0} onClick={save}>
            Save settings
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function SettingsView() {
  const [firm, reload] = useFirmConfig();
  return (
    <RoleGate allowed={["partner"]} message="Settings are for partners with admin ability. Switch Viewing as to Partner to try it.">
      <h2 className="mb-3 font-heading text-xl font-bold text-brand-charcoal">Publishing rules for {firm?.config.firmName}</h2>
      {firm ? <SettingsForm config={firm.config} onSaved={reload} /> : <Spinner size="small" label="Loading" />}
    </RoleGate>
  );
}
