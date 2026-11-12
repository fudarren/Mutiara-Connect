# Mutiara-Connect

Mutiara-Connect is a community portal for tracking construction news,
project updates, road diversions, and public notifications related to the
Penang LRT development.

## Project goals

- Make current construction updates easier for the community to follow.
- Organize updates by project, location, status, and publication date.
- Provide interactive construction maps, project details, and location-based
  updates.
- Give users responsive notification preferences and unread-alert navigation.

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
app/admin/login/               Simulated staff sign-in page
app/api/news/                  News Route Handler API endpoint
components/                    Reusable UI, shell, navigation, feedback, and map components
lib/                           Local construction, feedback, news, admin, and store helpers
styles/                        Global Tailwind and admin CSS entry points
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
| `/feedback` | Submit complaints, feedback, and optional evidence |
| `/about` | Portal information |
| `/admin` | Admin and management dashboard overview |
| `/admin/complaints` | Review, update and assign complaints |
| `/admin/updates` | Create, edit and remove construction updates |
| `/admin/announcements` | Publish and review announcements |
| `/admin/login` | Staff sign-in screen |
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

## Responsive navigation and notifications

- Desktop uses a fixed left navigation sidebar.
- Mobile uses a right-side sliding navigation drawer with labelled menu items.
- The header notification bell opens a popover containing all unread alerts.
- Notification cards and alert actions link to their related construction detail
  pages.
- The footer is shown on larger screens and hidden on mobile to preserve space.

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

Open `/admin` directly; the current frontend does not require a login. The
staff identity and records are samples, not verified Penang LRT information.

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
standalone admin workspace does not change the behavior of the existing
construction map, staff sign-in, or public notification modules; their data is
separate.
The existing construction module's staff sign-in is also simulated in the
browser and does not provide real authentication. The login page no longer
shows credentials, so use staff ID `STF-1001` with password `mutiara2026`
(defined in `lib/staffSession.ts`).

## Current status

The project currently uses local data and browser-local construction update
storage plus temporary in-memory mock state for the frontend-only feedback
prototype. Submitted feedback resets when the page is refreshed. Feedback
reports include mock GeoJSON Point coordinates for selected areas, and future
work can connect this area to a database, CMS, authentication, and verified
public data sources.

The feedback page also includes a frontend-only Telegram linking mock that
generates a six-digit code; it does not contact Telegram until backend
integration is implemented.
