import type { DemoConstructionUpdate } from "./types";

const malaysiaDateTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kuala_Lumpur",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const malaysiaInputParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kuala_Lumpur",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function formatMalaysiaDateTime(value: string): string {
  return `${malaysiaDateTime.format(new Date(value))} MYT`;
}

export function toMalaysiaDateTimeInput(value: string): string {
  const parts = Object.fromEntries(
    malaysiaInputParts.formatToParts(new Date(value)).map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function fromMalaysiaDateTimeInput(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;

  const timestamp = Date.parse(`${value}:00+08:00`);
  if (!Number.isFinite(timestamp)) return null;

  const iso = new Date(timestamp).toISOString();
  return toMalaysiaDateTimeInput(iso) === value ? iso : null;
}

export type ConstructionTiming = "Active" | "Upcoming" | "Completed";

export function constructionTiming(
  update: DemoConstructionUpdate,
  now: number,
): ConstructionTiming {
  if (now < Date.parse(update.startDate)) return "Upcoming";
  if (now >= Date.parse(update.endDate)) return "Completed";
  return "Active";
}
