"use client";

import { useMemo, useState } from "react";
import { PortalIcon } from "@/components/PortalIcons";

type Notification = {
  type: string;
  id: string;
  date: string;
  title: string;
  text: string;
  meta: string;
  extra: string;
  tone: "urgent" | "blue" | "plain";
  impact: string;
};

const notifications: Notification[] = [
  { type: "URGENT ALERT", id: "N-001", date: "6 Nov 2026, 8:30 AM MYT", title: "Temporary Road Diversion Near Station Area B", text: "A temporary diversion is in place around an active construction access point. Follow posted safety signage.", meta: "George Town East Sector", extra: "Traffic Impact: Moderate", tone: "urgent", impact: "High Impact" },
  { type: "UPDATE NOTIFICATION", id: "N-002", date: "5 Nov 2026, 3:15 PM MYT", title: "Construction Progress Update — Section A", text: "Latest summary of scheduled construction activities and site progress. Piling operations completed on Viaduct Piers 12 to 18.", meta: "Section A (Komtar – Jelutong)", extra: "Civil Works: 64% Complete", tone: "blue", impact: "Works Milestone" },
  { type: "UPDATE NOTIFICATION", id: "N-003", date: "4 Nov 2026, 10:00 AM MYT", title: "Upcoming Community Information Session", text: "Residents can review the session details and planned discussion topics. Hall briefing scheduled at Dewan MPKK Gelugor on Saturday.", meta: "14 Nov 2026, 10:00 AM", extra: "Public Consultation", tone: "plain", impact: "Read" },
  { type: "URGENT ALERT (RESOLVED)", id: "N-004", date: "3 Nov 2026, 4:45 PM MYT", title: "Temporary Access Restriction Notice", text: "Short-term access arrangements were announced for a worksite vicinity. Normal pedestrian corridor reopened 4 Nov 06:00 AM.", meta: "Jalan Sultan Azlan Shah Access", extra: "Expired Duration", tone: "plain", impact: "Read" },
  { type: "UPDATE NOTIFICATION", id: "N-005", date: "2 Nov 2026, 11:20 AM MYT", title: "Station Area B Works Schedule Updated", text: "Revised work schedule information is available for nearby users. Night works scheduled from 23:00 to 05:00 to reduce daytime congestion.", meta: "Night Schedule Notice", extra: "Low Acoustic Zone Protocol", tone: "blue", impact: "Timetable Adjustment" },
  { type: "UPDATE NOTIFICATION", id: "N-006", date: "1 Nov 2026, 9:00 AM MYT", title: "Weekly Construction Summary", text: "A summary of project progress has been shared with the community. Review key milestone achievements for October Week 4.", meta: "Bulletin Issue 43/2026", extra: "Key Metric: On Schedule (+1.2%)", tone: "plain", impact: "Read" },
];

const unreadIds = new Set(["N-001", "N-002", "N-005"]);

export function NotificationCenter() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const shownNotifications = useMemo(
    () => notifications.filter((notification) => {
      const matchesQuery = notification.title.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "All" || (filter === "Unread" && unreadIds.has(notification.id)) || (filter === "Read" && !unreadIds.has(notification.id));
      return matchesQuery && matchesFilter;
    }),
    [filter, query],
  );

  return (
    <div className="mx-auto w-full max-w-[1130px] px-3 py-6 text-[#181c1e] sm:px-5 sm:py-7">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#087b84]">Geo-zone: Penang Island</div>
          <h1 className="mt-1 flex items-center gap-2 text-[31px] leading-[38px] tracking-[-0.04em]">Notifications<span className="inline-flex h-6 min-w-[72px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-[#ffd9d8] px-3 text-[12px] leading-6 text-[#a81920]"><i className="size-1.5 rounded-full bg-[#c9222b]" />3 unread</span></h1>
          <p className="mt-1 text-[15px] leading-[22px] text-[#5d686c]">Stay updated on alerts, environmental advisories, and community announcements<br className="hidden sm:block" /> regarding the Mutiara LRT line construction.</p>
        </div>
        <button className="rounded bg-[#e8edf1] px-3 py-2 text-[11px] font-semibold text-[#25363d]">&#10003;&nbsp; Mark all as read</button>
      </div>

      <section className="flex min-h-[113px] flex-wrap items-start gap-3 rounded-md bg-[#dd1f23] p-4 text-white shadow-[0_2px_4px_#c1cdd2] sm:flex-nowrap sm:items-center sm:px-[18px]">
        <div className="group grid size-[34px] shrink-0 place-items-center border border-[#ff8888]"><PortalIcon name="bell" light /></div>
        <div className="min-w-0 flex-1"><div className="flex items-center gap-2.5 text-[10px]"><b className="bg-white px-2 py-1 text-[10px] text-[#be252b]">URGENT ALERT</b><span>6 Nov 2026, 8:30 AM MYT&nbsp; &bull; &nbsp;Station Area B Construction Zone</span></div><h2 className="my-1.5 text-base">Temporary Road Diversion Near Station Area B</h2><p className="text-xs leading-[18px]">A temporary diversion is in place around an active construction access point. Follow posted safety signage.<br />Heavy machinery crossing active 08:30&ndash;18:00 daily.</p></div>
        <button className="flex items-center gap-2 rounded bg-white px-3 py-2.5 font-bold text-[#b62027]">View details <PortalIcon name="arrow" size={17} /></button>
      </section>

      <section className="my-[30px] rounded-md border border-[#e7ecef] bg-white p-3.5 shadow-[0_1px_2px_#dfe7eb]">
        <div className="flex flex-wrap items-center gap-2.5"><label className="flex h-[33px] min-w-0 flex-1 basis-full items-center gap-2 rounded bg-[#f0f4f7] px-2.5 text-[#67747a] sm:basis-0"><PortalIcon name="search" size={17} /><input className="w-full bg-transparent text-[#181c1e] outline-none placeholder:text-[#67747a]" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notifications by keyword..." /></label>
          <div className="flex h-[33px] rounded bg-[#f0f4f7]">{["All", "Unread", "Read"].map((tab) => <button key={tab} className={`px-2.5 text-[11px] ${filter === tab ? "m-0.5 h-[27px] rounded bg-white font-bold text-[#087b84] shadow-[0_1px_3px_#d5dfe4]" : "text-[#54636a]"}`} onClick={() => setFilter(tab)}>{tab} <span className="ml-1 inline-grid min-w-[17px] place-items-center rounded-full bg-[#e1e7eb] px-1 text-[9px]">{tab === "All" ? 6 : 3}</span></button>)}</div>
          <button className="flex h-[33px] min-w-[126px] items-center gap-2 rounded bg-[#e8edf1] px-3 text-[11px] font-semibold text-[#25363d]"><PortalIcon name="filter" size={15} /><span className="flex-1 text-left">Filter Options</span></button>
        </div>
        <div className="mt-4 flex flex-col justify-between gap-2 text-[10px] text-[#7a8588] sm:flex-row"><span>Active filters:<b className="ml-1.5 rounded bg-[#edf1f3] px-2 py-1 font-medium text-[#5e6b70]">Type: All</b><b className="ml-1.5 rounded bg-[#edf1f3] px-2 py-1 font-medium text-[#5e6b70]">Time: All time</b></span><span>Showing {shownNotifications.length} of 6 notifications</span></div>
      </section>

      <div className="grid gap-2.5">{shownNotifications.map((notification) => { const toneClass = notification.tone === "urgent" ? "border-[#f9eded] bg-[#fff1f1]" : notification.tone === "blue" ? "border-[#dfebf7] bg-[#e7f2ff]" : "border-[#e8edf0] bg-white"; const actionClass = notification.tone === "plain" ? "text-[#7a8588] hover:text-[#087b84]" : "text-[#087b84]"; return <article className={`group flex gap-3 rounded-md border p-[17px] shadow-[0_1px_2px_#e1e8eb] ${toneClass}`} key={notification.id}><div className={`mt-1.5 size-2 shrink-0 rounded-full ${notification.tone === "urgent" ? "bg-[#c9222b]" : "bg-[#087b84]"}`} /><div className="min-w-0 flex-1"><div className="flex items-center gap-2.5 text-[9px] text-[#697477]"><span className={`px-2 py-1 text-[9px] font-bold ${notification.tone === "urgent" ? "bg-[#be1f25] text-white" : "bg-[#e1e6e8] text-[#4a5e66]"}`}>&#9673;&nbsp;{notification.type}</span><small className="hidden sm:inline">ID: {notification.id} &nbsp;&bull;&nbsp; {notification.date}</small><strong className={`ml-auto text-[10px] font-medium ${notification.tone === "urgent" ? "text-[#bc232b]" : "text-[#6d777a]"}`}>{notification.impact}</strong></div><h2 className="my-1.5 text-base tracking-[-0.02em]">{notification.title}</h2><p className="text-xs leading-[18px] text-[#5c686d]">{notification.text}</p><div className="mt-3.5 flex flex-wrap items-center gap-x-[18px] gap-y-2 text-[10px] text-[#748084]"><span className="inline-flex items-center gap-1"><PortalIcon name="problem" size={13} />{notification.meta}</span><span className="inline-flex items-center gap-1"><PortalIcon name="problem" size={13} />{notification.extra}</span><button className={`ml-auto flex items-center gap-2 rounded bg-white px-2.5 py-1.5 text-[10px] font-semibold shadow-[0_1px_3px_#d9e2e7] ${actionClass}`}>View details <PortalIcon name="arrow" size={15} /></button></div></div></article>; })}</div>

      <div className="mt-[18px] flex min-h-[60px] items-center gap-2.5 rounded-md border border-[#e7ecef] bg-white px-3.5 py-2.5 text-[#5d696d]"><PortalIcon name="problem" size={16} /><p className="flex-1 text-xs leading-[15px]">Click any notification item to inspect the full bulletin, safety routing maps, and contractor<br className="hidden sm:block" /> remarks.</p><small className="hidden font-mono text-[10px] text-[#7c878b] sm:block">Showing 1 to {shownNotifications.length} of 6<br />entries</small><button className="grid size-7 place-items-center rounded bg-[#f3f6f7] text-lg text-[#a2abad]">&lsaquo;</button><b className="grid size-7 place-items-center rounded bg-[#087b84] text-xs text-white">1</b><button className="grid size-7 place-items-center rounded bg-[#f3f6f7] text-lg text-[#a2abad]">&rsaquo;</button></div>
    </div>
  );
}
