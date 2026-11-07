import { NewsCard } from "@/components/NewsCard";
import { constructionNews } from "@/lib/news";

export default function NewsPage() {
  return (
    <section className="mx-auto min-h-[65vh] max-w-7xl px-6 py-16 sm:px-10">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#176b61]">
        Updates
      </p>
      <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em]">
        Construction news
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-[#61716d]">
        A central place for verified updates and community-relevant milestones.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {constructionNews.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
