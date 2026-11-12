import type { Metadata } from "next";
import { ComplaintsPage } from "@/components/admin/ComplaintsPage";

export const metadata: Metadata = { title: "Complaints" };

export default function Page() {
  return <ComplaintsPage />;
}
