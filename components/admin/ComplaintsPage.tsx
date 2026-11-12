"use client";

import { useState, type FormEvent } from "react";
import { DEMO_STAFF, staffName } from "@/lib/admin/data";
import { formatMalaysiaDateTime } from "@/lib/admin/dates";
import { assignComplaint, changeComplaintStatus, useDemoData } from "@/lib/admin/store";
import { COMPLAINT_STATUSES, type Complaint } from "@/lib/admin/types";
import { AdminIcon } from "./AdminIcon";
import { Badge, Dialog, EmptyState, Feedback, Field, PageLoading, describedBy } from "./AdminUI";

type Message = { text: string; error: boolean } | null;

function ComplaintDetails({ complaint, onClose }: { complaint: Complaint; onClose: () => void }) {
  const [staffId, setStaffId] = useState(complaint.assignedStaffId ?? "");
  const [assignmentError, setAssignmentError] = useState("");
  const [message, setMessage] = useState<Message>(null);

  function updateStatus(status: string) {
    const result = changeComplaintStatus(complaint.complaintId, status);
    setMessage(result.ok ? { text: `Status changed to ${status}.`, error: false } : { text: result.error, error: true });
  }

  function handleAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = assignComplaint(complaint.complaintId, staffId);
    if (!result.ok) {
      setAssignmentError(result.error);
      setMessage(null);
      return;
    }
    setAssignmentError("");
    setMessage({ text: `Assigned to ${staffName(staffId)}.`, error: false });
  }

  return (
    <Dialog title={`Complaint ${complaint.complaintId}`} description="Review the complaint and update its status or assignment." onClose={onClose} wide>
      <div className="admin-dialog-body">
        {message && <Feedback error={message.error}>{message.text}</Feedback>}
        <div className="admin-detail-grid">
          <div><span>Category</span><strong>{complaint.category}</strong></div>
          <div><span>Location</span><strong>{complaint.location}</strong></div>
          <div><span>Submitted</span><strong>{formatMalaysiaDateTime(complaint.submittedAt)}</strong></div>
          <div><span>Currently assigned</span><strong>{staffName(complaint.assignedStaffId)}</strong></div>
        </div>
        <div className="admin-detail-description">
          <span>Description</span>
          <p>{complaint.description}</p>
        </div>
        <div className="admin-detail-actions">
          <Field id="complaint-status" label="Status">
            <select id="complaint-status" value={complaint.status} onChange={(event) => updateStatus(event.target.value)}>
              {COMPLAINT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </Field>
          <form onSubmit={handleAssignment} noValidate>
            <Field id="complaint-assignee" label="Assign to staff" error={assignmentError}>
              <select
                id="complaint-assignee"
                value={staffId}
                onChange={(event) => { setStaffId(event.target.value); setAssignmentError(""); }}
                aria-invalid={Boolean(assignmentError)}
                aria-describedby={describedBy("complaint-assignee", assignmentError)}
              >
                <option value="">Select a staff member</option>
                {DEMO_STAFF.map((staff) => <option key={staff.staffId} value={staff.staffId}>{staff.displayName} ({staff.role})</option>)}
              </select>
            </Field>
            <button type="submit" className="admin-button admin-button--secondary admin-assign-button">Confirm assignment</button>
          </form>
        </div>
        <div className="admin-dialog-actions"><button type="button" className="admin-button admin-button--secondary" onClick={onClose}>Close</button></div>
      </div>
    </Dialog>
  );
}

export function ComplaintsPage() {
  const snapshot = useDemoData();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  if (!snapshot) return <PageLoading title="Complaints" />;

  const query = search.trim().toLocaleLowerCase();
  const filtered = snapshot.data.complaints.filter((complaint) => {
    const matchesText = [complaint.complaintId, complaint.description, complaint.location]
      .some((value) => value.toLocaleLowerCase().includes(query));
    return matchesText && (status === "All" || complaint.status === status);
  });
  const selected = snapshot.data.complaints.find((complaint) => complaint.complaintId === selectedId);

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <h1>Complaints</h1>
          <p>Review and respond to community feedback.</p>
        </div>
      </div>
      <section className="admin-content-section">
        <div className="admin-section-heading">
          <h2>All complaints <span className="admin-count">{snapshot.data.complaints.length}</span></h2>
        </div>
        <div className="admin-table-tools">
          <div className="admin-search">
            <AdminIcon name="search" size={18} />
            <label className="admin-visually-hidden" htmlFor="complaint-search">Search complaints by ID, description or location</label>
            <input id="complaint-search" type="search" placeholder="Search by ID, description or location" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <div className="admin-filter">
            <label htmlFor="complaint-filter">Status</label>
            <select id="complaint-filter" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="All">All statuses</option>
              {COMPLAINT_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>
        <p className="admin-results" aria-live="polite">Showing {filtered.length} of {snapshot.data.complaints.length} complaints</p>
        {filtered.length === 0 ? (
          <EmptyState title={snapshot.data.complaints.length ? "No matching complaints" : "No complaints yet"}>
            {snapshot.data.complaints.length ? "Try a different search or status filter." : "There are no complaints to display."}
          </EmptyState>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th scope="col">Complaint</th><th scope="col">Location</th><th scope="col">Submitted</th><th scope="col">Status</th><th scope="col">Assigned staff</th><th scope="col"><span className="admin-visually-hidden">Actions</span></th></tr></thead>
              <tbody>
                {filtered.map((complaint) => (
                  <tr key={complaint.complaintId}>
                    <td data-label="Complaint"><strong>{complaint.complaintId}</strong><span className="admin-table-subtext">{complaint.category}</span></td>
                    <td data-label="Location">{complaint.location}</td>
                    <td data-label="Submitted"><time dateTime={complaint.submittedAt}>{formatMalaysiaDateTime(complaint.submittedAt)}</time></td>
                    <td data-label="Status"><Badge>{complaint.status}</Badge></td>
                    <td data-label="Assigned staff">{staffName(complaint.assignedStaffId)}</td>
                    <td data-label="Action"><button type="button" className="admin-table-link" aria-label={`View details for ${complaint.complaintId}`} onClick={() => setSelectedId(complaint.complaintId)}>View details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {selected && <ComplaintDetails key={selected.complaintId} complaint={selected} onClose={() => setSelectedId(null)} />}
    </>
  );
}
