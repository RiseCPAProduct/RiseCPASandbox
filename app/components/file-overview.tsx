"use client";

import { Button, DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderTitle, OverlayDrawer } from "@fluentui/react-components";
import { Dismiss20Regular, Open20Regular } from "@fluentui/react-icons";
import { formatMonthYear } from "@/lib/format-date";
import { TYPE_LABELS, type DocumentItem } from "@/lib/placeholder-documents";
import { TypeIcon } from "./results-table";

type Props = {
  item: DocumentItem | undefined;
  onClose: () => void;
};

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
