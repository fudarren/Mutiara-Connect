"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PortalIcon } from "./PortalIcons";

const base =
  "group flex h-[38px] items-center justify-center gap-2.5 rounded-[3px] px-2.5 text-[13px] font-semibold sm:justify-start";
const idle = "text-[#354144] hover:bg-[#087b84] hover:text-white";
const active = "nav-active bg-[#087b84] text-white";

type NavItem = { href: string; icon: string; label: string; active: boolean; badge?: string };

function NavLink({ href, icon, label, active: isActive, badge }: NavItem) {
  return (
    <Link
      className={`${base} ${isActive ? active : idle}`}
      href={href}
      aria-current={isActive ? "page" : undefined}
      title={label}
    >
      <PortalIcon name={icon} light={icon === "bell" && isActive} />
      <span className="hidden sm:inline">{label}</span>
      {badge && (
        <span className="ml-auto hidden min-w-5 place-items-center rounded-[10px] bg-[#c9e7f2] px-1 text-[11px] text-[#226477] sm:grid">
          {badge}
        </span>
      )}
    </Link>
  );
}

/** Active item is highlighted from the current path; rendered without it while the path streams in. */
export function Sidebar() {
  return <SidebarView pathname={usePathname()} />;
}

export function SidebarView({ pathname }: { pathname: string }) {
  const on = (prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);

  return (
    <aside
      aria-label="Portal navigation"
      className="fixed bottom-0 left-0 top-[54px] z-20 flex w-[60px] flex-col overflow-y-auto border-r border-[#e6edf1] bg-white px-1.5 py-5 sm:w-[215px] sm:px-2.5 sm:py-7"
    >
      <nav>
        <p className="mb-3.5 ml-2.5 hidden text-[10px] font-bold uppercase tracking-[0.07em] text-[#718083] sm:block">Portal modules</p>
        <NavLink href="/" icon="grid" label="Dashboard" active={pathname === "/"} />
        <NavLink href="/projects" icon="map" label="Construction Map" active={on("/projects")} />
        <NavLink href="/news" icon="megaphone" label="Construction News" active={on("/news")} />
        <NavLink href="/about" icon="problem" label="Report Issue" active={pathname === "/about"} />
      </nav>
      <nav className="mt-6">
        <p className="mb-3.5 ml-2.5 hidden text-[10px] font-bold uppercase tracking-[0.07em] text-[#718083] sm:block">Communications</p>
        <NavLink href="/notification" icon="bell" label="Notifications" active={on("/notification")} badge="3" />
        <NavLink href="/about" icon="settings" label="Preferences" active={false} />
      </nav>
      <nav className="mt-6">
        <p className="mb-3.5 ml-2.5 hidden text-[10px] font-bold uppercase tracking-[0.07em] text-[#718083] sm:block">Staff</p>
        <NavLink href="/admin" icon="grid" label="Admin Dashboard" active={pathname === "/admin"} />
        <NavLink href="/admin/construction" icon="shield" label="Manage Entries" active={on("/admin")} />
      </nav>
      <div className="mt-auto hidden rounded-[3px] bg-[#f0f4f6] p-2.5 text-[#637075] sm:block">
        <div className="mb-2 flex items-center gap-1 text-[10px] text-[#30434a]"><PortalIcon name="clock" size={14} />System Time</div>
        <strong className="block text-[11px] font-medium">George Town, Penang</strong>
        <small className="mt-1 block font-mono text-[10px]">MYT&nbsp; UTC+08:00</small>
      </div>
    </aside>
  );
}
