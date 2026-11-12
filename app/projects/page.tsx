import type { Metadata } from "next";
import { Suspense } from "react";
import { ConstructionExplorer } from "@/components/construction/ConstructionExplorer";

export const metadata: Metadata = {
  title: "Construction Map | Mutiara-Connect",
  description: "Road closures, detours, pedestrian diversions and construction zones along the Penang LRT Mutiara Line.",
};

type SearchParams = Promise<{ q?: string | string[]; focus?: string | string[] }>;

const first = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value) ?? "";

/** Reads ?q= (from the header search box) and ?focus= (from "Show on map" links). */
async function ProjectsContent({ searchParams }: { searchParams: SearchParams }) {
  const { q, focus } = await searchParams;
  return <ConstructionExplorer key={`${first(q)}|${first(focus)}`} initialQuery={first(q)} initialFocus={first(focus)} />;
}

export default function ProjectsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1280px] px-3 py-6 text-sm text-[#5d686c] sm:px-5">
          Loading construction updates...
        </div>
      }
    >
      <ProjectsContent searchParams={searchParams} />
    </Suspense>
  );
}
