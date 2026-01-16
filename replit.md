# Danawa Auto Sales Radar

## Overview

A Korean automotive sales tracking dashboard that monitors rapidly rising vehicle models based on Danawa (다나와) sales data. The application scrapes monthly sales statistics for domestic and imported vehicles, calculates a composite "rising score" based on month-over-month changes, and displays the top trending models in a clean, data-dense dashboard interface.

The core value proposition is helping users quickly identify which car models are experiencing unusual sales growth by combining absolute sales changes, percentage changes, and rank movements into a single scoring system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Theme**: Light/dark mode support via custom ThemeProvider
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a feature-based structure with:
- `/pages` - Route-level components (Dashboard, NotFound)
- `/components` - Reusable UI components including shadcn/ui primitives
- `/hooks` - Custom React hooks (use-mobile, use-toast)
- `/lib` - Utilities and API client configuration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: REST endpoints under `/api/*` prefix
- **Caching**: In-memory Map with 30-minute TTL for scraped data

Key server modules:
- `routes.ts` - API endpoint definitions with Zod validation
- `danawa-scraper.ts` - HTML parsing logic for Danawa sales pages
- `storage.ts` - In-memory user storage (prepared for future auth)
- `vite.ts` - Dev server integration with HMR

### Data Flow
1. Client requests radar data via `/api/radar?month=YYYY-MM&nation=domestic|import`
2. Server checks cache, fetches from Danawa if stale
3. HTML is parsed to extract sales rankings, calculating derived metrics
4. Response includes models sorted by composite score with Danawa source links

### Shared Schema
Located in `/shared/schema.ts`, defines:
- `RadarModel` - Individual model sales data with scores
- `Nation` - "domestic" | "import" enum
- `FilterOptions` - Client-side filtering parameters
- Zod schemas for runtime validation on both client and server

### Build System
- Development: Vite dev server with Express backend proxy
- Production: esbuild bundles server to single CJS file, Vite builds static assets to `dist/public`

## External Dependencies

### Database
- **Drizzle ORM** configured for PostgreSQL (`drizzle.config.ts`)
- Schema location: `shared/schema.ts`
- Migrations output: `./migrations`
- Currently using in-memory storage; Postgres can be provisioned via `DATABASE_URL` environment variable

### Data Source
- **Danawa Auto** (auto.danawa.com) - Korean automotive price comparison site
- Sales data URLs follow pattern: `https://auto.danawa.com/auto/?Month=YYYY-MM-00&Nation={domestic|export}&Tab=Model&Work=record`
- Data is scraped and transformed, not cached raw (per source usage guidelines)

### UI Component Library
- **shadcn/ui** - Radix UI primitives with Tailwind styling
- Full component set installed under `client/src/components/ui/`
- Configured via `components.json` with path aliases

### Key NPM Packages
- `@tanstack/react-query` - Data fetching and caching
- `zod` / `drizzle-zod` - Schema validation
- `date-fns` - Date formatting
- `wouter` - Client-side routing
- `express` / `express-session` - HTTP server
- `connect-pg-simple` - Session storage (when Postgres enabled)