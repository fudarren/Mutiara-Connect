"use client";

import { useState } from "react";
import { PortalIcon } from "@/components/PortalIcons";

function createLinkCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function TelegramConnectCard() {
  const [code, setCode] = useState("");
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  function generateCode() {
    setCode(createLinkCode());
    setConnected(false);
    setCopied(false);
    setCopyError("");
  }

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setCopyError("");
    } catch {
      setCopyError("Copy is unavailable. Please enter the code manually in Telegram.");
    }
  }

  return (
    <section className="rounded-md border border-[#d6e5f1] bg-[#f3f8fc] p-4 shadow-[0_1px_2px_#dfe7eb] sm:p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded bg-[#dcecf8] text-[#24749a]" aria-hidden="true"><PortalIcon name="send" size={18} /></span>
        <div className="min-w-0">
          <h2 className="text-[16px] font-bold text-[#253d4d]">Report through Telegram</h2>
          <p className="mt-1 text-[12px] leading-[18px] text-[#5d7180]">
            Connect your account to submit reports and receive status updates from the Telegram bot.
          </p>
        </div>
      </div>

      {connected ? (
        <div className="mt-4 rounded border border-[#b8dfc2] bg-[#effaf1] p-3 text-[12px] leading-[18px] text-[#24733b]" role="status">
          <b>Telegram connected for this prototype.</b>
          <p className="mt-1">The real bot verification and notifications will be connected in the backend phase.</p>
          <button type="button" onClick={() => setConnected(false)} className="mt-2 font-bold text-[#087b84] hover:underline">Disconnect mock account</button>
        </div>
      ) : code ? (
        <div className="mt-4 grid gap-3">
          <div className="rounded border border-[#cbdde9] bg-white p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.04em] text-[#5d7180]">Your 6-digit linking code</p>
            <strong className="mt-1 block font-mono text-[25px] tracking-[0.2em] text-[#087b84]">{code}</strong>
          </div>
          <ol className="grid gap-1 text-[11px] leading-[17px] text-[#5d7180]">
            <li><b>1.</b> Open the future Mutiara Connect Telegram bot.</li>
            <li><b>2.</b> Send this code to the bot.</li>
            <li><b>3.</b> Return here and confirm the mock connection.</li>
          </ol>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={copyCode} className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded bg-white px-2 text-[11px] font-bold text-[#087b84] ring-1 ring-[#cbdde9] hover:bg-[#eaf4fa]"><PortalIcon name="copy" size={14} />{copied ? "Code copied" : "Copy code"}</button>
            <button type="button" onClick={() => setConnected(true)} className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded bg-[#087b84] px-2 text-[11px] font-bold text-white hover:bg-[#066a72]"><PortalIcon name="check" size={14} />Confirm mock link</button>
          </div>
          {copyError && <p className="text-[11px] font-semibold text-[#a81920]" role="alert">{copyError}</p>}
          <button type="button" onClick={generateCode} className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#5d7180] hover:text-[#087b84]"><PortalIcon name="refresh" size={13} />Generate a new code</button>
        </div>
      ) : (
        <button type="button" onClick={generateCode} className="mt-4 inline-flex min-h-[38px] w-full items-center justify-center gap-2 rounded bg-[#087b84] px-3 text-[12px] font-bold text-white hover:bg-[#066a72]">
          <PortalIcon name="send" size={15} />
          Generate Telegram linking code
        </button>
      )}
      <p className="mt-3 text-[10px] leading-[15px] text-[#718083]">
        Frontend mock only. No Telegram message or account connection is performed yet.
      </p>
    </section>
  );
}
