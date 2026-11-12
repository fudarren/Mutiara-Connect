import type { Metadata } from "next";
import { ManageConstruction } from "@/components/construction/ManageConstruction";

export const metadata: Metadata = {
  title: "Manage Construction Entries | Mutiara-Connect",
};

export default function ManageConstructionPage() {
  return <ManageConstruction />;
}
