import type { Metadata } from "next";
import { PortalShell } from "@/components/PortalShell";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Mutiara-Connect | Penang LRT updates",
  description: "A community portal for following Penang LRT construction news.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <PortalShell>{children}</PortalShell>
      </body>
    </html>
  );
}
