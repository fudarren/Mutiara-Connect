"use client";

import { useSyncExternalStore } from "react";
import { seedUpdates } from "@/lib/construction";
import type { ConstructionUpdate } from "@/types";

/*
 * Construction updates are kept in this browser's localStorage. Public and
 * staff pages read the same local records; there is no server synchronization.
 */

const KEY = "mutiara-construction-updates-v1";
const EVENT = "mutiara-construction-change";

let cachedRaw: string | null | undefined;
let cachedList: ConstructionUpdate[] = seedUpdates;

function read(): ConstructionUpdate[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === cachedRaw) return cachedList;
    cachedRaw = raw;
    cachedList = raw ? (JSON.parse(raw) as ConstructionUpdate[]) : seedUpdates;
  } catch {
    cachedRaw = undefined;
    cachedList = seedUpdates;
  }
  return cachedList;
}

function write(list: ConstructionUpdate[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage blocked: changes stay in memory only for this view */
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

/** All updates, including unpublished drafts (staff pages filter as needed). */
export function useConstructionUpdates(): ConstructionUpdate[] {
  return useSyncExternalStore(subscribe, read, () => seedUpdates);
}

export function nextUpdateId(list: ConstructionUpdate[]): string {
  const max = list.reduce((m, u) => Math.max(m, Number(u.updateId.replace(/\D/g, "")) || 0), 0);
  return `cu-${String(max + 1).padStart(3, "0")}`;
}

/** Create or replace an update (Create / Edit Construction Update). */
export function saveUpdate(update: ConstructionUpdate) {
  const list = read();
  const exists = list.some((u) => u.updateId === update.updateId);
  write(exists ? list.map((u) => (u.updateId === update.updateId ? update : u)) : [update, ...list]);
}

/** Remove Construction Update. */
export function removeUpdate(updateId: string) {
  write(read().filter((u) => u.updateId !== updateId));
}

export function resetUpdates() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}
