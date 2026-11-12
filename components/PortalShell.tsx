"use client";

import { usePathname } from "next/navigation";
import { PortalFooter } from "./PortalFooter";
import { InformationBar, PortalHeader } from "./PortalHeader";
import { Suspense } from "react";
import { MobileSidebar, Sidebar, SidebarView } from "./Sidebar";

function PublicPortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />
      <Suspense fallback={null}>
        <MobileSidebar />
      </Suspense>
      <div className="mt-[54px] flex min-h-[calc(100vh-123px)] flex-1">
        <Suspense fallback={<SidebarView pathname="" />}>
          <Sidebar />
        </Suspense>
        <main className="flex min-w-0 flex-1 flex-col sm:ml-[215px]">
          <InformationBar />
          {children}
        </main>
      </div>
      <PortalFooter />
    </div>
  );
}

function ShellForPath({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dashboardRoutes = ["/admin", "/admin/complaints", "/admin/updates", "/admin/announcements"];

  if (dashboardRoutes.includes(pathname)) return <>{children}</>;
  return <PublicPortalShell>{children}</PublicPortalShell>;
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="mx-auto min-h-screen max-w-7xl px-6 py-16 text-[#61716d] sm:px-10" role="status">Loading Mutiara-Connect...</div>}>
      <ShellForPath>{children}</ShellForPath>
    </Suspense>
  );
}
