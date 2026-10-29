import type { Metadata } from "next";
import SettingsView from "../../components/publishing/settings-view";

export const metadata: Metadata = { title: "Publishing settings - RISE CPA Intranet" };

export default function SettingsPage() {
  return <SettingsView />;
}
