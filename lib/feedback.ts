import type { Point } from "geojson";
import type { FeedbackCategory, FeedbackKind, FeedbackReport, FeedbackStatus } from "@/types/feedback";

export const feedbackCategories: FeedbackCategory[] = [
  "Construction impact",
  "Safety concern",
  "Accessibility",
  "Environmental issue",
  "General feedback",
];

export const reportLocations: { label: string; coordinates: Point }[] = [
  { label: "George Town / Komtar", coordinates: { type: "Point", coordinates: [100.3292, 5.4148] } },
  { label: "Jelutong", coordinates: { type: "Point", coordinates: [100.3118, 5.3895] } },
  { label: "Gelugor", coordinates: { type: "Point", coordinates: [100.3177, 5.3652] } },
  { label: "Bayan Lepas", coordinates: { type: "Point", coordinates: [100.3055, 5.364] } },
  { label: "Penang International Airport", coordinates: { type: "Point", coordinates: [100.2655, 5.2971] } },
  { label: "Penang Sentral", coordinates: { type: "Point", coordinates: [100.388, 5.3991] } },
  { label: "Other location (map picker coming later)", coordinates: { type: "Point", coordinates: [100.3327, 5.4164] } },
];

export const feedbackStatusOrder: FeedbackStatus[] = ["Submitted", "Under review", "In progress", "Resolved"];

export const mockFeedbackReports: FeedbackReport[] = [
  {
    referenceNumber: "MC-2026-0047",
    kind: "Complaint",
    category: "Safety concern",
    title: "Temporary barrier needs clearer warning signs",
    description: "A barrier near the work area is difficult to see after dark.",
    location: "George Town / Komtar",
    locationCoordinates: { type: "Point", coordinates: [100.3292, 5.4148] },
    submittedAt: "2026-11-10T18:20:00+08:00",
    status: "Submitted",
  },
  {
    referenceNumber: "MC-2026-0045",
    kind: "Complaint",
    category: "Accessibility",
    title: "Ramp access is partially blocked",
    description: "Materials are narrowing the temporary accessible route near the station entrance.",
    location: "Gelugor",
    locationCoordinates: { type: "Point", coordinates: [100.3177, 5.3652] },
    submittedAt: "2026-11-09T11:05:00+08:00",
    status: "In progress",
  },
  {
    referenceNumber: "MC-2026-0042",
    kind: "Complaint",
    category: "Construction impact",
    title: "Dust affecting nearby shopfronts",
    description: "Dust from the active work area is collecting near the pedestrian entrance.",
    location: "Bayan Lepas",
    locationCoordinates: { type: "Point", coordinates: [100.3055, 5.364] },
    submittedAt: "2026-11-08T09:30:00+08:00",
    status: "Under review",
  },
  {
    referenceNumber: "MC-2026-0038",
    kind: "Feedback",
    category: "Accessibility",
    title: "Appreciation for the temporary walkway",
    description: "The temporary walkway near the station works is clearly signposted and helpful.",
    location: "Jelutong",
    locationCoordinates: { type: "Point", coordinates: [100.3118, 5.3895] },
    submittedAt: "2026-11-04T14:10:00+08:00",
    status: "Resolved",
  },
];

export function createFeedbackReference() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `MC-${year}-${suffix}`;
}

export function formatFeedbackDate(value: string) {
  return new Intl.DateTimeFormat("en-MY", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kuala_Lumpur",
  }).format(new Date(value));
}

export function statusTone(status: FeedbackStatus) {
  if (status === "Resolved") return "green";
  if (status === "In progress") return "blue";
  if (status === "Under review") return "amber";
  return "teal";
}

export function createReport(input: {
  kind: FeedbackKind;
  category: FeedbackCategory;
  title: string;
  description: string;
  location: string;
  locationCoordinates: Point;
  photoName?: string;
}): FeedbackReport {
  return {
    ...input,
    referenceNumber: createFeedbackReference(),
    submittedAt: new Date().toISOString(),
    status: "Submitted",
  };
}
