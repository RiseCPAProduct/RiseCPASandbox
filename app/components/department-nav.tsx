"use client";

import Link from "next/link";
import { Card, CardHeader } from "@fluentui/react-components";
import { Folder16Regular } from "@fluentui/react-icons";
import { departmentHref } from "@/lib/departments";
import { getDepartmentFolders, getDepartments } from "@/lib/search";
import { useDemoRole } from "./demo-role";

// Department cards for the Departments tab and the manager / partner home
// page. Each card and folder links to the department page.
export default function DepartmentNav() {
  const { items } = useDemoRole();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {getDepartments(items).map((department) => {
        const total = items.filter((item) => item.department === department).length;
        return (
          <Card key={department}>
            <CardHeader
              header={
                <Link
                  href={departmentHref(department)}
                  className="rounded font-heading text-lg font-bold text-brand-charcoal hover:text-brand-green hover:underline"
                >
                  {department}
                </Link>
              }
              action={
                <span className="text-xs text-zinc-500">
                  {total} {total === 1 ? "item" : "items"}
                </span>
              }
            />
            <ul className="space-y-1">
              {getDepartmentFolders(items, department).map(({ folder, count }) => (
                <li key={folder}>
                  <Link
                    href={departmentHref(department, folder)}
                    className="flex items-center justify-between rounded px-2 py-1 text-sm text-brand-charcoal hover:bg-brand-green/10"
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
          </Card>
        );
      })}
    </div>
  );
}
