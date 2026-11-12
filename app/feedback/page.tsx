import type { Metadata } from "next";
import { FeedbackCenter } from "@/components/feedback/FeedbackCenter";

export const metadata: Metadata = {
  title: "Community Feedback | Mutiara-Connect",
  description: "Submit a complaint or feedback about the Mutiara Line construction works.",
};

export default function FeedbackPage() {
  return <FeedbackCenter />;
}
