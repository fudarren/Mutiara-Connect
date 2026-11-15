"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PortalIcon } from "./PortalIcons";
import { useUserSession } from "@/lib/session";
import { SignOutButton } from "./SignOutButton";
import { useNotifications } from "@/lib/notificationStore";

export function PortalHeader() {
  const { notifications, unreadIds, markRead } = useNotifications();
  const unreadNotifications = notifications.filter((notification) => unreadIds.has(notification.id)).slice(0, 3);
  const { user } = useUserSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showNotifications) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [showNotifications]);

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-[54px] items-center gap-3 border-b border-[#e5ebef] bg-white px-3 sm:gap-8 sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5 sm:min-w-[210px]">
        <span className="grid size-[34px] shrink-0 place-items-center">
          <img className="h-full w-full object-contain" src="/Mutiara-Connect-Logo.png" alt="Mutiara Connect logo" />
        </span>
        <span className="block">
          <strong className="block text-[20px] leading-5 sm:text-[15px] sm:leading-4">Mutiara Connect</strong>
          <small className="block text-[12px] leading-4 uppercase tracking-[0.04em] text-[#566166] sm:text-[10px] sm:leading-normal">Community Hub</small>
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
        <div ref={notificationMenuRef} className="fixed right-[66px] top-[11px] z-40 sm:relative sm:right-auto sm:top-auto sm:z-auto">
          <button type="button" onClick={() => setShowNotifications((current) => !current)} className="group relative grid size-[31px] place-items-center rounded bg-[#f4f6f7] text-[#526066] hover:bg-[#087b84] hover:text-white" aria-label={`Notifications (${unreadIds.size} unread)`} aria-expanded={showNotifications} aria-controls="notification-popover">
            <PortalIcon name="bell" />
            <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-[#c9222b] px-1 text-[10px] font-bold text-white">{unreadIds.size}</span>
          </button>
          {showNotifications && (
            <div id="notification-popover" role="dialog" aria-label="Unread notifications" className="absolute right-0 top-full z-50 mt-2 w-[285px] rounded-md border border-[#e2e9ed] bg-white p-3 text-[#182126] shadow-[0_5px_18px_rgba(20,44,53,0.18)]">
              <div className="flex items-center justify-between border-b border-[#edf1f3] pb-2">
                <strong className="text-[12px]">Unread notifications</strong>
                <span className="rounded-full bg-[#ffd9d8] px-2 py-0.5 text-[10px] font-bold text-[#a81920]">{unreadIds.size}</span>
              </div>
              <div className="mt-1 max-h-[260px] overflow-y-auto">
                {unreadNotifications.length === 0 && <p className="p-2 text-[11px] text-[#5c686d]">No unread notifications.</p>}
                {unreadNotifications.map((notification) => (
                  <Link key={notification.href} href={notification.href} onClick={() => { markRead(notification); setShowNotifications(false); }} className="block rounded p-2 hover:bg-[#fff1f1]">
                    <span className="block text-[9px] font-bold uppercase tracking-[0.04em] text-[#c9222b]">{notification.type}</span>
                    <strong className="mt-1 block text-[11px] leading-4">{notification.title}</strong>
                    <span className="mt-1 block text-[10px] leading-4 text-[#5c686d]">{notification.text}</span>
                  </Link>
                ))}
              </div>
              <Link href="/notification" onClick={() => setShowNotifications(false)} className="mt-2 block border-t border-[#edf1f3] pt-2 text-center text-[10px] font-bold text-[#087b84] hover:underline">View all notifications</Link>
            </div>
          )}
        </div>
        <div className="hidden items-center gap-2 text-right sm:flex">
          <span><strong className="block text-xs">{user?.name ?? "Guest"}</strong><small className="block text-[9px] text-[#566166]">{user ? (user.role === "admin" ? "Administrator" : "Public user") : "Browsing the portal"}</small></span>
          {user ? (
            <SignOutButton className="flex min-h-8 items-center justify-center rounded bg-[#e8edf1] px-3 text-xs font-semibold text-[#25363d]" />
          ) : (
            <Link href="/login" className="flex min-h-8 items-center justify-center rounded bg-[#1d3d67] px-3 text-xs font-semibold text-white hover:bg-[#173253]">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function InformationBar() {
  return (
    <div className="sticky top-[54px] z-20 flex h-[29px] shrink-0 items-center bg-[#deedfb] px-3 text-[10px] tracking-[0.03em] text-[#4e6775] sm:px-[22px]">
      <span className="flex items-center gap-1.5"><PortalIcon name="shield" size={14} />Mutiara LRT Connect &bull; Official Public Works Notification System</span>
    </div>
  );
}
