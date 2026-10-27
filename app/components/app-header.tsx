"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Dropdown, Field, Option, Tab, TabList } from "@fluentui/react-components";
import { Navigation20Regular } from "@fluentui/react-icons";
import { ROLE_LABELS } from "@/lib/mock-user";
import { activeTab, NAV_TABS } from "@/lib/nav";
import type { Role } from "@/lib/placeholder-documents";
import { useDemoRole } from "./demo-role";
import DepartmentSidebar from "./department-sidebar";
import OneDriveButton from "./onedrive-button";

const ROLES = Object.keys(ROLE_LABELS) as Role[];

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole } = useDemoRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="border-b-4 border-brand-green bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 pt-3">
        <Button
          appearance="subtle"
          icon={<Navigation20Regular />}
          aria-label="Open departments sidebar"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen(true)}
        />
        <Link href="/" className="flex items-center rounded focus-visible:outline-2 focus-visible:outline-brand-green">
          <span className="font-heading text-xl font-bold tracking-wide text-brand-charcoal">
            RISE <span className="text-brand-green">CPA</span>
          </span>
          <span className="ml-3 border-l border-zinc-300 pl-3 text-sm text-brand-charcoal">Intranet</span>
        </Link>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <OneDriveButton />
          <Field label="Viewing as (demo)" orientation="horizontal" size="small" className="items-center">
            <Dropdown
              size="small"
              className="min-w-0! w-28"
              value={ROLE_LABELS[role]}
              selectedOptions={[role]}
              onOptionSelect={(_, data) => data.optionValue && setRole(data.optionValue as Role)}
            >
              {ROLES.map((r) => (
                <Option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </Option>
              ))}
            </Dropdown>
          </Field>
        </div>
      </div>
      <nav aria-label="Hub tabs" className="mx-auto max-w-6xl overflow-x-auto px-2">
        <TabList
          selectedValue={activeTab(pathname) ?? null}
          onTabSelect={(_, data) => {
            const tab = NAV_TABS.find((t) => t.id === data.value);
            if (tab) router.push(tab.href);
          }}
        >
          {NAV_TABS.map((tab) => (
            <Tab key={tab.id} value={tab.id} onMouseEnter={() => router.prefetch(tab.href)}>
              {tab.label}
            </Tab>
          ))}
        </TabList>
      </nav>
      <DepartmentSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </header>
  );
}
