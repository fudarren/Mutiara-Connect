import type { Feature, FeatureCollection, MultiLineString, Polygon, Position } from "geojson";
import type {
  ClosureStatus,
  ConstructionUpdate,
  Station,
  UpdateFilter,
  WorkType,
  Zone,
} from "@/types";

/* ---------------------------------------------------------------------------
 * Sample construction records; not official MRT Corp or Penang information.
 * ------------------------------------------------------------------------- */

/** Fixed date for the sample construction timeline, in Malaysia time. */
export const PROTOTYPE_TODAY = "2026-11-10";
export const PROTOTYPE_NOW_LABEL = "10 Nov 2026, 9:00 AM MYT";

const r5 = (n: number) => Math.round(n * 1e5) / 1e5;

function areaAround(lat: number, lng: number, h = 0.0011, w = 0.0015): Polygon {
  return {
    type: "Polygon",
    coordinates: [[
      [r5(lng - w), r5(lat - h)],
      [r5(lng + w), r5(lat - h)],
      [r5(lng + w), r5(lat + h)],
      [r5(lng - w), r5(lat + h)],
      [r5(lng - w), r5(lat - h)],
    ]],
  };
}

/** Lines are given as [dLat, dLng] offsets from an anchor point. */
function linesAround(lat: number, lng: number, ...lines: [number, number][][]): MultiLineString {
  return {
    type: "MultiLineString",
    coordinates: lines.map((line) => line.map(([dy, dx]) => [r5(lng + dx), r5(lat + dy)])),
  };
}

/* ----------------------------- Zones & stations ---------------------------- */

const SENTRAL: Position = [100.364, 5.401];
const WELD_QUAY: Position = [100.3445, 5.4137];
const KOMTAR: Position = [100.3292, 5.4148];
const JELUTONG: Position = [100.3125, 5.389];
const GELUGOR: Position = [100.304, 5.3615];
const SG_NIBONG: Position = [100.2965, 5.3315];
const BAYAN_BARU: Position = [100.2885, 5.3225];
const AIRPORT: Position = [100.2775, 5.2975];

const box = (minLng: number, minLat: number, maxLng: number, maxLat: number): Polygon => ({
  type: "Polygon",
  coordinates: [[[minLng, minLat], [maxLng, minLat], [maxLng, maxLat], [minLng, maxLat], [minLng, minLat]]],
});

export const zones: Zone[] = [
  {
    zoneId: "zone-1",
    name: "Mainland & Waterfront (Penang Sentral - Weld Quay)",
    boundary: box(100.34, 5.395, 100.372, 5.42),
    alignment: { type: "LineString", coordinates: [SENTRAL, WELD_QUAY] },
  },
  {
    zoneId: "zone-2",
    name: "Section A (Komtar - Jelutong)",
    boundary: box(100.305, 5.38, 100.34, 5.425),
    alignment: { type: "LineString", coordinates: [WELD_QUAY, KOMTAR, JELUTONG] },
  },
  {
    zoneId: "zone-3",
    name: "Southern Corridor (Gelugor - Bayan Lepas)",
    boundary: box(100.265, 5.285, 100.32, 5.38),
    alignment: { type: "LineString", coordinates: [JELUTONG, GELUGOR, SG_NIBONG, BAYAN_BARU, AIRPORT] },
  },
];

export const stations: Station[] = [
  { stationId: "st-1", name: "Penang Sentral", location: { type: "Point", coordinates: SENTRAL } },
  { stationId: "st-2", name: "Weld Quay", location: { type: "Point", coordinates: WELD_QUAY } },
  { stationId: "st-3", name: "Komtar", location: { type: "Point", coordinates: KOMTAR } },
  { stationId: "st-4", name: "Jelutong", location: { type: "Point", coordinates: JELUTONG } },
  { stationId: "st-5", name: "Gelugor (Station Area B)", location: { type: "Point", coordinates: GELUGOR } },
  { stationId: "st-6", name: "Sungai Nibong", location: { type: "Point", coordinates: SG_NIBONG } },
  { stationId: "st-7", name: "Bayan Baru", location: { type: "Point", coordinates: BAYAN_BARU } },
  { stationId: "st-8", name: "Penang Airport", location: { type: "Point", coordinates: AIRPORT } },
];

export const fullAlignment: Position[] = [
  SENTRAL, WELD_QUAY, KOMTAR, JELUTONG, GELUGOR, SG_NIBONG, BAYAN_BARU, AIRPORT,
];

/* ------------------------------ Seed updates ------------------------------- */

export const seedUpdates: ConstructionUpdate[] = [
  {
    updateId: "cu-001",
    title: "Temporary Road Diversion Near Station Area B",
    description:
      "A temporary diversion is in place around an active construction access point. Heavy machinery crossing is active 08:30-18:00 daily. Follow posted safety signage and marshal instructions.",
    workType: "Road Closure",
    affectedRoads: ["Jalan Sultan Azlan Shah (southbound)"],
    affectedArea: areaAround(5.3615, 100.3040),
    detourRoutes: linesAround(5.3615, 100.304, [[0.0028, -0.0012], [0.0028, -0.004], [-0.0028, -0.004], [-0.0028, -0.0012]]),
    pedestrianRoutes: linesAround(5.3615, 100.304, [[0.002, 0.0022], [-0.002, 0.0022]]),
    pedestrianAccessInfo:
      "Pedestrians use the covered temporary walkway on the east side. Crossings are marshalled during working hours.",
    businessAccessInfo:
      "Shops along the closed stretch stay open and are reachable from the rear service lane. Delivery vehicles follow the green detour.",
    startDate: "2026-11-06",
    endDate: "2026-12-20",
    workingHours: "08:30 - 18:00 daily",
    impactLevel: "High",
    status: "Under construction",
    isUrgent: true,
    isPublished: true,
    lastUpdated: "2026-11-06T08:30:00+08:00",
  },
  {
    updateId: "cu-002",
    title: "Viaduct Piers 12-18 Civil Works",
    description:
      "Piling operations are completed on Viaduct Piers 12 to 18 and civil works are now around 64% complete. Noise and dust control measures are in place.",
    workType: "Construction Zone",
    affectedRoads: ["Jalan Jelutong"],
    affectedArea: areaAround(5.3895, 100.3118, 0.0014, 0.0022),
    detourRoutes: null,
    pedestrianRoutes: null,
    pedestrianAccessInfo: "Footpaths remain open. Keep to the marked walkway beside the hoarding.",
    businessAccessInfo: "All premises remain open. Loading bays on Jalan Jelutong are unaffected.",
    startDate: "2026-08-03",
    endDate: "2027-03-31",
    workingHours: "Mon - Sat, 08:00 - 18:00",
    impactLevel: "Moderate",
    status: "Under construction",
    isUrgent: false,
    isPublished: true,
    lastUpdated: "2026-11-05T15:15:00+08:00",
  },
  {
    updateId: "cu-003",
    title: "Pedestrian Corridor Reopened - Jalan Sultan Azlan Shah Access",
    description:
      "Short-term access arrangements near the worksite have ended. The normal pedestrian corridor reopened on 4 Nov at 06:00 AM.",
    workType: "Pedestrian Diversion",
    affectedRoads: ["Jalan Sultan Azlan Shah"],
    affectedArea: areaAround(5.364, 100.3055, 0.0008, 0.0012),
    detourRoutes: null,
    pedestrianRoutes: linesAround(5.364, 100.3055, [[0.0015, 0.002], [-0.0015, 0.002]]),
    pedestrianAccessInfo: "Normal pedestrian corridor restored, including the OKU-friendly ramp.",
    businessAccessInfo: "No restrictions. Normal shopfront access has resumed.",
    startDate: "2026-10-28",
    endDate: "2026-11-04",
    workingHours: "N/A",
    impactLevel: "Low",
    status: "Completed",
    isUrgent: false,
    isPublished: true,
    lastUpdated: "2026-11-04T06:00:00+08:00",
  },
  {
    updateId: "cu-004",
    title: "Komtar Station Box - Jalan Penang Lane Closure",
    description:
      "Excavation of the Komtar station box requires closing the kerbside lane on Jalan Penang. Two lanes remain open to traffic and buses are rerouted via Lebuh Light.",
    workType: "Lane Closure",
    affectedRoads: ["Jalan Penang", "Lebuh Light"],
    affectedArea: areaAround(5.4148, 100.3292, 0.0012, 0.0018),
    detourRoutes: linesAround(5.4148, 100.3292, [[-0.003, 0.001], [-0.003, 0.0045], [0.003, 0.0045], [0.003, 0.001]]),
    pedestrianRoutes: linesAround(5.4148, 100.3292, [[0.0012, -0.0022], [-0.0012, -0.0022]]),
    pedestrianAccessInfo:
      "The footpath along Jalan Penang is narrowed to 1.5 m. The OKU ramp has been relocated to the Lebuh Light entrance.",
    businessAccessInfo:
      "Komtar-facing shopfronts remain open. Customers use the Lebuh Light entrance while hoarding is in place.",
    startDate: "2026-10-15",
    endDate: "2027-02-28",
    workingHours: "Daily, 22:00 to 06:00 with the lane closed. Site works run 24 hours.",
    impactLevel: "High",
    status: "Under construction",
    isUrgent: false,
    isPublished: true,
    lastUpdated: "2026-11-03T10:00:00+08:00",
  },
  {
    updateId: "cu-005",
    title: "Penang Sentral Interchange Works",
    description:
      "Preparation of the interchange between the LRT and Penang Sentral bus and rail terminal. Detailed traffic arrangements will be announced before works start.",
    workType: "Station Works",
    affectedRoads: ["Jalan Bagan Dalam"],
    affectedArea: areaAround(5.401, 100.364, 0.0015, 0.0025),
    detourRoutes: null,
    pedestrianRoutes: null,
    pedestrianAccessInfo: "No change to terminal walkways at this stage.",
    businessAccessInfo: "Terminal retail outlets are unaffected during planning.",
    startDate: "2027-01-11",
    endDate: "2027-09-30",
    workingHours: "To be announced",
    impactLevel: "Low",
    status: "Planning",
    isUrgent: false,
    isPublished: true,
    lastUpdated: "2026-10-30T09:00:00+08:00",
  },
  {
    updateId: "cu-006",
    title: "Station Area B Night Works",
    description:
      "Night works are scheduled from 23:00 to 05:00 to reduce daytime congestion. Low-acoustic equipment is used within the residential buffer zone.",
    workType: "Construction Zone",
    affectedRoads: ["Persiaran Gurney Selatan"],
    affectedArea: areaAround(5.3598, 100.3022, 0.0012, 0.0018),
    detourRoutes: null,
    pedestrianRoutes: null,
    pedestrianAccessInfo: "Footpaths are closed between 23:00 and 05:00 only.",
    businessAccessInfo: "Premises are unaffected during trading hours.",
    startDate: "2026-11-02",
    endDate: "2026-12-31",
    workingHours: "23:00 - 05:00 nightly",
    impactLevel: "Low",
    status: "Under construction",
    isUrgent: false,
    isPublished: true,
    lastUpdated: "2026-11-02T11:20:00+08:00",
  },
  {
    updateId: "cu-007",
    title: "Weld Quay Utility Relocation",
    description:
      "Underground utilities are being relocated ahead of station construction. Traffic flow is maintained and flagmen are on duty when needed.",
    workType: "Utility Relocation",
    affectedRoads: ["Pesara King Edward"],
    affectedArea: areaAround(5.414, 100.344, 0.001, 0.0016),
    detourRoutes: null,
    pedestrianRoutes: null,
    pedestrianAccessInfo: "Pedestrian access is maintained along the waterfront promenade.",
    businessAccessInfo: "Ferry-terminal kiosks and nearby shops remain open.",
    startDate: "2026-09-14",
    endDate: "2026-12-12",
    workingHours: "Mon - Fri, 09:00 - 17:00",
    impactLevel: "Low",
    status: "Under construction",
    isUrgent: false,
    isPublished: true,
    lastUpdated: "2026-10-28T14:00:00+08:00",
  },
  {
    updateId: "cu-008",
    title: "Bayan Baru Viaduct Foundations",
    description:
      "Foundation and pile-cap works for the elevated viaduct near Persiaran Bayan Indah. Heavy vehicle movements are expected during the day.",
    workType: "Construction Zone",
    affectedRoads: ["Persiaran Bayan Indah"],
    affectedArea: areaAround(5.3225, 100.2885, 0.0014, 0.002),
    detourRoutes: null,
    pedestrianRoutes: null,
    pedestrianAccessInfo: "Use the pedestrian overpass near the mall. The at-grade crossing is closed.",
    businessAccessInfo: "Mall and shoplot entrances stay open. Peak-hour access may be slower.",
    startDate: "2026-07-20",
    endDate: "2027-05-30",
    workingHours: "Mon - Sat, 08:00 - 18:00",
    impactLevel: "Moderate",
    status: "Under construction",
    isUrgent: false,
    isPublished: true,
    lastUpdated: "2026-10-22T16:30:00+08:00",
  },
  {
    updateId: "cu-009",
    title: "Airport Link Site Preparation",
    description:
      "Early works and traffic arrangements are being monitored around the proposed airport connection. One lane on Jalan Tun Dr Awang is closed to stage materials.",
    workType: "Lane Closure",
    affectedRoads: ["Jalan Tun Dr Awang"],
    affectedArea: areaAround(5.2975, 100.2775, 0.0013, 0.0019),
    detourRoutes: linesAround(5.2975, 100.2775, [[0.0035, -0.001], [0.0035, -0.0045], [-0.003, -0.0045], [-0.003, -0.001]]),
    pedestrianRoutes: null,
    pedestrianAccessInfo: "Airport walkways are unaffected. Use the signposted crossing near the entrance.",
    businessAccessInfo: "Airport-side shops and car parks remain open. Allow extra time for drop-off.",
    startDate: "2026-10-24",
    endDate: "2027-01-31",
    workingHours: "Daily, 07:00 - 19:00",
    impactLevel: "Moderate",
    status: "Under construction",
    isUrgent: false,
    isPublished: true,
    lastUpdated: "2026-10-24T09:00:00+08:00",
  },
  {
    updateId: "cu-010",
    title: "Sungai Nibong Walkway Diversion",
    description:
      "The existing walkway is diverted around the site hoarding for the duration of the foundation works.",
    workType: "Pedestrian Diversion",
    affectedRoads: ["Jalan Sungai Nibong"],
    affectedArea: areaAround(5.3315, 100.2965, 0.001, 0.0016),
    detourRoutes: null,
    pedestrianRoutes: linesAround(5.3315, 100.2965, [[0.0018, -0.0018], [0.0004, -0.003], [-0.0018, -0.0018]]),
    pedestrianAccessInfo:
      "A level, 1.8 m wide temporary walkway with tactile paving is provided for wheelchair and OKU users.",
    businessAccessInfo: "Nearby stalls remain open. Customers enter via the diverted walkway.",
    startDate: "2026-10-05",
    endDate: "2026-12-05",
    workingHours: "Continuous",
    impactLevel: "Low",
    status: "Under construction",
    isUrgent: false,
    isPublished: true,
    lastUpdated: "2026-10-05T08:00:00+08:00",
  },
  {
    updateId: "cu-011",
    title: "Lebuh Chulia Weekend Road Closure",
    description:
      "Lebuh Chulia will be closed to vehicles for overnight utility works. Heritage-zone visitors should follow the detour via Lebuh Campbell.",
    workType: "Road Closure",
    affectedRoads: ["Lebuh Chulia"],
    affectedArea: areaAround(5.417, 100.3412, 0.001, 0.0016),
    detourRoutes: linesAround(5.417, 100.3412, [[-0.0028, -0.002], [-0.0028, 0.003], [0.0028, 0.003], [0.0028, 0.002]]),
    pedestrianRoutes: null,
    pedestrianAccessInfo: "The street stays open to pedestrians. Watch for temporary barriers.",
    businessAccessInfo: "Restaurants and guesthouses remain open. Goods deliveries are accepted before 18:00 only.",
    startDate: "2026-11-21",
    endDate: "2026-11-22",
    workingHours: "Sat 22:00 - Sun 06:00",
    impactLevel: "Moderate",
    status: "Planning",
    isUrgent: false,
    isPublished: true,
    lastUpdated: "2026-11-09T17:00:00+08:00",
  },
  {
    updateId: "cu-012",
    title: "Draft: Jalan Burma Lane Closure",
    description: "Draft entry prepared by the project office. Not yet published to the public portal.",
    workType: "Lane Closure",
    affectedRoads: ["Jalan Burma"],
    affectedArea: areaAround(5.4262, 100.3205, 0.001, 0.0015),
    detourRoutes: null,
    pedestrianRoutes: null,
    pedestrianAccessInfo: "To be confirmed.",
    businessAccessInfo: "To be confirmed.",
    startDate: "2026-12-01",
    endDate: "2026-12-14",
    workingHours: "To be announced",
    impactLevel: "Moderate",
    status: "Planning",
    isUrgent: false,
    isPublished: false,
    lastUpdated: "2026-11-09T11:00:00+08:00",
  },
];

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

/** ConstructionUpdate.isClosureInEffect(now) - only road/lane closures count. */
export function isClosureInEffect(update: ConstructionUpdate, today = PROTOTYPE_TODAY): boolean {
  const isClosureType = update.workType === "Road Closure" || update.workType === "Lane Closure";
  return (
    isClosureType &&
    update.status !== "Completed" &&
    update.startDate <= today &&
    today <= update.endDate
  );
}

export function closureStatus(update: ConstructionUpdate, today = PROTOTYPE_TODAY): ClosureStatus {
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
  for (const zone of zones) {
    features.push({ type: "Feature", geometry: zone.alignment, properties: { kind: "alignment", zoneId: zone.zoneId, name: zone.name } });
  }
  for (const station of stations) {
    features.push({ type: "Feature", geometry: station.location, properties: { kind: "station", stationId: station.stationId, name: station.name } });
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
    };
    features.push({ type: "Feature", geometry: u.affectedArea, properties: { ...base, kind: "affected-area" } });
    if (u.detourRoutes) features.push({ type: "Feature", geometry: u.detourRoutes, properties: { ...base, kind: "detour-route" } });
    if (u.pedestrianRoutes) features.push({ type: "Feature", geometry: u.pedestrianRoutes, properties: { ...base, kind: "pedestrian-route" } });
  }
  return { type: "FeatureCollection", features };
}
