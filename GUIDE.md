# AlphaVault Frontend Engineering Guide

## 1. Architecture

AlphaVault follows a **feature-based architecture**.

```text
src/
├── app/              # Application composition
├── features/         # Business/domain features
├── components/       # Shared reusable UI
├── lib/              # Infrastructure/integrations
├── hooks/            # Generic shared hooks
├── types/            # Global types
├── config/           # Environment/app configuration
└── styles/           # Global styles
```

### Core rule

```text
Pages
  ↓
Feature Components
  ↓
Feature Hooks
  ↓
Feature API
  ↓
Shared API Client
  ↓
Backend
```

Business logic must stay inside its feature. Shared infrastructure must not depend on features.

---

# 2. Feature Structure

```text
features/
├── auth/
├── transactions/
├── analytics/
└── rewards/
```

Each feature can contain:

```text
api/          # API functions
components/   # Feature-specific UI
hooks/        # Feature-specific hooks
schemas/      # Zod/runtime validation
types/        # Feature-specific TypeScript types
pages/        # Route-level pages
utils/        # Feature-specific utilities
constants/    # Feature-specific constants
```

Only create directories that are actually needed.

---

# 3. Transactions

Transactions are the most performance-sensitive part of the application because the dataset contains approximately 10,000 transactions.

The transaction feature owns:

- Searching merchants
- Filtering
- Sorting
- Pagination
- Transaction details
- Transaction table

Recommended flow:

```text
User
 ↓
Filters / Search / Sort
 ↓
URL State
 ↓
TanStack Query
 ↓
Transaction API
 ↓
FastAPI
 ↓
PostgreSQL
```

Prefer **server-side filtering, sorting, and pagination** rather than downloading and repeatedly processing all 10,000 records in the browser.

Search should be debounced (~250–300ms is a reasonable starting point).

---

# 4. Analytics

Analytics owns:

- Spending by category
- Monthly spending trends
- Chart interactions
- Chart → transaction filtering

Recommended flow:

```text
Analytics
 ↓
Analytics API
 ↓
Chart
 ↓
User interaction
 ↓
Transaction filter
 ↓
Transaction query
```

Do not maintain a separate copy of transaction data inside analytics unnecessarily.

---

# 5. Rewards

Rewards owns:

- Coin balance
- Reward catalogue
- Reward selection
- Redemption
- Redemption errors

Redemption flow:

```text
Select
 ↓
Confirm
 ↓
Redeem API
 ↓
Success / Error
 ↓
Update or invalidate balance
```

The backend remains the source of truth.

A failed redemption must never leave the UI showing an incorrect balance.

---

# 6. State Management

Use different state mechanisms for different types of state.

### Server State

Use **TanStack Query**:

```text
Transactions
Rewards
Coin Balance
Analytics
```

### URL State

Use URL search parameters for transaction controls:

```text
search
category
status
date range
amount range
sort
pagination
```

Example:

```text
/dashboard/transactions?search=amazon&status=success&sort=date
```

### Local UI State

Use React state for things such as:

```text
Modal open/close
Selected row
Active tab
Temporary input state
```

### Global Client State

Use Zustand only when state genuinely needs to be shared globally.

Do not put all application state into a global store.

---

# 7. API Architecture

All HTTP configuration belongs in:

```text
src/lib/api/
```

Feature-specific API functions belong in:

```text
src/features/<feature>/api/
```

Preferred:

```text
Component
 ↓
Hook
 ↓
Feature API
 ↓
Shared API Client
 ↓
Backend
```

Avoid calling `fetch()`/Axios directly inside UI components.

---

# 8. Query Rules

Query keys must contain all parameters that affect the response.

Example:

```ts
[
  "transactions",
  {
    search,
    category,
    status,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    sortBy,
    sortOrder,
    page,
  },
]
```

Changing filters should therefore produce the correct cached query.

Do not duplicate server data in Zustand or React state without a clear reason.

---

# 9. Components

Use:

```text
src/components/
```

only for genuinely reusable components.

Use:

```text
src/features/<feature>/components/
```

for business-specific components.

For example:

```text
TransactionTable
```

belongs in:

```text
features/transactions/components/
```

not the global components directory.

The transaction table should be implemented without a visual component library. Headless table logic can be used, but the actual table markup and styling should remain under our control.

---

# 10. TypeScript

Rules:

- Avoid `any`.
- Prefer explicit types for API responses.
- Keep feature-specific types inside the feature.
- Keep truly global types inside `src/types/`.
- Use Zod for runtime validation of external/API data.

Preferred flow:

```text
API Response
 ↓
Zod Validation
 ↓
Typed Data
 ↓
Application
```

---

# 11. Performance

Follow this order:

```text
Correct architecture
 ↓
Efficient API queries
 ↓
Efficient rendering
 ↓
Measure bottlenecks
 ↓
Optimize where necessary
```

Rules:

- Debounce search.
- Avoid unnecessary API requests.
- Avoid duplicating large datasets.
- Prefer server-side pagination/filtering/sorting.
- Keep table rows lightweight.
- Use virtualization when actually required.
- Avoid unnecessary global state.
- Do not blindly use `useMemo`/`useCallback`.

Optimize based on measured problems rather than assumptions.

---

# 12. Loading / Error / Empty States

Every server-driven feature should handle:

```text
Loading
Success
Empty
Error
```

Never silently fail.

Mutations must also handle failure gracefully and leave the UI in a consistent state.

---

# 13. Accessibility

Interactive UI must support:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible labels
- Proper buttons/links
- Escape-to-close dialogs
- Appropriate focus management
- ARIA only where necessary

Accessibility should be considered during implementation, not added at the end.

---

# 14. Dependency Rules

Allowed:

```text
features → components
features → lib
features → shared hooks
```

Avoid:

```text
lib → features
```

Avoid unnecessary:

```text
transactions → rewards
rewards → analytics
analytics → transactions
```

If functionality is genuinely shared, move it to an appropriate shared layer.

---

# 15. Naming

### Components

```text
PascalCase
```

Example:

```text
TransactionTable
RewardCard
DashboardLayout
```

### Hooks

```text
useCamelCase
```

Example:

```text
useTransactions
useCoinBalance
```

### Functions

```text
camelCase
```

Example:

```text
getTransactions
redeemReward
```

### Constants

```text
UPPER_SNAKE_CASE
```

Example:

```text
PAYMENT_STATUSES
DEFAULT_PAGE_SIZE
```

---

# 16. Imports

Prefer path aliases:

```ts
@/components/ui
@/features/transactions
@/lib/api
```

Avoid deeply nested imports such as:

```ts
../../../../components/ui
```

---

# 17. Testing

Prioritize meaningful tests for:

1. Transaction filtering
2. Merchant search
3. Sorting
4. Reward redemption
5. Failed redemption handling
6. Important user interactions

Prefer behavior-focused tests over tests written only to increase coverage.

---

# 18. Git

Commit logical changes frequently.

Examples:

```text
feat(transactions): add server-side transaction query
feat(rewards): implement reward redemption
feat(analytics): add category spending chart
perf(transactions): debounce merchant search
fix(rewards): handle failed redemption
test(rewards): add redemption failure test
```

Avoid one giant final commit.

---

# 19. Documentation

Repository-level documentation:

```text
README.md
ASSUMPTIONS.md
DECISIONS.md
AI-USAGE.md
GUIDE.md
```

### README.md

Contains:

- Project overview
- Tech stack
- Local setup
- Environment variables
- Database/seed setup
- Deployment
- Known issues

### ASSUMPTIONS.md

Documents product decisions made where the requirements were ambiguous.

### DECISIONS.md

Documents important technical decisions and their reasoning.

### AI-USAGE.md

Documents AI tools used, where they were used, and examples of AI-generated work that was discarded or corrected.

### GUIDE.md

Contains these engineering and architecture rules.

---

# 20. Golden Rules

Before merging code:

- [ ] Business logic is inside the correct feature.
- [ ] Shared components are genuinely reusable.
- [ ] API calls are not directly inside UI components.
- [ ] Server state uses TanStack Query.
- [ ] Filters/search/sort use a predictable state model.
- [ ] Large datasets are not unnecessarily duplicated.
- [ ] Search is debounced.
- [ ] Loading, empty, and error states exist.
- [ ] API data is validated where appropriate.
- [ ] Failed mutations leave the UI consistent.
- [ ] Interactive elements are keyboard accessible.
- [ ] No unnecessary global state was introduced.
- [ ] Feature boundaries are respected.
- [ ] Important behavior has tests.
- [ ] Documentation is updated when architectural decisions change.

---

# 21. Core Philosophy

> **Features own business logic.  
> Components own presentation.  
> Hooks orchestrate behavior.  
> APIs communicate with the backend.  
> `lib` owns infrastructure.  
> `app` composes the application.**

Keep the architecture simple, measurable, and explainable. Depth and correctness are more important than adding unnecessary abstractions.
