"use client";

import { useState, type FormEvent } from "react";
import { constructionTiming, formatMalaysiaDateTime, toMalaysiaDateTimeInput } from "@/lib/admin/dates";
import { removeConstructionUpdate, saveConstructionUpdate, useDemoData } from "@/lib/admin/store";
import type { ConstructionDraft, DemoConstructionUpdate, FieldErrors } from "@/lib/admin/types";
import { validateConstructionDraft } from "@/lib/admin/validation";
import { AdminIcon } from "./AdminIcon";
import { Badge, Dialog, EmptyState, Feedback, Field, PageLoading, describedBy } from "./AdminUI";

const emptyDraft: ConstructionDraft = {
  title: "",
  description: "",
  affectedArea: "",
  startDate: "",
  endDate: "",
};

function ConstructionForm({
  initial,
  onClose,
  onSave,
}: {
  initial?: DemoConstructionUpdate;
  onClose: () => void;
  onSave: (id: string) => void;
}) {
  const [draft, setDraft] = useState<ConstructionDraft>(() => initial ? {
    title: initial.title,
    description: initial.description,
    affectedArea: initial.affectedArea,
    startDate: toMalaysiaDateTimeInput(initial.startDate),
    endDate: toMalaysiaDateTimeInput(initial.endDate),
  } : emptyDraft);
  const [errors, setErrors] = useState<FieldErrors<ConstructionDraft>>({});
  const [formError, setFormError] = useState("");

  function change(field: keyof ConstructionDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateConstructionDraft(draft);
    setErrors(validation.errors);
    if (Object.keys(validation.errors).length) return;

    const result = saveConstructionUpdate(draft, initial?.updateId);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    onSave(result.id);
  }

  return (
    <Dialog
      title={initial ? "Edit construction update" : "Create construction update"}
      description="Describe the activity and the area affected."
      onClose={onClose}
      wide
    >
      <form className="admin-dialog-body admin-form" onSubmit={submit} noValidate>
        {formError && <Feedback error>{formError}</Feedback>}
        <Field id="update-title" label="Title" error={errors.title}>
          <input id="update-title" value={draft.title} maxLength={120} onChange={(event) => change("title", event.target.value)} aria-invalid={Boolean(errors.title)} aria-describedby={describedBy("update-title", errors.title)} />
        </Field>
        <Field id="update-description" label="Description" error={errors.description}>
          <textarea id="update-description" rows={4} maxLength={2000} value={draft.description} onChange={(event) => change("description", event.target.value)} aria-invalid={Boolean(errors.description)} aria-describedby={describedBy("update-description", errors.description)} />
        </Field>
        <Field id="update-area" label="Location" error={errors.affectedArea}>
          <input id="update-area" value={draft.affectedArea} maxLength={160} onChange={(event) => change("affectedArea", event.target.value)} aria-invalid={Boolean(errors.affectedArea)} aria-describedby={describedBy("update-area", errors.affectedArea)} />
        </Field>
        <div className="admin-form-row">
          <Field id="update-start" label="Start date and time" error={errors.startDate} hint="Malaysia time (MYT)">
            <input id="update-start" type="datetime-local" value={draft.startDate} onChange={(event) => change("startDate", event.target.value)} aria-invalid={Boolean(errors.startDate)} aria-describedby={describedBy("update-start", errors.startDate, "Malaysia time (MYT)")} />
          </Field>
          <Field id="update-end" label="End date and time" error={errors.endDate} hint="Must be later than the start">
            <input id="update-end" type="datetime-local" value={draft.endDate} onChange={(event) => change("endDate", event.target.value)} aria-invalid={Boolean(errors.endDate)} aria-describedby={describedBy("update-end", errors.endDate, "Must be later than the start")} />
          </Field>
        </div>
        <div className="admin-dialog-actions">
          <button type="button" className="admin-button admin-button--secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="admin-button admin-button--primary">{initial ? "Save changes" : "Create update"}</button>
        </div>
      </form>
    </Dialog>
  );
}

export function ConstructionPage() {
  const snapshot = useDemoData();
  const [editing, setEditing] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  if (!snapshot) return <PageLoading title="Construction updates" />;

  const updates = snapshot.data.updates.filter((update) => !update.removedAt);
  const editingUpdate = updates.find((update) => update.updateId === editing);
  const removingUpdate = updates.find((update) => update.updateId === removing);

  function handleRemove(id: string) {
    const result = removeConstructionUpdate(id);
    setRemoving(null);
    setMessage(result.ok ? { text: `${id} was removed.`, error: false } : { text: result.error, error: true });
  }

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <h1>Construction updates</h1>
          <p>Manage current and planned works.</p>
        </div>
        <button type="button" className="admin-button admin-button--primary" onClick={() => { setMessage(null); setEditing("new"); }}><AdminIcon name="plus" size={16} /><span>Create update</span></button>
      </div>
      {message && <Feedback error={message.error}>{message.text}</Feedback>}
      <div className="admin-section-intro">
        <h2>All updates <span className="admin-count">{updates.length}</span></h2>
      </div>
      {updates.length === 0 ? (
        <section className="admin-content-section"><EmptyState title="No construction updates">Create an update to add it to the list.</EmptyState></section>
      ) : (
        <div className="admin-update-list">
          {updates.map((update) => (
            <article className="admin-update-row" key={update.updateId}>
              <div className="admin-update-main">
                <div className="admin-update-title-row">
                  <h3>{update.title}</h3>
                  <Badge>{constructionTiming(update, snapshot.now)}</Badge>
                </div>
                <p className="admin-update-description">{update.description}</p>
                <div className="admin-update-meta">
                  <span>{update.updateId}</span>
                  <span><AdminIcon name="pin" size={15} />{update.affectedArea}</span>
                  <span><AdminIcon name="calendar" size={15} />{formatMalaysiaDateTime(update.startDate)} to {formatMalaysiaDateTime(update.endDate)}</span>
                </div>
              </div>
              <div className="admin-update-actions">
                <button type="button" className="admin-button admin-button--secondary admin-button--small" aria-label={`Edit ${update.updateId} ${update.title}`} onClick={() => { setMessage(null); setEditing(update.updateId); }}><AdminIcon name="edit" size={15} /><span>Edit</span></button>
                <button type="button" className="admin-button admin-button--subtle-danger admin-button--small" aria-label={`Remove ${update.updateId} ${update.title}`} onClick={() => { setMessage(null); setRemoving(update.updateId); }}><AdminIcon name="trash" size={15} /><span>Remove</span></button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing === "new" && <ConstructionForm onClose={() => setEditing(null)} onSave={(id) => { setEditing(null); setMessage({ text: `${id} was created.`, error: false }); }} />}
      {editingUpdate && <ConstructionForm key={editingUpdate.updateId} initial={editingUpdate} onClose={() => setEditing(null)} onSave={(id) => { setEditing(null); setMessage({ text: `${id} was updated.`, error: false }); }} />}
      {removingUpdate && (
        <Dialog title="Remove construction update?" onClose={() => setRemoving(null)}>
          <div className="admin-dialog-body">
            <p>Remove <strong>{removingUpdate.title}</strong> from the list?</p>
            <div className="admin-dialog-actions">
              <button type="button" className="admin-button admin-button--secondary" onClick={() => setRemoving(null)}>Cancel</button>
              <button type="button" className="admin-button admin-button--danger" onClick={() => handleRemove(removingUpdate.updateId)}>Confirm removal</button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
