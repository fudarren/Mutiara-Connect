import { CONSTRUCTION_AS_OF, publishedTrafficStatus } from "./constructionNotices";
import type { Feature, FeatureCollection, Polygon, Position } from "geojson";
import { alignmentSegments, officialStations as stations } from "./officialMutiara";
export { alignmentSegments, officialStations as stations } from "./officialMutiara";
import type {
  ClosureStatus,
  ConstructionUpdate,
  Station,
  UpdateFilter,
  WorkType,
  Zone,
} from "@/types";

export { CONSTRUCTION_AS_OF, CONSTRUCTION_REVIEW_LABEL } from "./constructionNotices";

const r5 = (n: number) => Math.round(n * 1e5) / 1e5;

/* ----------------------------- Zones & stations ---------------------------- */

const box = (minLng: number, minLat: number, maxLng: number, maxLat: number): Polygon => ({
  type: "Polygon",
  coordinates: [[[minLng, minLat], [maxLng, minLat], [maxLng, maxLat], [minLng, maxLat], [minLng, minLat]]],
});

export const zones: Zone[] = [
  {
    zoneId: "zone-1",
    name: "Mainland & Waterfront (Macallum - Penang Sentral)",
    boundary: box(100.34, 5.39, 100.38, 5.42),
    alignment: { type: "LineString", coordinates: alignmentSegments[2].coordinates },
  },
  {
    zoneId: "zone-2",
    name: "Section A (Komtar - Jelutong)",
    boundary: box(100.305, 5.38, 100.34, 5.425),
    alignment: { type: "LineString", coordinates: stations.slice(15, 20).map((s) => s.location.coordinates) },
  },
  {
    zoneId: "zone-3",
    name: "Southern Corridor (Gelugor - Bayan Lepas)",
    boundary: box(100.25, 5.24, 100.325, 5.38),
    alignment: { type: "LineString", coordinates: stations.slice(0, 16).map((s) => s.location.coordinates) },
  },
];

/* ------------------------------ Seed updates ------------------------------- */

import { constructionNotices } from "./constructionNotices";
import { legacySeedUpdates } from "./legacyConstructionUpdates";

/** CU-001 is restored from the original sample records. It is a staff-entered diversion, not an MRT Corp notice. */
const restoredSamples = legacySeedUpdates.filter((u) => u.updateId === "cu-001");

export const seedUpdates: ConstructionUpdate[] = [...constructionNotices, ...restoredSamples];

/* --------------------------------- Helpers --------------------------------- */

export const workTypes: WorkType[] = [
  "Road Closure",
  "Lane Closure",
  "Construction Zone",
  "Pedestrian Diversion",
  "Station Works",
  "Utility Relocation",
];

export const workTypeStyle: Record<WorkType, { color: string; glyph: string }> = {
  "Road Closure": { color: "#c9222b", glyph: "R" },
  "Lane Closure": { color: "#d9822b", glyph: "L" },
  "Construction Zone": { color: "#a36a08", glyph: "C" },
  "Pedestrian Diversion": { color: "#2f6fdb", glyph: "P" },
  "Station Works": { color: "#087b84", glyph: "S" },
  "Utility Relocation": { color: "#5f6e75", glyph: "U" },
};

export const DETOUR_COLOR = "#1f9d55";
export const PEDESTRIAN_COLOR = "#2f6fdb";
export const ALIGNMENT_COLOR = "#087b84";

/** Whether the published restriction period includes this date (not a live status). */
export function isClosureInEffect(update: ConstructionUpdate, today = CONSTRUCTION_AS_OF): boolean {
  const isClosureType = Boolean(update.trafficRestriction) || update.workType === "Road Closure" || update.workType === "Lane Closure";
  return (
    isClosureType &&
    update.status !== "Completed" &&
    update.startDate <= today &&
    today <= update.endDate
  );
}

export function closureStatus(update: ConstructionUpdate, today = CONSTRUCTION_AS_OF): ClosureStatus {
  if (update.source && update.trafficRestriction) return publishedTrafficStatus(update, today);
  const isClosureType = update.workType === "Road Closure" || update.workType === "Lane Closure";
  if (!isClosureType || update.status === "Completed" || update.endDate < today) return "Open";
  if (update.startDate > today) return "Scheduled";
  return update.workType === "Road Closure" ? "Closed" : "Partially open";
}

export function centroidOf(polygon: Polygon): Position {
  const ring = polygon.coordinates[0].slice(0, -1);
  const lng = ring.reduce((sum, p) => sum + p[0], 0) / ring.length;
  const lat = ring.reduce((sum, p) => sum + p[1], 0) / ring.length;
  return [r5(lng), r5(lat)];
}

/** Zone.containsLocation(location) */
export function zoneContains(zone: Zone, point: Position): boolean {
  const ring = zone.boundary.coordinates[0];
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > point[1] !== yj > point[1] && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

export function zoneOf(update: ConstructionUpdate): Zone | undefined {
  const c = centroidOf(update.affectedArea);
  return zones.find((zone) => zoneContains(zone, c));
}

export function nearestStation(update: ConstructionUpdate): Station {
  const c = centroidOf(update.affectedArea);
  return stations.reduce((best, s) => {
    const d = Math.hypot(s.location.coordinates[0] - c[0], s.location.coordinates[1] - c[1]);
    const bd = Math.hypot(best.location.coordinates[0] - c[0], best.location.coordinates[1] - c[1]);
    return d < bd ? s : best;
  });
}

/** ConstructionUpdate.searchUpdates(keyword) */
export function searchUpdates(list: ConstructionUpdate[], keyword: string): ConstructionUpdate[] {
  const q = keyword.trim().toLowerCase();
  if (!q) return list;
  return list.filter((u) =>
    [u.title, u.description, u.workType, u.status, u.affectedRoads.join(" "), zoneOf(u)?.name ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

/** ConstructionUpdate.filterUpdates(criteria) - includes the keyword search. */
export function filterUpdates(list: ConstructionUpdate[], filter: UpdateFilter): ConstructionUpdate[] {
  return searchUpdates(list, filter.keyword ?? "").filter(
    (u) =>
      (!filter.workType || filter.workType === "All" || u.workType === filter.workType) &&
      (!filter.status || filter.status === "All" || u.status === filter.status) &&
      (!filter.closure || filter.closure === "All" || closureStatus(u) === filter.closure) &&
      (!filter.zoneId || filter.zoneId === "All" || zoneOf(u)?.zoneId === filter.zoneId),
  );
}

/* ------------------------------ Date formatting ---------------------------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-11-06" -> "6 Nov 2026" (no time-zone maths, so server and client always agree). */
export function formatDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

const mytFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kuala_Lumpur",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** ISO timestamp -> "6 Nov 2026, 8:30 AM MYT" (Malaysia time, as required by the NFRs). */
export function formatMYT(iso: string): string {
  const parts = Object.fromEntries(mytFormatter.formatToParts(new Date(iso)).map((p) => [p.type, p.value]));
  return `${parts.day} ${parts.month} ${parts.year}, ${parts.hour}:${parts.minute} ${String(parts.dayPeriod).toUpperCase()} MYT`;
}

/* --------------------------------- GeoJSON --------------------------------- */

export function toFeatureCollection(updates: ConstructionUpdate[]): FeatureCollection {
  const features: Feature[] = [];
  for (const segment of alignmentSegments) {
    features.push({ type: "Feature", geometry: { type: "LineString", coordinates: segment.coordinates }, properties: { kind: "indicative-alignment", name: segment.name, sourceUrl: segment.sourceUrl, coordinateAccuracy: "approximate" } });
  }
  for (const station of stations) {
    features.push({ type: "Feature", geometry: station.location, properties: { kind: "station", stationId: station.stationId, name: station.name, provisional: station.provisional, coordinateAccuracy: station.coordinateAccuracy, sourceUrl: station.sourceUrl } });
  }
  for (const u of updates) {
    const base = {
      updateId: u.updateId,
      title: u.title,
      workType: u.workType,
      status: u.status,
      closureStatus: closureStatus(u),
      startDate: u.startDate,
      endDate: u.endDate,
      workingHours: u.workingHours,
      geometryAccuracy: u.geometryAccuracy ?? "staff-marked",
      source: u.source ?? null,
      asOf: CONSTRUCTION_AS_OF,
    };
    features.push({ type: "Feature", geometry: u.affectedArea, properties: { ...base, kind: "affected-area" } });
    if (u.detourRoutes) features.push({ type: "Feature", geometry: u.detourRoutes, properties: { ...base, kind: "detour-route" } });
    if (u.pedestrianRoutes) features.push({ type: "Feature", geometry: u.pedestrianRoutes, properties: { ...base, kind: "pedestrian-route" } });
  }
  return { type: "FeatureCollection", features };
}
