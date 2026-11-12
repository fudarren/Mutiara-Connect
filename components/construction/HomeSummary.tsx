"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ClosureBadge, WorkTypeBadge } from "@/components/construction/Badges";
import { PROTOTYPE_NOW_LABEL, closureStatus, formatMYT } from "@/lib/construction";
import { useConstructionUpdates } from "@/lib/constructionStore";

export function HomeSummary() {
  const all = useConstructionUpdates();
  const published = useMemo(() => all.filter((u) => u.isPublished), [all]);

  const stats = useMemo(
    () => [
      { label: "Road closures in effect", value: published.filter((u) => ["Closed", "Partially open"].includes(closureStatus(u))).length, tone: "text-[#a81920]" },
      { label: "Works under construction", value: published.filter((u) => u.status === "Under construction").length, tone: "text-[#7a5600]" },
      { label: "Closures scheduled", value: published.filter((u) => closureStatus(u) === "Scheduled").length, tone: "text-[#24558f]" },
      { label: "Urgent notices", value: published.filter((u) => u.isUrgent && u.status !== "Completed").length, tone: "text-[#a81920]" },
    ],
    [published],
  );

  const latest = useMemo(
    () => [...published].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)).slice(0, 4),
    [published],
  );

  return (
    <>
      <section aria-label="Construction summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-md border border-[#e7ecef] bg-white p-4 shadow-[0_1px_2px_#dfe7eb]">
            <div className={`text-[30px] font-semibold leading-9 tracking-[-0.04em] ${s.tone}`}>{s.value}</div>
            <div className="mt-1 text-[11px] text-[#5d686c]">{s.label}</div>
          </div>
        ))}
      </section>

      <section aria-label="Latest construction updates" className="mt-6 rounded-md border border-[#e7ecef] bg-white p-4 shadow-[0_1px_2px_#dfe7eb]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-bold tracking-[-0.02em]">Latest construction updates</h2>
          <Link href="/projects" className="text-[12px] font-semibold text-[#087b84] hover:underline">View all on map</Link>
        </div>
        <ul className="mt-3 grid gap-2.5">
          {latest.map((u) => (
            <li key={u.updateId} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded border border-[#eef2f4] px-3 py-2.5">
              <WorkTypeBadge type={u.workType} />
              <ClosureBadge status={closureStatus(u)} />
              <Link href={`/projects/${u.updateId}`} className="min-w-[200px] flex-1 text-[13px] font-semibold hover:text-[#087b84] hover:underline">
                {u.title}
              </Link>
              <span className="text-[10px] text-[#7a8588]">{formatMYT(u.lastUpdated)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[10px] text-[#7a8588]">Last updated {PROTOTYPE_NOW_LABEL}.</p>
      </section>
    </>
  );
}
