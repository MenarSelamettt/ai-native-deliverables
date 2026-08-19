# Day 4 Starter — The Response Isn't Finished Yet

Starter checkpoint for the Week 4 Day 4 streaming-lifecycle debugging activity.

## Start the app

```bash
npm ci
npm run dev
```

## Available commands

- `npm run dev` — start the local development server
- `npm run typecheck` — check TypeScript
- `npm run lint` — check code quality
- `npm test` — run the focused test suite
- `npm run build` — create a production build

## Mock and real backend modes

Mock API mode is enabled by default. Copy `.env.example` to `.env` only when you want to make the mode explicit.

- `VITE_USE_MOCK_API=true`: browser MSW intercepts the relative `/api` contract.
- `VITE_USE_MOCK_API=false`: MSW is not started and `/api` requests pass through the Vite proxy.
- `VITE_API_PROXY_TARGET`: optional backend target; defaults to `http://localhost:8080`.

## Starting architecture

- Local React state: search, selected transaction ID, login email, and login password.
- Zustand: the shared and persisted category preference only.
- TanStack Query: current server session and authenticated transactions.
- Derived during render: totals, categories, filtered results, visible count, and selected transaction.
- React Router: `/login` and a session-protected `/dashboard`.
- AI SDK UI: a one-shot Spending Insight completion through `/api/insights/spending`.

The complete activity instructions and verification criteria are provided in the cohort platform.
