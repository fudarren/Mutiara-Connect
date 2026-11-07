# Mutiara-Connect

Mutiara-Connect is a community portal for tracking construction news and
project updates related to the Penang LRT development.

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

## Project structure

```text
app/                  Pages, layouts, loading states, errors, and API routes
components/           Reusable UI components
lib/                  Data access and domain helpers
types/                Shared TypeScript types
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
| `/api/news` | Starter news API route |

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
connect this area to a database, CMS, or verified public data source.
