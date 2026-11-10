"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { demoAccounts, signIn, signOut, useStaffSession } from "@/lib/staffSession";

export default function StaffLoginPage() {
  const router = useRouter();
  const session = useStaffSession();
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!staffId.trim() || !password) {
      setError("Enter both your staff ID and password.");
      return;
    }
    if (!signIn(staffId, password)) {
      setError("Invalid staff ID or password. Please try again.");
      return;
    }
    setError("");
    router.push("/admin/construction");
  }

  const demo = demoAccounts[0];

  return (
    <div className="mx-auto w-full max-w-[520px] px-3 py-10 text-[#181c1e] sm:px-5">
      <div className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#087b84]">Authorised staff only</div>
      <h1 className="mt-1 text-[29px] leading-[36px] tracking-[-0.04em]">Staff log in</h1>
      <p className="mt-1 text-[14px] leading-[21px] text-[#5d686c]">
        Authority officers, project officers and administrators sign in to manage construction entries.
      </p>

      {session ? (
        <div className="mt-6 rounded-md border border-[#e7ecef] bg-white p-5 shadow-[0_1px_2px_#dfe7eb]" role="status">
          <p className="text-[13px]">
            You are signed in as <b>{session.name}</b> ({session.staffRole}).
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/admin/construction" className="rounded bg-[#087b84] px-4 py-2.5 text-[12px] font-semibold text-white hover:bg-[#066a72]">
              Continue to manage entries
            </Link>
            <button type="button" onClick={signOut} className="rounded bg-[#e8edf1] px-4 py-2.5 text-[12px] font-semibold text-[#25363d] hover:bg-[#d9e2e7]">
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-6 grid gap-4 rounded-md border border-[#e7ecef] bg-white p-5 shadow-[0_1px_2px_#dfe7eb]">
          {error && (
            <div role="alert" className="rounded border border-[#f1c3c5] bg-[#fff1f1] p-3 text-[12px] font-semibold text-[#a81920]">
              {error}
            </div>
          )}
          <label className="grid gap-1 text-[12px] font-bold text-[#25363d]">
            Staff ID
            <input
              className="h-[38px] rounded border border-[#d5dfe4] px-3 text-[14px] font-normal"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </label>
          <label className="grid gap-1 text-[12px] font-bold text-[#25363d]">
            Password
            <input
              type="password"
              className="h-[38px] rounded border border-[#d5dfe4] px-3 text-[14px] font-normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="h-[40px] rounded bg-[#087b84] text-[13px] font-semibold text-white hover:bg-[#066a72]">
            Log in
          </button>
        </form>
      )}

      <aside className="mt-4 rounded-md border border-dashed border-[#cbd6dc] bg-[#f7fafb] p-4 text-[12px] leading-[18px] text-[#5d686c]">
        <b className="text-[#25363d]">Prototype demo account</b>
        <br />
        Staff ID: <code className="rounded bg-white px-1">{demo.staffId}</code> &nbsp; Password:{" "}
        <code className="rounded bg-white px-1">{demo.password}</code>
        <br />
        <span className="text-[11px]">
          Part A has no server, so sign-in is simulated in the browser. Real authentication and roles come in Part B.
        </span>
      </aside>

      <p className="mt-4 text-center text-[12px]">
        <Link href="/projects" className="font-semibold text-[#087b84] hover:underline">&larr; Back to the public construction map</Link>
      </p>
    </div>
  );
}
