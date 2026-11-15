import type { Position } from "geojson";
import type { Station } from "@/types";

/** Route sources reviewed on 15 November 2026. Geometry remains indicative. */
export const OFFICIAL_REVIEWED_ON = "2026-11-15";
export const MUTIARA_ROUTE_URL = "https://laluanmutiara.mymrt.com.my/lrt-mutiara-line/";
export const MUTIARA_SCHEME_URL = "https://www.mymrt.com.my/wp-content/uploads/2026/02/PML-PI-Notice-BW-ENG-1.pdf";
export const MUTIARA_EIA_URL = "https://laluanmutiara.mymrt.com.my/wp-content/uploads/2026/03/EIA-PML-SEGMENT-2-EXECUTIVE-SUMMARY-DAN-RINGKASAN-EKSEKUTIF.pdf";

export type MutiaraStation = Station & {
  provisional: boolean;
  coordinateAccuracy: "approximate" | "published coordinates";
  sourceUrl: string;
};

// Names/order follow MRT Corp's station guide and February 2026 revised scheme.
// Island coordinates are approximate landmark-based anchors, NOT surveyed station
// footprints. S30/S31 are converted from the coordinates in the Segment 2 EIA.
const stationRows: [string, string, number, number, boolean?][] = [
  ["A01", "PSR-A (Silicon Island)", 100.2630, 5.2510, true],
  ["S02", "Permatang Damar Laut", 100.2650, 5.2700],
  ["S03", "Penang International Airport", 100.2657, 5.2935],
  ["S04", "Sungai Tiram", 100.2720, 5.3010],
  ["S05", "FIZ South", 100.2830, 5.3050],
  ["S06", "FIZ North", 100.2860, 5.3140],
  ["S07", "Jalan Tengah", 100.2810, 5.3215],
  ["S08", "SPICE", 100.2780, 5.3290],
  ["S09", "Bukit Jambul", 100.2830, 5.3370],
  ["S10", "Sungai Nibong", 100.2930, 5.3400],
  ["S11", "Sungai Dua", 100.3000, 5.3460],
  ["S12", "Batu Uban", 100.3060, 5.3535],
  ["S13", "Jalan Universiti", 100.3080, 5.3600],
  ["S14", "Gelugor", 100.3100, 5.3710],
  ["S15", "Penang Waterfront", 100.3160, 5.3760],
  ["S16", "East Jelutong", 100.3220, 5.3870],
  ["S17", "Sungai Pinang", 100.3290, 5.3950],
  ["S18", "Bandar Sri Pinang", 100.3320, 5.4010],
  ["S19", "Macallum", 100.3330, 5.4080],
  ["S20", "KOMTAR", 100.3300, 5.4130],
  ["S30", "Jalan Bagan Luar", 100 + 22 / 60 + 6.41 / 3600, 5 + 24 / 60 + 3.40 / 3600, true],
  ["S31", "Penang Sentral", 100 + 22 / 60 + 4.52 / 3600, 5 + 23 / 60 + 38.38 / 3600],
];

export const officialStations: MutiaraStation[] = stationRows.map(([stationId, name, lng, lat, provisional]) => ({
  stationId, name, provisional: Boolean(provisional),
  location: { type: "Point", coordinates: [lng, lat] },
  coordinateAccuracy: stationId === "S30" || stationId === "S31" ? "published coordinates" : "approximate",
  sourceUrl: stationId === "S30" || stationId === "S31" ? MUTIARA_EIA_URL : MUTIARA_ROUTE_URL,
}));

const at = (id: string): Position => officialStations.find((s) => s.stationId === id)!.location.coordinates;

/** Separate lines preserve the Macallum branch; never connect KOMTAR to the mainland. */
export const alignmentSegments = [
  { id: "island", name: "Permatang Damar Laut – KOMTAR", coordinates: officialStations.slice(1, 20).map((s) => s.location.coordinates), provisional: false, sourceUrl: MUTIARA_ROUTE_URL },
  { id: "psr", name: "PSR-A provisional extension", coordinates: [at("A01"), at("S02")], provisional: true, sourceUrl: MUTIARA_SCHEME_URL },
  { id: "mainland", name: "Macallum – Penang Sentral (planned cross-sea connection)", coordinates: [at("S19"), [100.341, 5.402], [100.360, 5.405], [100.365, 5.405], at("S30"), at("S31")], provisional: true, sourceUrl: MUTIARA_SCHEME_URL },
];
