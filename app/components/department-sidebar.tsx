"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button, DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer } from "@fluentui/react-components";
import { Dismiss20Regular, Folder16Regular } from "@fluentui/react-icons";
import { departmentHref } from "@/lib/departments";
import { getDepartmentFolders, getDepartments } from "@/lib/search";
import { useDemoRole } from "./demo-role";

type Props = {
  open: boolean;
  onClose: () => void;
};

// Pop-out left sidebar listing the departments the current role can see,
// each with its standard folders. Closed by default (Meeting 4, section 5).
export default function DepartmentSidebar({ open, onClose }: Props) {
  return (
    <OverlayDrawer position="start" open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DrawerHeader>
        <DrawerHeaderTitle
          action={<Button appearance="subtle" aria-label="Close departments sidebar" icon={<Dismiss20Regular />} onClick={onClose} />}
        >
          Departments
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        <Suspense>
          <DepartmentLinks onNavigate={onClose} />
        </Suspense>
      </DrawerBody>
    </OverlayDrawer>
  );
}

function DepartmentLinks({ onNavigate }: { onNavigate: () => void }) {
  const { items } = useDemoRole();
  const pathname = usePathname();
  const folderParam = useSearchParams().get("folder");

  return (
    <ul className="space-y-4 pb-4">
      {getDepartments(items).map((department) => {
        const href = departmentHref(department);
        const current = pathname === href;
        const total = items.filter((item) => item.department === department).length;
        return (
          <li key={department}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={current && !folderParam ? "page" : undefined}
              className={`flex items-baseline justify-between rounded px-2 py-1 font-heading text-base font-bold text-brand-charcoal hover:bg-brand-green/10 ${current ? "bg-brand-green/15" : ""}`}
            >
              {department}
              <span className="font-sans text-xs font-normal text-zinc-500">{total}</span>
            </Link>
            <ul className="mt-1 space-y-0.5 pl-3">
              {getDepartmentFolders(items, department).map(({ folder, count }) => (
                <li key={folder}>
                  <Link
                    href={departmentHref(department, folder)}
                    onClick={onNavigate}
                    aria-current={current && folderParam === folder ? "page" : undefined}
                    className="flex items-center justify-between rounded px-2 py-1 text-sm text-brand-charcoal hover:bg-brand-green/10 aria-[current=page]:bg-brand-green/15 aria-[current=page]:font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      <Folder16Regular className="text-brand-green" aria-hidden />
                      {folder}
                    </span>
                    <span className="text-xs text-zinc-500">{count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
