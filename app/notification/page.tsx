import type { Metadata } from "next";
import { NotificationCenter } from "@/components/notification/NotificationCenter";

export const metadata: Metadata = {
  title: "Notifications | Mutiara-Connect",
};

export default function NotificationPage() {
  return <NotificationCenter />;
}
