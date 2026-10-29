"use client";

import { useEffect, useState } from "react";
import { Button, DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderTitle, OverlayDrawer } from "@fluentui/react-components";
import { Dismiss20Regular, Open20Regular } from "@fluentui/react-icons";
import { formatDayMonth, formatMonthYear } from "@/lib/format-date";
import { placeholderDocuments, TYPE_LABELS, type DocumentItem } from "@/lib/placeholder-documents";
import { apiFetch } from "@/lib/publishing/client";
import type { DocumentRecord } from "@/lib/publishing/service";
import { useDemoRole } from "./demo-role";
import { TypeIcon } from "./results-table";

type Props = {
  item: DocumentItem | undefined;
  onClose: () => void;
};

const day = (iso: string) => formatDayMonth(iso.slice(0, 10)) + " " + iso.slice(0, 4);

// Who submitted, approved and published a document that came through the
// pipeline. Placeholder documents have no record and show nothing.
function UpdateRecord({ id }: { id: string }) {
  const { role } = useDemoRole();
  const [state, setState] = useState<{ id: string; record: DocumentRecord | null } | null>(null);
  useEffect(() => {
    let cancelled = false;
    apiFetch<{ record: DocumentRecord }>(`/api/library/${id}`, role).then(
      (res) => !cancelled && setState({ id, record: res.record }),
      () => !cancelled && setState({ id, record: null }),
    );
    return () => {
      cancelled = true;
    };
  }, [id, role]);
  const record = state?.id === id ? state.record : null;
  if (!record) return null;
  return (
    <section aria-labelledby="record-heading" className="mt-6">
      <h3 id="record-heading" className="font-heading font-bold text-brand-charcoal">
        Document record
      </h3>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="font-semibold text-brand-charcoal">Version</dt>
        <dd>v{record.version}</dd>
        <dt className="font-semibold text-brand-charcoal">Submitted</dt>
        <dd>
          {record.submittedBy}, {day(record.submittedAt)}
        </dd>
        {record.approvedBy && record.approvedAt && (
          <>
            <dt className="font-semibold text-brand-charcoal">Approved</dt>
            <dd>
              {record.approvedBy}, {day(record.approvedAt)}
              {record.approvalNote && <span className="block text-zinc-600">{record.approvalNote}</span>}
            </dd>
          </>
        )}
        <dt className="font-semibold text-brand-charcoal">Published</dt>
        <dd>
          {record.publishedBy}, {day(record.publishedAt)}
        </dd>
        {record.replaces && (
          <>
            <dt className="font-semibold text-brand-charcoal">Replaces</dt>
            <dd className="break-all">{record.replaces}</dd>
          </>
        )}
        {record.changeNote && (
          <>
            <dt className="font-semibold text-brand-charcoal">What changed</dt>
            <dd>{record.changeNote}</dd>
          </>
        )}
      </dl>
    </section>
  );
}

// The lo-fi's "look before you open" panel: details of the selected file.
// Full width on a phone, a side panel on wider screens.
export default function FileOverview({ item, onClose }: Props) {
  return (
    <OverlayDrawer
      position="end"
      open={item !== undefined}
      onOpenChange={(_, data) => !data.open && onClose()}
      style={{ width: "min(100vw, 26rem)" }}
    >
      {item && (
        <>
          <DrawerHeader>
            <DrawerHeaderTitle
              action={<Button appearance="subtle" aria-label="Close file overview" icon={<Dismiss20Regular />} onClick={onClose} />}
            >
              File overview
            </DrawerHeaderTitle>
          </DrawerHeader>
          <DrawerBody>
            <div className="flex items-start gap-3">
              <TypeIcon type={item.type} />
              <p className="font-heading text-lg font-bold text-zinc-900">{item.name}</p>
            </div>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="font-semibold text-brand-charcoal">Type</dt>
              <dd>{TYPE_LABELS[item.type]}</dd>
              <dt className="font-semibold text-brand-charcoal">Department</dt>
              <dd>{item.department}</dd>
              <dt className="font-semibold text-brand-charcoal">Location</dt>
              <dd>{item.path}</dd>
              <dt className="font-semibold text-brand-charcoal">Published</dt>
              <dd>{formatMonthYear(item.published)}</dd>
              <dt className="font-semibold text-brand-charcoal">Last update</dt>
              <dd>{formatMonthYear(item.modified)}</dd>
            </dl>
            {/* Only documents that came through the pipeline have a record */}
            {!placeholderDocuments.some((d) => d.id === item.id) && <UpdateRecord id={item.id} />}
          </DrawerBody>
          <DrawerFooter>
            <Button appearance="primary" icon={<Open20Regular />} disabled>
              Open file (demo)
            </Button>
          </DrawerFooter>
        </>
      )}
    </OverlayDrawer>
  );
}
