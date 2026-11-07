export type NewsStatus = "Planning" | "Under construction" | "Completed";
export type ConstructionNews = { id: string; title: string; summary: string; location: string; publishedAt: string; status: NewsStatus; source: string; };
