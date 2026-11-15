"use client";

import { useSyncExternalStore } from "react";

/*
 * Which notifications are still unread, kept in this browser's localStorage so
 * the notification page and the header bell agree and survive page changes.
 */

const KEY = "mutiara-notifications-unread-v1";
const EVENT = "mutiara-notifications-change";

/** Notifications that start out unread (matches the sample notifications). */
const INITIAL_UNREAD: readonly string[] = ["N-001", "N-002", "N-005"];

let cachedRaw: string | null | undefined;
let cachedList: readonly string[] = INITIAL_UNREAD;

function read(): readonly string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === cachedRaw) return cachedList;
    cachedRaw = raw;
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    cachedList = Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : INITIAL_UNREAD;
  } catch {
    cachedRaw = undefined;
    cachedList = INITIAL_UNREAD;
  }
  return cachedList;
}

function write(list: readonly string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage blocked: the change only lasts for this view */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** IDs of the notifications that are still unread. */
export function useUnreadIds(): readonly string[] {
  return useSyncExternalStore(subscribe, read, () => INITIAL_UNREAD);
}

export function markRead(id: string) {
  const list = read();
  if (list.includes(id)) write(list.filter((x) => x !== id));
}

export function markAllRead() {
  if (read().length > 0) write([]);
}
