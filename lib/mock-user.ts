import type { Role } from "./placeholder-documents";

// Fictional signed-in user for the sandbox. There is no real auth.
export const mockUser: { firstName: string; role: Role } = {
  firstName: "Antonio",
  role: "staff",
};

export const ROLE_LABELS: Record<Role, string> = {
  staff: "Staff",
  manager: "Manager",
  partner: "Partner",
};
