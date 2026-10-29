import type { Metadata } from "next";
import PublishQueue from "../../components/publishing/publish-queue";

export const metadata: Metadata = { title: "Publish queue - RISE CPA Intranet" };

export default function PublishPage() {
  return <PublishQueue />;
}
