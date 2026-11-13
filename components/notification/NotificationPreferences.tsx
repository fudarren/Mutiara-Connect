"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { PortalIcon } from "@/components/PortalIcons";
import {
  DEFAULT_TELEGRAM_LINK_ENABLED,
  TELEGRAM_LINK_PREFERENCE_EVENT,
  TELEGRAM_LINK_PREFERENCE_KEY,
  readTelegramLinkEnabled,
} from "@/lib/notificationPreferences";

type Preferences = {
  urgentInApp: boolean;
  generalInApp: boolean;
  quietHours: boolean;
};

const initialPreferences: Preferences = {
  urgentInApp: true,
  generalInApp: true,
  quietHours: true,
};

function subscribeToTelegramLinkPreference(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(TELEGRAM_LINK_PREFERENCE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(TELEGRAM_LINK_PREFERENCE_EVENT, onChange);
  };
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-4 w-[31px] shrink-0 cursor-pointer rounded-full transition-colors ${checked ? "bg-[#0c8790]" : "bg-[#dce2e6]"}`}
    >
      <span
        className={`absolute left-0 top-[2px] size-3 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-[15px]" : "translate-x-[2px]"}`}
      />
    </button>
  );
}

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [showSuccess, setShowSuccess] = useState(false);
  const telegramLinkEnabled = useSyncExternalStore(
    subscribeToTelegramLinkPreference,
    readTelegramLinkEnabled,
    () => DEFAULT_TELEGRAM_LINK_ENABLED,
  );

  useEffect(() => {
    if (!showSuccess) return;
    const timeout = window.setTimeout(() => setShowSuccess(false), 5000);
    const hideWhenLeaving = () => {
      if (document.hidden) setShowSuccess(false);
    };

    document.addEventListener("visibilitychange", hideWhenLeaving);
    window.addEventListener("pagehide", hideWhenLeaving);
    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("visibilitychange", hideWhenLeaving);
      window.removeEventListener("pagehide", hideWhenLeaving);
    };
  }, [showSuccess]);

  const toggle = (key: keyof Preferences) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  };

  const toggleTelegramLink = () => {
    window.localStorage.setItem(
      TELEGRAM_LINK_PREFERENCE_KEY,
      String(!telegramLinkEnabled),
    );
    window.dispatchEvent(new Event(TELEGRAM_LINK_PREFERENCE_EVENT));
  };

  const reset = () => {
    setPreferences(initialPreferences);
    window.localStorage.setItem(
      TELEGRAM_LINK_PREFERENCE_KEY,
      String(DEFAULT_TELEGRAM_LINK_ENABLED),
    );
    window.dispatchEvent(new Event(TELEGRAM_LINK_PREFERENCE_EVENT));
  };
  const savePreferences = () => {
    setShowSuccess(true);
  };

  return (
    <div className="min-h-full bg-[#f5f8fa] px-3 py-4 text-[13px] text-[#10191d] sm:px-[15px] sm:py-5">
      <div className="mx-auto w-full max-w-[1130px]">
        {showSuccess && (
          <div
            role="status"
            className="mb-5 flex min-h-[43px] items-center gap-2 rounded-[3px] border border-[#e6eaed] bg-white px-2.5 text-[11px] shadow-[0_1px_2px_#dbe3e7]"
          >
            <span className="grid size-[20px] place-items-center">
              <PortalIcon name="accept" size={14} />
            </span>
            <strong className="text-[12px]">
              Notification preferences updated successfully
            </strong>
            <span className="hidden text-[10px] text-[#67757b] sm:inline">
              (Saved today&nbsp; at&nbsp; 09:15 MYT)
            </span>
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              aria-label="Dismiss success message"
              className="ml-auto grid size-[22px] cursor-pointer place-items-center rounded bg-[#eef2f4] hover:bg-[#dfe7ea]"
            >
              <PortalIcon name="close" size={11} />
            </button>
          </div>
        )}

        <div className="mb-6 text-[11px] text-[#64777e]">
          <h1 className="mt-2 text-[30px] font-bold leading-9 tracking-[-0.04em] text-[#10191d]">
            Notification Preferences
          </h1>
          <p className="mt-1 text-[14px] text-[#48606a]">
            Manage alerts and updates for the Mutiara LRT transit network.
          </p>
        </div>

        <div className="w-full space-y-4">
          <section className="rounded-md border border-[#e7ecef] bg-white px-4 py-3.5 shadow-[0_1px_2px_#e4eaed]">
            <div className="flex items-start gap-2.5">
              <span className="grid size-[27px] shrink-0 place-items-center rounded-sm bg-[#f1f5f7] text-[#087b84]">
                <PortalIcon name="bell" size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-bold">
                    In-App Notifications
                  </h2>
                  <span className="ml-auto inline-flex h-5 items-center justify-center rounded-full bg-[#b9f3f5] px-2.5 text-[10px] font-bold leading-none text-[#087b84]">
                    Active
                  </span>
                </div>
                <p className="text-[12px] text-[#46616b]">
                  Alerts delivered in the portal
                </p>
              </div>
            </div>
            <div className="mt-7 space-y-5">
              <PreferenceRow
                title="Urgent Alerts"
                description="Safety advisories and immediate disruptions"
              >
                <Toggle
                  checked={preferences.urgentInApp}
                  label="Urgent in-app alerts"
                  onChange={() => toggle("urgentInApp")}
                />
              </PreferenceRow>
              <PreferenceRow
                title="General Updates"
                description="Progress reports and station construction logs"
              >
                <Toggle
                  checked={preferences.generalInApp}
                  label="General in-app updates"
                  onChange={() => toggle("generalInApp")}
                />
              </PreferenceRow>
            </div>
          </section>

          <section className="rounded-md border border-[#e7ecef] bg-white px-4 py-3.5 shadow-[0_1px_2px_#e4eaed]">
            <div className="flex items-start gap-2.5">
              <span className="grid size-[26px] shrink-0 place-items-center">
                <PortalIcon name="round" size={26} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-bold">Telegram Link</h2>
                </div>
                <p className="text-[12px] text-[#46616b]">
                  Show the Telegram reporting link on the report issue page
                </p>
              </div>
            </div>
            <div className="mt-7">
              <PreferenceRow
                title="Enable Telegram link"
                description="Let users connect through Telegram when reporting an issue"
              >
                <Toggle
                  checked={telegramLinkEnabled}
                  label="Enable Telegram link"
                  onChange={toggleTelegramLink}
                />
              </PreferenceRow>
            </div>
          </section>

          <section className="flex items-center gap-2.5 rounded-md border border-[#e7ecef] bg-white px-4 py-3.5 shadow-[0_1px_2px_#e4eaed]">
            <span className="grid size-[28px] shrink-0 place-items-center bg-[#f1f4f6]">
              <PortalIcon name="moon" size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[16px] font-bold">Quiet Hours</h2>
              <p className="text-[12px] text-[#46616b]">
                Pause non-urgent notices during night hours
              </p>
            </div>
            <span className="hidden bg-[#edf0f2] px-2.5 py-1.5 font-mono text-[10px] font-bold text-[#34484f] sm:inline">
              22:00 &ndash; 07:00
            </span>
            <Toggle
              checked={preferences.quietHours}
              label="Quiet hours"
              onChange={() => toggle("quietHours")}
            />
          </section>

          <div className="flex flex-col-reverse items-start justify-between gap-3 pt-2 text-[11px] text-[#60747c] sm:flex-row sm:items-center">
            <span>Last synced: Today, 09:15 MYT</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={reset}
                className="cursor-pointer rounded bg-[#e9eef1] px-3 py-2 text-[12px] font-semibold text-[#34484f] hover:bg-[#dce5e9]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={savePreferences}
                className="flex cursor-pointer items-center gap-1.5 rounded bg-[#006c75] px-4 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-[#005d65]"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreferenceRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="min-w-0 flex-1">
        <h3 className="text-[12px] font-bold text-[#142c35]">{title}</h3>
        <p className="text-[11px] text-[#46616b]">{description}</p>
      </div>
      {children}
    </div>
  );
}
