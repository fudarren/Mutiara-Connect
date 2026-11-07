import type { ConstructionNews } from "@/types";

export const constructionNews: ConstructionNews[] = [
  { id: "penang-lrt-corridor-update", title: "Penang LRT corridor planning update", summary: "A community-friendly overview of the latest planning milestones and affected areas.", location: "George Town – Penang Sentral", publishedAt: "2026-11-01", status: "Planning", source: "Mutiara-Connect editorial team" },
  { id: "airport-station-site-preparation", title: "Site preparation begins near airport connection", summary: "Early works and traffic arrangements are being monitored around the proposed airport link.", location: "Bayan Lepas", publishedAt: "2026-10-24", status: "Under construction", source: "Community update" },
];
export function getNewsById(id: string) { return constructionNews.find((item) => item.id === id); }
