const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_ROOT = BOT_TOKEN ? `https://api.telegram.org/bot${BOT_TOKEN}` : "";
const POLL_TIMEOUT_SECONDS = 30;

const feedbackCategories = [
  "Construction impact",
  "Safety concern",
  "Accessibility",
  "Environmental issue",
  "General feedback",
];

const reportLocations = [
  { label: "George Town / Komtar", coordinates: [100.3292, 5.4148] },
  { label: "Jelutong", coordinates: [100.3118, 5.3895] },
  { label: "Gelugor", coordinates: [100.3177, 5.3652] },
  { label: "Bayan Lepas", coordinates: [100.3055, 5.364] },
  { label: "Penang International Airport", coordinates: [100.2655, 5.2971] },
  { label: "Penang Sentral", coordinates: [100.388, 5.3991] },
  { label: "Other location", coordinates: [100.3327, 5.4164] },
];

const reports = [
  {
    referenceNumber: "MC-2026-0047",
    kind: "Complaint",
    category: "Safety concern",
    title: "Temporary barrier needs clearer warning signs",
    description: "A barrier near the work area is difficult to see after dark.",
    location: "George Town / Komtar",
    locationCoordinates: { type: "Point", coordinates: [100.3292, 5.4148] },
    submittedAt: "2026-11-10T18:20:00+08:00",
    status: "Submitted",
  },
  {
    referenceNumber: "MC-2026-0042",
    kind: "Complaint",
    category: "Construction impact",
    title: "Dust affecting nearby shopfronts",
    description: "Dust from the active work area is collecting near the pedestrian entrance.",
    location: "Bayan Lepas",
    locationCoordinates: { type: "Point", coordinates: [100.3055, 5.364] },
    submittedAt: "2026-11-08T09:30:00+08:00",
    status: "Under review",
  },
];

const sessions = new Map();
const startedChatIds = new Set();
const linkedChatIds = new Set();
let nextUpdateOffset = 0;
let running = true;

function requireToken() {
  if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set. Put the rotated token in your local environment.");
  }
}

async function telegram(method, payload = {}) {
  requireToken();
  const response = await fetch(`${API_ROOT}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout((POLL_TIMEOUT_SECONDS + 5) * 1000),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(`Telegram API ${method} failed: ${result.description || response.statusText}`);
  }
  return result.result;
}

function mainKeyboard() {
  return {
    keyboard: [
      [{ text: "/report" }, { text: "/track" }],
      [{ text: "/myreports" }, { text: "/help" }],
      [{ text: "/cancel" }],
    ],
    resize_keyboard: true,
  };
}

function inlineKeyboard(rows) {
  return { inline_keyboard: rows };
}

async function sendMessage(chatId, text, extra = {}) {
  return telegram("sendMessage", { chat_id: chatId, text, ...extra });
}

async function answerCallback(query) {
  return telegram("answerCallbackQuery", { callback_query_id: query.id });
}

function sessionFor(chatId) {
  return sessions.get(chatId) || null;
}

function setSession(chatId, session) {
  sessions.set(chatId, session);
}

function clearSession(chatId) {
  sessions.delete(chatId);
}

function linkingPrompt(chatId) {
  setSession(chatId, { type: "link" });
  return sendMessage(chatId, "To continue, enter the linking code shown on the Mutiara Connect website.\n\nThis is a mock link, so any non-empty code will be accepted.", {
    reply_markup: { remove_keyboard: true },
  });
}

function reportReference() {
  const year = new Date().getFullYear();
  let reference;
  do {
    reference = `MC-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
  } while (reports.some((report) => report.referenceNumber === reference));
  return reference;
}

function startReport(chatId) {
  setSession(chatId, { type: "report", step: "kind", draft: {} });
  return sendMessage(chatId, "What would you like to submit?", {
    reply_markup: inlineKeyboard([
      [{ text: "Complaint", callback_data: "report:kind:Complaint" }],
      [{ text: "Feedback", callback_data: "report:kind:Feedback" }],
    ]),
  });
}

function askCategory(chatId) {
  return sendMessage(chatId, "Choose a category.", {
    reply_markup: inlineKeyboard(
      feedbackCategories.map((category) => [{ text: category, callback_data: `report:category:${category}` }]),
    ),
  });
}

function askLocation(chatId) {
  return sendMessage(chatId, "Where did this happen?", {
    reply_markup: inlineKeyboard(
      [
        [{ text: "Use my location (mock)", callback_data: "report:location:near-me" }],
        ...reportLocations.map((location) => [{ text: location.label, callback_data: `report:location:${location.label}` }]),
      ],
    ),
  });
}

function askPhoto(chatId) {
  return sendMessage(chatId, "Upload an image as evidence, or tap Skip if you do not have one.", {
    reply_markup: inlineKeyboard([
      [{ text: "Skip image", callback_data: "report:photo:skip" }],
    ]),
  });
}

function askConfirmation(chatId, session) {
  const evidence = session.draft.photoFileId ? "Image attached" : "No image";
  return sendMessage(chatId, `Please confirm this mock report:\n\n${session.draft.kind}: ${session.draft.title}\nCategory: ${session.draft.category}\nLocation: ${session.draft.location.label}\nEvidence: ${evidence}\nDescription: ${session.draft.description}`, {
    reply_markup: inlineKeyboard([
      [{ text: "Submit report", callback_data: "report:confirm:yes" }],
      [{ text: "Cancel", callback_data: "report:confirm:no" }],
    ]),
  });
}

async function handleReportCallback(query) {
  const chatId = query.message.chat.id;
  const session = sessionFor(chatId);
  if (!session || session.type !== "report") return sendMessage(chatId, "This report session expired. Send /report to start again.");

  const [, step, value] = query.data.split(":");
  if (step === "kind" && (value === "Complaint" || value === "Feedback")) {
    session.draft.kind = value;
    session.step = "category";
    setSession(chatId, session);
    return askCategory(chatId);
  }
  if (step === "category" && feedbackCategories.includes(value)) {
    session.draft.category = value;
    session.step = "location";
    setSession(chatId, session);
    return askLocation(chatId);
  }
  if (step === "location") {
    const selectedLocation = value === "near-me"
      ? { label: "Near me (mock: George Town / Komtar)", coordinates: [100.3292, 5.4148] }
      : reportLocations.find((location) => location.label === value);
    if (!selectedLocation) return sendMessage(chatId, "That location is unavailable. Send /report to try again.");
    session.draft.location = selectedLocation;
    session.step = "title";
    setSession(chatId, session);
    return sendMessage(chatId, "Give the report a short title.");
  }
  if (step === "photo" && value === "skip") {
    session.step = "confirm";
    setSession(chatId, session);
    return askConfirmation(chatId, session);
  }
  if (step === "confirm" && value === "yes") return saveReport(chatId, session);
  if (step === "confirm" && value === "no") {
    clearSession(chatId);
    return sendMessage(chatId, "The report was cancelled.", { reply_markup: mainKeyboard() });
  }
  return sendMessage(chatId, "That option is no longer available. Send /report to start again.");
}

async function saveReport(chatId, session) {
  const { kind, category, location, title, description, photoFileId } = session.draft;
  const report = {
    referenceNumber: reportReference(),
    kind,
    category,
    title,
    description,
    location: location.label,
    locationCoordinates: { type: "Point", coordinates: location.coordinates },
    submittedAt: new Date().toISOString(),
    status: "Submitted",
    photoFileId,
    photoName: photoFileId ? "Telegram image" : undefined,
    chatId,
  };
  reports.unshift(report);
  clearSession(chatId);
  return sendMessage(
    chatId,
    `Your ${kind.toLowerCase()} was submitted in the mock system.\n\nReference number: ${report.referenceNumber}\nStatus: ${report.status}\nLocation: ${report.location}\nEvidence: ${photoFileId ? "Image attached" : "No image"}\n\nKeep this reference number to track the report later.`,
    { reply_markup: mainKeyboard() },
  );
}

async function listMyReports(chatId) {
  const ownReports = reports.filter((report) => report.chatId === chatId);
  if (ownReports.length === 0) {
    return sendMessage(chatId, "You have not submitted any reports in this mock bot yet. Send /report to create one.", {
      reply_markup: mainKeyboard(),
    });
  }
  const summary = ownReports
    .map((report) => `${report.referenceNumber} - ${report.status}\n${report.title}\n${report.location}`)
    .join("\n\n");
  return sendMessage(chatId, `Your mock reports (${ownReports.length})\n\n${summary}`, {
    reply_markup: mainKeyboard(),
  });
}

async function startTracking(chatId, referenceFromCommand = "") {
  const reference = referenceFromCommand.trim();
  if (reference) return trackReport(chatId, reference);
  setSession(chatId, { type: "track" });
  return sendMessage(chatId, "Send the report reference number, for example MC-2026-0042.");
}

async function trackReport(chatId, reference) {
  const report = reports.find((item) => item.referenceNumber.toLowerCase() === reference.trim().toLowerCase());
  clearSession(chatId);
  if (!report) {
    return sendMessage(chatId, "I could not find that report in the mock data. Check the reference number and try again.", {
      reply_markup: mainKeyboard(),
    });
  }
  return sendMessage(
    chatId,
    `Report status\n\nReference: ${report.referenceNumber}\nType: ${report.kind}\nCategory: ${report.category}\nTitle: ${report.title}\nLocation: ${report.location}\nStatus: ${report.status}\nSubmitted: ${new Date(report.submittedAt).toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" })}`,
    { reply_markup: mainKeyboard() },
  );
}

async function handleTextMessage(message) {
  const chatId = message.chat.id;
  const text = (message.text || "").trim();
  if (!text) return;

  const [command, ...argumentsList] = text.split(/\s+/);
  const normalizedCommand = command.toLowerCase().split("@")[0];
  if (normalizedCommand === "/start") {
    startedChatIds.add(chatId);
    if (!linkedChatIds.has(chatId)) return linkingPrompt(chatId);
    clearSession(chatId);
    return sendMessage(chatId, "Welcome to the Mutiara Connect mock reporting bot.\n\nUse /report to submit a complaint or feedback, or /track to check a report.", {
      reply_markup: mainKeyboard(),
    });
  }
  if (!startedChatIds.has(chatId)) {
    return sendMessage(chatId, "Please press /start first to open the Mutiara Connect bot.");
  }
  const session = sessionFor(chatId);
  if (!linkedChatIds.has(chatId)) {
    if (session?.type === "link" && !normalizedCommand.startsWith("/")) {
      linkedChatIds.add(chatId);
      clearSession(chatId);
      return sendMessage(chatId, "Link successful for this mock bot. You can now submit and track reports.", {
        reply_markup: mainKeyboard(),
      });
    }
    if (normalizedCommand === "/cancel") {
      clearSession(chatId);
      return sendMessage(chatId, "Linking cancelled. Send /start when you are ready to link this mock bot.");
    }
    return linkingPrompt(chatId);
  }
  if (normalizedCommand === "/help") {
    return sendMessage(chatId, "Available commands:\n\n/report - submit a complaint or feedback\n/track - track a report by reference number\n/myreports - view all reports you submitted here\n/cancel - cancel the current step\n/help - show this help message", {
      reply_markup: mainKeyboard(),
    });
  }
  if (normalizedCommand === "/cancel") {
    clearSession(chatId);
    return sendMessage(chatId, "The current action was cancelled.", { reply_markup: mainKeyboard() });
  }
  if (normalizedCommand === "/report") return startReport(chatId);
  if (normalizedCommand === "/track") return startTracking(chatId, argumentsList.join(" "));
  if (normalizedCommand === "/myreports") return listMyReports(chatId);

  if (!session) return sendMessage(chatId, "Use /report, /track, or /help.", { reply_markup: mainKeyboard() });
  if (session.type === "track") return trackReport(chatId, text);
  if (session.type !== "report") return sendMessage(chatId, "Use /report or /track to begin.");

  if (session.step === "title") {
    session.draft.title = text;
    session.step = "description";
    setSession(chatId, session);
    return sendMessage(chatId, "Describe what happened, including useful timing or landmark details.");
  }
  if (session.step === "description") {
    session.draft.description = text;
    session.step = "photo";
    setSession(chatId, session);
    return askPhoto(chatId);
  }
  if (session.step === "photo" && text.toLowerCase() === "skip") {
    session.step = "confirm";
    setSession(chatId, session);
    return askConfirmation(chatId, session);
  }
  return sendMessage(chatId, "Please use the buttons or follow the current prompt. Send /cancel to stop.");
}

async function handleUpdate(update) {
  if (update.callback_query) {
    await answerCallback(update.callback_query);
    if (!linkedChatIds.has(update.callback_query.message.chat.id)) {
      return linkingPrompt(update.callback_query.message.chat.id);
    }
    if (update.callback_query.data.startsWith("report:")) return handleReportCallback(update.callback_query);
    return;
  }
  const message = update.message;
  if (message?.chat?.type !== "private") return;
  const session = sessionFor(message.chat.id);
  if (session?.type === "report" && session.step === "photo" && message.photo?.length) {
    session.draft.photoFileId = message.photo[message.photo.length - 1].file_id;
    session.step = "confirm";
    setSession(message.chat.id, session);
    return askConfirmation(message.chat.id, session);
  }
  return handleTextMessage(message);
}

async function configureBot() {
  await telegram("deleteWebhook", { drop_pending_updates: true });
  await telegram("setMyCommands", {
    commands: [
      { command: "start", description: "Open the Mutiara Connect bot" },
      { command: "report", description: "Submit a complaint or feedback" },
      { command: "track", description: "Track a report by reference number" },
      { command: "myreports", description: "View reports submitted by you" },
      { command: "cancel", description: "Cancel the current action" },
      { command: "help", description: "Show available commands" },
    ],
  });
  const bot = await telegram("getMe");
  console.log(`Telegram mock bot is running as @${bot.username}. Press Ctrl+C to stop.`);
}

async function poll() {
  while (running) {
    try {
      const updates = await telegram("getUpdates", {
        offset: nextUpdateOffset,
        timeout: POLL_TIMEOUT_SECONDS,
        allowed_updates: ["message", "callback_query"],
      });
      for (const update of updates) {
        nextUpdateOffset = update.update_id + 1;
        try {
          await handleUpdate(update);
        } catch (error) {
          console.error("Unable to handle a Telegram update.", error);
        }
      }
    } catch (error) {
      console.error("Telegram polling failed. Retrying in 5 seconds.", error);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

process.once("SIGINT", () => { running = false; });
process.once("SIGTERM", () => { running = false; });

configureBot().then(poll).catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
