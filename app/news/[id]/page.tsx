import Link from "next/link";
import { notFound } from "next/navigation";
import { PortalIcon } from "@/components/PortalIcons";
import { StatusBadge } from "@/components/StatusBadge";
import { getNewsById } from "@/lib/news";

type NewsDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  const article = getNewsById(id);

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-[900px] px-3 py-6 text-[#181c1e] sm:px-5 sm:py-7">
      <nav aria-label="Breadcrumb" className="mb-4 text-[11px]">
        <Link href="/news" className="font-semibold text-[#087b84] hover:underline">&larr; Construction news</Link>
      </nav>
      <StatusBadge status={article.status} />
      <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#087b84]">
        {article.location}
      </p>
      <h1 className="mt-1 text-[29px] leading-[36px] tracking-[-0.04em]">{article.title}</h1>
      <p className="mt-2 text-[11px] text-[#7a8588]">
        Published {article.publishedAt} | {article.source}
      </p>
      <p className="mt-5 text-[15px] leading-7 text-[#4a5a60]">{article.summary}</p>
      {article.updateId && (
        <div className="mt-6 rounded-md border border-[#e7ecef] bg-white p-4 shadow-[0_1px_2px_#dfe7eb]">
          <h2 className="text-[14px] font-bold">Related construction update</h2>
          <p className="mt-1 text-[13px] text-[#5d686c]">
            See the affected area, schedule, detour and access information for this work.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={`/projects/${article.updateId}`}
              className="flex items-center gap-2 rounded bg-[#087b84] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#066a72]"
            >
              View update details <PortalIcon name="arrow" size={14} />
            </Link>
            <Link
              href={`/projects?focus=${article.updateId}`}
              className="rounded bg-[#e8edf1] px-3 py-2 text-[11px] font-semibold text-[#25363d] hover:bg-[#d9e2e7]"
            >
              Show on map
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}
