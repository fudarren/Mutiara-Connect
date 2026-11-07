import { notFound } from "next/navigation";
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
    <article className="mx-auto min-h-[65vh] max-w-4xl px-6 py-16 sm:px-10">
      <StatusBadge status={article.status} />
      <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-[#176b61]">
        {article.location}
      </p>
      <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em]">
        {article.title}
      </h1>
      <p className="mt-5 text-sm text-[#61716d]">
        Published {article.publishedAt} | {article.source}
      </p>
      <p className="mt-8 text-xl leading-9 text-[#61716d]">
        {article.summary}
      </p>
      <div className="mt-10 rounded-2xl border border-dashed border-[#d5e0da] p-7 leading-7 text-[#61716d]">
        Detailed reporting and source references will be added here as the
        content system develops.
      </div>
    </article>
  );
}
