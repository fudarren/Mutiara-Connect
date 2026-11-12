"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import type { ConstructionMapProps } from "./ConstructionMap";

function MapSkeleton({ className = "h-[520px]" }: { className?: string }) {
  return (
    <div
      role="status"
      className={`grid place-items-center rounded-md border border-[#e7ecef] bg-[#f0f4f7] text-sm text-[#5d686c] ${className}`}
    >
      Loading map...
    </div>
  );
}

// Leaflet touches `window`, so the map is only rendered in the browser.
const LazyMap = dynamic<ConstructionMapProps>(() => import("./ConstructionMap"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

type BoundaryProps = { fallback: ReactNode; children: ReactNode };

/** If the map cannot load, show the fallback (the list view) instead of a blank page. */
class MapErrorBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function ConstructionMapLoader({
  fallback,
  ...props
}: ConstructionMapProps & { fallback?: ReactNode }) {
  return (
    <MapErrorBoundary
      fallback={
        fallback ?? (
          <div role="alert" className="rounded-md border border-[#f0d9a8] bg-[#fff4d6] p-4 text-sm text-[#6b4b00]">
            The map is currently unavailable. Please use the list view instead.
          </div>
        )
      }
    >
      <LazyMap {...props} />
    </MapErrorBoundary>
  );
}
