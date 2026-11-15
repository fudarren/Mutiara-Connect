import type { Polygon } from "geojson";
import type { ConstructionUpdate } from "@/types";

export const CONSTRUCTION_AS_OF = "2026-11-15";
export const CONSTRUCTION_REVIEW_LABEL = "15 Nov 2026 (MYT)";
export const TRAFFIC_SOURCE_URL = "https://www.mymrt.com.my/traffic-announcement/?_sft_project-name=penang-mutiara-line";

// Indicative locality rectangles for the existing map. These are NOT surveyed
// lane boundaries or official worksite footprints; that limitation travels with exports.
function locality(lat: number, lng: number, height = 0.001, width = 0.0007): Polygon {
  const r = (n: number) => Math.round(n * 1e5) / 1e5;
  return { type: "Polygon", coordinates: [[
    [r(lng - width), r(lat - height)], [r(lng + width), r(lat - height)],
    [r(lng + width), r(lat + height)], [r(lng - width), r(lat + height)],
    [r(lng - width), r(lat - height)],
  ]] };
}

type NoticeInput = Pick<ConstructionUpdate, "updateId" | "title" | "description" | "workType" | "affectedRoads" | "affectedArea" | "startDate" | "endDate" | "workingHours" | "trafficRestriction" | "impactLevel"> & {
  noticeId: string;
  sourceUrl: string;
  publishedOn?: string;
};

function notice({ noticeId, sourceUrl, publishedOn, ...entry }: NoticeInput): ConstructionUpdate {
  return {
    ...entry,
    detourRoutes: null,
    pedestrianRoutes: null,
    businessAccessInfo: "Premises-specific access is not stated in the notice. Check the official traffic plan and on-site signs.",
    pedestrianAccessInfo: "A pedestrian route is not specified in the reviewed notice text. Follow on-site directions; no verified walkway is mapped here.",
    // The notices do not rate their impact, so each notice carries the team's own estimate (see below).
    impactBasis: "team-assessed",
    status: "Under construction",
    isUrgent: false,
    isPublished: true,
    lastUpdated: `${CONSTRUCTION_AS_OF}T00:00:00+08:00`,
    geometryAccuracy: "approximate",
    source: { name: "MRT Corp", url: sourceUrl, noticeId, publishedOn, reviewedOn: CONSTRUCTION_AS_OF },
  };
}

/** Selected official notices, manually reviewed; not an exhaustive or live feed. */
export const constructionNotices: ConstructionUpdate[] = [
  notice({
    updateId: "mrt-ta01814", noticeId: "TA01814", publishedOn: "2026-11-07",
    title: "Tapak Pesta - JPJ Batu Uban: Drainage and Road Widening",
    description: "Intermittent closure of the leftmost lane towards KOMTAR between the residential area near Tapak Pesta and JPJ Batu Uban for drainage relocation and road widening. Other lanes remain available during the stated hours. The shaded area indicates the general locality; consult the source for lane boundaries.",
    workType: "Lane Closure", trafficRestriction: "partial", impactLevel: "Moderate", // daytime lane closure on a main road for two months
    affectedRoads: ["Jalan Sultan Azlan Shah (Tapak Pesta - JPJ Batu Uban)"],
    affectedArea: locality(5.350, 100.303, 0.0022),
    startDate: "2026-11-09", endDate: "2027-01-15", workingHours: "09:00 - 16:00 MYT (intermittent)",
    sourceUrl: "https://www.mymrt.com.my/wp-content/uploads/2026/11/TA01814-FINAL.pdf",
  }),
  notice({
    updateId: "mrt-ta01809", noticeId: "TA01809", publishedOn: "2026-11-03",
    title: "SPICE - Sunway Tunas: Night Road Widening",
    description: "Intermittent night lane closures near Seri Nilam and Padang Sunway Tunas, at the Jalan Mahsuri junction, and on the slip road near SPICE Aquatic Centre support road widening. Other lanes remain available. The shaded area is approximate; use the official plan for the affected lanes.",
    workType: "Lane Closure", trafficRestriction: "partial", impactLevel: "Low", // night-only lane closures, other lanes open
    affectedRoads: ["Jalan Tun Dr. Awang", "Jalan Mahsuri"],
    affectedArea: locality(5.329, 100.278, 0.0018, 0.001),
    startDate: "2026-11-05", endDate: "2026-12-30", workingHours: "22:00 - 05:00 MYT next morning (intermittent)",
    sourceUrl: "https://www.mymrt.com.my/wp-content/uploads/2026/11/TA01809-FINAL.pdf",
  }),
  notice({
    updateId: "mrt-ta01807", noticeId: "TA01807", publishedOn: "2026-11-02",
    title: "Sungai Pinang: Overnight Utility Relocation",
    description: "Intermittent restrictions affect the expressway motorcycle and leftmost lanes near the sewage treatment pond through to the Sungai Pinang slip road, plus the left and middle lanes on Jalan Sungai Pinang. Other lanes remain available during utility relocation. The mapped locality is approximate.",
    workType: "Utility Relocation", trafficRestriction: "partial", impactLevel: "Moderate", // overnight, but several lanes on two roads including the expressway
    affectedRoads: ["Tun Dr. Lim Chong Eu Expressway", "Jalan Sungai Pinang"],
    affectedArea: locality(5.397, 100.330, 0.0014, 0.001),
    startDate: "2026-11-04", endDate: "2026-12-31", workingHours: "22:00 - 05:00 MYT next morning (intermittent)",
    sourceUrl: "https://www.mymrt.com.my/wp-content/uploads/2026/11/TA01807-FINAL.pdf",
  }),
  notice({
    updateId: "mrt-komtar-20261028", noticeId: "KOMTAR notice starting 28 Oct 2026",
    title: "KOMTAR: Jalan Magazine and Lebuh Carnarvon Works",
    description: "The published notice lists long-term partial road and lane restrictions on Jalan Magazine and Lebuh Carnarvon for construction, with a 24-hour notice schedule. Refer to the official announcement for traffic arrangements and revisions. The shaded area locates the junction approximately.",
    workType: "Construction Zone", trafficRestriction: "partial", impactLevel: "Moderate", // partial restrictions in the city centre, 24 hours until 2029
    affectedRoads: ["Jalan Magazine", "Lebuh Carnarvon"],
    affectedArea: locality(5.413, 100.332, 0.0006, 0.001),
    startDate: "2026-10-28", endDate: "2029-08-31", workingHours: "24 hours",
    sourceUrl: TRAFFIC_SOURCE_URL,
  }),
  notice({
    updateId: "mrt-ta01571", noticeId: "TA01571", publishedOn: "2026-04-23",
    title: "JPJ Batu Uban - Sunny Point: Piling and Lane Diversions",
    description: "Bored piling and permanent structure works require round-the-clock lane diversions in both directions between JPJ Batu Uban and the Sunny Point junction. The official PDF contains the traffic plan. The shaded locality is approximate; no verified driving diversion has been traced on this map.",
    workType: "Construction Zone", trafficRestriction: "diversion", impactLevel: "High", // round-the-clock lane diversions in both directions
    affectedRoads: ["Jalan Sultan Azlan Shah (JPJ Batu Uban - Sunny Point)"],
    affectedArea: locality(5.357, 100.307, 0.0023),
    startDate: "2026-04-25", endDate: "2026-11-30", workingHours: "24 hours",
    sourceUrl: "https://www.mymrt.com.my/wp-content/uploads/2026/04/TA01571-FINAL.pdf",
  }),
];

/** A date-window classification, not a statement about live lane availability. */
export function publishedTrafficStatus(update: ConstructionUpdate, today: string) {
  if (update.source?.locallyEdited && update.status === "Completed") return "Open" as const;
  if (update.endDate < today) return "Notice ended" as const;
  if (update.startDate > today) return "Scheduled" as const;
  if (update.trafficRestriction === "diversion") return "Diversion" as const;
  if (update.trafficRestriction === "full") return "Closed" as const;
  return "Partially open" as const;
}
