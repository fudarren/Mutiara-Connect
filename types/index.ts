import type { LineString, MultiLineString, Point, Polygon } from "geojson";

export type NewsStatus = "Planning" | "Under construction" | "Completed";
export type ConstructionNews = {
  id: string;
  title: string;
  summary: string;
  location: string;
  publishedAt: string;
  status: NewsStatus;
  source: string;
  /** Optional link to a ConstructionUpdate shown on the construction map. */
  updateId?: string;
};

/* ---------------------------------------------------------------------------
 * Construction Information & Map module.
 * Field names follow the Class Diagram (ConstructionUpdate, Zone, Station).
 * Geometry uses GeoJSON ([longitude, latitude] order) so it can be shared
 * with other systems (see Non-functional requirement: GeoJSON-based data).
 * ------------------------------------------------------------------------- */

export type WorkType =
  | "Road Closure"
  | "Lane Closure"
  | "Construction Zone"
  | "Pedestrian Diversion"
  | "Station Works"
  | "Utility Relocation";

export type ImpactLevel = "Low" | "Moderate" | "High" | "Not specified";

/** Derived from ConstructionUpdate.isClosureInEffect(). */
export type ClosureStatus = "Closed" | "Partially open" | "Open" | "Scheduled" | "Diversion" | "Notice ended";

export type ConstructionUpdate = {
  updateId: string;
  title: string;
  description: string;
  workType: WorkType;
  affectedRoads: string[];
  /** Added for markAffectedArea(area): the marked affected area on the map. */
  affectedArea: Polygon;
  detourRoutes: MultiLineString | null;
  /** Added for pedestrian diversions shown on the map. */
  pedestrianRoutes: MultiLineString | null;
  pedestrianAccessInfo: string;
  businessAccessInfo: string;
  /** Calendar dates (YYYY-MM-DD) in Malaysia time. */
  startDate: string;
  endDate: string;
  workingHours: string;
  impactLevel: ImpactLevel;
  /** Set when the impact level is the team's own estimate rather than stated in a source notice. */
  impactBasis?: "team-assessed";
  status: NewsStatus;
  isUrgent: boolean;
  isPublished: boolean;
  /** ISO timestamp with explicit +08:00 offset (Malaysia time). */
  lastUpdated: string;
  /** Explicit traffic restriction, independent of the construction activity. */
  trafficRestriction?: "partial" | "full" | "diversion";
  geometryAccuracy?: "approximate";
  source?: {
    name: string;
    url: string;
    noticeId: string;
    publishedOn?: string;
    reviewedOn: string;
    locallyEdited?: boolean;
  };
};

export type Zone = {
  zoneId: string;
  name: string;
  boundary: Polygon;
  alignment: LineString;
};

export type Station = {
  stationId: string;
  name: string;
  location: Point;
};

export type UpdateFilter = {
  keyword?: string;
  workType?: WorkType | "All";
  status?: NewsStatus | "All";
  closure?: ClosureStatus | "All";
  zoneId?: string | "All";
};

export type StaffRole = "Authority officer" | "Project officer" | "Administrator";

export type StaffSession = {
  staffId: string;
  name: string;
  staffRole: StaffRole;
  department: string;
  assignedZone: string;
};
