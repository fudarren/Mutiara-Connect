import Link from "next/link";
import type { ConstructionNews } from "@/types";
import { PortalIcon } from "./PortalIcons";
import { StatusBadge } from "./StatusBadge";

type NewsCardProps = {
  article: ConstructionNews;
};

export function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="rounded-md border border-[#e7ecef] bg-white p-4 shadow-[0_1px_2px_#dfe7eb]">
      <div className="flex items-center justify-between gap-3 text-[11px] text-[#5d686c]">
        <StatusBadge status={article.status} />
        <time dateTime={article.publishedAt}>{article.publishedAt}</time>
      </div>
      <h2 className="mt-3 text-[16px] font-bold leading-6 tracking-[-0.02em]">{article.title}</h2>
      <p className="mt-2 text-[13px] leading-5 text-[#5c686d]">{article.summary}</p>
      <p className="mt-3 text-[11px] text-[#748084]">{article.location}</p>
      <Link
        className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#087b84] hover:underline"
        href={`/news/${article.id}`}
      >
        Read update <PortalIcon name="arrow" size={14} />
      </Link>
    </article>
  );
}
