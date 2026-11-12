import type { Metadata } from "next";
import { ConstructionPage } from "@/components/admin/ConstructionPage";

export const metadata: Metadata = { title: "Construction Updates" };

export default function Page() {
  return <ConstructionPage />;
}
