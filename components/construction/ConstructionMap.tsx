"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Position } from "geojson";
import {
  ALIGNMENT_COLOR,
  DETOUR_COLOR,
  PEDESTRIAN_COLOR,
  centroidOf,
  closureStatus,
  formatDate,
  fullAlignment,
  stations,
  workTypeStyle,
  zones,
} from "@/lib/construction";
import type { ConstructionUpdate } from "@/types";

export type MapBounds = [[number, number], [number, number]];

export type ConstructionMapProps = {
  updates: ConstructionUpdate[];
  selectedId?: string | null;
  /** Increase to fly the map to the selected update (e.g. when chosen from the list). */
  focusNonce?: number;
  onSelect?: (updateId: string) => void;
  showAlignment?: boolean;
  showZones?: boolean;
  showDetours?: boolean;
  showPedestrian?: boolean;
  bounds?: MapBounds;
  /** Show "View details" links in popups. */
  linkPopups?: boolean;
  className?: string;
};

/** Penang Island framing used by default. */
export const PENANG_BOUNDS: MapBounds = [[5.285, 100.262], [5.43, 100.378]];

export const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const ll = (p: Position): L.LatLngTuple => [p[1], p[0]];

function pinIcon(u: ConstructionUpdate, selected: boolean) {
  const { color, glyph } = workTypeStyle[u.workType];
  return L.divIcon({
    className: `mc-pin${selected ? " is-selected" : ""}`,
    html: `<span style="background:${color}">${glyph}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function areaStyle(u: ConstructionUpdate, selected: boolean): L.PathOptions {
  const { color } = workTypeStyle[u.workType];
  return { color, weight: selected ? 4 : 2, fillColor: color, fillOpacity: selected ? 0.4 : 0.25 };
}

/** Popup content is built with DOM nodes + textContent, so staff-entered text is never parsed as HTML. */
function popupNode(u: ConstructionUpdate, link: boolean, navigate: (href: string) => void): HTMLElement {
  const root = document.createElement("div");
  root.className = "mc-popup grid gap-1 text-xs leading-[17px]";
  const line = (text: string, className = "") => {
    const el = document.createElement("span");
    el.textContent = text;
    if (className) el.className = className;
    root.appendChild(el);
    return el;
  };
  line(u.title, "text-[13px] font-bold");
  line(`${u.workType}, ${u.status}`);
  line(`Road status: ${closureStatus(u)}`, "font-semibold");
  line(`${formatDate(u.startDate)} - ${formatDate(u.endDate)}`);
  if (link) {
    const a = document.createElement("a");
    a.href = `/projects/${u.updateId}`;
    a.textContent = "View details";
    a.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(a.getAttribute("href") ?? "/projects");
    });
    root.appendChild(a);
  }
  return root;
}

/*
 * The map is created and destroyed inside effects (instead of react-leaflet's
 * component tree). With Cache Components, Next keeps a hidden page alive and
 * re-runs its effects when the user comes back; creating the map in an effect
 * means it is rebuilt cleanly each time instead of reusing a destroyed map.
 */
export default function ConstructionMap({
  updates,
  selectedId = null,
  focusNonce = 0,
  onSelect,
  showAlignment = true,
  showZones = false,
  showDetours = true,
  showPedestrian = true,
  bounds = PENANG_BOUNDS,
  linkPopups = true,
  className = "h-[520px]",
}: ConstructionMapProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const groupRef = useRef<L.LayerGroup | null>(null);
  const shapesRef = useRef(new Map<string, { area: L.Polygon; pin: L.Marker }>());
  const onSelectRef = useRef(onSelect);
  const lastFly = useRef(0);
  const [tilesFailed, setTilesFailed] = useState(false);
  const boundsKey = JSON.stringify(bounds);

  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  // 1. The map itself.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const map = L.map(el, { scrollWheelZoom: true });
    map.fitBounds(JSON.parse(boundsKey) as MapBounds);
    const tiles = L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 19 }).addTo(map);
    tiles.on("tileerror", () => setTilesFailed(true));
    tiles.on("tileload", () => setTilesFailed(false));
    mapRef.current = map;
    groupRef.current = L.layerGroup().addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      groupRef.current = null;
    };
  }, [boundsKey]);

  // 2. Layers (rebuilt when the data or visible layers change; selection is styled separately below).
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const shapes = shapesRef.current;
    shapes.clear();
    const select = (id: string) => onSelectRef.current?.(id);

    if (showZones) {
      for (const zone of zones) {
        L.polygon(zone.boundary.coordinates[0].map(ll), {
          color: "#5f7f86", weight: 1.5, dashArray: "6 6", fillColor: "#087b84", fillOpacity: 0.04, interactive: false,
        }).addTo(group);
      }
    }

    if (showAlignment) {
      L.polyline(fullAlignment.map(ll), { color: ALIGNMENT_COLOR, weight: 5, opacity: 0.85 }).addTo(group);
      for (const station of stations) {
        L.circleMarker(ll(station.location.coordinates), {
          radius: 7, color: ALIGNMENT_COLOR, weight: 3, fillColor: "#ffffff", fillOpacity: 1,
        })
          .bindTooltip(station.name, { permanent: true, direction: "right", offset: [8, 0], className: "mc-station-label" })
          .addTo(group);
      }
    }

    for (const u of updates) {
      const area = L.polygon(u.affectedArea.coordinates[0].map(ll), areaStyle(u, false)).addTo(group);
      area.on("click", () => select(u.updateId));
      if (showDetours && u.detourRoutes) {
        L.polyline(u.detourRoutes.coordinates.map((line) => line.map(ll)), { color: DETOUR_COLOR, weight: 4, dashArray: "10 8" }).addTo(group);
      }
      if (showPedestrian && u.pedestrianRoutes) {
        L.polyline(u.pedestrianRoutes.coordinates.map((line) => line.map(ll)), {
          color: PEDESTRIAN_COLOR, weight: 4, dashArray: "2 8", lineCap: "round",
        }).addTo(group);
      }
      shapes.set(u.updateId, { area, pin: null as unknown as L.Marker });
    }

    for (const u of updates) {
      const c = centroidOf(u.affectedArea);
      const pin = L.marker([c[1], c[0]], {
        icon: pinIcon(u, false),
        title: `${u.workType}: ${u.title}`,
        alt: `${u.workType}: ${u.title}`,
        keyboard: true,
        riseOnHover: true,
      })
        .bindPopup(popupNode(u, linkPopups, (href) => router.push(href)))
        .addTo(group);
      pin.on("click", () => select(u.updateId));
      const entry = shapes.get(u.updateId);
      if (entry) entry.pin = pin;
    }

    return () => {
      group.clearLayers();
      shapes.clear();
    };
  }, [boundsKey, updates, showAlignment, showZones, showDetours, showPedestrian, linkPopups, router]);

  // 3. Highlight the selected update.
  useEffect(() => {
    const byId = new Map(updates.map((u) => [u.updateId, u]));
    shapesRef.current.forEach(({ area, pin }, id) => {
      const u = byId.get(id);
      if (!u) return;
      const selected = id === selectedId;
      area.setStyle(areaStyle(u, selected));
      pin.setIcon(pinIcon(u, selected));
    });
  }, [boundsKey, updates, selectedId, showAlignment, showZones, showDetours, showPedestrian, linkPopups, router]);

  // 4. Fly to the selected update when asked (e.g. "Show on map" in the list).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focusNonce || focusNonce === lastFly.current || !selectedId) return;
    const u = updates.find((x) => x.updateId === selectedId);
    if (!u) return;
    lastFly.current = focusNonce;
    const c = centroidOf(u.affectedArea);
    map.flyTo([c[1], c[0]], Math.max(map.getZoom(), 15), { duration: 0.8 });
  }, [boundsKey, focusNonce, selectedId, updates]);

  return (
    <div className={`relative z-0 overflow-hidden rounded-md ${className}`}>
      <div
        ref={containerRef}
        role="region"
        aria-label="Interactive construction map of the Penang LRT Mutiara Line"
        style={{ height: "100%", width: "100%" }}
      />
      {tilesFailed && (
        <div
          role="status"
          className="absolute inset-x-3 bottom-8 z-[1000] rounded bg-[#fff4d6] px-3 py-2 text-xs text-[#6b4b00] shadow"
        >
          Map background could not be loaded (offline?). Routes and markers are still shown. You can also use the List view.
        </div>
      )}
    </div>
  );
}
