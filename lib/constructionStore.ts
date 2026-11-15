"use client";

import { useSyncExternalStore } from "react";
import { seedUpdates } from "@/lib/construction";
import { legacySeedUpdates } from "@/lib/legacyConstructionUpdates";
import { migrateConstructionUpdates, restoreMissingDefaults } from "@/lib/constructionMigration";
import type { ConstructionUpdate } from "@/types";

/*
 * Construction updates are kept in this browser's localStorage. Public and
 * staff pages read the same local records; there is no server synchronization.
 */

// v3: one-time restore of default records (e.g. CU-001) that older v2 browser data was missing.
const KEY = "mutiara-construction-updates-v3";
const V2_KEY = "mutiara-construction-updates-v2";
const LEGACY_KEY = "mutiara-construction-updates-v1";
const EVENT = "mutiara-construction-change";

let cachedRaw: string | null | undefined;
let cachedList: ConstructionUpdate[] = seedUpdates;
let memoryOnly = false;

function read(): ConstructionUpdate[] {
  if (memoryOnly) return cachedList;
  try {
    const raw = window.localStorage.getItem(KEY);
    const v2Raw = raw === null ? window.localStorage.getItem(V2_KEY) : null;
    const legacyRaw = raw === null && v2Raw === null ? window.localStorage.getItem(LEGACY_KEY) : null;
    const cacheKey = raw !== null ? `current:${raw}` : v2Raw !== null ? `v2:${v2Raw}` : `legacy:${legacyRaw}`;
    if (cacheKey === cachedRaw) return cachedList;
    const parsed: unknown = JSON.parse(raw ?? v2Raw ?? legacyRaw ?? "null");
    if (parsed !== null && !Array.isArray(parsed)) throw new Error("Invalid construction records");
    const list = parsed as ConstructionUpdate[] | null;
    cachedList = raw !== null
      ? (list ?? seedUpdates)
      : v2Raw !== null && list
        ? restoreMissingDefaults(list, seedUpdates)
        : list ? migrateConstructionUpdates(list, legacySeedUpdates, seedUpdates) : seedUpdates;
    cachedRaw = cacheKey;
  } catch {
    cachedRaw = undefined;
    cachedList = seedUpdates;
  }
  return cachedList;
}

function write(list: ConstructionUpdate[]) {
  cachedList = list;
  try {
    const raw = JSON.stringify(list);
    window.localStorage.setItem(KEY, raw);
    cachedRaw = `current:${raw}`;
    memoryOnly = false;
  } catch {
    memoryOnly = true;
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
  const max = list.reduce((m, u) => Math.max(m, Number(/^cu-(\d+)$/.exec(u.updateId)?.[1]) || 0), 0);
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
  // Write the new defaults so an old v1 backup cannot reappear after reset.
  write(seedUpdates);
}
