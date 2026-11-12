import { fromMalaysiaDateTimeInput } from "./dates";
import {
  ANNOUNCEMENT_PRIORITIES,
  COMPLAINT_STATUSES,
  type AnnouncementDraft,
  type AnnouncementPriority,
  type ComplaintStatus,
  type ConstructionDraft,
  type FieldErrors,
} from "./types";

export function isComplaintStatus(value: string): value is ComplaintStatus {
  return COMPLAINT_STATUSES.some((status) => status === value);
}

export function isAnnouncementPriority(value: string): value is AnnouncementPriority {
  return ANNOUNCEMENT_PRIORITIES.some((priority) => priority === value);
}

export function validateConstructionDraft(draft: ConstructionDraft) {
  const errors: FieldErrors<ConstructionDraft> = {};
  if (!draft.title.trim()) errors.title = "Enter a title.";
  if (!draft.description.trim()) errors.description = "Enter a description.";
  if (!draft.affectedArea.trim()) errors.affectedArea = "Enter an affected area.";

  const startDate = fromMalaysiaDateTimeInput(draft.startDate);
  const endDate = fromMalaysiaDateTimeInput(draft.endDate);
  if (!startDate) errors.startDate = "Enter a valid start date and time.";
  if (!endDate) errors.endDate = "Enter a valid end date and time.";
  if (startDate && endDate && Date.parse(endDate) <= Date.parse(startDate)) {
    errors.endDate = "The end date and time must be later than the start.";
  }

  return { errors, startDate, endDate };
}

export function validateAnnouncementDraft(draft: AnnouncementDraft, now: number) {
  const errors: FieldErrors<AnnouncementDraft> = {};
  if (!draft.title.trim()) errors.title = "Enter an announcement title.";
  if (!draft.message.trim()) errors.message = "Enter a message.";
  if (!draft.affectedArea.trim()) errors.affectedArea = "Enter an affected area.";
  if (!isAnnouncementPriority(draft.severity)) errors.severity = "Choose a valid priority.";

  const expiresAt = draft.expiresAt ? fromMalaysiaDateTimeInput(draft.expiresAt) : null;
  if (draft.expiresAt && !expiresAt) {
    errors.expiresAt = "Enter a valid expiry date and time.";
  } else if (expiresAt && Date.parse(expiresAt) <= now) {
    errors.expiresAt = "The expiry date and time must be in the future.";
  }

  return { errors, expiresAt };
}
