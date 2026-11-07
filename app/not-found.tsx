import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto min-h-[65vh] max-w-4xl px-6 py-16 sm:px-10">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#176b61]">
        404
      </p>
      <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em]">
        Update not found
      </h1>
      <p className="mt-5 text-lg text-[#61716d]">
        That page is not part of the current community bulletin.
      </p>
      <Link
        className="mt-8 inline-flex rounded-full bg-[#176b61] px-5 py-3 font-semibold text-white"
        href="/news"
      >
        Back to news
      </Link>
    </section>
  );
}
