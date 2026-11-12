import type { Metadata } from "next";
import { AnnouncementsPage } from "@/components/admin/AnnouncementsPage";

export const metadata: Metadata = { title: "Announcements" };

export default function Page() {
  return <AnnouncementsPage />;
}
