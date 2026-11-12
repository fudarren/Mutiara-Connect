"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PortalIcon } from "./PortalIcons";

const base =
  "group flex h-[38px] items-center justify-center gap-2.5 rounded-[3px] px-2.5 text-[13px] font-semibold sm:justify-start";
const idle = "text-[#354144] hover:bg-[#087b84] hover:text-white";
const active = "nav-active bg-[#087b84] text-white";

type NavItem = { href: string; icon: string; label: string; active: boolean; badge?: string; onClick?: () => void; showLabel?: boolean };

function NavLink({ href, icon, label, active: isActive, badge, onClick, showLabel = false }: NavItem) {
  return (
    <Link
      className={`${base} ${showLabel ? "justify-start" : ""} ${isActive ? active : idle}`}
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      title={label}
    >
      <PortalIcon name={icon} light={icon === "bell" && isActive} />
      <span className={showLabel ? "inline" : "hidden sm:inline"}>{label}</span>
      {badge && (
        <span className={`${showLabel ? "grid" : "hidden sm:grid"} ml-auto min-w-5 place-items-center rounded-[10px] bg-[#c9e7f2] px-1 text-[11px] text-[#226477]`}>
          {badge}
        </span>
      )}
    </Link>
  );
}

function SidebarContents({ pathname, onNavigate, showLabels = false }: { pathname: string; onNavigate?: () => void; showLabels?: boolean }) {
  const on = (prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);

  return (
    <>
      <nav>
        <p className="mb-3.5 ml-2.5 hidden text-[10px] font-bold uppercase tracking-[0.07em] text-[#718083] sm:block">Portal modules</p>
        <NavLink href="/" icon="grid" label="Dashboard" active={pathname === "/"} onClick={onNavigate} showLabel={showLabels} />
        <NavLink href="/projects" icon="map" label="Construction Map" active={on("/projects")} onClick={onNavigate} showLabel={showLabels} />
        <NavLink href="/news" icon="megaphone" label="Construction News" active={on("/news")} onClick={onNavigate} showLabel={showLabels} />
        <NavLink href="/about" icon="problem" label="Report Issue" active={pathname === "/about"} onClick={onNavigate} showLabel={showLabels} />
      </nav>
      <nav className="mt-6">
        <p className="mb-3.5 ml-2.5 hidden text-[10px] font-bold uppercase tracking-[0.07em] text-[#718083] sm:block">Communications</p>
        <NavLink href="/notification" icon="bell" label="Notifications" active={on("/notification")} badge="3" onClick={onNavigate} showLabel={showLabels} />
        <NavLink href="/notification-preferences" icon="settings" label="Preferences" active={on("/notification-preferences")} onClick={onNavigate} showLabel={showLabels} />
      </nav>
      <nav className="mt-6">
        <p className="mb-3.5 ml-2.5 hidden text-[10px] font-bold uppercase tracking-[0.07em] text-[#718083] sm:block">Staff</p>
        <NavLink href="/admin/construction" icon="shield" label="Manage Entries" active={on("/admin")} onClick={onNavigate} showLabel={showLabels} />
      </nav>
    </>
  );
}

/** Active item is highlighted from the current path; rendered without it while the path streams in. */
export function Sidebar() {
  return <SidebarView pathname={usePathname()} />;
}

export function SidebarView({ pathname }: { pathname: string }) {
  return (
    <aside
      aria-label="Portal navigation"
      className="fixed bottom-0 left-0 top-[54px] z-20 hidden w-[215px] flex-col overflow-y-auto border-r border-[#e6edf1] bg-white px-2.5 py-7 sm:flex"
    >
      <SidebarContents pathname={pathname} />
      <div className="mt-auto hidden rounded-[3px] bg-[#f0f4f6] p-2.5 text-[#637075] sm:block">
        <div className="mb-2 flex items-center gap-1 text-[10px] text-[#30434a]"><PortalIcon name="clock" size={14} />System Time</div>
        <strong className="block text-[11px] font-medium">George Town, Penang</strong>
        <small className="mt-1 block font-mono text-[10px]">MYT&nbsp; UTC+08:00</small>
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        className="fixed right-3 top-[11px] z-40 grid size-[31px] place-items-center rounded bg-[#f4f6f7] text-[22px] leading-none text-[#526066] sm:hidden"
      >
        &#9776;
      </button>
      {open && <button type="button" aria-label="Close navigation menu" onClick={() => setOpen(false)} className="fixed inset-0 top-[54px] z-40 bg-[#142c35]/35 sm:hidden" />}
      <aside
        aria-label="Mobile portal navigation"
        className={`fixed bottom-0 right-0 top-[54px] z-50 flex w-[270px] flex-col overflow-y-auto border-l border-[#e6edf1] bg-white px-4 py-6 shadow-[-4px_0_16px_rgba(20,44,53,0.18)] transition-transform duration-300 ease-out sm:hidden ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="mb-5 flex items-center justify-between border-b border-[#e8edf0] pb-4">
          <div>
            <strong className="block text-[16px]">Portal menu</strong>
            <small className="text-[10px] text-[#718083]">Mutiara Connect</small>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close navigation menu" className="grid size-8 place-items-center rounded bg-[#f0f4f6] text-[#526066]"><PortalIcon name="close" size={13} /></button>
        </div>
        <SidebarContents pathname={pathname} onNavigate={() => setOpen(false)} showLabels />
      </aside>
    </>
  );
}
