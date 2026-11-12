export type FeedbackKind = "Complaint" | "Feedback";

export type FeedbackCategory =
  | "Construction impact"
  | "Safety concern"
  | "Accessibility"
  | "Environmental issue"
  | "General feedback";

export type FeedbackStatus = "Submitted" | "Under review" | "In progress" | "Resolved";

export type FeedbackReport = {
  referenceNumber: string;
  kind: FeedbackKind;
  category: FeedbackCategory;
  title: string;
  description: string;
  location: string;
  locationCoordinates: Point;
  submittedAt: string;
  status: FeedbackStatus;
  photoName?: string;
};
import type { Point } from "geojson";
