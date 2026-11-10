import { NewsCard } from "@/components/NewsCard";
import { constructionNews } from "@/lib/news";

export default function NewsPage() {
  return (
    <div className="mx-auto w-full max-w-[1130px] px-3 py-6 text-[#181c1e] sm:px-5 sm:py-7">
      <div className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#087b84]">Updates</div>
      <h1 className="mt-1 text-[31px] leading-[38px] tracking-[-0.04em]">Construction news</h1>
      <p className="mt-1 max-w-2xl text-[15px] leading-[22px] text-[#5d686c]">
        A central place for verified updates and community-relevant milestones.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {constructionNews.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
