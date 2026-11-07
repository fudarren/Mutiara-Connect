import Link from "next/link";
import { PortalIcon } from "./PortalIcons";

const linkClass = "group flex h-[38px] items-center justify-center gap-2.5 rounded-[3px] px-2.5 text-[13px] font-semibold text-[#354144] hover:bg-[#087b84] hover:text-white sm:justify-start";

export function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-[54px] z-20 flex w-[60px] flex-col overflow-y-auto border-r border-[#e6edf1] bg-white px-1.5 py-5 sm:w-[215px] sm:px-2.5 sm:py-7">
      <div>
        <p className="mb-3.5 ml-2.5 hidden text-[10px] font-bold uppercase tracking-[0.07em] text-[#718083] sm:block">Portal modules</p>
        <Link className={linkClass} href="/"><PortalIcon name="grid" /><span className="hidden sm:inline">Dashboard</span></Link>
        <Link className={linkClass} href="/projects"><PortalIcon name="map" /><span className="hidden sm:inline">Construction Map</span></Link>
        <Link className={linkClass} href="/about"><PortalIcon name="megaphone" /><span className="hidden sm:inline">Report Issue</span></Link>
      </div>
      <div className="mt-6">
        <p className="mb-3.5 ml-2.5 hidden text-[10px] font-bold uppercase tracking-[0.07em] text-[#718083] sm:block">Communications</p>
        <Link className="group flex h-[38px] items-center justify-center gap-2.5 rounded-[3px] bg-[#087b84] px-2.5 text-[13px] font-semibold text-white sm:justify-start" href="/notification">
          <PortalIcon name="bell" light />
          <span className="hidden sm:inline">Notifications</span>
          <span className="ml-auto grid min-w-5 place-items-center rounded-[10px] bg-[#c9e7f2] px-1 text-[11px] text-[#226477]">3</span>
        </Link>
        <Link className={linkClass} href="/about"><PortalIcon name="settings" /><span className="hidden sm:inline">Preferences</span></Link>
      </div>
      <div className="mt-auto hidden rounded-[3px] bg-[#f0f4f6] p-2.5 text-[#637075] sm:block">
        <div className="mb-2 flex items-center gap-1 text-[10px] text-[#30434a]"><PortalIcon name="clock" size={14} />System Time</div>
        <strong className="block text-[11px] font-medium">George Town, Penang</strong>
        <small className="mt-1 block font-mono text-[10px]">MYT&nbsp; UTC+08:00</small>
      </div>
    </aside>
  );
}
