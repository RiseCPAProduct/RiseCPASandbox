import type { Metadata } from "next";
import SmartFileView from "../../components/publishing/smart-file-view";

export const metadata: Metadata = { title: "Smart File - RISE CPA Intranet" };

export default function SmartFilePage() {
  return <SmartFileView />;
}
