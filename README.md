# Mutiara-Connect

Mutiara-Connect is a community portal for tracking construction news and
project updates related to the Penang LRT development.

## Project goals

- Make current construction updates easier for the community to follow.
- Organize updates by project, location, status, and publication date.
- Provide a foundation for future maps, user reports, and project milestones.

## Tech stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint

## Project structure

```text
app/                  App Router layouts, pages, loading, and error states
app/news/             News listing and dynamic news detail pages
app/api/news/         News Route Handler API endpoint
components/           Reusable UI components
lib/                  Data access and domain helpers
types/                Shared TypeScript types
styles/               Global Tailwind CSS entry point
public/               Static assets
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Portal homepage and latest updates |
| `/news` | Construction news listing |
| `/news/[id]` | Individual news update |
| `/projects` | Project tracking area |
| `/about` | Portal information |
| `/api/news` | Starter news API Route Handler |
| `/admin` | Admin and management dashboard overview |
| `/admin/complaints` | Review, update and assign complaints |
| `/admin/updates` | Create, edit and remove construction updates |
| `/admin/announcements` | Publish and review announcements |
| `/admin/construction` | Existing construction module's staff management page |

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

The project currently uses local starter data in `lib/news.ts`. Future work can
connect this area to a database, CMS, maps, user reports, or verified public
data sources.
