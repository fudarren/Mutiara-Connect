"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AdminIcon } from "./AdminIcon";

const navigation = [
  { href: "/admin", label: "Overview", icon: "overview" },
  { href: "/admin/complaints", label: "Complaints", icon: "complaints" },
  { href: "/admin/updates", label: "Construction updates", icon: "construction" },
  { href: "/admin/announcements", label: "Announcements", icon: "announcements" },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin">
      <a className="admin-skip" href="#admin-main">Skip to content</a>
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin" aria-label="Mutiara Connect admin overview">
          <span className="admin-brand-mark" aria-hidden="true">
            <Image src="/Mutiara-Connect-Logo.png" alt="" width={76} height={76} loading="eager" />
          </span>
          <span><strong>Mutiara Connect</strong><small>Management portal</small></span>
        </Link>
        <nav className="admin-nav" aria-label="Admin navigation">
          {navigation.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={active ? "is-active" : ""} aria-current={active ? "page" : undefined}>
                <AdminIcon name={item.icon} size={19} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link className="admin-back-link" href="/"><AdminIcon name="external" size={16} /> Community portal</Link>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <strong>Management portal</strong>
          <div className="admin-identity">
            <span className="admin-avatar" aria-hidden="true">PN</span>
            <span><strong>Priya Nair</strong><small>Administrator</small></span>
          </div>
        </header>
        <main className="admin-main" id="admin-main" tabIndex={-1}>
          {children}
        </main>
        <footer className="admin-footer">
          <span>Copyright 2026 Mutiara Connect</span>
        </footer>
      </div>
    </div>
  );
}
