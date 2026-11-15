"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import type { Position } from "geojson";
import { ALIGNMENT_COLOR, DETOUR_COLOR, PEDESTRIAN_COLOR, alignmentSegments, stations } from "@/lib/construction";
import { PENANG_BOUNDS, TILE_ATTRIBUTION, TILE_URL, type MapBounds } from "@/components/construction/ConstructionMap";

export type PickerMode = "area" | "detour" | "pedestrian";

export type AreaPickerProps = {
  mode: PickerMode;
  area: Position[];
  detour: Position[];
  pedestrian: Position[];
  onAddPoint: (point: Position) => void;
  bounds?: MapBounds;
  /** Increase to zoom the map to the current affected area. */
  focusNonce?: number;
};

const ll = (p: Position): L.LatLngTuple => [p[1], p[0]];

const modeLabel: Record<PickerMode, string> = {
  area: "affected area",
  detour: "detour route",
  pedestrian: "pedestrian diversion",
};

/** Built inside effects so it is rebuilt cleanly when Next re-shows a cached page (see ConstructionMap). */
export default function AreaPicker({ mode, area, detour, pedestrian, onAddPoint, bounds = PENANG_BOUNDS, focusNonce = 0 }: AreaPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const groupRef = useRef<L.LayerGroup | null>(null);
  const onAddRef = useRef(onAddPoint);
  const lastFocus = useRef(0);
  const boundsKey = JSON.stringify(bounds);

  useEffect(() => {
    onAddRef.current = onAddPoint;
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const map = L.map(el, { scrollWheelZoom: true });
    map.fitBounds(JSON.parse(boundsKey) as MapBounds);
    L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 19 }).addTo(map);
    map.on("click", (e: L.LeafletMouseEvent) => {
      onAddRef.current([Math.round(e.latlng.lng * 1e5) / 1e5, Math.round(e.latlng.lat * 1e5) / 1e5]);
    });
    mapRef.current = map;
    groupRef.current = L.layerGroup().addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      groupRef.current = null;
    };
  }, [boundsKey]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    for (const segment of alignmentSegments) {
      L.polyline(segment.coordinates.map(ll), { color: ALIGNMENT_COLOR, weight: 4, opacity: 0.5, interactive: false }).addTo(group);
    }
    for (const s of stations) {
      L.circleMarker(ll(s.location.coordinates), { radius: 5, color: ALIGNMENT_COLOR, weight: 2, fillColor: "#fff", fillOpacity: 1, interactive: false })
        .bindTooltip(`${s.name}${s.provisional ? " (provisional)" : ""}`, { permanent: true, direction: "right", offset: [6, 0], className: "mc-station-label" })
        .addTo(group);
    }

    if (area.length >= 3) {
      L.polygon(area.map(ll), { color: "#c9222b", weight: 3, fillColor: "#c9222b", fillOpacity: 0.25, interactive: false }).addTo(group);
    } else if (area.length === 2) {
      L.polyline(area.map(ll), { color: "#c9222b", weight: 3, interactive: false }).addTo(group);
    }
    if (detour.length >= 2) {
      L.polyline(detour.map(ll), { color: DETOUR_COLOR, weight: 4, dashArray: "10 8", interactive: false }).addTo(group);
    }
    if (pedestrian.length >= 2) {
      L.polyline(pedestrian.map(ll), { color: PEDESTRIAN_COLOR, weight: 4, dashArray: "2 8", lineCap: "round", interactive: false }).addTo(group);
    }

    const vertices: [Position[], string][] = [[area, "#c9222b"], [detour, DETOUR_COLOR], [pedestrian, PEDESTRIAN_COLOR]];
    for (const [points, color] of vertices) {
      points.forEach((p, i) => {
        L.circleMarker(ll(p), { radius: 6, color: "#fff", weight: 2, fillColor: color, fillOpacity: 1, interactive: false })
          .bindTooltip(`Point ${i + 1}`)
          .addTo(group);
      });
    }

    return () => {
      group.clearLayers();
    };
  }, [boundsKey, area, detour, pedestrian]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusNonce || focusNonce === lastFocus.current || area.length === 0) return;
    lastFocus.current = focusNonce;
    map.fitBounds(L.latLngBounds(area.map(ll)).pad(1.5), { maxZoom: 17 });
  }, [boundsKey, focusNonce, area]);

  return (
    <div className="mc-picker relative z-0 h-[360px] overflow-hidden rounded-md border border-[#d9e2e7]">
      <div
        ref={containerRef}
        role="region"
        aria-label={`Map for marking the ${modeLabel[mode]}. Click to add points, or use the buttons above.`}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
