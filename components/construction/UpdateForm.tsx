"use client";

import { useState } from "react";
import type { Position } from "geojson";
import { AreaPickerLoader } from "@/components/construction/AreaPickerLoader";
import type { PickerMode } from "@/components/construction/AreaPicker";
import type { MapBounds } from "@/components/construction/ConstructionMap";
import { CONSTRUCTION_AS_OF, stations, workTypes } from "@/lib/construction";
import type { ConstructionUpdate, ImpactLevel, NewsStatus, WorkType } from "@/types";

type Props = {
  /** Existing update when editing; undefined when creating a new one. */
  initial?: ConstructionUpdate;
  newId: string;
  onSave: (update: ConstructionUpdate) => void;
  onCancel: () => void;
};

const fieldLabel = "grid gap-1 text-[11px] font-bold text-[#25363d]";
const input = "h-[34px] w-full rounded border border-[#d5dfe4] bg-white px-2.5 text-[13px] font-normal text-[#181c1e]";
const textarea = "w-full rounded border border-[#d5dfe4] bg-white px-2.5 py-2 text-[13px] font-normal leading-5 text-[#181c1e]";
const errorText = "text-[11px] font-semibold text-[#a81920]";

const impacts: ImpactLevel[] = ["Low", "Moderate", "High", "Not specified"];
const progress: NewsStatus[] = ["Planning", "Under construction", "Completed"];

function ringToPoints(update?: ConstructionUpdate): Position[] {
  return update ? update.affectedArea.coordinates[0].slice(0, -1) : [];
}

function boundsOf(points: Position[]): MapBounds | undefined {
  if (points.length === 0) return undefined;
  const lngs = points.map((p) => p[0]);
  const lats = points.map((p) => p[1]);
  const pad = 0.002;
  return [[Math.min(...lats) - pad, Math.min(...lngs) - pad], [Math.max(...lats) + pad, Math.max(...lngs) + pad]];
}

function nowMYT() {
  // Malaysia time (UTC+8), written with an explicit offset. Called only from the submit handler.
  return `${new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 19)}+08:00`;
}

export function UpdateForm({ initial, newId, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [workType, setWorkType] = useState<WorkType>(initial?.workType ?? "Road Closure");
  const [status, setStatus] = useState<NewsStatus>(initial?.status ?? "Planning");
  const [impactLevel, setImpactLevel] = useState<ImpactLevel>(initial?.impactLevel ?? "Moderate");
  const [roads, setRoads] = useState(initial?.affectedRoads.join(", ") ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? CONSTRUCTION_AS_OF);
  const [endDate, setEndDate] = useState(initial?.endDate ?? CONSTRUCTION_AS_OF);
  const [workingHours, setWorkingHours] = useState(initial?.workingHours ?? "");
  const [businessAccessInfo, setBusinessAccessInfo] = useState(initial?.businessAccessInfo ?? "");
  const [pedestrianAccessInfo, setPedestrianAccessInfo] = useState(initial?.pedestrianAccessInfo ?? "");
  const [isUrgent, setIsUrgent] = useState(initial?.isUrgent ?? false);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);

  const [mode, setMode] = useState<PickerMode>("area");
  const [area, setArea] = useState<Position[]>(ringToPoints(initial));
  const [detour, setDetour] = useState<Position[]>(initial?.detourRoutes?.coordinates[0] ?? []);
  const [pedestrian, setPedestrian] = useState<Position[]>(initial?.pedestrianRoutes?.coordinates[0] ?? []);
  const [presetStation, setPresetStation] = useState(stations[0].stationId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusNonce, setFocusNonce] = useState(0);
  // Only the first drawn line is editable here; any extra lines are kept as they were.
  const extraDetours = initial?.detourRoutes?.coordinates.slice(1) ?? [];
  const extraPedestrian = initial?.pedestrianRoutes?.coordinates.slice(1) ?? [];
  const [pickerBounds] = useState(() => boundsOf(ringToPoints(initial)));

  const layers: Record<PickerMode, { points: Position[]; set: (p: Position[]) => void; label: string }> = {
    area: { points: area, set: setArea, label: "Affected area" },
    detour: { points: detour, set: setDetour, label: "Detour route" },
    pedestrian: { points: pedestrian, set: setPedestrian, label: "Pedestrian diversion" },
  };
  const active = layers[mode];

  /** Clears a field's error message as soon as the user edits that field. */
  const edit = (key: string, setter: (value: string) => void) => (value: string) => {
    setter(value);
    setErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  };

  function addPoint(point: Position) {
    active.set([...active.points, point]);
    setErrors((prev) => ({ ...prev, area: "" }));
  }

  function placePreset() {
    const station = stations.find((s) => s.stationId === presetStation);
    if (!station) return;
    const [lng, lat] = station.location.coordinates;
    const h = 0.0011;
    const w = 0.0015;
    const r = (n: number) => Math.round(n * 1e5) / 1e5;
    setMode("area");
    setArea([[r(lng - w), r(lat - h)], [r(lng + w), r(lat - h)], [r(lng + w), r(lat + h)], [r(lng - w), r(lat + h)]]);
    setErrors((prev) => ({ ...prev, area: "" }));
    setFocusNonce((n) => n + 1);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    const roadList = roads.split(",").map((r) => r.trim()).filter(Boolean);
    if (!title.trim()) next.title = "Enter a title.";
    if (!description.trim()) next.description = "Enter a short description.";
    if (roadList.length === 0) next.roads = "Enter at least one affected road (separate with commas).";
    if (!startDate) next.startDate = "Choose a start date.";
    if (!endDate) next.endDate = "Choose an end date.";
    else if (startDate && endDate < startDate) next.endDate = "End date cannot be before the start date.";
    if (area.length < 3) next.area = "Mark the affected area on the map with at least 3 points.";
    if (detour.length === 1) next.detour = "A detour route needs at least 2 points (or clear it).";
    if (pedestrian.length === 1) next.pedestrian = "A pedestrian diversion needs at least 2 points (or clear it).";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSave({
      updateId: initial?.updateId ?? newId,
      title: title.trim(),
      description: description.trim(),
      workType,
      affectedRoads: roadList,
      affectedArea: { type: "Polygon", coordinates: [[...area, area[0]]] },
      detourRoutes: detour.length >= 2 ? { type: "MultiLineString", coordinates: [detour, ...extraDetours] } : null,
      pedestrianRoutes: pedestrian.length >= 2 ? { type: "MultiLineString", coordinates: [pedestrian, ...extraPedestrian] } : null,
      pedestrianAccessInfo: pedestrianAccessInfo.trim() || "To be confirmed.",
      businessAccessInfo: businessAccessInfo.trim() || "To be confirmed.",
      startDate,
      endDate,
      workingHours: workingHours.trim() || "To be announced",
      impactLevel,
      status,
      isUrgent,
      isPublished,
      lastUpdated: nowMYT(),
      source: initial?.source ? { ...initial.source, locallyEdited: true } : undefined,
      geometryAccuracy: initial?.geometryAccuracy,
      impactBasis: initial && initial.impactLevel === impactLevel ? initial.impactBasis : undefined,
      trafficRestriction: initial?.workType === workType ? initial.trafficRestriction : undefined,
    });
  }

  const errorList = Object.values(errors).filter(Boolean);

  return (
    <form onSubmit={submit} noValidate className="rounded-md border border-[#087b84] bg-white p-4 shadow-[0_1px_3px_#cfe3e5]" aria-label={initial ? "Edit construction entry" : "Add construction entry"}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[17px] font-bold tracking-[-0.02em]">
          {initial ? `Edit entry ${initial.updateId.toUpperCase()}` : "Add construction entry"}
        </h2>
        <span className="text-[11px] text-[#718083]">Fields marked * are required</span>
      </div>

      {errorList.length > 0 && (
        <div role="alert" className="mt-3 rounded border border-[#f1c3c5] bg-[#fff1f1] p-3 text-[12px] text-[#a81920]">
          <b>Please fix the following before saving:</b>
          <ul className="mt-1 list-disc pl-5">
            {errorList.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>
      )}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className={`${fieldLabel} md:col-span-2`}>
          Title *
          <input className={input} value={title} onChange={(e) => edit("title", setTitle)(e.target.value)} autoFocus />
          {errors.title && <span className={errorText}>{errors.title}</span>}
        </label>
        <label className={`${fieldLabel} md:col-span-2`}>
          Description *
          <textarea className={textarea} rows={3} value={description} onChange={(e) => edit("description", setDescription)(e.target.value)} />
          {errors.description && <span className={errorText}>{errors.description}</span>}
        </label>
        <label className={fieldLabel}>
          Work type
          <select className={input} value={workType} onChange={(e) => setWorkType(e.target.value as WorkType)}>
            {workTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className={fieldLabel}>
          Progress
          <select className={input} value={status} onChange={(e) => setStatus(e.target.value as NewsStatus)}>
            {progress.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className={fieldLabel}>
          Impact level
          <select className={input} value={impactLevel} onChange={(e) => setImpactLevel(e.target.value as ImpactLevel)}>
            {impacts.map((i) => <option key={i}>{i}</option>)}
          </select>
        </label>
        <label className={fieldLabel}>
          Affected roads *
          <input className={input} value={roads} onChange={(e) => edit("roads", setRoads)(e.target.value)} placeholder="Jalan Penang, Lebuh Light" />
          {errors.roads && <span className={errorText}>{errors.roads}</span>}
        </label>
        <label className={fieldLabel}>
          Start date *
          <input type="date" className={input} value={startDate} onChange={(e) => edit("startDate", setStartDate)(e.target.value)} />
          {errors.startDate && <span className={errorText}>{errors.startDate}</span>}
        </label>
        <label className={fieldLabel}>
          End date *
          <input type="date" className={input} value={endDate} onChange={(e) => edit("endDate", setEndDate)(e.target.value)} />
          {errors.endDate && <span className={errorText}>{errors.endDate}</span>}
        </label>
        <label className={`${fieldLabel} md:col-span-2`}>
          Working hours
          <input className={input} value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} placeholder="e.g. Mon - Sat, 08:00 - 18:00" />
        </label>
        <label className={fieldLabel}>
          Business access information
          <textarea className={textarea} rows={2} value={businessAccessInfo} onChange={(e) => setBusinessAccessInfo(e.target.value)} />
        </label>
        <label className={fieldLabel}>
          Pedestrian accessibility information
          <textarea className={textarea} rows={2} value={pedestrianAccessInfo} onChange={(e) => setPedestrianAccessInfo(e.target.value)} />
        </label>
        <div className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-2">
          <label className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#25363d]">
            <input type="checkbox" className="size-4 accent-[#087b84]" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} />
            Mark as urgent
          </label>
          <label className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#25363d]">
            <input type="checkbox" className="size-4 accent-[#087b84]" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            Publish to the public portal
          </label>
        </div>
      </div>

      <fieldset className="mt-5 rounded-md border border-[#e7ecef] p-3.5">
        <legend className="px-1 text-[12px] font-bold">Mark affected area on map *</legend>
        <p className="text-[12px] leading-[18px] text-[#5d686c]">
          Choose a layer, then click the map to add points. The affected area needs at least 3 points; detour and
          pedestrian routes are optional (2 or more points).
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex rounded bg-[#f0f4f7]" role="group" aria-label="Layer to draw">
            {(Object.keys(layers) as PickerMode[]).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={`px-3 py-2 text-[11px] ${mode === m ? "m-0.5 rounded bg-white font-bold text-[#087b84] shadow-[0_1px_3px_#d5dfe4]" : "text-[#54636a]"}`}
              >
                {layers[m].label} ({layers[m].points.length})
              </button>
            ))}
          </div>
          <button type="button" onClick={() => active.set(active.points.slice(0, -1))} disabled={active.points.length === 0} className="rounded bg-[#e8edf1] px-3 py-2 text-[11px] font-semibold text-[#25363d] disabled:opacity-50">
            Undo last point
          </button>
          <button type="button" onClick={() => active.set([])} disabled={active.points.length === 0} className="rounded bg-[#e8edf1] px-3 py-2 text-[11px] font-semibold text-[#25363d] disabled:opacity-50">
            Clear {active.label.toLowerCase()}
          </button>
          <span className="ml-auto flex items-center gap-2">
            <label className="sr-only" htmlFor="preset-station">Station for preset area</label>
            <select id="preset-station" className="h-[32px] rounded bg-[#f0f4f7] px-2 text-[11px]" value={presetStation} onChange={(e) => setPresetStation(e.target.value)}>
              {stations.map((s) => <option key={s.stationId} value={s.stationId}>{s.name}</option>)}
            </select>
            <button type="button" onClick={placePreset} className="rounded bg-[#e8edf1] px-3 py-2 text-[11px] font-semibold text-[#25363d]">
              Place area at station
            </button>
          </span>
        </div>
        <div className="mt-3">
          <AreaPickerLoader mode={mode} area={area} detour={detour} pedestrian={pedestrian} onAddPoint={addPoint} bounds={pickerBounds} focusNonce={focusNonce} />
        </div>
        {errors.area && <p className={`${errorText} mt-2`}>{errors.area}</p>}
        {errors.detour && <p className={`${errorText} mt-1`}>{errors.detour}</p>}
        {errors.pedestrian && <p className={`${errorText} mt-1`}>{errors.pedestrian}</p>}
      </fieldset>

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="submit" className="rounded bg-[#087b84] px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-[#066a72]">
          {initial ? "Save changes" : "Create entry"}
        </button>
        <button type="button" onClick={onCancel} className="rounded bg-[#e8edf1] px-4 py-2.5 text-[12px] font-semibold text-[#25363d] hover:bg-[#d9e2e7]">
          Cancel
        </button>
      </div>
    </form>
  );
}
