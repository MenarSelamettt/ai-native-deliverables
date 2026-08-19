# Day 3 Data Decisions

## State ownership

| Value | Owner | Tool | Reason |
|---|---|---|---|
| Search | Browser interaction | React | Transient and local to the dashboard. |
| Selected transaction | Browser interaction | React | A local UI selection represented by its ID. |
| Category | Browser preference | Zustand | Shared by multiple components and useful across reloads. |
| Session/current user | Server | TanStack Query | Authenticated server truth with loading, error, and cache states. |
| Transactions | Server | TanStack Query | Fetched and cached domain data owned by the API. |

Transactions and session data are never copied into Zustand. Authentication uses session-cookie semantics, so no token is persisted in browser storage.

## TanStack Query or Apollo?

The current contract is REST/fetch-shaped:

```text
GET /api/transactions
GET /api/transactions/:id
```

TanStack Query fits this contract directly: each endpoint has a query function, a stable key, and explicit loading/error/cache behavior.

An alternative GraphQL contract might look like:

```graphql
query Transactions {
  transactions {
    id
    merchant
    category
    amount
  }
}
```

Apollo may become attractive if the backend becomes GraphQL and the same entities appear across several queries where normalized caching provides concrete value. Apollo is not added merely because it appears in the lesson; it does not improve this supplied REST contract.
