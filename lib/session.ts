"use client";

import { useSyncExternalStore } from "react";
import type { StaffSession } from "@/types";

type PublicUser = { username: string; name: string; role: "public" };
type AdminUser = { username: string; name: string; role: "admin"; staff: StaffSession };
export type SessionUser = PublicUser | AdminUser;
type Account = { user: SessionUser; password: string };
type SessionSnapshot = { user: SessionUser | null; error: string | null };
type SessionResult = { ok: true } | { ok: false; error: string };

const accounts: Account[] = [
  { user: { username: "public", name: "Ahmad Rahman", role: "public" }, password: "public2026" },
  {
    user: {
      username: "admin",
      name: "Priya Nair",
      role: "admin",
      staff: {
        staffId: "STF-1001",
        name: "Priya Nair",
        staffRole: "Administrator",
        department: "Mutiara Connect",
        assignedZone: "All zones",
      },
    },
    password: "admin2026",
  },
];

const KEY = "mutiara-user-session-v1";
const EVENT = "mutiara-user-session-change";
const serverSnapshot: SessionSnapshot = { user: null, error: null };
let cachedRaw: string | null | undefined;
let snapshot = serverSnapshot;

function read(): SessionSnapshot {
  let raw: string | null;
  try {
    raw = window.sessionStorage.getItem(KEY);
  } catch (error) {
    if (!snapshot.error) {
      console.error("Unable to read the sign-in session.", error);
      snapshot = { user: null, error: "Unable to access your session. Enable browser storage and try again." };
    }
    return snapshot;
  }
  if (raw === cachedRaw) return snapshot;
  cachedRaw = raw;
  const user = accounts.find((account) => account.user.username === raw)?.user ?? null;
  if (raw !== null && !user) {
    console.error("The stored sign-in session is invalid.");
    snapshot = { user: null, error: "Your session is invalid. Please sign in again." };
  } else {
    snapshot = { user, error: null };
  }
  return snapshot;
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.storageArea === window.sessionStorage && (event.key === KEY || event.key === null)) onChange();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function useUserSession() {
  return useSyncExternalStore(subscribe, read, () => serverSnapshot);
}

export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function signIn(username: string, password: string): SessionResult {
  const account = accounts.find(
    (candidate) => candidate.user.username === username.trim().toLowerCase() && candidate.password === password,
  );
  if (!account) return { ok: false, error: "Invalid username or password. Please try again." };
  try {
    window.sessionStorage.setItem(KEY, account.user.username);
  } catch (error) {
    console.error("Unable to save the sign-in session.", error);
    return { ok: false, error: "Unable to sign in. Enable browser storage and try again." };
  }
  cachedRaw = account.user.username;
  snapshot = { user: account.user, error: null };
  window.dispatchEvent(new Event(EVENT));
  return { ok: true };
}

export function signOut(): SessionResult {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch (error) {
    console.error("Unable to clear the sign-in session.", error);
    return { ok: false, error: "Unable to sign out. Enable browser storage and try again." };
  }
  cachedRaw = null;
  snapshot = serverSnapshot;
  window.dispatchEvent(new Event(EVENT));
  return { ok: true };
}

export function userHome(user: SessionUser) {
  return user.role === "admin" ? "/admin" : "/";
}
