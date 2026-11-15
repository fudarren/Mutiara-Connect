"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { signIn, useHydrated, useUserSession, userHome } from "@/lib/session";

export function LoginPage() {
  const router = useRouter();
  const returnTo = useSearchParams().get("next");
  const hydrated = useHydrated();
  const { user, error: sessionError } = useUserSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (hydrated && user) router.replace(userHome(user, returnTo));
  }, [hydrated, user, router, returnTo]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }
    const result = signIn(username, password);
    setError(result.ok ? "" : result.error);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7f9] px-5 py-10 text-[#202b35]">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex items-center gap-3">
          <Image src="/Mutiara-Connect-Logo.png" alt="Mutiara Connect logo" width={64} height={64} loading="eager" />
          <strong className="text-xl">Mutiara Connect</strong>
        </div>
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="mt-2 text-sm text-[#5d6974]">Enter your account details to continue.</p>
        <form onSubmit={submit} noValidate className="mt-7 grid gap-5">
          {(error || sessionError) && <p id="login-error" role="alert" className="rounded border border-[#e6c9c5] bg-[#fff2f0] px-3 py-3 text-sm text-[#8e3932]">{error || sessionError}</p>}
          <label className="grid gap-2 text-sm font-semibold" htmlFor="login-username">
            Username
            <input id="login-username" value={username} onChange={(event) => { setUsername(event.target.value); setError(""); }} autoComplete="username" autoCapitalize="none" spellCheck={false} required aria-describedby={error || sessionError ? "login-error" : undefined} className="h-11 rounded border border-[#cbd4dc] bg-white px-3 font-normal focus:outline-2 focus:outline-[#1d3d67]" />
          </label>
          <label className="grid gap-2 text-sm font-semibold" htmlFor="login-password">
            Password
            <input id="login-password" type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} autoComplete="current-password" required aria-describedby={error || sessionError ? "login-error" : undefined} className="h-11 rounded border border-[#cbd4dc] bg-white px-3 font-normal focus:outline-2 focus:outline-[#1d3d67]" />
          </label>
          <button type="submit" disabled={!hydrated || Boolean(user)} className="flex h-11 items-center justify-center rounded bg-[#1d3d67] px-4 text-sm font-semibold text-white hover:bg-[#173253] disabled:cursor-wait disabled:opacity-60">Sign in</button>
        </form>
        <Link href="/" className="mt-4 flex min-h-11 items-center justify-center rounded border border-[#cbd4dc] px-4 text-sm font-semibold text-[#1d3d67] hover:bg-white">Continue as guest</Link>
      </div>
    </main>
  );
}
