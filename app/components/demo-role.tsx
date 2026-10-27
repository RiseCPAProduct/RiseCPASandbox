"use client";
 
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { mockUser } from "@/lib/mock-user";
import { placeholderDocuments, type DocumentItem, type Role } from "@/lib/placeholder-documents";
import { filterByRole } from "@/lib/search";

type DemoRole = {
  role: Role;
  setRole: (role: Role) => void;
  // Documents the current role may see. Use these everywhere, so hidden
  // items never reach search, counts, cards or the sidebar.
  items: DocumentItem[];
};

const DemoRoleContext = createContext<DemoRole | null>(null);

// Lives in the root layout, so the "Viewing as" role survives switching tabs.
export function DemoRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(mockUser.role);
  const value = useMemo(() => ({ role, setRole, items: filterByRole(placeholderDocuments, role) }), [role]);
  return <DemoRoleContext.Provider value={value}>{children}</DemoRoleContext.Provider>;
}

export function useDemoRole(): DemoRole {
  const value = useContext(DemoRoleContext);
  if (!value) throw new Error("useDemoRole must be used inside DemoRoleProvider");
  return value;
}
