"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PortalIcon } from "@/components/PortalIcons";
import { ClosureBadge, ImpactBadge, ProgressBadge, UrgentBadge, WorkTypeBadge } from "@/components/construction/Badges";
import { ConstructionMapLoader } from "@/components/construction/ConstructionMapLoader";
import {
  DETOUR_COLOR,
  PEDESTRIAN_COLOR,
  CONSTRUCTION_REVIEW_LABEL,
  ALIGNMENT_COLOR,
  closureStatus,
  filterUpdates,
  formatDate,
  toFeatureCollection,
  workTypeStyle,
  workTypes,
  zoneOf,
  zones,
} from "@/lib/construction";
import { useConstructionUpdates } from "@/lib/constructionStore";
import type { ClosureStatus, ConstructionUpdate, NewsStatus, WorkType } from "@/types";

type View = "map" | "list";

const statuses: (NewsStatus | "All")[] = ["All", "Planning", "Under construction", "Completed"];
const closures: (ClosureStatus | "All")[] = ["All", "Closed", "Partially open", "Open", "Scheduled", "Diversion", "Notice ended"];

const selectClass =
  "h-[33px] w-full min-w-0 rounded bg-[#f0f4f7] px-2 text-[12px] text-[#181c1e]";
const labelClass = "grid min-w-[130px] flex-1 gap-1 text-[10px] font-bold uppercase tracking-[0.04em] text-[#718083]";

function UpdateCard({
  update,
  selected,
  onShowOnMap,
  full = false,
}: {
  update: ConstructionUpdate;
  selected: boolean;
  onShowOnMap: (id: string) => void;
  full?: boolean;
}) {
  const zone = zoneOf(update);
  return (
    <article
      className={`rounded-md border bg-white p-3.5 shadow-[0_1px_2px_#e1e8eb] ${selected ? "border-[#087b84] ring-2 ring-[#087b84]/25" : "border-[#e7ecef]"}`}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <WorkTypeBadge type={update.workType} />
        <ClosureBadge status={closureStatus(update)} />
        {update.isUrgent && <UrgentBadge />}
      </div>
      <h3 className="mt-2 text-[14px] font-bold leading-5 tracking-[-0.01em]">{update.title}</h3>
      <p className="mt-1 text-[11px] leading-4 text-[#5d686c]">
        {update.affectedRoads.join(", ")}
        {zone ? `, ${zone.name}` : ""}
      </p>
      <p className="mt-1 text-[11px] text-[#748084]">
        {formatDate(update.startDate)} to {formatDate(update.endDate)}, {update.workingHours}
      </p>
      {full && (
        <>
          <p className="mt-2 text-xs leading-[18px] text-[#5c686d]">{update.description}</p>
          <dl className="mt-2 grid gap-1 text-[11px] leading-4 text-[#5c686d]">
            <div><dt className="inline font-bold text-[#25363d]">Business access: </dt><dd className="inline">{update.businessAccessInfo}</dd></div>
            <div><dt className="inline font-bold text-[#25363d]">Pedestrian access: </dt><dd className="inline">{update.pedestrianAccessInfo}</dd></div>
          </dl>
        </>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ProgressBadge status={update.status} />
        <ImpactBadge level={update.impactLevel} />
        <span className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => onShowOnMap(update.updateId)}
            className="rounded bg-[#e8edf1] px-2.5 py-1.5 text-[10px] font-semibold text-[#25363d] hover:bg-[#d9e2e7]"
          >
            Show on map
          </button>
          <Link
            href={`/projects/${update.updateId}`}
            className="flex items-center gap-1.5 rounded bg-[#087b84] px-2.5 py-1.5 text-[10px] font-semibold text-white hover:bg-[#066a72]"
          >
            View details <PortalIcon name="arrow" size={13} />
          </Link>
        </span>
      </div>
    </article>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#4a5e66]" aria-label="Map legend">
      {workTypes.map((type) => (
        <span key={type} className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="grid size-[18px] place-items-center rounded-full text-[9px] font-bold text-white"
            style={{ background: workTypeStyle[type].color }}
          >
            {workTypeStyle[type].glyph}
          </span>
          {type}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5">
        <svg width="26" height="6" aria-hidden="true"><line x1="0" y1="3" x2="26" y2="3" stroke={ALIGNMENT_COLOR} strokeWidth="5" /></svg>
        LRT alignment
      </span>
      <span className="inline-flex items-center gap-1.5">
        <svg width="26" height="6" aria-hidden="true"><line x1="0" y1="3" x2="26" y2="3" stroke={DETOUR_COLOR} strokeWidth="4" strokeDasharray="7 5" /></svg>
        Detour route
      </span>
      <span className="inline-flex items-center gap-1.5">
        <svg width="26" height="6" aria-hidden="true"><line x1="0" y1="3" x2="26" y2="3" stroke={PEDESTRIAN_COLOR} strokeWidth="4" strokeDasharray="1 6" strokeLinecap="round" /></svg>
        Pedestrian diversion
      </span>
    </div>
  );
}

export function ConstructionExplorer({
  initialQuery = "",
  initialFocus = "",
}: {
  initialQuery?: string;
  initialFocus?: string;
}) {
  const allUpdates = useConstructionUpdates();
  const published = useMemo(() => allUpdates.filter((u) => u.isPublished), [allUpdates]);

  const [keyword, setKeyword] = useState(initialQuery);
  const [workType, setWorkType] = useState<WorkType | "All">("All");
  const [status, setStatus] = useState<NewsStatus | "All">("All");
  const [closure, setClosure] = useState<ClosureStatus | "All">("All");
  const [zoneId, setZoneId] = useState("All");
  const [view, setView] = useState<View>("map");
  const [selectedId, setSelectedId] = useState<string | null>(initialFocus || null);
  const [focusNonce, setFocusNonce] = useState(initialFocus ? 1 : 0);
  const [layers, setLayers] = useState({ alignment: true, zones: false, detours: true, pedestrian: true });

  const results = useMemo(
    () => filterUpdates(published, { keyword, workType, status, closure, zoneId }),
    [published, keyword, workType, status, closure, zoneId],
  );
  const selected = results.find((u) => u.updateId === selectedId) ?? null;
  const filtersActive = keyword !== "" || workType !== "All" || status !== "All" || closure !== "All" || zoneId !== "All";

  function clearFilters() {
    setKeyword("");
    setWorkType("All");
    setStatus("All");
    setClosure("All");
    setZoneId("All");
  }

  function showOnMap(id: string) {
    setView("map");
    setSelectedId(id);
    setFocusNonce((n) => n + 1);
  }

  function downloadGeoJSON() {
    const blob = new Blob([JSON.stringify(toFeatureCollection(results), null, 2)], { type: "application/geo+json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "mutiara-construction-updates.geojson";
    link.click();
    URL.revokeObjectURL(url);
  }

  const emptyState = (
    <div className="rounded-md border border-dashed border-[#cbd6dc] bg-white p-6 text-center text-sm text-[#5d686c]" role="status">
      No construction updates match your search or filters.
      <div>
        <button type="button" onClick={clearFilters} className="mt-3 rounded bg-[#087b84] px-3 py-2 text-xs font-semibold text-white">
          Clear filters
        </button>
      </div>
    </div>
  );

  const listView = (
    <div className="grid gap-3 md:grid-cols-2">
      {results.map((u) => (
        <UpdateCard key={u.updateId} update={u} selected={u.updateId === selectedId} onShowOnMap={showOnMap} full />
      ))}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-[1280px] px-3 py-6 text-[#181c1e] sm:px-5 sm:py-7">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#087b84]">
            Geo-zone: Penang Island
          </div>
          <h1 className="mt-1 text-[31px] leading-[38px] tracking-[-0.04em]">Construction Map</h1>
          <p className="mt-1 max-w-2xl text-[15px] leading-[22px] text-[#5d686c]">
            Check road closures, detours, pedestrian diversions and construction zones along the Penang LRT Mutiara Line.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-[33px] rounded bg-[#f0f4f7]" role="group" aria-label="Choose view">
            {(["map", "list"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={`px-3.5 text-[12px] ${view === v ? "m-0.5 rounded bg-white font-bold text-[#087b84] shadow-[0_1px_3px_#d5dfe4]" : "text-[#54636a]"}`}
              >
                {v === "map" ? "Map view" : "List view"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={downloadGeoJSON}
            className="h-[33px] rounded bg-[#e8edf1] px-3 text-[11px] font-semibold text-[#25363d] hover:bg-[#d9e2e7]"
          >
            Download GeoJSON
          </button>
        </div>
      </div>

      <section aria-label="Search and filters" className="mb-4 rounded-md border border-[#e7ecef] bg-white p-3.5 shadow-[0_1px_2px_#dfe7eb]">
        <div className="flex flex-wrap items-end gap-2.5">
          <label className="grid min-w-[220px] flex-[2] gap-1 text-[10px] font-bold uppercase tracking-[0.04em] text-[#718083]">
            Search
            <span className="flex h-[33px] items-center gap-2 rounded bg-[#f0f4f7] px-2.5 font-normal normal-case tracking-normal text-[#67747a]">
              <PortalIcon name="search" size={16} />
              <input
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Road, area or keyword, e.g. Komtar"
                className="w-full bg-transparent text-[12px] text-[#181c1e] outline-none placeholder:text-[#67747a]"
              />
            </span>
          </label>
          <label className={labelClass}>
            Type
            <select className={selectClass} value={workType} onChange={(e) => setWorkType(e.target.value as WorkType | "All")}>
              <option value="All">All types</option>
              {workTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className={labelClass}>
            Road status
            <select className={selectClass} value={closure} onChange={(e) => setClosure(e.target.value as ClosureStatus | "All")}>
              {closures.map((c) => <option key={c} value={c}>{c === "All" ? "All road statuses" : c}</option>)}
            </select>
          </label>
          <label className={labelClass}>
            Progress
            <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value as NewsStatus | "All")}>
              {statuses.map((s) => <option key={s} value={s}>{s === "All" ? "All progress" : s}</option>)}
            </select>
          </label>
          <label className={labelClass}>
            Zone
            <select className={selectClass} value={zoneId} onChange={(e) => setZoneId(e.target.value)}>
              <option value="All">All zones</option>
              {zones.map((z) => <option key={z.zoneId} value={z.zoneId}>{z.name}</option>)}
            </select>
          </label>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!filtersActive}
            className="h-[33px] rounded bg-[#e8edf1] px-3 text-[11px] font-semibold text-[#25363d] enabled:hover:bg-[#d9e2e7] disabled:opacity-50"
          >
            Clear filters
          </button>
        </div>
        <div className="mt-3 flex flex-col justify-between gap-1 text-[10px] text-[#7a8588] sm:flex-row">
          <span role="status">
            Showing {results.length} of {published.length} published updates
          </span>
          <span>Times shown in Malaysia time (MYT). Sources reviewed {CONSTRUCTION_REVIEW_LABEL}.</span>
        </div>
      </section>

      {results.length === 0 ? (
        emptyState
      ) : view === "list" ? (
        listView
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="grid content-start gap-3">
            <ConstructionMapLoader
              updates={results}
              selectedId={selectedId}
              focusNonce={focusNonce}
              onSelect={setSelectedId}
              showAlignment={layers.alignment}
              showZones={layers.zones}
              showDetours={layers.detours}
              showPedestrian={layers.pedestrian}
              className="h-[380px] sm:h-[540px]"
              fallback={
                <div className="grid gap-3">
                  <div role="alert" className="rounded-md border border-[#f0d9a8] bg-[#fff4d6] p-3 text-sm text-[#6b4b00]">
                    The map is currently unavailable, so the list view is shown instead.
                  </div>
                  {listView}
                </div>
              }
            />
            <fieldset className="flex flex-wrap gap-x-5 gap-y-2 rounded-md border border-[#e7ecef] bg-white px-3.5 py-2.5 text-[12px] text-[#25363d]">
              <legend className="px-1 text-[10px] font-bold uppercase tracking-[0.04em] text-[#718083]">Map layers</legend>
              {(
                [
                  ["alignment", "LRT alignment & stations"],
                  ["zones", "Zone boundaries"],
                  ["detours", "Detour routes"],
                  ["pedestrian", "Pedestrian diversions"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={layers[key]}
                    onChange={(e) => setLayers((prev) => ({ ...prev, [key]: e.target.checked }))}
                    className="size-4 accent-[#087b84]"
                  />
                  {label}
                </label>
              ))}
            </fieldset>
            <div className="rounded-md border border-[#e7ecef] bg-white px-3.5 py-3">
              <Legend />
            </div>
            {selected && (
              <section aria-label="Selected update" className="rounded-md border border-[#087b84] bg-[#f3fafa] p-3.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <WorkTypeBadge type={selected.workType} />
                  <ClosureBadge status={closureStatus(selected)} />
                </div>
                <h2 className="mt-2 text-[15px] font-bold">{selected.title}</h2>
                <p className="mt-1 text-xs leading-[18px] text-[#5c686d]">{selected.description}</p>
                <div className="mt-3 flex gap-2">
                  <Link href={`/projects/${selected.updateId}`} className="flex items-center gap-1.5 rounded bg-[#087b84] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#066a72]">
                    View full details <PortalIcon name="arrow" size={14} />
                  </Link>
                  <button type="button" onClick={() => setSelectedId(null)} className="rounded bg-white px-3 py-2 text-[11px] font-semibold text-[#25363d] shadow-[0_1px_3px_#d9e2e7]">
                    Clear selection
                  </button>
                </div>
              </section>
            )}
          </div>
          <aside aria-label="Matching construction updates" className="grid max-h-[none] content-start gap-2.5 lg:max-h-[860px] lg:overflow-y-auto lg:pr-1">
            {results.map((u) => (
              <UpdateCard key={u.updateId} update={u} selected={u.updateId === selectedId} onShowOnMap={showOnMap} />
            ))}
          </aside>
        </div>
      )}

      <p className="mt-6 text-[10px] leading-4 text-[#7a8588]">
        Construction notices reviewed 15 Nov 2026, alongside any locally saved entries. Statuses reflect that date
        and the published working hours, not live traffic. Shaded areas and route locations are approximate;
        Follow posted traffic plans and on-site directions. Updates are not refreshed automatically.
      </p>
    </div>
  );
}
