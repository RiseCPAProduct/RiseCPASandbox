import type { Metadata } from "next";
import ReviewQueue from "../../components/publishing/review-queue";

export const metadata: Metadata = { title: "Review queue - RISE CPA Intranet" };

export default function ReviewPage() {
  return <ReviewQueue />;
}
