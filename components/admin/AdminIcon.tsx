import type { ReactNode } from "react";

type IconName =
  | "overview"
  | "complaints"
  | "construction"
  | "announcements"
  | "arrow"
  | "plus"
  | "clock"
  | "check"
  | "search"
  | "pin"
  | "calendar"
  | "reset"
  | "close"
  | "edit"
  | "trash"
  | "external";

const paths: Record<IconName, ReactNode> = {
  overview: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  complaints: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 2v-5.5a7.5 7.5 0 1 1 17-4Z" /><path d="M8 10h8M8 13h5" /></>,
  construction: <><path d="M3 20h18M5 20v-6l7-4 7 4v6M9 20v-4h6v4M12 10V4M8 7l4-3 4 3" /></>,
  announcements: <><path d="M4 10v4h4l9 4V6l-9 4H4ZM8 14l1.5 5h3L11 15M20 9v6" /></>,
  arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
  pin: <><path d="M19 10c0 5-7 10-7 10s-7-5-7-10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
  calendar: <><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M8 3v6M16 3v6M4 10h16" /></>,
  reset: <><path d="M4 11a8 8 0 1 1 2.4 6M4 5v6h6" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
  edit: <><path d="m4 16-.5 4.5L8 20 19 9l-4-4L4 16ZM13.5 6.5l4 4" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></>,
  external: <><path d="M13 5h6v6M19 5l-8 8M18 14v4H6V6h4" /></>,
};

export function AdminIcon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
