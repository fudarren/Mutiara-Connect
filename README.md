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
app/                         App Router layouts, pages, loading, and error states
app/news/                    News listing and dynamic news detail pages
app/projects/                Construction map and dynamic construction details
app/notification/            Notification centre
app/notification-preferences Notification preferences page
app/admin/                   Staff login and construction management pages
app/api/news/                News Route Handler API endpoint
components/                  Reusable UI, shell, navigation, and map components
lib/                         Local construction, news, and store helpers
styles/                      Global Tailwind CSS entry point
public/                      Static icons, logos, and image assets
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Portal homepage and latest updates |
| `/news` | Construction news listing |
| `/news/[id]` | Individual news update |
| `/projects` | Interactive construction map and project list |
| `/projects/[id]` | Individual construction update details |
| `/notification` | Notification centre with search and filters |
| `/notification-preferences` | In-app and Telegram notification settings |
| `/about` | Portal information and issue reporting |
| `/admin/login` | Staff sign-in screen |
| `/admin/construction` | Staff construction update management |
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

## Verification commands

```bash
npm run lint
npm run build
```

## Current status

The project currently uses local data and browser-local construction update
storage. Future work can connect this area to a database, CMS, authentication,
user reports, or verified public data sources.
