"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { SIGN_IN_REQUIRED_PATHS, useHydrated, useUserSession } from "@/lib/session";
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
      <div className="flex min-h-[calc(100vh-123px)] flex-1 sm:mt-[54px]">
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
  const signInRequired = SIGN_IN_REQUIRED_PATHS.includes(pathname);

  useEffect(() => {
    if (!hydrated || loginRoute || !adminRoute) return;
    if (!user) router.replace("/login");
    else if (user.role !== "admin") router.replace("/");
  }, [hydrated, loginRoute, adminRoute, user, router]);

  if (loginRoute) return <>{children}</>;
  if (!hydrated || (adminRoute && user?.role !== "admin")) {
    return <main className="flex min-h-screen items-center justify-center text-sm text-[#5d6974]" role="status">Opening your workspace...</main>;
  }
  if (!user && signInRequired) {
    const feedback = pathname === "/feedback";
    return (
      <PublicPortalShell>
        <section className="mx-auto w-full max-w-[700px] px-5 py-12 text-[#202b35]">
          <h1 className="text-2xl font-bold">{feedback ? "Report an issue" : "Notification preferences"}</h1>
          <p className="mt-3 text-sm leading-6 text-[#5d6974]">
            {feedback ? "Sign in to submit a complaint or share feedback." : "Sign in to manage your notification preferences."}
            {" "}You can still browse construction updates and news as a guest.
          </p>
          <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="mt-6 inline-flex min-h-11 items-center justify-center rounded bg-[#1d3d67] px-5 text-sm font-semibold text-white hover:bg-[#173253]">Sign in to continue</Link>
        </section>
      </PublicPortalShell>
    );
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
