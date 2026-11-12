import type { NewsStatus } from "@/types";

type StatusBadgeProps = {
  status: NewsStatus;
};

const tone: Record<NewsStatus, string> = {
  Planning: "bg-[#e1edfb] text-[#24558f]",
  "Under construction": "bg-[#fff0c9] text-[#7a5600]",
  Completed: "bg-[#dbeee6] text-[#176b61]",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`rounded px-2 py-1 text-[10px] font-bold ${tone[status]}`}>
      {status}
    </span>
  );
}
