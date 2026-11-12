import Link from "next/link";
import { HomeSummary } from "@/components/construction/HomeSummary";
import { PortalIcon } from "@/components/PortalIcons";

const modules = [
  { href: "/projects", icon: "map", title: "Construction Map", text: "See road closures, detours and construction zones on an interactive map, or browse them as a list." },
  { href: "/news", icon: "megaphone", title: "Construction News", text: "Read community-friendly updates about planning milestones and works along the line." },
  { href: "/notification", icon: "bell", title: "Notifications", text: "Review urgent alerts and construction announcements, and search your notification history." },
  { href: "/admin/construction", icon: "shield", title: "Staff: Manage Entries", text: "Authorised officers sign in to add, edit or remove construction entries and mark affected areas." },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-[1130px] px-3 py-6 text-[#181c1e] sm:px-5 sm:py-7">
      <div className="mb-6">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#087b84]">
          Penang LRT Mutiara Line
        </div>
        <h1 className="mt-1 text-[31px] leading-[38px] tracking-[-0.04em]">Mutiara Connect community hub</h1>
        <p className="mt-1 max-w-2xl text-[15px] leading-[22px] text-[#5d686c]">
          Construction information, notifications and feedback for residents, commuters and businesses near the Mutiara
          Line.
        </p>
      </div>

      <HomeSummary />

      <section aria-label="Portal modules" className="mt-6 grid gap-3 md:grid-cols-2">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group flex gap-3 rounded-md border border-[#e7ecef] bg-white p-4 shadow-[0_1px_2px_#dfe7eb] hover:border-[#087b84]"
          >
            <span className="grid size-[38px] shrink-0 place-items-center rounded bg-[#e8f3f4]">
              <PortalIcon name={m.icon} size={20} />
            </span>
            <span className="min-w-0">
              <strong className="flex items-center gap-1.5 text-[14px]">
                {m.title} <PortalIcon name="arrow" size={14} />
              </strong>
              <span className="mt-1 block text-[12px] leading-[18px] text-[#5d686c]">{m.text}</span>
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
