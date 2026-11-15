/*
 * Sample notifications, shared by the Notifications page and the home
 * dashboard so the counts on both always agree.
 */

export type Notification = {
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

export const notifications: Notification[] = [
  {
    type: "URGENT ALERT",
    id: "N-001",
    date: "6 Nov 2026, 8:30 AM MYT",
    title: "Temporary Road Diversion Near Station Area B",
    text: "A temporary diversion is in place around an active construction access point. Follow posted safety signage.",
    meta: "George Town East Sector",
    extra: "Traffic Impact: Moderate",
    tone: "urgent",
    impact: "High Impact",
  },
  {
    type: "UPDATE NOTIFICATION",
    id: "N-002",
    date: "5 Nov 2026, 3:15 PM MYT",
    title: "Construction Progress Update — Section A",
    text: "Latest summary of scheduled construction activities and site progress. Piling operations completed on Viaduct Piers 12 to 18.",
    meta: "Section A (Komtar – Jelutong)",
    extra: "Civil Works: 64% Complete",
    tone: "blue",
    impact: "Works Milestone",
  },
  {
    type: "UPDATE NOTIFICATION",
    id: "N-003",
    date: "4 Nov 2026, 10:00 AM MYT",
    title: "Upcoming Community Information Session",
    text: "Residents can review the session details and planned discussion topics. Hall briefing scheduled at Dewan MPKK Gelugor on Saturday.",
    meta: "14 Nov 2026, 10:00 AM",
    extra: "Public Consultation",
    tone: "plain",
    impact: "Low Impact",
  },
  {
    type: "URGENT ALERT (RESOLVED)",
    id: "N-004",
    date: "3 Nov 2026, 4:45 PM MYT",
    title: "Temporary Access Restriction Notice",
    text: "Short-term access arrangements were announced for a worksite vicinity. Normal pedestrian corridor reopened 4 Nov 06:00 AM.",
    meta: "Jalan Sultan Azlan Shah Access",
    extra: "Expired Duration",
    tone: "plain",
    impact: "Resolved - No Impact",
  },
  {
    type: "UPDATE NOTIFICATION",
    id: "N-005",
    date: "2 Nov 2026, 11:20 AM MYT",
    title: "Station Area B Works Schedule Updated",
    text: "Revised work schedule information is available for nearby users. Night works scheduled from 23:00 to 05:00 to reduce daytime congestion.",
    meta: "Night Schedule Notice",
    extra: "Low Acoustic Zone Protocol",
    tone: "blue",
    impact: "Timetable Adjustment",
  },
  {
    type: "UPDATE NOTIFICATION",
    id: "N-006",
    date: "1 Nov 2026, 9:00 AM MYT",
    title: "Weekly Construction Summary",
    text: "A summary of project progress has been shared with the community. Review key milestone achievements for October Week 4.",
    meta: "Bulletin Issue 43/2026",
    extra: "Key Metric: On Schedule (+1.2%)",
    tone: "plain",
    impact: "Low Impact",
  },
];

/** Urgent alerts that are still active (resolved ones have "(RESOLVED)" in their type). */
export const activeUrgentAlertCount = notifications.filter((n) => n.type === "URGENT ALERT").length;
