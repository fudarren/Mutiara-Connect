import { workTypeStyle } from "@/lib/construction";
import type { ClosureStatus, ImpactLevel, NewsStatus, WorkType } from "@/types";

const closureClass: Record<ClosureStatus, string> = {
  Closed: "bg-[#ffd9d8] text-[#a81920]",
  "Partially open": "bg-[#ffe9cf] text-[#8a4f0b]",
  Open: "bg-[#dbeee6] text-[#176b61]",
  Scheduled: "bg-[#e1edfb] text-[#24558f]",
  Diversion: "bg-[#ffe9cf] text-[#8a4f0b]",
  "Notice ended": "bg-[#e8edf1] text-[#4a5e66]",
};

const impactClass: Record<ImpactLevel, string> = {
  High: "bg-[#ffd9d8] text-[#a81920]",
  Moderate: "bg-[#ffe9cf] text-[#8a4f0b]",
  Low: "bg-[#e8edf1] text-[#4a5e66]",
  "Not specified": "bg-[#e8edf1] text-[#4a5e66]",
};

const statusClass: Record<NewsStatus, string> = {
  Planning: "bg-[#e1edfb] text-[#24558f]",
  "Under construction": "bg-[#fff0c9] text-[#7a5600]",
  Completed: "bg-[#dbeee6] text-[#176b61]",
};

const pill = "inline-flex items-center gap-1.5 whitespace-nowrap rounded px-2 py-1 text-[10px] font-bold";

export function WorkTypeBadge({ type }: { type: WorkType }) {
  const { color, glyph } = workTypeStyle[type];
  return (
    <span className={`${pill} bg-[#f0f4f7] text-[#25363d]`}>
      <span
        aria-hidden="true"
        className="grid size-4 place-items-center rounded-full text-[9px] text-white"
        style={{ background: color }}
      >
        {glyph}
      </span>
      {type}
    </span>
  );
}

export function ClosureBadge({ status }: { status: ClosureStatus }) {
  return <span className={`${pill} ${closureClass[status]}`}>{status}</span>;
}

export function ImpactBadge({ level }: { level: ImpactLevel }) {
  return <span className={`${pill} ${impactClass[level]}`}>{level === "Not specified" ? "Impact not specified" : `${level} impact`}</span>;
}

export function ProgressBadge({ status }: { status: NewsStatus }) {
  return <span className={`${pill} ${statusClass[status]}`}>{status}</span>;
}

export function DraftBadge() {
  return <span className={`${pill} bg-[#edf1f3] text-[#5e6b70]`}>Draft - not published</span>;
}

export function UrgentBadge() {
  return <span className={`${pill} bg-[#be1f25] text-white`}>URGENT</span>;
}
