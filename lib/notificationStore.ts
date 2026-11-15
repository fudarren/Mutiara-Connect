"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useConstructionUpdates } from "./constructionStore";
import { useUserSession } from "./session";
import { buildConstructionNotifications, type ConstructionNotification } from "./notifications";

const EVENT = "mutiara-notifications-read-change";
const memory = new Map<string, string>();

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function read(key: string) {
  if (memory.has(key)) return memory.get(key)!;
  try { return window.localStorage.getItem(key) ?? "{}"; } catch { return "{}"; }
}

function parse(raw: string): Record<string, string> {
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([, revision]) => typeof revision === "string"));
  } catch { return {}; }
}

export function useNotifications() {
  const updates = useConstructionUpdates();
  const { user } = useUserSession();
  const key = `mutiara-notifications-read-v1:${user?.username ?? "guest"}`;
  const raw = useSyncExternalStore(subscribe, () => read(key), () => "{}");
  const notifications = useMemo(() => buildConstructionNotifications(updates), [updates]);
  const unreadIds = useMemo(() => {
    const receipts = parse(raw);
    return new Set(notifications.filter((n) => receipts[n.id] !== n.revision).map((n) => n.id));
  }, [raw, notifications]);

  function markRead(items: ConstructionNotification[]) {
    const receipts = parse(read(key));
    for (const item of items) receipts[item.id] = item.revision;
    const next = JSON.stringify(receipts);
    try {
      window.localStorage.setItem(key, next);
      memory.delete(key);
    } catch { memory.set(key, next); }
    window.dispatchEvent(new Event(EVENT));
  }

  return { notifications, unreadIds, markRead: (item: ConstructionNotification) => markRead([item]), markAllRead: () => markRead(notifications) };
}
