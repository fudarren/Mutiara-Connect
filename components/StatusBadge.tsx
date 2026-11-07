import type { NewsStatus } from "@/types";

type StatusBadgeProps = {
  status: NewsStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className="rounded-full bg-[#dbeee6] px-2.5 py-1 text-xs font-bold text-[#176b61]">
      {status}
    </span>
  );
}
