import type { Role } from "../placeholder-documents";
import type { Actor } from "./types";

// Fictional people behind the "Viewing as (demo)" switcher. There is no
// sign-in yet; the switcher picks who is acting.
export const DEMO_PEOPLE: Record<Role, Actor> = {
  staff: { name: "Antonio Silva", role: "staff" },
  manager: { name: "Maya Chen", role: "manager" },
  partner: { name: "Nolan Reyes", role: "partner" },
};

export const ROLE_HEADER = "x-demo-role";

export function actorFromRole(value: string | null): Actor {
  return value === "manager" || value === "partner" ? DEMO_PEOPLE[value] : DEMO_PEOPLE.staff;
}
