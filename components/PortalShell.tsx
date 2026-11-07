import { PortalFooter } from "./PortalFooter";
import { OfficialBar, PortalHeader } from "./PortalHeader";
import { Sidebar } from "./Sidebar";

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />
      <div className="mt-[54px] flex min-h-[calc(100vh-123px)] flex-1">
        <Sidebar />
        <main className="ml-[60px] flex min-w-0 flex-1 flex-col sm:ml-[215px]">
          <OfficialBar />
          {children}
        </main>
      </div>
      <PortalFooter />
    </div>
  );
}
