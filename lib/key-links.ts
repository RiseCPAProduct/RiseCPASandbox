// The short list of links Staff and co-ops see on Home (Meeting 4,
// section 5). Each points at a staff-visible placeholder document.

export type KeyLink = { label: string; description: string; documentId: string };

export const KEY_LINKS: KeyLink[] = [
  { label: "Employee Policy Manual", description: "Vacation, leave, conduct and benefits.", documentId: "hr-2" },
  { label: "Client File Naming SOP", description: "How to name and file client documents.", documentId: "hr-8" },
  { label: "New Hire Checklist", description: "Everything to set up in your first weeks.", documentId: "hr-9" },
  { label: "Remote Desktop How-To", description: "Connect to the office from home.", documentId: "ops-5" },
  { label: "IT Service Ticket Guide", description: "How to log an Internet Technology ticket.", documentId: "ops-4" },
];

