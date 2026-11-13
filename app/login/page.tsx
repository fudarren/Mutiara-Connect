import type { Metadata } from "next";
import { LoginPage } from "@/components/LoginPage";

export const metadata: Metadata = { title: "Sign in | Mutiara Connect" };

export default function Page() {
  return <LoginPage />;
}
