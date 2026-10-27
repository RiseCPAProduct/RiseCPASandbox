import { DEPARTMENTS, type Department } from "./placeholder-documents";

// URL segment for a department page, e.g. "HR" -> "hr".
export function departmentSlug(department: Department): string {
  return department.toLowerCase();
}

// Undefined for an unknown slug, so the page can show not-found.
export function departmentFromSlug(slug: string): Department | undefined {
  const lower = slug.toLowerCase();
  return DEPARTMENTS.find((department) => departmentSlug(department) === lower);
}

export function departmentHref(department: Department, folder?: string): string {
  const base = `/departments/${departmentSlug(department)}`;
  return folder ? `${base}?${new URLSearchParams({ folder })}` : base;
}
