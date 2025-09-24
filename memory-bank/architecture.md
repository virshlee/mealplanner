# Architecture Overview

**Version:** 1.1
**Date:** September 23, 2025

---

## System Architecture

- **Client**: React (Vite) single-page app.
- **Auth**: Firebase Authentication (Google provider only).
- **Data**: Firestore (user-scoped subcollections) in Europe region.
- **Hosting**: Firebase Hosting (single project with multiple channels: dev, preview, production).
- **Offline**: Firestore persistence enabled for offline read/write and sync.

## Current Implementation Status

- Authentication foundation implemented with Google provider and context (`AuthContext`).
- UI simplified to Meals-only: `Layout` renders `Meals` component exclusively.
- Firestore offline persistence enabled with IndexedDB.
- Security rules enforce user-scoped access under `users/{userId}/{document=**}`.

## Data Topology

- `users/{userId}` root doc contains profile fields.
- Subcollections under user:
  - `ingredients/{ingredientId}`
  - `meals/{mealId}` with `ingredientLines[]` and `mealType`
  - `plans/{planId}` with `entries[]`

Ingredients now store `amount` and `servings` to express density like "2 cup per 4 servings" for aggregation and planning.

## Security Model

- All reads/writes are restricted to authenticated users on their own namespace.
- No public/shared collections at this stage.

Example rules (conceptual):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Enumerations & Units

- Units are enumerated and stored as imperial: `oz`, `lb`, `cup`, `tbsp`, `tsp`, `pc`, `pint`, `quart`, `gallon`.
- A conversion map in code supports display/input in metric and aggregation for grocery lists.

## Meal Types

- Enumerated: `breakfast`, `lunch_dinner`, `snack`.
- Saved on each meal; can be user-set or auto-inferred then edited.

## Offline Strategy

- Enable Firestore persistence.
- Queue writes while offline; resolve conflicts via last-write-wins (Firetore default) and UI hints.
- Use optimistic UI updates for CRUD and plan generation.

## Pagination & Performance

- Use query cursors for infinite scroll on `ingredients` and `meals`.
- Denormalize minimal fields in plans for fast rendering if needed later.

## Deployment & Environments

- Single Firebase project in Europe.
 - Use Hosting channels:
  - `dev` for internal testing
  - `preview` via PR previews
  - `production` for releases

## Future: Grocery List

- Aggregate ingredientLines across `plans/{planId}.entries`.
- Normalize by unit via conversion map; group by `ingredientId` for totals.
 - With plans in place, totals can be computed by summing scaled meal ingredient lines across selected plan entries.
