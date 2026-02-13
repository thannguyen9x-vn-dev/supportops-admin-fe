# Admin MVP Plan

## 1) Goal
Build the admin UI incrementally from Figma while keeping interactions realistic, even before full business requirements are finalized.

## 2) Working approach (vertical slice)
Implement one end-to-end flow at a time instead of building all screens statically.

Flow pattern:
1. Open page
2. Load data (mock/fake API)
3. Perform key action
4. Show success/error feedback
5. Persist state in UI (re-render updated data)

## 3) Initial module scope
Based on the current screens, start with 4 modules:
1. `Overview` (dashboard, read-only KPIs/charts)
2. `Sales` (product list + simple edit flow)
3. `Messages` (inbox list + selection/bulk action)
4. `Settings` (profile + password + notification preferences)

## 4) Build order (recommended)
1. `Settings` first
Reason: easiest to validate interactions (form, save, toggle, validation).
2. `Sales` second
Reason: introduces list/table patterns, row actions, pagination.
3. `Messages` third
Reason: adds multi-select and bulk actions.
4. `Overview` last
Reason: mostly visualization, depends on stable data shapes.

## 5) MVP backlog by slice

### Slice A: Settings - account management
- Routes:
  - `/[locale]/settings`
- Core user actions:
  - Update profile form
  - Change password
  - Toggle notification preferences
- Data contract (mock first):
  - `profile`: firstName, lastName, email, phone, country, city, organization
  - `security`: currentPassword, newPassword, confirmPassword
  - `notifications`: key/value boolean settings
- Done criteria:
  - Validation errors are shown inline
  - Save button has loading + success + error state
  - Changed values persist in local mock store

### Slice B: Sales - list and quick edit
- Routes:
  - `/[locale]/sales`
- Core user actions:
  - Search/filter list
  - Select row(s)
  - Edit one item (inline or drawer/modal)
- Data contract:
  - `product`: id, name, technology, price, status, updatedAt
- Done criteria:
  - Table handles loading/empty/error
  - Edit action updates row data on success
  - Selection state works with pagination

### Slice C: Messages - inbox workflow
- Routes:
  - `/[locale]/messages`
- Core user actions:
  - Select one/many messages
  - Mark read/unread
  - Star/unstar
  - Delete/archive (mock)
- Data contract:
  - `message`: id, sender, subject, preview, time, read, starred, selected
- Done criteria:
  - Bulk actions apply correctly to selected rows
  - Row visual state reflects read/starred changes
  - Action feedback is visible

### Slice D: Overview - dashboard
- Routes:
  - `/[locale]/dashboard`
- Core user actions:
  - Change date range (day/month/year)
  - Inspect top metrics
- Data contract:
  - KPI cards, chart series, recent transactions
- Done criteria:
  - Range switch updates charts/cards
  - Skeletons shown while loading
  - Empty states handled for each widget

## 6) Required UI states for every page
Each new page must implement these states:
1. `loading`
2. `empty`
3. `error`
4. `success`
5. `permissionDenied` (if page is restricted)

## 7) Technical rules for this repo
1. Keep `apps/web` structure and route groups as-is.
2. Use hybrid styling:
   - CSS Modules for layout shell
   - MUI components for interactive controls
   - Prefer `--mui-*` tokens in CSS Modules
3. Use `@/` imports for cross-feature paths.
4. Keep user-facing copy in i18n files (`en.json`, `vi.json`).

## 8) Definition of done (per task)
A task is done only when:
1. Route is accessible and wired in navigation
2. Main interaction works with mock data
3. Loading/empty/error are implemented
4. i18n keys are added for new labels/messages
5. `pnpm --filter web exec tsc --noEmit` passes
6. `pnpm --filter web lint` passes (or issues are documented)

## 9) How to add new Figma pages later
When adding a new page, provide this minimal brief:
1. Page name + route
2. Primary actor and goal
3. Top 3 actions users can do on that page
4. Required fields/data shown
5. Success condition after action

Then convert it into one new vertical slice with the same template above.

## 10) Next practical step
Start with Slice A (`Settings`) and lock these first:
1. Form schema
2. Mock API contract
3. Save interaction states

After Slice A is stable, reuse the same list/form patterns for `Sales` and `Messages`.
