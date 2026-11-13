export const TELEGRAM_LINK_PREFERENCE_KEY = "mutiara-connect.telegram-link-enabled";
export const TELEGRAM_LINK_PREFERENCE_EVENT = "mutiara-connect:telegram-link-preference-changed";
export const DEFAULT_TELEGRAM_LINK_ENABLED = true;

export function readTelegramLinkEnabled() {
  if (typeof window === "undefined") return DEFAULT_TELEGRAM_LINK_ENABLED;

  return window.localStorage.getItem(TELEGRAM_LINK_PREFERENCE_KEY) !== "false";
}
