import type { ConstructionUpdate } from "@/types";

function sameRecord(left: ConstructionUpdate, right: ConstructionUpdate): boolean {
  const normalize = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(normalize);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, normalize(item)]));
    }
    return value;
  };
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));
}

/** Add back any current default records missing from a stored list. Existing and edited records are kept as they are. */
export function restoreMissingDefaults(stored: ConstructionUpdate[], current: ConstructionUpdate[]): ConstructionUpdate[] {
  const have = new Set(stored.map((entry) => entry.updateId));
  return [...stored, ...current.filter((entry) => !have.has(entry.updateId))];
}

/** Replace only untouched fixtures. Keep user-created, edited and unpublished records. */
export function migrateConstructionUpdates(
  stored: ConstructionUpdate[],
  legacy: ConstructionUpdate[],
  current: ConstructionUpdate[],
): ConstructionUpdate[] {
  const retained = stored.filter((entry) => !legacy.some((sample) => sample.updateId === entry.updateId && sameRecord(entry, sample)));
  const retainedIds = new Set(retained.map((entry) => entry.updateId));
  return [...current.filter((entry) => !retainedIds.has(entry.updateId)), ...retained];
}
