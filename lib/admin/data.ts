import type { Complaint, DemoAnnouncement, DemoConstructionUpdate, DemoData, DemoStaff } from "./types";

export const DEMO_STAFF: DemoStaff[] = [
  { staffId: "STF-101", displayName: "Aina Rahman", role: "Project Officer" },
  { staffId: "STF-102", displayName: "Daniel Tan", role: "Response Team" },
  { staffId: "STF-103", displayName: "Priya Nair", role: "Administrator" },
];

const updateCopy: Record<string, { previous: string; current: string }> = {
  "UPD-001": {
    previous: "A fictional lane adjustment is in place while crews carry out preparatory works. Allow additional travel time.",
    current: "One lane is temporarily closed for site preparation. Motorists should allow additional travel time.",
  },
  "UPD-002": {
    previous: "A fictional signed walkway provides an alternative route around the work area.",
    current: "Pedestrians are being directed to a temporary walkway around the work area. Access to nearby premises remains available.",
  },
  "UPD-003": {
    previous: "A fictional overnight inspection will temporarily narrow one traffic lane.",
    current: "An overnight inspection of underground utilities will temporarily narrow one traffic lane.",
  },
  "UPD-004": {
    previous: "Fictional resurfacing works are planned near the junction, with access maintained for nearby shops.",
    current: "Resurfacing near the junction will take place in stages, with access maintained for nearby shops.",
  },
  "UPD-005": {
    previous: "Fictional site barriers were installed and the pedestrian path reopened.",
    current: "Safety barriers have been installed and the pedestrian path has reopened.",
  },
  "UPD-006": {
    previous: "Fictional drainage checks concluded without further disruption.",
    current: "Drainage checks are complete and normal access has resumed.",
  },
};

const announcementCopy: Record<string, { previous: string; current: string }> = {
  "ANN-001": {
    previous: "Please follow the fictional diversion signs near the work area.",
    current: "Please follow the pedestrian diversion signs near the work area.",
  },
  "ANN-002": {
    previous: "A fictional lane adjustment is being demonstrated for the Gelugor area.",
    current: "A lane on Jalan Sultan Azlan Shah is temporarily closed. Please allow extra travel time and follow posted signs.",
  },
  "ANN-003": {
    previous: "A fictional utility inspection is scheduled later this week.",
    current: "A utility inspection is scheduled later this week. Temporary lane restrictions may apply.",
  },
  "ANN-004": {
    previous: "The fictional barrier installation has been completed.",
    current: "The barrier installation is complete and the pedestrian path has reopened.",
  },
};

export function refreshSampleContent(data: DemoData): DemoData {
  let changed = false;
  const updates = data.updates.map((update) => {
    const copy = updateCopy[update.updateId];
    if (!copy || update.description !== copy.previous) return update;
    changed = true;
    return { ...update, description: copy.current };
  });
  const announcements = data.announcements.map((announcement) => {
    const copy = announcementCopy[announcement.notificationId];
    if (!copy || announcement.message !== copy.previous) return announcement;
    changed = true;
    return { ...announcement, message: copy.current };
  });
  return changed ? { ...data, updates, announcements } : data;
}

export function staffName(staffId: string | null): string {
  return DEMO_STAFF.find((staff) => staff.staffId === staffId)?.displayName ?? "Unassigned";
}

export function createDemoData(now = new Date()): DemoData {
  const at = (days: number) => new Date(now.getTime() + days * 86_400_000).toISOString();

  const complaints: Complaint[] = [
    { complaintId: "CMP-001", category: "Construction noise", description: "Loud piling sounds in the evening are disturbing residents near the junction.", location: "Jalan Perak, George Town", submittedAt: at(-0.2), status: "Pending", assignedStaffId: null },
    { complaintId: "CMP-002", category: "Road closure", description: "Temporary lane barriers are causing congestion around the morning school commute.", location: "Jalan Sultan Azlan Shah, Gelugor", submittedAt: at(-0.8), status: "In Progress", assignedStaffId: "STF-101" },
    { complaintId: "CMP-003", category: "Pedestrian access", description: "The marked pedestrian route is difficult for wheelchair users to follow.", location: "Bayan Lepas town centre", submittedAt: at(-1.3), status: "Pending", assignedStaffId: null },
    { complaintId: "CMP-004", category: "Dust and debris", description: "Dust from a nearby work area is settling on shopfronts during the afternoon.", location: "Jalan Tun Dr Awang, Bayan Lepas", submittedAt: at(-2), status: "In Progress", assignedStaffId: "STF-102" },
    { complaintId: "CMP-005", category: "Traffic signage", description: "A diversion sign at the junction is not clearly visible from the approach road.", location: "Jelutong Expressway", submittedAt: at(-3), status: "Resolved", assignedStaffId: "STF-101" },
    { complaintId: "CMP-006", category: "Business access", description: "Delivery vehicles need clearer access to businesses along the temporary barrier.", location: "Sungai Nibong", submittedAt: at(-3.6), status: "Pending", assignedStaffId: "STF-103" },
    { complaintId: "CMP-007", category: "Construction noise", description: "Residents asked for clarification about early-morning machinery noise.", location: "Macallum Street, George Town", submittedAt: at(-4), status: "Resolved", assignedStaffId: "STF-102" },
    { complaintId: "CMP-008", category: "Pedestrian access", description: "A temporary walkway feels too narrow during the evening peak.", location: "Gelugor", submittedAt: at(-5), status: "In Progress", assignedStaffId: "STF-101" },
    { complaintId: "CMP-009", category: "Road closure", description: "The alternative route to the community hall needs clearer directional signs.", location: "Bayan Baru", submittedAt: at(-6), status: "Pending", assignedStaffId: null },
    { complaintId: "CMP-010", category: "Drainage", description: "Water collects near the temporary fencing after heavy rain.", location: "Jelutong", submittedAt: at(-7), status: "Resolved", assignedStaffId: "STF-102" },
    { complaintId: "CMP-011", category: "Public transport", description: "The temporary bus stop location is unclear to passengers.", location: "Komtar, George Town", submittedAt: at(-8), status: "In Progress", assignedStaffId: "STF-103" },
    { complaintId: "CMP-012", category: "Site safety", description: "Residents requested better lighting beside a temporary pedestrian route.", location: "Batu Maung", submittedAt: at(-9), status: "Resolved", assignedStaffId: "STF-101" },
  ];

  const update = (
    updateId: string,
    title: string,
    description: string,
    affectedArea: string,
    start: number,
    end: number,
    created: number,
  ): DemoConstructionUpdate => ({
    updateId, title, description, affectedArea,
    startDate: at(start), endDate: at(end),
    createdAt: at(created), updatedAt: at(created), removedAt: null,
  });

  const updates = [
    update("UPD-001", "Temporary lane works near Gelugor", updateCopy["UPD-001"].current, "Jalan Sultan Azlan Shah, Gelugor", -2, 4, -4),
    update("UPD-002", "Pedestrian walkway diversion", updateCopy["UPD-002"].current, "Sungai Nibong", -1, 3, -3),
    update("UPD-003", "Scheduled utility inspection", updateCopy["UPD-003"].current, "Jalan Tun Dr Awang, Bayan Lepas", 2, 5, -2),
    update("UPD-004", "Upcoming road resurfacing", updateCopy["UPD-004"].current, "Jelutong", 5, 8, -5),
    update("UPD-005", "Completed barrier installation", updateCopy["UPD-005"].current, "Bayan Baru", -10, -5, -12),
    update("UPD-006", "Completed drainage checks", updateCopy["UPD-006"].current, "George Town", -15, -8, -16),
  ];

  const announcement = (
    notificationId: string,
    title: string,
    message: string,
    affectedArea: string,
    severity: DemoAnnouncement["severity"],
    published: number,
    expires: number | null,
  ): DemoAnnouncement => ({
    notificationId, title, message, affectedArea, severity,
    createdAt: at(published), publishedAt: at(published),
    expiresAt: expires === null ? null : at(expires),
  });

  const announcements = [
    announcement("ANN-001", "Temporary walkway reminder", announcementCopy["ANN-001"].current, "Sungai Nibong", "Normal", -0.5, 3),
    announcement("ANN-002", "Lane adjustment advisory", announcementCopy["ANN-002"].current, "Gelugor", "Urgent", -1, 2),
    announcement("ANN-003", "Upcoming inspection notice", announcementCopy["ANN-003"].current, "Bayan Lepas", "Normal", -3, null),
    announcement("ANN-004", "Completed works update", announcementCopy["ANN-004"].current, "Bayan Baru", "Normal", -6, null),
  ];

  return { complaints, updates, announcements };
}
