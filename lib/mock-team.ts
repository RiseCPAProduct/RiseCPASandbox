import type { Role } from "./placeholder-documents";

// Fictional direct reports for the manager and partner home page. Review
// files and coaching notes are manager-level content, so Staff never see them.

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  reviewFile: string;
  coachingNotes: string;
};

export const mockTeam: TeamMember[] = [
  {
    id: "team-1",
    name: "Priya Nair",
    title: "Staff Accountant",
    reviewFile: "Priya Nair - Performance Review 2026.xlsx",
    coachingNotes: "Ready to lead small audit files. Pair with a senior on the Harbourview year-end.",
  },
  {
    id: "team-2",
    name: "Daniel Okafor",
    title: "Tax Associate",
    reviewFile: "Daniel Okafor - Performance Review 2026.xlsx",
    coachingNotes: "Strong on T2 returns. Working on client communication; review two emails a week together.",
  },
  {
    id: "team-3",
    name: "Sofia Martins",
    title: "Co-op Student",
    reviewFile: "Sofia Martins - Performance Review 2026.xlsx",
    coachingNotes: "Settling in well. Walk through the Client File Naming SOP again before busy season.",
  },
];

export function teamForRole(role: Role): TeamMember[] {
  return role === "staff" ? [] : mockTeam;
}
