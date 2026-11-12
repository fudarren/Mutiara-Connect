"use client";

import { useState, type FormEvent } from "react";
import { formatMalaysiaDateTime } from "@/lib/admin/dates";
import { publishAnnouncement, useDemoData } from "@/lib/admin/store";
import type { AnnouncementDraft, FieldErrors } from "@/lib/admin/types";
import { validateAnnouncementDraft } from "@/lib/admin/validation";
import { AdminIcon } from "./AdminIcon";
import { Badge, EmptyState, Feedback, Field, PageLoading, describedBy } from "./AdminUI";

const emptyDraft: AnnouncementDraft = {
  title: "",
  message: "",
  affectedArea: "",
  severity: "Normal",
  expiresAt: "",
};

export function AnnouncementsPage() {
  const snapshot = useDemoData();
  const [draft, setDraft] = useState<AnnouncementDraft>(emptyDraft);
  const [errors, setErrors] = useState<FieldErrors<AnnouncementDraft>>({});
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  if (!snapshot) return <PageLoading title="Announcements" />;

  const announcements = [...snapshot.data.announcements].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

  function change(field: keyof AnnouncementDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setMessage(null);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateAnnouncementDraft(draft, Date.now());
    setErrors(validation.errors);
    if (Object.keys(validation.errors).length) return;

    const result = publishAnnouncement(draft);
    if (!result.ok) {
      setMessage({ text: result.error, error: true });
      return;
    }
    setDraft(emptyDraft);
    setMessage({ text: `${result.id} has been published.`, error: false });
  }

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <h1>Announcements</h1>
          <p>Publish updates for the community.</p>
        </div>
      </div>
      {message && <Feedback error={message.error}>{message.text}</Feedback>}
      <div className="admin-announcement-grid">
        <section className="admin-content-section">
          <div className="admin-section-heading"><h2>New announcement</h2></div>
          <form className="admin-form" onSubmit={submit} noValidate>
            <Field id="announcement-title" label="Title" error={errors.title}>
              <input id="announcement-title" value={draft.title} maxLength={120} onChange={(event) => change("title", event.target.value)} placeholder="e.g. Temporary access reminder" aria-invalid={Boolean(errors.title)} aria-describedby={describedBy("announcement-title", errors.title)} />
            </Field>
            <Field id="announcement-message" label="Message" error={errors.message}>
              <textarea id="announcement-message" rows={5} maxLength={2000} value={draft.message} onChange={(event) => change("message", event.target.value)} placeholder="Enter the announcement..." aria-invalid={Boolean(errors.message)} aria-describedby={describedBy("announcement-message", errors.message)} />
            </Field>
            <Field id="announcement-area" label="Affected area" error={errors.affectedArea}>
              <input id="announcement-area" value={draft.affectedArea} maxLength={160} onChange={(event) => change("affectedArea", event.target.value)} placeholder="e.g. Gelugor" aria-invalid={Boolean(errors.affectedArea)} aria-describedby={describedBy("announcement-area", errors.affectedArea)} />
            </Field>
            <fieldset className="admin-priority-field">
              <legend>Priority</legend>
              <div className="admin-priority-options">
                <label className={draft.severity === "Normal" ? "is-selected" : ""}><input type="radio" name="priority" value="Normal" checked={draft.severity === "Normal"} onChange={(event) => change("severity", event.target.value)} /> <span><strong>Normal</strong><small>General information</small></span></label>
                <label className={draft.severity === "Urgent" ? "is-selected is-urgent" : ""}><input type="radio" name="priority" value="Urgent" checked={draft.severity === "Urgent"} onChange={(event) => change("severity", event.target.value)} /> <span><strong>Urgent</strong><small>Needs attention</small></span></label>
              </div>
              {errors.severity && <p className="admin-field-error">{errors.severity}</p>}
            </fieldset>
            <Field id="announcement-expiry" label="Expiry date and time" optional error={errors.expiresAt} hint="Malaysia time (MYT)">
              <input id="announcement-expiry" type="datetime-local" value={draft.expiresAt} onChange={(event) => change("expiresAt", event.target.value)} aria-invalid={Boolean(errors.expiresAt)} aria-describedby={describedBy("announcement-expiry", errors.expiresAt, "Malaysia time (MYT)")} />
            </Field>
            <button type="submit" className="admin-button admin-button--primary admin-publish-button"><AdminIcon name="announcements" size={16} /><span>Publish announcement</span></button>
          </form>
        </section>

        <section className="admin-content-section">
          <div className="admin-section-heading"><h2>Published <span className="admin-count">{announcements.length}</span></h2></div>
          {announcements.length === 0 ? (
            <EmptyState title="No announcements yet">Published announcements will appear here.</EmptyState>
          ) : (
            <div className="admin-announcement-list">
              {announcements.map((announcement) => (
                <article className="admin-announcement" key={announcement.notificationId}>
                  <div className="admin-update-title-row"><h3>{announcement.title}</h3><Badge>{announcement.severity}</Badge></div>
                  <p>{announcement.message}</p>
                  <div className="admin-announcement-meta">
                    <span>{announcement.notificationId}</span>
                    <span><AdminIcon name="pin" size={14} /> {announcement.affectedArea}</span>
                    <span><AdminIcon name="calendar" size={14} /> Published {formatMalaysiaDateTime(announcement.publishedAt)}</span>
                    {announcement.expiresAt && <span>Expires {formatMalaysiaDateTime(announcement.expiresAt)}{Date.parse(announcement.expiresAt) <= snapshot.now ? " (expired)" : ""}</span>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
