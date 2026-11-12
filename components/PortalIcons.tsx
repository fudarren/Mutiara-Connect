type IconProps = { size?: number; light?: boolean };

const publicIcons: Record<string, string> = {
  bell: "/bell-black.png",
  settings: "/settings-black.png",
  search: "/search-interface-symbol.png",
  filter: "/filter.png",
  shield: "/shield.png",
  clock: "/clock.png",
  problem: "/problem.png",
  grid: "/dashboard-black.png",
  map: "/map-black.png",
  megaphone: "/loud-speaker-black.png",
  accept: "/accept.png",
  close: "/close.png",
  round: "/round.png",
  link: "/link.png",
  moon: "/moon.png",
};

export function PortalIcon({
  name,
  size = 18,
  light = false,
}: IconProps & { name: string }) {
  const image = publicIcons[name];

  if (image) {
    if (name === "bell") {
      return (
        <span className="portal-icon relative" style={{ width: size, height: size }}>
          <img
            className={`absolute inset-0 h-full w-full object-contain ${light ? "hidden" : "block group-hover:hidden"}`}
            src={image}
            alt=""
          />
          <img
            className={`absolute inset-0 h-full w-full object-contain ${light ? "block" : "hidden group-hover:block"}`}
            src="/bell-white.png"
            alt=""
          />
        </span>
      );
    }
    if (name === "settings") {
      return (
        <span className="portal-icon relative" style={{ width: size, height: size }}>
          <img className="absolute inset-0 block h-full w-full object-contain group-hover:hidden" src={image} alt="" />
          <img className="absolute inset-0 hidden h-full w-full object-contain group-hover:block" src="/settings-white.png" alt="" />
        </span>
      );
    }
    if (name === "grid") {
      return (
        <span className="portal-icon relative" style={{ width: size, height: size }}>
          <img className="absolute inset-0 block h-full w-full object-contain group-hover:hidden" src={image} alt="" />
          <img className="absolute inset-0 hidden h-full w-full object-contain group-hover:block" src="/dashboard-white.png" alt="" />
        </span>
      );
    }
    if (name === "map") {
      return (
        <span className="portal-icon relative" style={{ width: size, height: size }}>
          <img className="absolute inset-0 block h-full w-full object-contain group-hover:hidden" src={image} alt="" />
          <img className="absolute inset-0 hidden h-full w-full object-contain group-hover:block" src="/map-white.png" alt="" />
        </span>
      );
    }
    if (name === "megaphone") {
      return (
        <span className="portal-icon relative" style={{ width: size, height: size }}>
          <img className="absolute inset-0 block h-full w-full object-contain group-hover:hidden" src={image} alt="" />
          <img className="absolute inset-0 hidden h-full w-full object-contain group-hover:block" src="/loud-speaker-white.png" alt="" />
        </span>
      );
    }

    return (
      <img
        className={`portal-icon portal-icon-${name}`}
        src={image}
        alt=""
        width={size}
        height={size}
      />
    );
  }

  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<string, React.ReactNode> = {
    megaphone: <><path d="m3 11 18-5v12L3 14v-3Z" /><path d="M11 16v4M7 15l-2 4" /></>,
    sliders: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="8" cy="6" r="2" fill="currentColor" /><circle cx="16" cy="12" r="2" fill="currentColor" /><circle cx="10" cy="18" r="2" fill="currentColor" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    copy: <><rect x="9" y="9" width="10" height="10" rx="1" /><path d="M5 15V6a1 1 0 0 1 1-1h9" /></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.9-3L3 11" /><path d="M3 5v6h6" /><path d="M4 13a8 8 0 0 0 14.9 3L21 13" /><path d="M21 19v-6h-6" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
  };

  return <svg aria-hidden="true" {...common}>{paths[name]}</svg>;
}
