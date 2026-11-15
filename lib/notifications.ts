import type { ConstructionUpdate } from "@/types";

export type ConstructionNotification = {
  id: string;
  href: string;
  revision: string;
  type: "URGENT ALERT" | "UPDATE NOTIFICATION" | "RESOLVED";
  timestamp: string;
  date: string;
  title: string;
  text: string;
  meta: string;
  extra: string;
  tone: "urgent" | "blue" | "plain";
  impact: string;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kuala_Lumpur", day: "numeric", month: "short", year: "numeric",
});

/** One notification per published record, linking directly to its actual ID. */
export function buildConstructionNotifications(updates: ConstructionUpdate[]): ConstructionNotification[] {
  return updates.filter((update) => update.isPublished).map((update): ConstructionNotification => {
    const resolved = update.status === "Completed";
    const urgent = update.isUrgent && !resolved;
    const issuedOn = !update.source?.locallyEdited ? update.source?.publishedOn : undefined;
    const timestamp = issuedOn ? `${issuedOn}T00:00:00+08:00` : update.lastUpdated;
    return {
      id: update.updateId,
      href: `/projects/${encodeURIComponent(update.updateId)}`,
      revision: JSON.stringify(update),
      type: resolved ? "RESOLVED" : urgent ? "URGENT ALERT" : "UPDATE NOTIFICATION",
      timestamp,
      date: `${issuedOn ? "Issued" : "Updated"} ${dateFormatter.format(new Date(timestamp))} MYT`,
      title: update.title,
      text: update.description,
      meta: update.affectedRoads.join(", "),
      extra: `${dateFormatter.format(new Date(`${update.startDate}T00:00:00+08:00`))} – ${dateFormatter.format(new Date(`${update.endDate}T00:00:00+08:00`))} · ${update.workingHours}`,
      tone: resolved ? "plain" : urgent ? "urgent" : "blue",
      impact: update.impactLevel === "Not specified" ? "Impact not specified" : `${update.impactLevel} impact`,
    };
  }).sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp) || a.id.localeCompare(b.id));
}

export function matchesNotificationTime(notification: ConstructionNotification, range: "All time" | "Last 7 days" | "Last 30 days", asOf: string): boolean {
  if (range === "All time") return true;
  const end = Date.parse(`${asOf}T23:59:59.999+08:00`);
  const start = Date.parse(`${asOf}T00:00:00+08:00`) - ((range === "Last 7 days" ? 7 : 30) - 1) * 86_400_000;
  const timestamp = Date.parse(notification.timestamp);
  return timestamp >= start && timestamp <= end;
}
