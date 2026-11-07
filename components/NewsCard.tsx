import Link from "next/link";
import type { ConstructionNews } from "@/types";
import { StatusBadge } from "./StatusBadge";

type NewsCardProps = {
  article: ConstructionNews;
};

export function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="rounded-2xl border border-[#d5e0da] bg-white p-6">
      <div className="flex items-center justify-between gap-3 text-xs text-[#61716d]">
        <StatusBadge status={article.status} />
        <time dateTime={article.publishedAt}>{article.publishedAt}</time>
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em]">
        {article.title}
      </h3>
      <p className="mt-3 leading-7 text-[#61716d]">{article.summary}</p>
      <p className="mt-4 text-sm text-[#61716d]">{article.location}</p>
      <Link
        className="mt-5 inline-block font-semibold text-[#176b61]"
        href={`/news/${article.id}`}
      >
        Read update -&gt;
      </Link>
    </article>
  );
}
