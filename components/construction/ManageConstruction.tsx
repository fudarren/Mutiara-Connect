"use client";

import Link from "next/link";
import { useState } from "react";
import { ClosureBadge, DraftBadge, ProgressBadge, WorkTypeBadge } from "@/components/construction/Badges";
import { UpdateForm } from "@/components/construction/UpdateForm";
import { closureStatus, formatDate, formatMYT } from "@/lib/construction";
import { nextUpdateId, removeUpdate, saveUpdate, useConstructionUpdates } from "@/lib/constructionStore";
import { useHydrated, useStaffSession } from "@/lib/staffSession";
import { SignOutButton } from "@/components/SignOutButton";
import type { ConstructionUpdate } from "@/types";

type Editing = null | "new" | string;

const btn = "rounded px-2.5 py-1.5 text-[10px] font-semibold";

export function ManageConstruction() {
  const hydrated = useHydrated();
  const session = useStaffSession();
  const updates = useConstructionUpdates();
  const [editing, setEditing] = useState<Editing>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  if (!hydrated) {
    return <div className="mx-auto w-full max-w-[1130px] px-3 py-10 text-sm text-[#5d686c] sm:px-5">Checking sign-in...</div>;
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-[560px] px-3 py-10 sm:px-5">
        <div role="alert" className="rounded-md border border-[#e7ecef] bg-white p-6 text-center shadow-[0_1px_2px_#dfe7eb]">
          <h1 className="text-[22px] tracking-[-0.03em]">Staff sign-in required</h1>
          <p className="mt-2 text-sm text-[#5d686c]">
            Only authorised staff can manage construction entries. Please log in to continue.
          </p>
          <Link href="/login" className="mt-4 inline-flex rounded bg-[#087b84] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#066a72]">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  const editingUpdate = editing && editing !== "new" ? updates.find((u) => u.updateId === editing) : undefined;

  function handleSave(update: ConstructionUpdate) {
    const isNew = !updates.some((u) => u.updateId === update.updateId);
    saveUpdate(update);
    setEditing(null);
    setMessage(`${isNew ? "Created" : "Saved"} ${update.updateId.toUpperCase()}: ${update.title}`);
  }

  function togglePublish(u: ConstructionUpdate) {
    saveUpdate({ ...u, isPublished: !u.isPublished });
    setMessage(`${u.updateId.toUpperCase()} is now ${u.isPublished ? "unpublished (hidden from the public)" : "published"}.`);
  }

  function confirmRemove(u: ConstructionUpdate) {
    removeUpdate(u.updateId);
    setConfirmId(null);
    setMessage(`Removed ${u.updateId.toUpperCase()}: ${u.title}`);
  }

  return (
    <div className="mx-auto w-full max-w-[1130px] px-3 py-6 text-[#181c1e] sm:px-5 sm:py-7">
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#087b84]">Staff area</div>
          <h1 className="mt-1 text-[31px] leading-[38px] tracking-[-0.04em]">Manage construction entries</h1>
          <p className="mt-1 text-[13px] text-[#5d686c]">
            Signed in as <b>{session.name}</b>, {session.staffRole}, {session.department}. Zone:{" "}
            {session.assignedZone}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { setEditing("new"); setMessage(""); }}
            className="rounded bg-[#087b84] px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-[#066a72]"
          >
            + Add entry
          </button>
          <SignOutButton className="flex min-h-10 items-center justify-center rounded bg-[#e8edf1] px-4 py-2.5 text-[12px] font-semibold text-[#25363d]" />
        </div>
      </div>

      {message && (
        <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded border border-[#bfe0d2] bg-[#ebf7f1] px-3 py-2.5 text-[12px] font-semibold text-[#176b61]">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage("")} className="text-[11px] underline">Dismiss</button>
        </div>
      )}

      {editing !== null && (
        <div className="mb-5">
          <UpdateForm
            key={editing}
            initial={editingUpdate}
            newId={nextUpdateId(updates)}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      <section aria-label="Construction entries" className="overflow-x-auto rounded-md border border-[#e7ecef] bg-white shadow-[0_1px_2px_#dfe7eb]">
        <table className="w-full min-w-[860px] text-left text-[12px]">
          <thead className="bg-[#f4f7f8] text-[10px] uppercase tracking-[0.04em] text-[#718083]">
            <tr>
              <th scope="col" className="px-3 py-2.5">ID</th>
              <th scope="col" className="px-3 py-2.5">Entry</th>
              <th scope="col" className="px-3 py-2.5">Type</th>
              <th scope="col" className="px-3 py-2.5">Road status</th>
              <th scope="col" className="px-3 py-2.5">Progress</th>
              <th scope="col" className="px-3 py-2.5">Updated (MYT)</th>
              <th scope="col" className="px-3 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {updates.map((u) => (
              <tr key={u.updateId} className="border-t border-[#eef2f4] align-top">
                <td className="whitespace-nowrap px-3 py-3 font-mono text-[11px]">{u.updateId.toUpperCase()}</td>
                <td className="max-w-[260px] px-3 py-3">
                  <div className="font-semibold">{u.title}</div>
                  <div className="mt-0.5 text-[11px] text-[#748084]">
                    {formatDate(u.startDate)} - {formatDate(u.endDate)}
                  </div>
                  {!u.isPublished && <div className="mt-1"><DraftBadge /></div>}
                </td>
                <td className="px-3 py-3"><WorkTypeBadge type={u.workType} /></td>
                <td className="px-3 py-3"><ClosureBadge status={closureStatus(u)} /></td>
                <td className="px-3 py-3"><ProgressBadge status={u.status} /></td>
                <td className="px-3 py-3 text-[11px] text-[#5d686c]">{formatMYT(u.lastUpdated)}</td>
                <td className="px-3 py-3">
                  {confirmId === u.updateId ? (
                    <div role="alertdialog" aria-label={`Confirm removal of ${u.title}`} className="flex flex-wrap items-center justify-end gap-2">
                      <span className="text-[11px] font-semibold text-[#a81920]">Remove this entry?</span>
                      <button type="button" onClick={() => confirmRemove(u)} className={`${btn} bg-[#c9222b] text-white`}>Confirm</button>
                      <button type="button" onClick={() => setConfirmId(null)} className={`${btn} bg-[#e8edf1] text-[#25363d]`}>Cancel</button>
                    </div>
                  ) : (
                    <div className="flex min-w-[250px] flex-wrap justify-end gap-1.5">
                      <Link href={`/projects/${u.updateId}`} className={`${btn} bg-[#e8edf1] text-[#25363d] hover:bg-[#d9e2e7]`}>View</Link>
                      <button type="button" onClick={() => { setEditing(u.updateId); setMessage(""); }} className={`${btn} bg-[#e8edf1] text-[#25363d] hover:bg-[#d9e2e7]`}>Edit</button>
                      <button type="button" onClick={() => togglePublish(u)} className={`${btn} bg-[#e8edf1] text-[#25363d] hover:bg-[#d9e2e7]`}>
                        {u.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <button type="button" onClick={() => { setConfirmId(u.updateId); setMessage(""); }} className={`${btn} bg-[#ffd9d8] text-[#a81920] hover:bg-[#ffc7c5]`}>Remove</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {updates.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-8 text-center text-[#5d686c]">No entries. Use &ldquo;Add entry&rdquo; to create one.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <p className="mt-4 text-[11px] text-[#7a8588]">
        Changes appear immediately on the public{" "}
        <Link href="/projects" className="font-semibold text-[#087b84] hover:underline">construction map</Link>.
      </p>
    </div>
  );
}
