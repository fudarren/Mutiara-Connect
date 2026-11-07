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

## Verification commands

```bash
npm run lint
npm run build
```

## Current status

The project currently uses local starter data in `lib/news.ts`. Future work can
connect this area to a database, CMS, maps, user reports, or verified public
data sources.
