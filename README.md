# TrackBud Frontend

TrackBud Frontend is a Next.js and React frontend for the TrackBud personal finance application. It supports authenticated dashboard access, transaction and category management, dashboard analytics, currency-aware formatting, and AI-powered financial insights backed by the TrackBud API.

The frontend is functional for the current product scope. Production deployment hardening is in progress, especially around same-origin API hosting and safe release workflows.

## Live Demo

- Frontend: [https://track-bud-frontend.vercel.app/](https://track-bud-frontend.vercel.app/)
- Backend API: Deployed separately on Render

## Highlights

- Next.js App Router application with route groups for auth and protected pages
- Cookie-based session flow using the backend HTTP-only `token` cookie
- Next.js proxy route guard for dashboard and auth pages
- Shared Axios client with same-origin `/api/v1` default and local cross-origin override support
- Global `401` response handling for expired or invalid protected sessions
- Zustand stores for auth, dashboard, transactions, and categories
- Store reset behavior for logout and user switching
- React Hook Form and Zod validation for auth, category, and transaction forms
- Dashboard widgets with partial-failure handling
- Cursor-paginated transaction modal with load-more support
- Currency and date formatting with `Intl`
- Recharts dashboard charts with deterministic colors and custom tooltips
- AI spending summary, saving recommendations, forecast, and monthly review UI
- Dark-mode-first Tailwind CSS interface with Radix UI primitives and Lucide icons
- Standalone Next.js output and Dockerfile for containerized production builds
- Vercel config disables automatic Git deployments to protect the current live app

## Features

### Authentication

- Signup, login, logout, guest login, and current-user restoration
- Auth state stored in `useAuthStore`
- Backend session sent through HTTP-only cookies; no auth token is stored in browser storage
- Client-side auth initialization from `src/app/layout.tsx`
- Next.js `src/proxy.ts` redirects unauthenticated dashboard requests to `/login`
- Auth pages redirect authenticated users to `/dashboard`
- Global Axios `401` interceptor clears stale frontend session state and redirects to login
- Logout clears auth and user-owned dashboard/category/transaction state even if backend logout fails

### Dashboard

- Balance, total income, total expense, and transaction count summary from backend dashboard endpoints
- Recent activity
- Top spending categories
- Monthly income versus expense bar chart
- Category distribution pie chart
- Per-widget dashboard fetch handling so one failed widget does not discard successful widget data
- Retry state for dashboard-level failures
- User currency support through `defaultCurrency`

### Transactions

- Create income and expense transactions
- List transactions in a modal
- Cursor pagination with load-more behavior
- Delete transactions
- Category lookup for transaction display
- Amount, category, kind, note, and date validation
- Currency-aware signed amount display
- Date formatting through shared formatter utilities

Update/edit transaction UI is not currently implemented, although the backend README documents a `PATCH /api/v1/transactions/:id` endpoint.

### Categories

- List active categories
- Create custom categories
- Archive/delete custom categories through the backend
- Hide archived categories from the active UI
- Prevent default categories from being deleted in the UI
- Refresh category state after create/archive operations

### AI Insights

- Spending summary generation
- Saving recommendations generation
- Expense forecast generation
- Raw-text fallback rendering when structured AI data is unavailable
- Error rendering through shared AI section cards
- Monthly AI review current-state lookup
- Monthly review generation
- Polling for queued or processing monthly reviews
- Monthly review status badges and review detail dialog

### Styling and UX

- Dark-only theme direction
- Lexend font
- Tailwind CSS v4 utility styling
- Shared Button, Input, SelectField, FormError, Dialog, Select, and Card primitives
- Radix UI Dialog and Select foundations
- Lucide icons
- Responsive dashboard grids and modals

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 |
| UI runtime | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Forms | React Hook Form |
| Validation | Zod |
| State management | Zustand |
| HTTP client | Axios |
| Charts | Recharts |
| UI primitives | Radix UI Dialog and Select |
| Icons | Lucide React |
| Build output | Next.js standalone output |
| Containerization | Docker |
| Hosting | Vercel currently; container path available |

## Architecture

### Browser Flow

```text
Browser
  -> Next.js App Router pages
  -> Auth initializer and route guards
  -> Module components
  -> Zustand stores and service files
  -> Shared Axios client
  -> TrackBud Backend API
```

### API Base URL Flow

```text
NEXT_PUBLIC_API_URL unset
  -> frontend calls /api/v1
  -> intended for same-origin production or reverse-proxy deployment

NEXT_PUBLIC_API_URL set, for example http://localhost:5000
  -> frontend calls http://localhost:5000/api/v1
  -> intended for local frontend/backend development on separate ports
```

## Project Structure

```text
src/
  app/
    layout.tsx                   # Root layout and auth initialization
    page.tsx                     # Public landing page
    globals.css                  # Global Tailwind and dark theme CSS
    (auth)/
      login/
      signup/
    (protected)/
      dashboard/
  components/
    auth/                        # Auth initializer and route wrapper components
    ui/                          # Shared UI primitives
  lib/
    api-config.ts                # API base URL normalization
    axios.ts                     # Shared Axios client and response interceptor
    formatters.ts                # Currency and date formatters
    utils.ts                     # Class merging and error extraction helpers
  modules/
    auth/
    categories/
    transactions/
    dashboard/
    ai/
      components/monthly-review/
  types/
    apiResponse.ts
src/proxy.ts                     # Next.js route protection proxy
Dockerfile
vercel.json
```

## API Integration

All service files call versioned backend routes through the shared Axios client. The frontend expects the backend API under `/api/v1`.

| Area | Methods Used | Routes Used |
| --- | --- | --- |
| Auth | `POST`, `GET` | `/auth/signup`, `/auth/login`, `/auth/logout`, `/auth/me` |
| Categories | `GET`, `POST`, `DELETE` | `/categories`, `/categories/:id` |
| Transactions | `GET`, `POST`, `DELETE` | `/transactions`, `/transactions/:id` |
| Dashboard | `GET` | `/dashboard/summary`, `/dashboard/charts`, `/dashboard/top-categories`, `/dashboard/recent-activity` |
| AI | `GET`, `POST` | `/ai/spending-summary`, `/ai/saving-recommendations`, `/ai/forecast`, `/ai/monthly-review`, `/ai/monthly-review/current`, `/ai/monthly-review/:id` |

Backend responses are typed with the shared `ApiResponse<T>` envelope:

```text
success
message
...payload
```

Protected requests require the backend HTTP-only `token` cookie to be included by the browser. The Axios client uses `withCredentials: true`.

## Local Development

### 1. Clone the Repository

```bash
git clone <repository-url>
cd track-bud-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

For local development with the backend running on another port:

```text
NEXT_PUBLIC_API_URL=http://localhost:5000
```

The frontend automatically appends `/api/v1`, so `http://localhost:5000` becomes `http://localhost:5000/api/v1`.

For same-origin production or reverse-proxy deployment, leave `NEXT_PUBLIC_API_URL` unset so the frontend uses `/api/v1`.

### 4. Start the Development Server

```bash
npm run dev
```

The app runs on the default Next.js development port unless another port is configured.

## Environment Variables

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Optional | Backend origin for local/cross-origin development. Leave unset for same-origin `/api/v1`. Must not contain secrets because it is exposed to browser code. |

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the production app |
| `npm run start` | Start the built Next.js app |
| `npm run lint` | Run ESLint |

## Production Notes

- The preferred production architecture is same-origin API access through `/api/v1`, matching the backend production note to avoid relying on cross-site browser cookies.
- `NEXT_PUBLIC_API_URL` should normally be unset in same-origin production.
- If the frontend and backend remain on different origins, verify backend CORS, `Secure`, `SameSite`, cookie domain, and credential settings before release.
- `vercel.json` currently disables automatic Git deployments with `"deploymentEnabled": false`.
- Use Vercel preview deployments or another staging environment before changing the live app.
- The Next.js config uses `output: "standalone"` for self-contained production builds.
- The Dockerfile builds and runs the standalone app on Node.js 22 Alpine.
- Run `npm run lint` and `npm run build` before deployment.
- Do not put secrets in `NEXT_PUBLIC_*` variables.

## Current Scope and Limitations

- The frontend implements the main MVP user flows for auth, dashboard, transactions, categories, and AI insights.
- Monthly AI review UI is implemented, including generation and polling.
- Transaction update/edit UI is not implemented.
- Automated tests are not included in the current scope.
- Storybook or component preview tooling is not included.
- The app is dark-mode-only.
- Production monitoring and error tracking are not configured in this repository.
- Cross-origin Vercel-to-Render cookie behavior requires careful environment verification if same-origin proxying is not used.

## License

This project is for educational and portfolio purposes.
