# Mutiara-Connect

Mutiara-Connect is a community portal for tracking construction news,
project updates, road diversions, and public notifications related to the
Penang LRT development.

## Project goals

- Provide construction updates through an interactive map.
- Enable submission and tracking of public complaints.
- Deliver timely notifications on construction updates and disruptions.
- Support construction information and complaint management.

## Tech stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint
- Leaflet for interactive construction maps

## Project structure

```text
app/                           App Router layouts, pages, loading, and error states
app/news/                      News listing and dynamic news detail pages
app/projects/                  Construction map and dynamic construction details
app/feedback/                  Community complaints and feedback centre
app/notification/              Notification centre
app/notification-preferences/  Notification preferences page
app/admin/(dashboard)/         Staff overview, complaints, updates, and announcements
app/login/                     Shared public and administrator sign-in
app/api/news/                  News Route Handler API endpoint
components/                    Reusable UI, shell, navigation, feedback, and map components
lib/                           Local construction, feedback, news, admin, and store helpers
styles/                        Global Tailwind and admin CSS entry points
telegram-bot/bot.mjs           Standalone Telegram polling bot with mock reporting flows
public/                        Static icons, logos, and image assets
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Portal homepage and latest updates |
| `/news` | Construction news listing |
| `/news/[id]` | Individual news update |
| `/projects` | Interactive construction map and project list |
| `/projects/[id]` | Individual construction update details |
| `/feedback` | Community complaints, feedback, status tracking, and report history |
| `/notification` | Notification centre with search and filters |
| `/notification-preferences` | In-app and Telegram notification settings |
| `/about` | Portal information |
| `/admin` | Admin and management dashboard overview |
| `/admin/complaints` | Review, update and assign complaints |
| `/admin/updates` | Create, edit and remove construction updates |
| `/admin/announcements` | Publish and review announcements |
| `/login` | Sign-in screen for both roles |
| `/admin/login` | Redirect to the shared sign-in screen |
| `/admin/construction` | Legacy staff construction management page |
| `/api/news` | News API Route Handler |

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Community feedback module

The `/feedback` page is a frontend-only complaint and feedback prototype. It
supports:

- Complaint or feedback report types and categories.
- Mock Penang locations with GeoJSON point coordinates and a Leaflet preview.
- Required-field validation with inline messages and SweetAlert2 error dialogs.
- Optional image evidence represented by its selected filename.
- Mock reference numbers, status tracking, filters, and in-memory report history.
- SweetAlert2 success confirmation after a report is submitted.

Feedback reports are stored in React memory for the current page session and
reset after a refresh. No production API, database, or file upload service is
connected yet.

## Telegram mock bot

The project also includes a separate native Node.js polling bot under
`telegram-bot/bot.mjs`. It is not connected to the website or a backend yet.
The bot keeps mock reports in memory and supports:

- `/start` with a mock linking-code step; any non-empty code is accepted.
- `/report` for complaint or feedback submission.
- Category and mock location selection, including a mock “near me” option.
- Optional Telegram image upload or skipping the image.
- `/track` to check a report reference number.
- `/myreports` to list reports submitted by the current Telegram chat.
- `/cancel` and `/help`.

The bot token must remain local and must never be committed:

PowerShell:

```powershell
$env:TELEGRAM_BOT_TOKEN = "YOUR_ROTATED_BOT_TOKEN"
npm run telegram:bot
```

Command Prompt:

```bat
set TELEGRAM_BOT_TOKEN=YOUR_ROTATED_BOT_TOKEN
npm run telegram:bot
```

The bot uses long polling and must be running in a terminal to respond. Its
mock data resets when the process stops. Future backend integration can replace
the mock linking, report storage, tracking, and Telegram notification logic.

## Responsive navigation and notifications

- Desktop uses a fixed left navigation sidebar.
- Mobile uses a right-side sliding navigation drawer with labelled menu items.
- The header notification bell opens a popover containing all unread alerts.
- Notification cards and alert actions link to their related construction detail
  pages.
- The community footer includes the project logo and grouped links to existing
  portal pages. It is hidden on mobile to preserve space. The admin portal uses
  a compact matching footer that remains visible on mobile.

Development access also supports `127.0.0.1` and `127.0.0.2`. These loopback
hosts are explicitly allowed for Next.js dev resources, including hot reload;
other cross-origin hosts remain blocked. Restart the development server after
changing `allowedDevOrigins` in [next.config.ts](./next.config.ts).

## Verification commands

```bash
npm run lint
npm run build
```

## Admin and management dashboard

Guests can browse the community homepage, construction map and detail pages,
news, and notifications without signing in. `/login` also offers **Continue
as guest**. Guest headers and mobile menus show **Sign in** instead of Sign out.

Complaint/feedback submission at `/feedback` and notification preferences at
`/notification-preferences` require sign-in. Direct visits and navigation links
show a sign-in prompt for guests, and the forms and Telegram linking controls
are not mounted. After signing in from that prompt, the user returns to the
requested page. Return destinations are limited to these two internal routes.
Signed-out visits to `/admin` routes are still redirected to `/login`.

Use either of the two default accounts:

| Role | Username | Password | Landing page |
| --- | --- | --- | --- |
| Public user | `public` | `public2026` | `/` |
| Administrator | `admin` | `admin2026` | `/admin` |

The administrator can also open the community portal. Only this role sees
the Staff navigation on desktop and mobile and can open `/admin` routes,
including the legacy construction management page. A public user who enters
an admin URL is sent to `/`. Sign-out is available in the public header,
mobile menu, and admin sidebar, returning to `/login`. The visitor can then
continue browsing as a guest.

The session persists across refreshes in the current tab using sessionStorage.
Only the username is stored. Identity and role are resolved from the hardcoded
accounts, not from stored role fields. Old staff-only sessions are not used.
Storage failures are shown explicitly on sign-in and sign-out.

This is frontend-only role switching, not secure authentication. Credentials
and mock data are in the client bundle and browser storage can be modified.
Production requires server-side authentication and authorization. Route
content waits for the browser session. The root layout opts out of instant
navigation and `instantInsights.validationLevel` is `manual-warning` so
child pages are not implicitly validated while hidden by this guard.
Future server-authenticated pages can explicitly opt back in. Records are
not verified Penang LRT information.

The four admin pages use hardcoded mock data kept in browser localStorage.
Changes persist across refreshes in that browser. To return to the original
data, clear the site's localStorage. The UI does not mention mock data or show
storage warnings. Construction dates are generated relative to the current
date, and all displayed and entered dates use Malaysia time (MYT).

For a walkthrough:

1. On **Overview**, inspect the live counts and recent records.
2. Open **Complaints**, search or filter, and view a pending complaint. Change
   its status to In Progress and confirm an assignment to a predefined staff
   member. Return to Overview to see the count change.
3. Open **Construction updates** and create an update. Edit it, cancel a
   removal, and then confirm removal.
4. Open **Announcements**, publish an Urgent announcement, and find it in
   the list. Refresh to check persistence.

Publishing and assignment never send notifications or contact anyone. This
standalone admin workspace keeps its records separate from the existing
construction map and public notification data.
The existing construction module uses the same administrator session and
does not require a second sign-in.

## Current status

The project currently uses local data and browser-local construction update
storage plus temporary in-memory mock state for the frontend-only feedback
prototype. Submitted feedback resets when the page is refreshed. Feedback
reports include mock GeoJSON Point coordinates for selected areas, and future
work can connect this area to a database, CMS, authentication, and verified
public data sources.

The feedback page includes a separate frontend-only Telegram linking mock that
generates a six-digit code for the future website integration. It does not
contact the standalone Telegram bot or perform an account connection.
