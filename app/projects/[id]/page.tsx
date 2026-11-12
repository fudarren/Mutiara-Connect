import type { Metadata } from "next";
import { Suspense } from "react";
import { ConstructionDetail } from "@/components/construction/ConstructionDetail";

export const metadata: Metadata = {
  title: "Construction Update | Mutiara-Connect",
};

type Params = Promise<{ id: string }>;

async function DetailContent({ params }: { params: Params }) {
  const { id } = await params;
  return <ConstructionDetail updateId={id} />;
}

export default function ProjectDetailPage({ params }: { params: Params }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1130px] px-3 py-6 text-sm text-[#5d686c] sm:px-5">
          Loading construction update...
        </div>
      }
    >
      <DetailContent params={params} />
    </Suspense>
  );
}
