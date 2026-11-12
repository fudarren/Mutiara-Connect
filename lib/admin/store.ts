"use client";

import { useSyncExternalStore } from "react";
import { createDemoData, DEMO_STAFF, refreshSampleContent } from "./data";
import type {
  AnnouncementDraft,
  Complaint,
  ConstructionDraft,
  DemoAnnouncement,
  DemoConstructionUpdate,
  DemoData,
} from "./types";
import {
  isAnnouncementPriority,
  isComplaintStatus,
  validateAnnouncementDraft,
  validateConstructionDraft,
} from "./validation";

export const DEMO_STORAGE_KEY = "cmt322.admin.frontend-demo.v1";

type Snapshot = {
  data: DemoData;
  now: number;
};

type ActionResult = { ok: true; id: string } | { ok: false; error: string };

let snapshot: Snapshot | null = null;
let listeningForStorage = false;
let clock: number | undefined;
const listeners = new Set<() => void>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
    return false;
  }
  const time = Date.parse(value);
  return Number.isFinite(time) && new Date(time).toISOString() === value;
}

function isComplaint(value: unknown): value is Complaint {
  return isRecord(value)
    && isText(value.complaintId)
    && isText(value.category)
    && isText(value.description)
    && isText(value.location)
    && isTimestamp(value.submittedAt)
    && typeof value.status === "string"
    && isComplaintStatus(value.status)
    && (value.assignedStaffId === null
      || (typeof value.assignedStaffId === "string"
        && DEMO_STAFF.some((staff) => staff.staffId === value.assignedStaffId)));
}

function isUpdate(value: unknown): value is DemoConstructionUpdate {
  return isRecord(value)
    && isText(value.updateId)
    && isText(value.title)
    && isText(value.description)
    && isText(value.affectedArea)
    && isTimestamp(value.startDate)
    && isTimestamp(value.endDate)
    && Date.parse(value.endDate) > Date.parse(value.startDate)
    && isTimestamp(value.createdAt)
    && isTimestamp(value.updatedAt)
    && (value.removedAt === null || isTimestamp(value.removedAt));
}

function isAnnouncement(value: unknown): value is DemoAnnouncement {
  return isRecord(value)
    && isText(value.notificationId)
    && isText(value.title)
    && isText(value.message)
    && isText(value.affectedArea)
    && typeof value.severity === "string"
    && isAnnouncementPriority(value.severity)
    && isTimestamp(value.createdAt)
    && isTimestamp(value.publishedAt)
    && (value.expiresAt === null || isTimestamp(value.expiresAt));
}

function hasUniqueIds(ids: string[]): boolean {
  return new Set(ids).size === ids.length;
}

function parseData(raw: string): DemoData | null {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(value)
    || !Array.isArray(value.complaints) || !value.complaints.every(isComplaint)
    || !Array.isArray(value.updates) || !value.updates.every(isUpdate)
    || !Array.isArray(value.announcements) || !value.announcements.every(isAnnouncement)
    || !hasUniqueIds(value.complaints.map((item) => item.complaintId))
    || !hasUniqueIds(value.updates.map((item) => item.updateId))
    || !hasUniqueIds(value.announcements.map((item) => item.notificationId))) {
    return null;
  }
  return {
    complaints: value.complaints,
    updates: value.updates,
    announcements: value.announcements,
  };
}

function emit() {
  listeners.forEach((listener) => listener());
}

function save(data: DemoData) {
  try {
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Keep working from memory when storage is unavailable.
  }
  snapshot = { data, now: Date.now() };
  emit();
}

function load() {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
  } catch {
    snapshot = { data: createDemoData(), now: Date.now() };
    emit();
    return;
  }

  if (raw === null) {
    save(createDemoData());
    return;
  }

  const data = parseData(raw);
  if (!data) {
    save(createDemoData());
    return;
  }
  const refreshed = refreshSampleContent(data);
  if (refreshed !== data) {
    save(refreshed);
    return;
  }
  snapshot = { data: refreshed, now: Date.now() };
  emit();
}

function handleStorage(event: StorageEvent) {
  if (event.key !== DEMO_STORAGE_KEY && event.key !== null) return;
  load();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!listeningForStorage) {
    listeningForStorage = true;
    window.addEventListener("storage", handleStorage);
    load();
  }
  if (clock === undefined) {
    clock = window.setInterval(() => {
      if (snapshot) {
        snapshot = { ...snapshot, now: Date.now() };
        emit();
      }
    }, 30_000);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && clock !== undefined) {
      window.clearInterval(clock);
      clock = undefined;
    }
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => null;

export function useDemoData(): Snapshot | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function nextId(prefix: string, ids: string[]): string {
  const highest = ids.reduce((max, id) => {
    const match = new RegExp(`^${prefix}-(\\d+)$`).exec(id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `${prefix}-${String(highest + 1).padStart(3, "0")}`;
}

export function changeComplaintStatus(id: string, status: string): ActionResult {
  if (!snapshot) return { ok: false, error: "Data is still loading." };
  if (!isComplaintStatus(status)) return { ok: false, error: "Choose a valid complaint status." };
  if (!snapshot.data.complaints.some((complaint) => complaint.complaintId === id)) {
    return { ok: false, error: "This complaint is no longer available." };
  }
  save({
    ...snapshot.data,
    complaints: snapshot.data.complaints.map((complaint) =>
      complaint.complaintId === id ? { ...complaint, status } : complaint,
    ),
  });
  return { ok: true, id };
}

export function assignComplaint(id: string, staffId: string): ActionResult {
  if (!snapshot) return { ok: false, error: "Data is still loading." };
  if (!DEMO_STAFF.some((staff) => staff.staffId === staffId)) {
    return { ok: false, error: "Choose a predefined staff member." };
  }
  if (!snapshot.data.complaints.some((complaint) => complaint.complaintId === id)) {
    return { ok: false, error: "This complaint is no longer available." };
  }
  save({
    ...snapshot.data,
    complaints: snapshot.data.complaints.map((complaint) =>
      complaint.complaintId === id ? { ...complaint, assignedStaffId: staffId } : complaint,
    ),
  });
  return { ok: true, id };
}

export function saveConstructionUpdate(draft: ConstructionDraft, updateId?: string): ActionResult {
  if (!snapshot) return { ok: false, error: "Data is still loading." };
  const { errors, startDate, endDate } = validateConstructionDraft(draft);
  if (Object.keys(errors).length || !startDate || !endDate) {
    return { ok: false, error: "Correct the construction update fields and try again." };
  }
  const existing = updateId
    ? snapshot.data.updates.find((update) => update.updateId === updateId && !update.removedAt)
    : undefined;
  if (updateId && !existing) {
    return { ok: false, error: "This construction update is no longer available." };
  }

  const now = new Date().toISOString();
  const id = updateId ?? nextId("UPD", snapshot.data.updates.map((update) => update.updateId));
  const update: DemoConstructionUpdate = {
    updateId: id,
    title: draft.title.trim(),
    description: draft.description.trim(),
    affectedArea: draft.affectedArea.trim(),
    startDate,
    endDate,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    removedAt: null,
  };
  save({
    ...snapshot.data,
    updates: existing
      ? snapshot.data.updates.map((item) => item.updateId === id ? update : item)
      : [update, ...snapshot.data.updates],
  });
  return { ok: true, id };
}

export function removeConstructionUpdate(id: string): ActionResult {
  if (!snapshot) return { ok: false, error: "Data is still loading." };
  if (!snapshot.data.updates.some((update) => update.updateId === id && !update.removedAt)) {
    return { ok: false, error: "This construction update is no longer available." };
  }
  const removedAt = new Date().toISOString();
  save({
    ...snapshot.data,
    updates: snapshot.data.updates.map((update) =>
      update.updateId === id ? { ...update, removedAt } : update,
    ),
  });
  return { ok: true, id };
}

export function publishAnnouncement(draft: AnnouncementDraft): ActionResult {
  if (!snapshot) return { ok: false, error: "Data is still loading." };
  const now = Date.now();
  const { errors, expiresAt } = validateAnnouncementDraft(draft, now);
  if (Object.keys(errors).length || !isAnnouncementPriority(draft.severity)) {
    return { ok: false, error: "Correct the announcement fields and try again." };
  }
  const id = nextId("ANN", snapshot.data.announcements.map((item) => item.notificationId));
  const timestamp = new Date(now).toISOString();
  const announcement: DemoAnnouncement = {
    notificationId: id,
    title: draft.title.trim(),
    message: draft.message.trim(),
    affectedArea: draft.affectedArea.trim(),
    severity: draft.severity,
    createdAt: timestamp,
    publishedAt: timestamp,
    expiresAt,
  };
  save({ ...snapshot.data, announcements: [announcement, ...snapshot.data.announcements] });
  return { ok: true, id };
}
