export type TabId = "home" | "search" | "departments" | "publishing" | "help";

export type NavTab = { id: TabId; label: string; href: string };

// The hub's tabs, in the order they appear in the header. Ask HR is a
// floating button on every tab, not a tab of its own.
export const NAV_TABS: NavTab[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "search", label: "Search", href: "/search" },
  { id: "departments", label: "Departments", href: "/departments" },
  // Submit, review and publish: the one path into the Published folder
  { id: "publishing", label: "Publishing", href: "/publishing" },
  { id: "help", label: "Help", href: "/help" },
];

// Home matches only "/"; other tabs match their path and anything below it,
// so /departments/hr keeps Departments selected.
export function activeTab(pathname: string): TabId | undefined {
  if (pathname === "/") return "home";
  return NAV_TABS.find((tab) => tab.href !== "/" && (pathname === tab.href || pathname.startsWith(`${tab.href}/`)))?.id;
}
