"use client";

import { usePathname, useRouter } from "next/navigation";
import { useHydrated, useUserSession } from "@/lib/session";
import { PortalFooter } from "./PortalFooter";
import { InformationBar, PortalHeader } from "./PortalHeader";
import { Suspense, useEffect } from "react";
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
  const router = useRouter();
  const hydrated = useHydrated();
  const { user } = useUserSession();
  const dashboardRoutes = ["/admin", "/admin/complaints", "/admin/updates", "/admin/announcements"];
  const loginRoute = pathname === "/login" || pathname === "/admin/login";
  const adminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  useEffect(() => {
    if (!hydrated || loginRoute) return;
    if (!user) router.replace("/login");
    else if (adminRoute && user.role !== "admin") router.replace("/");
  }, [hydrated, loginRoute, adminRoute, user, router]);

  if (loginRoute) return <>{children}</>;
  if (!hydrated || !user || (adminRoute && user.role !== "admin")) {
    return <main className="flex min-h-screen items-center justify-center text-sm text-[#5d6974]" role="status">Opening your workspace...</main>;
  }
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
