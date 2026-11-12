import Link from "next/link";
import { PortalIcon } from "./PortalIcons";

export function PortalHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-[54px] items-center gap-3 border-b border-[#e5ebef] bg-white px-3 sm:gap-8 sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5 sm:min-w-[210px]">
        <span className="grid size-[34px] shrink-0 place-items-center">
          <img className="h-full w-full object-contain" src="/Mutiara-Connect-Logo.png" alt="Mutiara Connect logo" />
        </span>
        <span className="hidden sm:block">
          <strong className="block text-[15px] leading-4">Mutiara Connect</strong>
          <small className="block text-[10px] uppercase tracking-[0.04em] text-[#566166]">Community Hub</small>
        </span>
      </div>
      <form
        action="/projects"
        method="get"
        role="search"
        className="hidden h-[31px] w-[215px] items-center gap-2 rounded-[3px] bg-[#f1f4f6] px-2.5 text-xs text-[#586368] sm:flex"
      >
        <PortalIcon name="search" size={16} />
        <input
          name="q"
          type="search"
          aria-label="Search construction updates"
          className="w-full min-w-0 bg-transparent outline-none placeholder:text-[#586368]"
          placeholder="Search roads, areas or updates"
        />
      </form>
      <div className="ml-auto flex items-center gap-5">
        <Link href="/notification" className="group relative grid size-[31px] place-items-center rounded bg-[#f4f6f7] text-[#526066] hover:bg-[#087b84] hover:text-white" aria-label="Notifications (3 unread)">
          <PortalIcon name="bell" />
          <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-[#c9222b] px-1 text-[10px] font-bold text-white">3</span>
        </Link>
        <div className="hidden items-center gap-2 text-right sm:flex">
          <span><strong className="block text-xs">Ahmad R.</strong><small className="block text-[9px] text-[#566166]">Public Stakeholder</small></span>
          <span className="grid size-[27px] place-items-center rounded-full bg-[#087b84] text-white">A</span>
        </div>
      </div>
    </header>
  );
}

export function InformationBar() {
  return (
    <div className="flex h-[29px] items-center bg-[#deedfb] px-3 text-[10px] tracking-[0.03em] text-[#4e6775] sm:px-[22px]">
      <span className="flex items-center gap-1.5"><PortalIcon name="shield" size={14} />Mutiara Connect community works information</span>
    </div>
  );
}
