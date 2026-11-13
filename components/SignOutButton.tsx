"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/session";

export function SignOutButton({ className }: { className: string }) {
  const router = useRouter();
  const [error, setError] = useState("");

  function handleSignOut() {
    const result = signOut();
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace("/login");
  }

  return (
    <div>
      <button type="button" className={className} onClick={handleSignOut}>Sign out</button>
      {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
