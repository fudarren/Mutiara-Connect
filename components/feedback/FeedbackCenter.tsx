"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { PortalIcon } from "@/components/PortalIcons";
import { TelegramConnectCard } from "@/components/feedback/TelegramConnectCard";
import {
  createReport,
  feedbackCategories,
  feedbackStatusOrder,
  formatFeedbackDate,
  mockFeedbackReports,
  reportLocations,
  statusTone,
} from "@/lib/feedback";
import type { FeedbackCategory, FeedbackKind, FeedbackReport } from "@/types/feedback";
import type { FeedbackStatus } from "@/types/feedback";
import type { Point } from "geojson";

const FeedbackLocationMap = dynamic(() => import("./FeedbackLocationMap"), {
  ssr: false,
  loading: () => <div className="grid h-[244px] place-items-center rounded border border-[#d5dfe4] bg-[#f0f4f7] text-[12px] text-[#718083]">Loading map...</div>,
});

const fieldClass = "box-border h-[40px] w-full min-w-0 shrink-0 rounded border border-[#d5dfe4] bg-white px-3 text-[13px] text-[#181c1e] outline-none transition focus:border-[#087b84] focus:ring-2 focus:ring-[#087b84]/15";
const labelClass = "grid gap-1 text-[11px] font-bold uppercase tracking-[0.04em] text-[#526269]";
const cardClass = "rounded-md border border-[#e7ecef] bg-white shadow-[0_1px_2px_#dfe7eb]";
const invalidFieldClass = "border-[#c9222b] focus:border-[#c9222b] focus:ring-[#c9222b]/15";

function StatusBadge({ status }: { status: FeedbackReport["status"] }) {
  const tone = statusTone(status);
  const styles = {
    teal: "bg-[#e6f4f3] text-[#087b84]",
    amber: "bg-[#fff4d8] text-[#8a6100]",
    blue: "bg-[#e7f2ff] text-[#245f91]",
    green: "bg-[#e5f5e9] text-[#24733b]",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[tone]}`}>{status}</span>;
}

function StatusTimeline({ status }: { status: FeedbackReport["status"] }) {
  const currentIndex = feedbackStatusOrder.indexOf(status);
  return (
    <ol className="grid gap-2 sm:grid-cols-4 sm:gap-0" aria-label={`Report status: ${status}`}>
      {feedbackStatusOrder.map((step, index) => (
        <li key={step} className="flex items-center gap-2 text-[10px] text-[#69777b] sm:relative sm:block sm:pr-2">
          <span className={`grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${index <= currentIndex ? "bg-[#087b84] text-white" : "bg-[#e6edf0] text-[#7b898d]"}`}>
            {index < currentIndex ? <PortalIcon name="check" size={13} /> : index + 1}
          </span>
          <span className="sm:mt-1 sm:block">{step}</span>
          {index < feedbackStatusOrder.length - 1 && <span className={`hidden h-px sm:absolute sm:left-6 sm:right-2 sm:top-3 sm:block ${index < currentIndex ? "bg-[#087b84]" : "bg-[#dbe5e8]"}`} />}
        </li>
      ))}
    </ol>
  );
}

function ReportCard({ report }: { report: FeedbackReport }) {
  return (
    <article className={`${cardClass} p-4`}>
      <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#718083]">
            <span className="font-bold uppercase tracking-[0.05em] text-[#087b84]">{report.kind}</span>
            <span>•</span>
            <span>{report.referenceNumber}</span>
          </div>
          <h3 className="mt-1 text-[14px] font-bold leading-5">{report.title}</h3>
        </div>
        <span className="self-start"><StatusBadge status={report.status} /></span>
      </div>
      <p className="mt-2 text-[11px] leading-[18px] text-[#5d686c]">{report.description}</p>
      <div className="mt-3 grid gap-1 text-[10px] text-[#718083] min-[520px]:flex min-[520px]:flex-wrap min-[520px]:gap-x-4">
        <span><b className="text-[#394b50]">Location:</b> {report.location}</span>
        <span><b className="text-[#394b50]">Submitted:</b> {formatFeedbackDate(report.submittedAt)}</span>
        {report.photoName && <span className="truncate"><b className="text-[#394b50]">Evidence:</b> {report.photoName}</span>}
      </div>
      <div className="mt-4 border-t border-[#edf1f3] pt-3">
        <StatusTimeline status={report.status} />
      </div>
    </article>
  );
}

export function FeedbackCenter() {
  const [reports, setReports] = useState<FeedbackReport[]>(mockFeedbackReports);
  const [kind, setKind] = useState<FeedbackKind>("Complaint");
  const [category, setCategory] = useState<FeedbackCategory>("Construction impact");
  const [location, setLocation] = useState("");
  const [locationCoordinates, setLocationCoordinates] = useState<Point | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [reference, setReference] = useState("");
  const [searchedReport, setSearchedReport] = useState<FeedbackReport | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<FeedbackReport | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [historyFilter, setHistoryFilter] = useState<FeedbackStatus | "All">("All");
  const [showAllHistory, setShowAllHistory] = useState(false);

  const allReports = useMemo(
    () => historyFilter === "All" ? reports : reports.filter((report) => report.status === historyFilter),
    [historyFilter, reports],
  );
  const visibleReports = showAllHistory ? allReports : allReports.slice(0, 2);

  function submitReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFieldErrors: Record<string, string> = {};
    if (!location) nextFieldErrors.location = "Please select where the issue happened.";
    if (!title.trim()) nextFieldErrors.title = "Please enter a short title.";
    if (!description.trim()) nextFieldErrors.description = "Please describe what happened.";
    if (!locationCoordinates) nextFieldErrors.location = "Please select a location so it can be shown on the map.";
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) {
      setError("Please fix the highlighted fields before submitting.");
      return;
    }
    const selectedCoordinates = locationCoordinates;
    if (!selectedCoordinates) return;
    const report = createReport({
      kind,
      category,
      location,
      locationCoordinates: selectedCoordinates,
      title: title.trim(),
      description: description.trim(),
      photoName: photoName || undefined,
    });
    const nextReports = [report, ...reports];
    setReports(nextReports);
    setSuccess(report);
    setError("");
    setFieldErrors({});
    setTitle("");
    setDescription("");
    setLocation("");
    setLocationCoordinates(null);
    setPhotoName("");
  }

  function searchReference(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const match = reports.find((report) => report.referenceNumber.toLowerCase() === reference.trim().toLowerCase());
    setSearchedReport(match ?? null);
    if (!match) setError("No report was found for that reference number.");
    else setError("");
  }

  return (
    <div className="mx-auto w-full max-w-[1130px] px-3 py-5 text-[#181c1e] sm:px-5 sm:py-7">
      <div className="mb-5 sm:mb-6">
        <div className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#087b84]">Community feedback module</div>
        <h1 className="mt-1 text-[clamp(25px,4vw,31px)] leading-tight tracking-[-0.04em]">Report an issue or share feedback</h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-[21px] text-[#5d686c] sm:text-[15px] sm:leading-[22px]">
          Help the Mutiara Line team understand what is happening in your area. A reference number is generated after every successful submission.
        </p>
      </div>

      {success && (
        <div className={`${cardClass} mb-4 border-[#b8dfc2] bg-[#effaf1] p-3.5 text-[12px] text-[#24733b] sm:mb-5 sm:p-4`} role="status">
          <b>Report submitted successfully.</b> Keep your reference number <strong>{success.referenceNumber}</strong> to track its status.
        </div>
      )}
      {error && <div className={`${cardClass} mb-4 border-[#f1c3c5] bg-[#fff1f1] p-3 text-[12px] font-semibold text-[#a81920] sm:mb-5`} role="alert">{error}</div>}

      <div className="mb-5">
        <TelegramConnectCard />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] xl:gap-5">
        <section className={`${cardClass} p-4 sm:p-5`}>
          <div className="flex items-start gap-3 border-b border-[#edf1f3] pb-4">
            <span className="grid size-9 shrink-0 place-items-center rounded bg-[#e8f3f4]"><PortalIcon name="problem" size={20} /></span>
            <div><h2 className="text-[17px] font-bold">Submit complaint / feedback</h2><p className="mt-1 text-[12px] leading-[18px] text-[#68767a]">Tell us what happened and where it happened.</p></div>
          </div>
          <form onSubmit={submitReport} className="mt-5 grid gap-4" noValidate>
            <fieldset className="grid gap-2">
              <legend className="mb-1 text-[11px] font-bold uppercase tracking-[0.04em] text-[#526269]">Report type</legend>
              <div className="grid grid-cols-2 gap-2">
                {(["Complaint", "Feedback"] as FeedbackKind[]).map((value) => <label key={value} className={`flex min-h-[40px] cursor-pointer items-center justify-center gap-2 rounded border px-3 py-2 text-[12px] ${kind === value ? "border-[#087b84] bg-[#e8f3f4] font-bold text-[#087b84]" : "border-[#d5dfe4] text-[#526269]"}`}><input type="radio" className="accent-[#087b84]" name="kind" value={value} checked={kind === value} onChange={() => setKind(value)} />{value}</label>)}
              </div>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}><span>Category</span><select className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value as FeedbackCategory)}>{feedbackCategories.map((value) => <option key={value}>{value}</option>)}</select><span className="h-[16px] text-[11px]">&nbsp;</span></label>
              <label className={labelClass}><span>Report location <span className="text-[#c9222b]">*</span></span><select className={`${fieldClass} ${fieldErrors.location ? invalidFieldClass : ""}`} value={location} onChange={(event) => { const selected = reportLocations.find((item) => item.label === event.target.value); setLocation(selected?.label ?? ""); setLocationCoordinates(selected?.coordinates ?? null); setFieldErrors((current) => ({ ...current, location: "" })); }} aria-invalid={Boolean(fieldErrors.location)} aria-describedby="location-error" required><option value="">Select an area</option>{reportLocations.map((item) => <option key={item.label} value={item.label}>{item.label}</option>)}</select><span id="location-error" className={`h-[16px] text-[11px] font-semibold normal-case tracking-normal ${fieldErrors.location ? "text-[#c9222b]" : "invisible"}`} role="alert">{fieldErrors.location || "\u00a0"}</span></label>
            </div>
            <div className="grid gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#526269]">Location preview</span>
                <span className="text-[10px] text-[#718083]">Frontend mock</span>
              </div>
              <FeedbackLocationMap point={locationCoordinates} />
            </div>
            <label className={labelClass}><span>Short title <span className="text-[#c9222b]">*</span></span><input className={`${fieldClass} ${fieldErrors.title ? invalidFieldClass : ""}`} value={title} onChange={(event) => { setTitle(event.target.value); setFieldErrors((current) => ({ ...current, title: "" })); }} placeholder="e.g. Blocked pedestrian walkway" aria-invalid={Boolean(fieldErrors.title)} aria-describedby="title-error" required /><span id="title-error" className={`h-[16px] text-[11px] font-semibold normal-case tracking-normal ${fieldErrors.title ? "text-[#c9222b]" : "invisible"}`} role="alert">{fieldErrors.title || "\u00a0"}</span></label>
            <label className={labelClass}><span>Description <span className="text-[#c9222b]">*</span></span><textarea className={`box-border h-[120px] w-full min-w-0 shrink-0 resize-y rounded border border-[#d5dfe4] bg-white px-3 py-2 text-[13px] font-normal text-[#181c1e] outline-none transition focus:border-[#087b84] focus:ring-2 focus:ring-[#087b84]/15 ${fieldErrors.description ? invalidFieldClass : ""}`} value={description} onChange={(event) => { setDescription(event.target.value); setFieldErrors((current) => ({ ...current, description: "" })); }} placeholder="Include useful details such as timing, nearby landmarks, or what happened." aria-invalid={Boolean(fieldErrors.description)} aria-describedby="description-error" required /><span id="description-error" className={`h-[16px] text-[11px] font-semibold normal-case tracking-normal ${fieldErrors.description ? "text-[#c9222b]" : "invisible"}`} role="alert">{fieldErrors.description || "\u00a0"}</span></label>
            <label className={labelClass}>Photo evidence <span className="font-normal normal-case tracking-normal text-[#7a8588]">(optional)</span><input className="min-h-[40px] rounded border border-dashed border-[#b8c8ce] bg-[#f7fafb] px-3 py-2 text-[12px] font-normal" type="file" accept="image/*" onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? "")} /><span className="font-normal normal-case tracking-normal text-[#7a8588]">Accepted for this frontend prototype: image filename only.</span></label>
            <button type="submit" className="min-h-[40px] rounded bg-[#087b84] px-4 text-[13px] font-bold text-white transition hover:bg-[#066a72]">Submit {kind.toLowerCase()}</button>
          </form>
        </section>

        <aside className="grid content-start gap-5">
          <section className={`${cardClass} p-4`}>
            <h2 className="text-[16px] font-bold">Track complaint status</h2>
            <p className="mt-1 text-[12px] leading-[18px] text-[#68767a]">Enter the reference number from your confirmation.</p>
            <form onSubmit={searchReference} className="mt-4 grid gap-2 min-[420px]:flex">
              <input className="h-[38px] min-w-0 flex-1 rounded border border-[#d5dfe4] px-3 text-[12px] uppercase" value={reference} onChange={(event) => setReference(event.target.value)} placeholder="MC-2026-0042" aria-label="Report reference number" />
              <button className="min-h-[38px] rounded bg-[#e8edf1] px-4 text-[11px] font-bold text-[#25363d] hover:bg-[#d9e2e7]">Track</button>
            </form>
            {searchedReport && <div className="mt-4 border-t border-[#edf1f3] pt-3"><ReportCard report={searchedReport} /></div>}
          </section>
          <section className={`${cardClass} border-[#cce4e5] bg-[#f0f9f9] p-4 text-[12px] leading-[18px] text-[#426267]`}>
            <h2 className="font-bold text-[#087b84]">What happens next?</h2>
            <ol className="mt-2 grid gap-2"><li><b>1.</b> Your report receives a reference number.</li><li><b>2.</b> The responsible team reviews the details.</li><li><b>3.</b> Status updates appear in your report history.</li></ol>
          </section>
        </aside>
      </div>

      <section className="mt-7">
        <div className="mb-3 flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-end min-[420px]:justify-between">
          <div><div className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#087b84]">Your submissions</div><h2 className="mt-1 text-[clamp(19px,3vw,21px)] font-bold tracking-[-0.03em]">Complaint and feedback history</h2></div>
          <span className="text-[11px] text-[#718083]">{allReports.length} report{allReports.length === 1 ? "" : "s"}</span>
        </div>
        <div className="mb-3 flex gap-1 overflow-x-auto rounded bg-[#f0f4f7] p-1" role="tablist" aria-label="Filter report history">
          {(["All", "Submitted", "Under review", "In progress", "Resolved"] as const).map((filter) => (
            <button key={filter} type="button" role="tab" aria-selected={historyFilter === filter} onClick={() => { setHistoryFilter(filter); setShowAllHistory(false); }} className={`shrink-0 rounded px-2.5 py-1.5 text-[10px] font-semibold ${historyFilter === filter ? "bg-white text-[#087b84] shadow-[0_1px_3px_#d5dfe4]" : "text-[#5d686c] hover:text-[#087b84]"}`}>
              {filter}
            </button>
          ))}
        </div>
        {visibleReports.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">{visibleReports.map((report) => <ReportCard key={report.referenceNumber} report={report} />)}</div>
        ) : (
          <div className={`${cardClass} p-6 text-center text-[12px] text-[#718083]`}>No reports in this status.</div>
        )}
        {allReports.length > 2 && (
          <button type="button" onClick={() => setShowAllHistory((current) => !current)} className="mt-3 w-full rounded border border-[#d5dfe4] bg-white px-3 py-2 text-[11px] font-bold text-[#087b84] hover:border-[#087b84]">
            {showAllHistory ? "Show fewer reports" : `View all ${allReports.length} reports`}
          </button>
        )}
      </section>
    </div>
  );
}
