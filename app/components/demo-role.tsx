"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { mockUser } from "@/lib/mock-user";
import { placeholderDocuments, type DocumentItem, type Role } from "@/lib/placeholder-documents";
import { apiFetch } from "@/lib/publishing/client";
import type { Notification } from "@/lib/publishing/service";
import { filterByRole } from "@/lib/search";

type DemoRole = {
  role: Role;
  setRole: (role: Role) => void;
  // Documents the current role may see. Use these everywhere, so hidden
  // items never reach search, counts, cards or the sidebar.
  items: DocumentItem[];
  // Publish announcements the role may see, newest first
  notifications: Notification[];
  // Reload published documents after a publish or unpublish
  refreshLibrary: () => void;
};

const DemoRoleContext = createContext<DemoRole | null>(null);

type Library = { role: Role; items: DocumentItem[]; notifications: Notification[] };

// Lives in the root layout, so the "Viewing as" role survives switching tabs.
// Placeholder items render straight away; documents that came through the
// publishing pipeline are fetched from the server for the current role.
export function DemoRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(mockUser.role);
  const [library, setLibrary] = useState<Library | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Omit<Library, "role">>("/api/library", role)
      .then((data) => !cancelled && setLibrary({ role, ...data }))
      .catch(() => !cancelled && setLibrary({ role, items: [], notifications: [] }));
    return () => {
      cancelled = true;
    };
  }, [role, version]);

  const refreshLibrary = useCallback(() => setVersion((v) => v + 1), []);

  const value = useMemo(() => {
    // Never show another role's library while the new one loads.
    const current = library?.role === role ? library : null;
    return {
      role,
      setRole,
      items: [...filterByRole(placeholderDocuments, role), ...(current?.items ?? [])],
      notifications: current?.notifications ?? [],
      refreshLibrary,
    };
  }, [role, library, refreshLibrary]);
  return <DemoRoleContext.Provider value={value}>{children}</DemoRoleContext.Provider>;
}

export function useDemoRole(): DemoRole {
  const value = useContext(DemoRoleContext);
  if (!value) throw new Error("useDemoRole must be used inside DemoRoleProvider");
  return value;
}
