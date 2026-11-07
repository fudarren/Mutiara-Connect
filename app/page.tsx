import Link from "next/link";
import { NewsCard } from "@/components/NewsCard";
import { constructionNews } from "@/lib/news";

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#176b61]">
          Penang infrastructure, made clearer
        </p>
        <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">
          Stay connected to the future of Penang.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-[#61716d]">
          Follow construction news, understand project milestones, and keep up
          with the LRT developments shaping our communities.
        </p>
        <Link
          className="mt-8 inline-flex rounded-full bg-[#176b61] px-5 py-3 font-semibold text-white transition hover:bg-[#11554d]"
          href="/news"
        >
          Explore latest updates
        </Link>
      </section>

      <section
        className="mx-auto max-w-7xl px-6 pb-24 sm:px-10"
        aria-labelledby="latest-heading"
      >
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#176b61]">
              Community bulletin
            </p>
            <h2
              id="latest-heading"
              className="mt-2 text-4xl font-semibold tracking-[-0.04em]"
            >
              Latest construction news
            </h2>
          </div>
          <Link className="font-semibold text-[#176b61]" href="/news">
            View all news -&gt;
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {constructionNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}
