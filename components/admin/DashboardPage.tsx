"use client";

import Link from "next/link";
import { constructionTiming, formatMalaysiaDateTime } from "@/lib/admin/dates";
import { useDemoData } from "@/lib/admin/store";
import { AdminIcon } from "./AdminIcon";
import { Badge, EmptyState, PageLoading } from "./AdminUI";

export function DashboardPage() {
  const snapshot = useDemoData();
  if (!snapshot) return <PageLoading title="Overview" />;

  const { complaints } = snapshot.data;
  const updates = snapshot.data.updates.filter((update) => !update.removedAt);
  const activeUpdates = updates.filter((update) => constructionTiming(update, snapshot.now) === "Active");
  const pending = complaints.filter((complaint) => complaint.status === "Pending");
  const resolved = complaints.filter((complaint) => complaint.status === "Resolved");
  const recentComplaints = [...complaints].sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt)).slice(0, 4);
  const recentUpdates = [...updates].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 4);

  const stats = [
    { label: "Active works", value: activeUpdates.length, href: "/admin/updates" },
    { label: "Pending complaints", value: pending.length, href: "/admin/complaints" },
    { label: "Resolved complaints", value: resolved.length, href: "/admin/complaints" },
    { label: "Total complaints", value: complaints.length, href: "/admin/complaints" },
  ];

  return (
    <>
      <div className="admin-page-heading">
        <h1>Overview</h1>
        <div className="admin-heading-date"><AdminIcon name="calendar" size={17} /> {formatMalaysiaDateTime(new Date(snapshot.now).toISOString())}</div>
      </div>

      <section className="admin-stat-cards" aria-label="Summary">
        {stats.map((stat) => (
          <Link className="admin-stat-card" href={stat.href} key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </Link>
        ))}
      </section>

      <div className="admin-quick-buttons">
        <Link className="admin-button admin-button--primary" href="/admin/complaints"><AdminIcon name="complaints" size={17} /><span>Review complaints</span></Link>
        <Link className="admin-button admin-button--secondary" href="/admin/updates"><AdminIcon name="construction" size={17} /><span>Manage updates</span></Link>
        <Link className="admin-button admin-button--secondary" href="/admin/announcements"><AdminIcon name="announcements" size={17} /><span>New announcement</span></Link>
      </div>

      <div className="admin-overview-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <h2>Latest complaints</h2>
            <Link className="admin-text-link" href="/admin/complaints">View all</Link>
          </div>
          {recentComplaints.length === 0 ? (
            <EmptyState title="No complaints yet">New complaints will appear here.</EmptyState>
          ) : (
            <ul className="admin-recent-list">
              {recentComplaints.map((complaint) => (
                <li className="admin-recent-row" key={complaint.complaintId}>
                  <div className="admin-recent-copy">
                    <strong>{complaint.category}</strong>
                    <p>{complaint.location}</p>
                  </div>
                  <Badge>{complaint.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-panel">
          <div className="admin-panel-heading">
            <h2>Construction updates</h2>
            <Link className="admin-text-link" href="/admin/updates">View all</Link>
          </div>
          {recentUpdates.length === 0 ? (
            <EmptyState title="No construction updates">New updates will appear here.</EmptyState>
          ) : (
            <ul className="admin-recent-list">
              {recentUpdates.map((update) => (
                <li className="admin-recent-row" key={update.updateId}>
                  <div className="admin-recent-copy">
                    <strong>{update.title}</strong>
                    <p>{update.affectedArea}</p>
                  </div>
                  <Badge>{constructionTiming(update, snapshot.now)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
