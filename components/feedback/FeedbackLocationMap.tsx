"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import type { Point } from "geojson";
import { TILE_ATTRIBUTION, TILE_URL } from "@/components/construction/ConstructionMap";

const defaultCenter: L.LatLngTuple = [5.3991, 100.3292];

export default function FeedbackLocationMap({ point }: { point: Point | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: false }).setView(defaultCenter, 11);
    L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 19 }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markerRef.current?.remove();
    if (!point) {
      map.setView(defaultCenter, 11);
      return;
    }
    const [longitude, latitude] = point.coordinates;
    const position: L.LatLngTuple = [latitude, longitude];
    markerRef.current = L.circleMarker(position, {
      radius: 9,
      color: "#fff",
      weight: 3,
      fillColor: "#087b84",
      fillOpacity: 1,
    }).addTo(map);
    map.setView(position, 15);
  }, [point]);

  return (
    <div className="overflow-hidden rounded border border-[#d5dfe4] bg-[#f0f4f7]">
      <div ref={containerRef} className="h-[210px] w-full" role="region" aria-label="Selected report location map" />
      <p className="border-t border-[#d5dfe4] bg-white px-3 py-2 text-[10px] leading-4 text-[#718083]">
        {point
          ? `Mock GeoJSON point: ${point.coordinates[1].toFixed(5)}, ${point.coordinates[0].toFixed(5)}`
          : "Select an area to preview its mock map location."}
      </p>
    </div>
  );
}
