# Project: Meal Planner - Implementation Plan

**Version:** 1.1
**Date:** September 22, 2025
**Stack:** React, Vite, Firebase (Authentication, Firestore, Hosting) — Europe region

---

## 1. Introduction

This document outlines the development roadmap for the Meal Planner web application. The project will be executed in four distinct phases, organized into weekly sprints. Each phase builds upon the last, ensuring a structured and iterative development process, from initial setup to final deployment.

Key cross-cutting decisions:
- Region: Firebase project and Firestore in Europe.
- Units: Enumerated imperial units stored in DB (e.g., `oz`, `lb`, `cup`, `tbsp`, `tsp`, `pc`, `pint`, `quart`, `gallon`). Conversions supported in code for display/aggregation.
- Offline: Firestore offline persistence enabled; optimistic UI; background sync.
- Pagination: Infinite scroll for ingredients and meals using query cursors.
- Hosting: Single Firebase project with channels (dev, preview, production).

---

## 2. Phase 1: Foundation & User Authentication (Week 1: Sep 22 - Sep 28)

**Goal:** Set up the project environment, establish the basic application structure, and implement a secure user authentication system.

| Task ID | Task Description | Status |
| :--- | :--- | :--- |
| **1.1** | **Project Scaffolding:** Initialize a new React project using Vite. Install and configure essential dependencies: `firebase`, `tailwindcss`. | Done |
| **1.2** | **Firebase Setup (Europe):** Create a Firebase project in Europe region. Enable **Google Authentication** and **Firestore**. Configure Hosting. | Done |
| **1.3** | **Security Rules (User-Scoped):** Write Firestore rules to restrict reads/writes to `/users/{uid}/**` for the authenticated user. | Done |
| **1.4** | **Component Architecture:** Create layout components: `App.jsx`, `Header.jsx`, `Layout.jsx`. Header contains login controls. | Done |
| **1.5** | **Authentication Logic:** Implement Google sign-in/out via Firebase SDK. Add `AuthContext` to provide current user state. | Done |
| **1.6** | **Offline Persistence:** Enable Firestore offline persistence and add basic retry/sync indicators. | Done |

**Deliverable:** A basic, runnable React application where users can sign in/out with Google, backed by Firestore in Europe with offline cache enabled.

---

## 3. Phase 2: Core Feature - Meal & Ingredient Management (Week 2: Sep 29 - Oct 5)

**Goal:** Build the core functionality allowing users to create, view, and delete their personal library of meals and ingredients.

| Task ID | Task Description | Status |
| :--- | :--- | :--- |
| **2.1** | **Data Modeling in Firestore:** Use `/users/{userId}/meals/{mealId}`, `/users/{userId}/ingredients/{ingredientId}`. Ingredient names are not uniquely enforced. | Done |
| **2.2** | **Units & Conversion Layer:** Store ingredient lines in enumerated imperial units. Implement a conversion map/service to display metric (UI only) and support future grocery aggregation. | Done |
| **2.3** | **Ingredient Management UI:** Initially added; later removed per scope change to Meals-only UI. | Done (Removed) |
| **2.4** | **Meal Creation UI:** Scope simplified to URL import only; categorized list retained. | Done |
| **2.5** | **Firestore CRUD Services:** Create/list/delete meals; ensure ingredients by name for URL-import mapping. | Done |
| **2.6** | **Infinite Scroll:** Implemented for meals list. | Done |

**Deliverable:** Meals-only UI with recipe URL import and categorized meal list, infinite scroll; Firestore schema and services established (ingredients collection exists for internal mapping only).

---

## 4. Phase 3: Meal Plan Generation (Week 3: Oct 6 - Oct 12)

**Goal:** Implement the headline feature of the application: automatically generating a meal plan from the user's saved meals.

| Task ID | Task Description | Status |
| :--- | :--- | :--- |
| **3.1** | **Plan Generator UI:** Inputs for start date and N days; "Generate Plan" button. | Done |
| **3.2** | **Generation Algorithm:** Random selection from user meals; respects meal types for each slot. | Done |
| **3.3** | **State Management for Plan:** Persist plans in Firestore under `/users/{uid}/plans`. | Done |
| **3.4** | **Display Generated Plan:** Calendar-style view with slots per day; delete plan. | Done |
| **3.5** | **Adjust Servings:** Allow per-entry servings override without changing base meal defaults. | Deferred to Step 4 |

**Deliverable:** A functional plan generator that saves and displays N-day plans with type-aware slots and delete support.

---

## 5. Phase 4: Polish, Testing, and Deployment (Week 4: Oct 13 - Oct 19)

**Goal:** Refine the user experience, conduct testing to ensure quality, and deploy the application for public access.

| Task ID | Task Description | Status |
| :--- | :--- | :--- |
| **4.1** | **Responsive Styling:** Review and test on various screen sizes; tweak layout gaps and grids. | Done |
| **4.2** | **UX Enhancements:** Add clear status messages on long ops (done for Plans), show meal names in plan view. | Done |
| **4.3** | **End-to-End Testing:** Manually test flows: auth, CRUD, pagination, offline behavior, plan generation. | Done |
| **4.4** | **Production Build:** Create optimized production build via `npm run build`. | Done |
| **4.5** | **Deployment (Hosting Channels):** Deploy to Firebase Hosting using channels (dev/preview/production). | Done |

**Deliverable:** A polished, fully functional, and publicly accessible Meal Planner app with offline support and channel-based deployments.