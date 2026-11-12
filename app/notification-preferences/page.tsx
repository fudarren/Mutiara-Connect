import type { Metadata } from "next";
import { NotificationPreferences } from "@/components/notification/NotificationPreferences";

export const metadata: Metadata = {
  title: "Notification Preferences | Mutiara-Connect",
};

export default function NotificationPreferencesPage() {
  return <NotificationPreferences />;
}
