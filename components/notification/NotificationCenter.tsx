"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { PortalIcon } from "@/components/PortalIcons";

import { useNotifications } from "@/lib/notificationStore";
import { CONSTRUCTION_AS_OF } from "@/lib/constructionNotices";
import { matchesNotificationTime, type ConstructionNotification as Notification } from "@/lib/notifications";

const notificationTypes = [
  "All",
  "Urgent alerts",
  "Updates",
  "Resolved",
] as const;
const timeRanges = ["All time", "Last 7 days", "Last 30 days"] as const;
type NotificationTypeFilter = (typeof notificationTypes)[number];
type TimeRange = (typeof timeRanges)[number];

function matchesType(
  notification: Notification,
  selectedType: NotificationTypeFilter,
) {
  if (selectedType === "All") return true;
  if (selectedType === "Urgent alerts")
    return notification.type.startsWith("URGENT ALERT");
  if (selectedType === "Resolved")
    return notification.type.includes("RESOLVED");
  return notification.type === "UPDATE NOTIFICATION";
}

function getConstructionDetailsHref(notification: Notification) {
  return notification.href;
}

export function NotificationCenter() {
  const { notifications, unreadIds, markRead, markAllRead } = useNotifications();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState<NotificationTypeFilter>("All");
  const [timeFilter, setTimeFilter] = useState<TimeRange>("All time");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const filterPopoverRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showFilterOptions) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        filterPopoverRef.current &&
        !filterPopoverRef.current.contains(event.target as Node)
      )
        setShowFilterOptions(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowFilterOptions(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [showFilterOptions]);
  const matchingNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) =>
          [notification.title, notification.text, notification.meta, notification.extra].join(" ").toLowerCase().includes(query.trim().toLowerCase()) &&
          matchesType(notification, typeFilter) &&
          matchesNotificationTime(notification, timeFilter, CONSTRUCTION_AS_OF),
      ),
    [notifications, query, timeFilter, typeFilter],
  );
  const shownNotifications = useMemo(
    () =>
      matchingNotifications.filter(
        (notification) =>
          filter === "All" ||
          (filter === "Unread" && unreadIds.has(notification.id)) ||
          (filter === "Read" && !unreadIds.has(notification.id)),
      ),
    [filter, matchingNotifications, unreadIds],
  );
  const unreadCount = matchingNotifications.filter((notification) =>
    unreadIds.has(notification.id),
  ).length;
  const readCount = matchingNotifications.length - unreadCount;
  const activeFilterCount =
    Number(typeFilter !== "All") + Number(timeFilter !== "All time");
  const urgentNotification =
    notifications.find(
      (notification) => notification.type === "URGENT ALERT",
    ) ?? notifications[0];

  return (
    <div className="min-h-full bg-[#f5f8fa] px-3 py-6 text-[#181c1e] sm:px-5 sm:py-7">
      <div className="mx-auto w-full max-w-[1130px]">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#087b84]">
              Geo-zone: Penang Island
            </div>
            <h1 className="mt-1 flex items-center gap-2 text-[30px] leading-9 tracking-[-0.04em] font-bold">
              Notifications
              <span className="inline-flex h-6 min-w-[72px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-[#ffd9d8] px-3 text-[12px] leading-6 text-[#a81920]">
                <i className="size-1.5 rounded-full bg-[#c9222b]" />{unreadIds.size} unread
              </span>
            </h1>
            <p className="mt-1 text-[14px] leading-[21px] text-[#5d686c]">
              Stay updated on alerts, environmental advisories, and community
              announcements
              <br className="hidden sm:block" /> regarding the Mutiara LRT line
              construction.
            </p>
          </div>
          <button type="button" onClick={markAllRead} disabled={unreadIds.size === 0} className="rounded bg-[#e8edf1] px-3 py-2 text-[11px] font-semibold text-[#25363d]">
            &#10003;&nbsp; Mark all as read
          </button>
        </div>

        {urgentNotification && <section className="rounded-md border border-[#e4eaed] border-l-4 border-l-[#dd1f23] bg-white p-3 text-[#182126] shadow-[0_2px_4px_#c1cdd2] sm:flex sm:min-h-[113px] sm:flex-nowrap sm:items-center sm:gap-3 sm:border-0 sm:bg-[#dd1f23] sm:p-4 sm:px-[18px] sm:text-white">
          <div className="hidden group size-[34px] shrink-0 place-items-center border border-[#ff8888] sm:grid">
            <PortalIcon name="bell" light />
          </div>

          <div className="sm:hidden">
            <div className="flex items-center justify-between gap-3 text-[9px] uppercase tracking-[0.04em] text-[#c9222b]">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <span className="grid size-3 place-items-center rounded-full border border-[#c9222b] text-[7px] leading-none">
                  !
                </span>
                {urgentNotification.type}
              </span>
              <span className="normal-case tracking-normal text-[#4e79b2]">
                {urgentNotification.date}
              </span>
            </div>
            <h2 className="mt-2 text-[13px] font-bold leading-[17px]">
              {urgentNotification.title}
            </h2>
            <p className="mt-1 text-[10px] leading-[14px] text-[#536168]">
              {urgentNotification.text}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="inline-flex min-w-0 items-center gap-1 text-[9px] text-[#536b75]">
                <PortalIcon name="map" size={11} />{" "}
                <span className="truncate">{urgentNotification.meta}</span>
              </span>
              <Link
                href={getConstructionDetailsHref(urgentNotification)}
                onClick={() => markRead(urgentNotification)}
                className="flex shrink-0 items-center gap-1 rounded-[3px] bg-[#be1f25] px-2.5 py-1.5 text-[9px] font-bold text-white shadow-sm"
              >
                Details <PortalIcon name="arrow" size={12} />
              </Link>
            </div>
          </div>

          <div className="hidden min-w-0 flex-1 sm:block">
            <div className="flex items-center gap-2.5 text-[10px]">
              <b className="bg-white px-2 py-1 text-[10px] text-[#be252b]">
                {urgentNotification.type}
              </b>
              <span>
                {urgentNotification.date}&nbsp; &bull; &nbsp;{urgentNotification.meta}
              </span>
            </div>
            <h2 className="my-1.5 text-base">
              {urgentNotification.title}
            </h2>
            <p className="text-xs leading-[18px]">
              {urgentNotification.text}
            </p>
          </div>
          <Link
            href={getConstructionDetailsHref(urgentNotification)}
                onClick={() => markRead(urgentNotification)}
            className="hidden items-center gap-2 rounded bg-white px-3 py-2.5 font-bold text-[#b62027] sm:flex"
          >
            View details <PortalIcon name="arrow" size={17} />
          </Link>
        </section>}

        <section className="my-4 rounded-md border-0 bg-transparent p-0 shadow-none sm:my-[30px] sm:rounded-md sm:border sm:border-[#e7ecef] sm:bg-white sm:p-3.5 sm:shadow-[0_1px_2px_#dfe7eb]">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
            <label className="flex h-[34px] min-w-0 flex-1 basis-full items-center gap-2 rounded border border-[#e1e7eb] bg-white px-2.5 text-[#67747a] sm:h-[33px] sm:basis-0 sm:border-0 sm:bg-[#f0f4f7]">
              <PortalIcon name="search" size={15} />
              <input
                className="w-full bg-transparent text-[11px] text-[#181c1e] outline-none placeholder:text-[#67747a]"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search notifications, routes, stations..."
              />
              <span className="text-[13px] leading-none text-[#748084]">
                &times;
              </span>
            </label>
            <div className="flex h-[28px] rounded bg-[#edf1f4]">
              {["All", "Unread", "Read"].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={`cursor-pointer px-2 text-[9px] sm:px-2.5 sm:text-[11px] ${filter === tab ? "m-0.5 h-[24px] rounded bg-white font-bold text-[#087b84] shadow-[0_1px_3px_#d5dfe4] sm:h-[27px]" : "text-[#54636a]"}`}
                  onClick={() => setFilter(tab)}
                >
                  {tab}{" "}
                  <span
                    className={`ml-0.5 inline-grid min-w-[15px] place-items-center rounded-full px-1 text-[8px] ${tab === "Unread" ? "bg-[#c9222b] text-white" : "bg-[#e1e7eb]"}`}
                  >
                    {tab === "All"
                      ? matchingNotifications.length
                      : tab === "Unread"
                        ? unreadCount
                        : readCount}
                  </span>
                </button>
              ))}
            </div>
            <div ref={filterPopoverRef} className="relative">
              <button
                type="button"
                aria-expanded={showFilterOptions}
                onClick={() => setShowFilterOptions((open) => !open)}
                className={`flex h-[28px] min-w-0 cursor-pointer items-center gap-1 rounded px-2 text-[9px] font-semibold sm:h-[33px] sm:min-w-[126px] sm:gap-2 sm:px-3 sm:text-[11px] ${showFilterOptions ? "bg-[#dcecef] text-[#087b84]" : "bg-[#f1f4f6] text-[#25363d]"}`}
              >
                <PortalIcon name="filter" size={13} />
                <span className="flex-1 text-left">
                  <span className="sm:hidden">
                    Filters ({activeFilterCount})
                  </span>
                  <span className="hidden sm:inline">Filter Options</span>
                </span>
              </button>
              {showFilterOptions && (
                <div className="absolute right-0 top-full z-20 mt-2 w-[min(280px,calc(100vw-32px))] rounded-md border border-[#dce5e8] bg-white p-3 text-[#25363d] shadow-[0_8px_24px_rgba(35,55,65,0.16)]">
                  <div className="mb-2 flex items-center justify-between">
                    <strong className="text-[12px]">
                      Filter notifications
                    </strong>
                    <button
                      type="button"
                      aria-label="Close filter options"
                      onClick={() => setShowFilterOptions(false)}
                      className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded p-0 text-[#718083] hover:bg-[#f0f4f7]"
                    >
                      <PortalIcon name="close" size={11} />
                    </button>
                  </div>
                  <div className="grid gap-3">
                    <label className="grid gap-1 text-[10px] font-bold uppercase tracking-[0.04em] text-[#718083]">
                      Notification type
                      <select
                        value={typeFilter}
                        onChange={(event) =>
                          setTypeFilter(
                            event.target.value as NotificationTypeFilter,
                          )
                        }
                        className="h-[33px] cursor-pointer rounded bg-[#f0f4f7] px-2 text-[12px] font-normal normal-case tracking-normal text-[#25363d] outline-none focus:ring-2 focus:ring-[#087b84]"
                      >
                        {notificationTypes.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-1 text-[10px] font-bold uppercase tracking-[0.04em] text-[#718083]">
                      Time range
                      <select
                        value={timeFilter}
                        onChange={(event) =>
                          setTimeFilter(event.target.value as TimeRange)
                        }
                        className="h-[33px] cursor-pointer rounded bg-[#f0f4f7] px-2 text-[12px] font-normal normal-case tracking-normal text-[#25363d] outline-none focus:ring-2 focus:ring-[#087b84]"
                      >
                        {timeRanges.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 hidden flex-col justify-between gap-2 text-[10px] text-[#7a8588] sm:flex sm:flex-row">
            <span>
              Active filters:
              <b className="ml-1.5 rounded bg-[#edf1f3] px-2 py-1 font-medium text-[#5e6b70]">
                Type: {typeFilter}
              </b>
              <b className="ml-1.5 rounded bg-[#edf1f3] px-2 py-1 font-medium text-[#5e6b70]">
                Time: {timeFilter}
              </b>
            </span>
            <span>
              Showing {shownNotifications.length} of{" "}
              {matchingNotifications.length} notifications
            </span>
          </div>
        </section>

        <div className="grid gap-2.5">
          {shownNotifications.length === 0 && <p role="status" className="py-6 text-center text-sm text-[#5d686c]">No notifications match your filters.</p>}
          {shownNotifications.map((notification) => {
            const isUnread = unreadIds.has(notification.id);
            const toneClass =
              !isUnread
                ? "border-[#e8edf0] bg-[#f5f7f8]"
                : notification.tone === "urgent"
                ? "border-[#f9eded] bg-[#fff1f1]"
                : notification.tone === "blue"
                  ? "border-[#dfebf7] bg-[#e7f2ff]"
                  : "border-[#e8edf0] bg-white";
            const actionClass =
              !isUnread || notification.tone === "plain"
                ? "text-[#7a8588] hover:text-[#087b84]"
                : "text-[#087b84]";
            const badgeClass =
              !isUnread
                ? "bg-[#e1e6e8] text-[#6d777a]"
                : notification.tone === "urgent"
                  ? "bg-[#be1f25] text-white"
                  : "bg-[#e1e6e8] text-[#4a5e66]";
            const impactClass =
              !isUnread
                ? "text-[#7a8588]"
                : notification.tone === "urgent"
                  ? "text-[#bc232b]"
                  : "text-[#6d777a]";
            return (
              <article
                className={`group relative flex gap-3 rounded-md border p-[17px] shadow-[0_1px_2px_#e1e8eb] ${toneClass}`}
                key={notification.id}
              >
                <div
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${!unreadIds.has(notification.id) ? "bg-[#cbd4dc]" : notification.tone === "urgent" ? "bg-[#c9222b]" : "bg-[#087b84]"}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 text-[9px] text-[#697477]">
                    <span
                      className={`px-2 py-1 text-[9px] font-bold ${badgeClass}`}
                    >
                      &#9673;&nbsp;{notification.type}
                    </span>
                    <span
                      className={`rounded px-1.5 py-1 text-[8px] font-bold uppercase tracking-[0.04em] ${isUnread ? "bg-[#ffd9d8] text-[#a81920]" : "bg-[#edf1f3] text-[#748084]"}`}
                    >
                      {isUnread ? "Unread" : "Read"}
                    </span>
                    <small className="hidden sm:inline">
                      ID: {notification.id} &nbsp;&bull;&nbsp;{" "}
                      {notification.date}
                    </small>
                    <strong
                      className={`ml-auto text-[10px] font-medium ${impactClass}`}
                    >
                      {notification.impact}
                    </strong>
                  </div>
                  <h2 className="my-1.5 text-base tracking-[-0.02em]">
                    {notification.title}
                  </h2>
                  <p className="text-xs leading-[18px] text-[#5c686d]">
                    {notification.text}
                  </p>
                  <div className="mt-3.5 flex flex-wrap items-center gap-x-[18px] gap-y-2 text-[10px] text-[#748084]">
                    <span className="inline-flex items-center gap-1">
                      <PortalIcon name="problem" size={13} />
                      {notification.meta}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <PortalIcon name="problem" size={13} />
                      {notification.extra}
                    </span>
                    <Link
                      href={getConstructionDetailsHref(notification)}
                      onClick={() => markRead(notification)}
                      className={`ml-auto hidden items-center gap-2 rounded bg-white px-2.5 py-1.5 text-[10px] font-semibold shadow-[0_1px_3px_#d9e2e7] sm:flex ${actionClass}`}
                    >
                      View details <PortalIcon name="arrow" size={15} />
                    </Link>
                  </div>
                </div>
                <Link
                  href={getConstructionDetailsHref(notification)}
                      onClick={() => markRead(notification)}
                  aria-label={`Open ${notification.title}`}
                  className="absolute inset-0 z-10 sm:hidden"
                />
              </article>
            );
          })}
        </div>

        <div className="mt-[18px] flex min-h-[60px] items-center gap-2.5 rounded-md border border-[#e7ecef] bg-white px-3.5 py-2.5 text-[#5d696d]">
          <PortalIcon name="problem" size={16} />
          <p className="flex-1 text-xs leading-[15px]">
            Open a notification to view its construction details, dates and working hours.
            <br className="hidden sm:block" /> Updates reviewed as of 15 Nov 2026 (MYT).
          </p>
          <small className="hidden font-mono text-[10px] text-[#7c878b] sm:block">
            Showing {shownNotifications.length ? 1 : 0} to {shownNotifications.length} of {matchingNotifications.length}<br />
            entries
          </small>
          <button className="grid size-7 place-items-center rounded bg-[#f3f6f7] text-lg text-[#a2abad]">
            &lsaquo;
          </button>
          <b className="grid size-7 place-items-center rounded bg-[#087b84] text-xs text-white">
            1
          </b>
          <button className="grid size-7 place-items-center rounded bg-[#f3f6f7] text-lg text-[#a2abad]">
            &rsaquo;
          </button>
        </div>
      </div>
    </div>
  );
}
