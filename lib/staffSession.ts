"use client";

import { useSyncExternalStore } from "react";
import type { StaffSession } from "@/types";

/*
 * Sample accounts are hard-coded; sign-in is simulated locally and does not
 * provide server-side authentication or security.
 */

type DemoAccount = StaffSession & { password: string };

export const demoAccounts: DemoAccount[] = [
  {
    staffId: "STF-1001",
    password: "mutiara2026",
    name: "Nur Aisyah",
    staffRole: "Project officer",
    department: "MRT Corp Project Office",
    assignedZone: "Section A (Komtar - Jelutong)",
  },
  {
    staffId: "STF-2001",
    password: "mutiara2026",
    name: "Rajesh Kumar",
    staffRole: "Authority officer",
    department: "Penang Island City Council",
    assignedZone: "Southern Corridor (Gelugor - Bayan Lepas)",
  },
  {
    staffId: "STF-3001",
    password: "mutiara2026",
    name: "Lim Wei Han",
    staffRole: "Administrator",
    department: "Mutiara Connect Platform Team",
    assignedZone: "All zones",
  },
];

const KEY = "mutiara-staff-session-v1";
const EVENT = "mutiara-staff-change";

let cachedRaw: string | null | undefined;
let cachedSession: StaffSession | null = null;

function read(): StaffSession | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw === cachedRaw) return cachedSession;
    cachedRaw = raw;
    cachedSession = raw ? (JSON.parse(raw) as StaffSession) : null;
  } catch {
    cachedRaw = undefined;
    cachedSession = null;
  }
  return cachedSession;
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

export function useStaffSession(): StaffSession | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

/** True once the component has hydrated, so pages can avoid flashing a wrong state. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** Returns the session on success, or null when the credentials do not match. */
export function signIn(staffId: string, password: string): StaffSession | null {
  const account = demoAccounts.find(
    (a) => a.staffId.toLowerCase() === staffId.trim().toLowerCase() && a.password === password,
  );
  if (!account) return null;
  const { password: _password, ...session } = account;
  void _password;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
  return session;
}

export function signOut() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}
