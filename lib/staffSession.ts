"use client";

import { useUserSession } from "./session";
export { useHydrated } from "./session";

export function useStaffSession() {
  const { user } = useUserSession();
  return user?.role === "admin" ? user.staff : null;
}
