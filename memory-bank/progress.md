# Project Progress

## Step 1 — Design docs finalized (Completed Sep 23, 2025)

- Design document, architecture overview, tech stack, and implementation plan are written and aligned.
- Database schema defined and referenced below for convenience.

### Database Schema (Firestore)

```
/users/{userId}
  email: string
  name: string

/users/{userId}/ingredients/{ingredientId}
  name: string
  unit: 'oz' | 'lb' | 'cup' | 'tbsp' | 'tsp' | 'pc' | 'pint' | 'quart' | 'gallon'

/users/{userId}/meals/{mealId}
  name: string
  instructions: string
  defaultServings: number
  mealType: 'breakfast' | 'lunch_dinner' | 'snack'
  ingredientLines: Array<{
    ingredientId: string
    quantity: number
    unit: 'oz' | 'lb' | 'cup' | 'tbsp' | 'tsp' | 'pc' | 'pint' | 'quart' | 'gallon'
  }>

/users/{userId}/plans/{planId}
  startDate: string // ISO
  numDays: number
  entries: Array<{
    date: string // ISO
    slot: 'breakfast' | 'lunch_dinner' | 'snack'
    mealId: string
    servings: number
  }>
```

## Step 2 — Core CRUD scoped (Completed Sep 24, 2025)

## Step 3 — Plan generation (Completed Sep 24, 2025)

Delivered:
- Plan generator UI with start date and N days; random selection by slot type.
- Plans persisted to `/users/{uid}/plans`; list with delete and calendar-style render.
- User feedback/status during generation; error handling.

Next:
- Step 4 polish: show meal titles in plan view, responsive tweaks, E2E pass, deploy.

## Step 4 — Polish, Testing, Deployment (Completed Sep 24, 2025)

Delivered:
- Responsive spacing and layout tweaks for generator and lists.
- Plans generator status messages and meal names in calendar view.
- Production build completed; deployed to Firebase Hosting with rules configured in `firebase.json`.

Smoke test checklist (passed):
- Sign in/out with Google.
- Add meal by URL; meal appears under correct category.
- Generate plan (7 days); plan appears in list and calendar view.
- Delete a plan; list updates.
- Offline toggle (via header control) still functional for reads/writes.
Delivered:
- Meals-only UI per scope: URL import flow and categorized list (Breakfasts, Dinners, Snacks).
- Simplified `Layout` to render only `Meals`; Ingredients page removed.
- Firestore rules updated to allow user-scoped access under `users/{userId}/{document=**}`.
- Firestore services for meals and ingredients (ensure-by-name for importer) and pagination implemented.
- Authorized domains configured; rules deployed via updated `firebase.json` targets.

Notes:
- `ingredients` collection remains for mapping imported recipe lines to user-owned ingredient IDs; it’s not exposed as a standalone page.

## Notes
- Follow Vite single `index.html` at repo root and serve `dist` for Firebase Hosting.


