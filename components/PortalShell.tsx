import { PortalFooter } from "./PortalFooter";
import { OfficialBar, PortalHeader } from "./PortalHeader";
import { Suspense } from "react";
import { MobileSidebar, Sidebar, SidebarView } from "./Sidebar";

export function PortalShell({ children }: { children: React.ReactNode }) {
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
          <OfficialBar />
          {children}
        </main>
      </div>
      <PortalFooter />
    </div>
  );
}
