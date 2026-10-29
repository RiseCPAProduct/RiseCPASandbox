import type { Metadata } from "next";
import SubmitView from "../components/publishing/submit-view";

export const metadata: Metadata = { title: "Publishing - RISE CPA Intranet" };

export default function PublishingPage() {
  return <SubmitView />;
}
