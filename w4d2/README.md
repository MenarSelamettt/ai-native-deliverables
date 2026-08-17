# Day 2 Starter — State Architecture

Internal curriculum checkpoint for **State Architecture: Put State Where It Belongs**.

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

## Instructor design note

This project starts from the completed Day 1 dashboard. Its visible behavior should remain unchanged.

Two realistic architectural pressures are intentionally present:

- Filtered transactions are synchronized into state through an effect even though they can be calculated from existing data and filter inputs.
- The transaction workspace has evolved into a meaningful UI boundary. Category now travels through it to both the filter controls and transaction status, while remaining ordinary React state.

The checkpoint should prompt an architecture audit of `searchTerm`, `category`, `filteredTransactions`, and `transactions` before learners edit code.

Do not reveal the intended refactor, prescribe Zustand for every value, or describe the planted effect as a labelled bug. The lesson is that working, tested code can still deserve a state-ownership refactor.
