import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import "@/styles/admin.css";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | Mutiara Connect",
    template: "%s | Mutiara Connect Admin",
  },
  description: "Manage community feedback, construction updates and announcements for the Mutiara Line.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
