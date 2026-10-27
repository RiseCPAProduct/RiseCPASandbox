"use client";

import { Button, Link, Popover, PopoverSurface, PopoverTrigger } from "@fluentui/react-components";
import { Cloud20Regular } from "@fluentui/react-icons";

// Placeholder for the signed-in user's personal OneDrive. Linking each
// employee to their own space is covered in docs/FEASIBILITY.md.
const ONEDRIVE_URL = "https://onedrive.live.com";

export default function OneDriveButton() {
  return (
    <Popover withArrow positioning="below-end">
      <PopoverTrigger disableButtonEnhancement>
        <Button appearance="outline" size="small" icon={<Cloud20Regular />}>
          My OneDrive
        </Button>
      </PopoverTrigger>
      <PopoverSurface aria-label="My OneDrive" className="max-w-72">
        <p className="text-sm font-semibold text-zinc-900">Demo</p>
        <p className="mt-1 text-sm text-brand-charcoal">In the real hub this opens your own OneDrive.</p>
        <Link href={ONEDRIVE_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block">
          Open OneDrive (placeholder)<span className="sr-only"> (opens in a new tab)</span>
        </Link>
      </PopoverSurface>
    </Popover>
  );
}
