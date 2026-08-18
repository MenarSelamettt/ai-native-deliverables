# Day 3 Starter — The Data Isn't Yours Anymore

Internal curriculum checkpoint for the Day 3 server-state and protected-access integration activity.

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

## Internal checkpoint design

The repository starts from the finalized Day 2 reference and is deliberately healthy before learner changes. It supplies the router topology, providers, login UI, mock HTTP backend, fixtures, resettable test server, API types, styling, proxy, and dependencies.

The dashboard still reads the static Day 2 transaction source so learners can make the ownership migration observable. The meaningful incomplete areas are the API adapter request details, four small query/mutation hooks, protected-layout decisions, login wiring, and the dashboard's asynchronous transaction states.

Do not ask learners to redesign routes, write MSW infrastructure, move category out of Zustand, put authentication or transactions into Zustand, store tokens, or add unrelated product features. The intended comparison is static supplied data versus authenticated API-owned server state.
