"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return (
    <section className="mx-auto min-h-[65vh] max-w-4xl px-6 py-16 sm:px-10">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#176b61]">
        Something went wrong
      </p>
      <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em]">
        We could not load this update.
      </h1>
      <button
        className="mt-8 rounded-full bg-[#176b61] px-5 py-3 font-semibold text-white"
        onClick={() => reset()}
      >
        Try again
      </button>
    </section>
  );
}
