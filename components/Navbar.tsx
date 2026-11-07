import Link from "next/link";

export function Navbar() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
      <Link className="flex items-center gap-2 font-bold" href="/">
        <span className="grid size-9 place-items-center rounded-full bg-[#176b61] text-white">
          M
        </span>
        <span>Mutiara-Connect</span>
      </Link>
      <nav
        className="flex gap-4 text-sm text-[#61716d] sm:gap-7"
        aria-label="Main navigation"
      >
        <Link className="hover:text-[#176b61]" href="/news">
          News
        </Link>
        <Link className="hover:text-[#176b61]" href="/projects">
          Projects
        </Link>
        <Link className="hover:text-[#176b61]" href="/about">
          About
        </Link>
      </nav>
    </header>
  );
}
