export const COMPLAINT_STATUSES = ["Pending", "In Progress", "Resolved"] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export const ANNOUNCEMENT_PRIORITIES = ["Normal", "Urgent"] as const;
export type AnnouncementPriority = (typeof ANNOUNCEMENT_PRIORITIES)[number];

export type DemoStaff = {
  staffId: string;
  displayName: string;
  role: "Administrator" | "Response Team" | "Project Officer";
};

export type Complaint = {
  complaintId: string;
  category: string;
  description: string;
  location: string;
  submittedAt: string;
  status: ComplaintStatus;
  assignedStaffId: string | null;
};

export type DemoConstructionUpdate = {
  updateId: string;
  title: string;
  description: string;
  affectedArea: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  removedAt: string | null;
};

export type DemoAnnouncement = {
  notificationId: string;
  title: string;
  message: string;
  affectedArea: string;
  severity: AnnouncementPriority;
  createdAt: string;
  publishedAt: string;
  expiresAt: string | null;
};

export type DemoData = {
  complaints: Complaint[];
  updates: DemoConstructionUpdate[];
  announcements: DemoAnnouncement[];
};

export type ConstructionDraft = {
  title: string;
  description: string;
  affectedArea: string;
  startDate: string;
  endDate: string;
};

export type AnnouncementDraft = {
  title: string;
  message: string;
  affectedArea: string;
  severity: string;
  expiresAt: string;
};

export type FieldErrors<T> = Partial<Record<keyof T, string>>;
