"use client";

import Link from "next/link";
import { PortalIcon } from "@/components/PortalIcons";
import { ClosureBadge, DraftBadge, ImpactBadge, ProgressBadge, UrgentBadge, WorkTypeBadge } from "@/components/construction/Badges";
import { ConstructionMapLoader } from "@/components/construction/ConstructionMapLoader";
import type { MapBounds } from "@/components/construction/ConstructionMap";
import {
  DETOUR_COLOR,
  PEDESTRIAN_COLOR,
  closureStatus,
  formatDate,
  formatMYT,
  nearestStation,
  zoneOf,
} from "@/lib/construction";
import { useConstructionUpdates } from "@/lib/constructionStore";
import { useStaffSession } from "@/lib/staffSession";
import type { ClosureStatus, ConstructionUpdate } from "@/types";

function boundsFor(u: ConstructionUpdate): MapBounds {
  const pts = [
    ...u.affectedArea.coordinates[0],
    ...(u.detourRoutes?.coordinates.flat() ?? []),
    ...(u.pedestrianRoutes?.coordinates.flat() ?? []),
  ];
  const lngs = pts.map((p) => p[0]);
  const lats = pts.map((p) => p[1]);
  const pad = 0.0015;
  return [
    [Math.min(...lats) - pad, Math.min(...lngs) - pad],
    [Math.max(...lats) + pad, Math.max(...lngs) + pad],
  ];
}

function closureExplanation(u: ConstructionUpdate, status: ClosureStatus): string {
  const period = `${formatDate(u.startDate)} to ${formatDate(u.endDate)}`;
  if (u.source) {
    if (status === "Notice ended") return "The published notice period has ended. This does not confirm that the road has reopened or that construction is complete. Check the source for extensions.";
    return `The notice describes ${status === "Diversion" ? "lane diversions" : "traffic restrictions"} from ${period}, ${u.workingHours}. This is a published schedule, not live lane availability. Source reviewed ${formatDate(u.source.reviewedOn)}${u.source.locallyEdited ? "; this record has local edits" : ""}.`;
  }
  switch (status) {
    case "Closed":
      return `The road is closed to through traffic from ${period} (${u.workingHours}).`;
    case "Partially open":
      return `One or more lanes are closed from ${period} (${u.workingHours}). Remaining lanes stay open, so expect delays.`;
    case "Scheduled":
      return `A closure is scheduled to start on ${formatDate(u.startDate)} and run until ${formatDate(u.endDate)} (${u.workingHours}).`;
    default:
      return u.status === "Completed"
        ? "Works are completed and normal access has resumed."
        : "No road closure is in effect for this work.";
  }
}

/** The form saves "To be confirmed." for blank access notes, so treat that (and blanks) as not specified. */
function isSpecified(text: string): boolean {
  return !/^\s*(to be confirmed\.?|tbc\.?|to be announced\.?|n\/a|none|-)?\s*$/i.test(text);
}

function detourText(u: ConstructionUpdate, status: ClosureStatus): string {
  const roads = u.affectedRoads.join(", ");
  if (status === "Closed" || status === "Partially open") {
    return `No separate detour route has been drawn for this work. Traffic is managed on site, so follow the marshals and posted signs along ${roads}, allow extra travel time and use nearby parallel roads where possible.`;
  }
  if (status === "Scheduled") {
    return `No detour is in place yet. Detour details will be published here before the closure starts on ${formatDate(u.startDate)}.`;
  }
  if (u.status === "Completed") return "This work is completed, so no detour is needed.";
  return `No detour is needed for this work. ${roads} stay open to traffic, but take extra care near the site.`;
}

function businessText(u: ConstructionUpdate): string {
  return `Businesses along ${u.affectedRoads.join(", ")} stay open during the works. Customers can reach shops on foot using the marked walkways, and delivery vehicles should follow the posted signs. Ask the site marshals on duty if you need a special access arrangement.`;
}

function pedestrianText(u: ConstructionUpdate): string {
  return `Footpaths near ${u.affectedRoads.join(", ")} stay open where it is safe. Please follow the marked walkways, hoarding signs and marshal instructions around the works, and take extra care when crossing near the site.`;
}

function Panel({ title, badge, children }: { title: string; badge?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-[#e7ecef] bg-white p-4 shadow-[0_1px_2px_#dfe7eb]">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-[14px] font-bold tracking-[-0.01em]">{title}</h2>
        {badge}
      </div>
      <div className="mt-2 text-[13px] leading-5 text-[#4a5a60]">{children}</div>
    </section>
  );
}

export function ConstructionDetail({ updateId }: { updateId: string }) {
  const all = useConstructionUpdates();
  const staff = useStaffSession();
  const update = all.find((u) => u.updateId === updateId && (u.isPublished || staff));

  if (!update) {
    return (
      <div className="mx-auto w-full max-w-[900px] px-3 py-10 sm:px-5">
        <div role="alert" className="rounded-md border border-[#e7ecef] bg-white p-6 text-center shadow-[0_1px_2px_#dfe7eb]">
          <h1 className="text-[22px] tracking-[-0.03em]">Construction update not found</h1>
          <p className="mt-2 text-sm text-[#5d686c]">
            This update may have been removed or is not published yet.
          </p>
          <Link href="/projects" className="mt-4 inline-flex rounded bg-[#087b84] px-4 py-2 text-xs font-semibold text-white">
            Back to construction map
          </Link>
        </div>
      </div>
    );
  }

  const status = closureStatus(update);
  const zone = zoneOf(update);
  const station = nearestStation(update);
  const hasDetour = update.detourRoutes !== null;
  const hasPedRoute = update.pedestrianRoutes !== null;

  return (
    <div className="mx-auto w-full max-w-[1130px] px-3 py-6 text-[#181c1e] sm:px-5 sm:py-7">
      <nav aria-label="Breadcrumb" className="mb-4 text-[11px] text-[#718083]">
        <Link href="/projects" className="font-semibold text-[#087b84] hover:underline">Back to Construction Map</Link>
        <span aria-hidden="true"> / </span>
        <span>{update.updateId.toUpperCase()}</span>
      </nav>

      <header className="mb-5">
        <div className="flex flex-wrap items-center gap-1.5">
          <WorkTypeBadge type={update.workType} />
          <ClosureBadge status={status} />
          <ProgressBadge status={update.status} />
          <ImpactBadge level={update.impactLevel} />
          {update.isUrgent && <UrgentBadge />}
          {!update.isPublished && <DraftBadge />}
        </div>
        <h1 className="mt-3 text-[29px] leading-[36px] tracking-[-0.04em]">{update.title}</h1>
        <p className="mt-1 text-[13px] text-[#5d686c]">
          {update.affectedRoads.join(", ")}
          {zone ? `, ${zone.name}` : ""}
        </p>
        <p className="mt-1 text-[11px] text-[#7a8588]">
          {update.source && !update.source.locallyEdited ? `Source reviewed ${formatDate(update.source.reviewedOn)}` : `Last updated ${formatMYT(update.lastUpdated)}`}, ID {update.updateId.toUpperCase()}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid content-start gap-2">
          <ConstructionMapLoader
            updates={[update]}
            selectedId={update.updateId}
            bounds={boundsFor(update)}
            linkPopups={false}
            className="h-[340px] sm:h-[400px]"
            fallback={
              <div role="alert" className="rounded-md border border-[#f0d9a8] bg-[#fff4d6] p-4 text-sm text-[#6b4b00]">
                The map is unavailable. Affected roads: {update.affectedRoads.join(", ")}.
              </div>
            }
          />
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-[#4a5e66]">
            {hasDetour && (
              <span className="inline-flex items-center gap-1.5">
                <svg width="26" height="6" aria-hidden="true"><line x1="0" y1="3" x2="26" y2="3" stroke={DETOUR_COLOR} strokeWidth="4" strokeDasharray="7 5" /></svg>
                Detour route
              </span>
            )}
            {hasPedRoute && (
              <span className="inline-flex items-center gap-1.5">
                <svg width="26" height="6" aria-hidden="true"><line x1="0" y1="3" x2="26" y2="3" stroke={PEDESTRIAN_COLOR} strokeWidth="4" strokeDasharray="1 6" strokeLinecap="round" /></svg>
                Pedestrian diversion
              </span>
            )}
            <span>{update.geometryAccuracy === "approximate" ? "Shaded area = approximate locality, not lane boundaries" : "Shaded area = affected area"}</span>
          </div>
        </div>

        <aside aria-label="At a glance" className="rounded-md border border-[#e7ecef] bg-white p-4 shadow-[0_1px_2px_#dfe7eb]">
          <h2 className="text-[14px] font-bold">At a glance</h2>
          <dl className="mt-3 grid gap-3 text-[12px]">
            {[
              ["Schedule", `${formatDate(update.startDate)} - ${formatDate(update.endDate)}`],
              ["Working hours", update.workingHours],
              ["Nearest station", station.name],
              ["Zone", zone?.name ?? "Outside defined zones"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#718083]">{label}</dt>
                <dd className="mt-0.5 text-[#25363d]">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 grid gap-2">
            <Link
              href={`/projects?focus=${update.updateId}`}
              className="flex items-center justify-center gap-2 rounded bg-[#087b84] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#066a72]"
            >
              Show on full map <PortalIcon name="arrow" size={14} />
            </Link>
            <Link
              href="/notification"
              className="rounded bg-[#e8edf1] px-3 py-2 text-center text-[11px] font-semibold text-[#25363d] hover:bg-[#d9e2e7]"
            >
              View related notifications
            </Link>
          </div>
        </aside>
      </div>

      <section className="mt-4 rounded-md border border-[#e7ecef] bg-white p-4 shadow-[0_1px_2px_#dfe7eb]">
        <h2 className="text-[14px] font-bold">About this work</h2>
        <p className="mt-2 text-[13px] leading-5 text-[#4a5a60]">{update.description}</p>
      </section>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Panel title="Road closure status" badge={<ClosureBadge status={status} />}>
          {closureExplanation(update, status)}
        </Panel>
        <Panel title="Detour route">
          {hasDetour ? (
            <>
              A detour is available and shown as the green dashed line on the map. Affected roads:{" "}
              <b>{update.affectedRoads.join(", ")}</b>. Follow the posted detour signs.
            </>
          ) : update.source ? (
            "No verified detour geometry is mapped here. Follow posted traffic plans and on-site directions for lane diversions."
          ) : (
            detourText(update, status)
          )}
        </Panel>
        <Panel title="Business access">
          {isSpecified(update.businessAccessInfo) ? update.businessAccessInfo : businessText(update)}
        </Panel>
        <Panel title="Pedestrian accessibility">
          {isSpecified(update.pedestrianAccessInfo) ? update.pedestrianAccessInfo : pedestrianText(update)}
          {hasPedRoute && <> The diverted walkway is shown as the blue dotted line on the map.</>}
        </Panel>
      </div>
    </div>
  );
}
