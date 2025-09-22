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
| **1.1** | **Project Scaffolding:** Initialize a new React project using Vite. Install and configure essential dependencies: `firebase`, `tailwindcss`. | To Do |
| **1.2** | **Firebase Setup (Europe):** Create a Firebase project in Europe region. Enable **Google Authentication** and **Firestore**. Configure Hosting. | To Do |
| **1.3** | **Security Rules (User-Scoped):** Write Firestore rules to restrict reads/writes to `/users/{uid}/**` for the authenticated user. | To Do |
| **1.4** | **Component Architecture:** Create layout components: `App.jsx`, `Header.jsx`, `Layout.jsx`. Header contains login controls. | To Do |
| **1.5** | **Authentication Logic:** Implement Google sign-in/out via Firebase SDK. Add `AuthContext` to provide current user state. | To Do |
| **1.6** | **Offline Persistence:** Enable Firestore offline persistence and add basic retry/sync indicators. | To Do |

**Deliverable:** A basic, runnable React application where users can sign in/out with Google, backed by Firestore in Europe with offline cache enabled.

---

## 3. Phase 2: Core Feature - Meal & Ingredient Management (Week 2: Sep 29 - Oct 5)

**Goal:** Build the core functionality allowing users to create, view, and delete their personal library of meals and ingredients.

| Task ID | Task Description | Status |
| :--- | :--- | :--- |
| **2.1** | **Data Modeling in Firestore:** Use `/users/{userId}/meals/{mealId}`, `/users/{userId}/ingredients/{ingredientId}`. Ingredient names are not uniquely enforced. | To Do |
| **2.2** | **Units & Conversion Layer:** Store ingredient lines in enumerated imperial units. Implement a conversion map/service to display metric (UI only) and support future grocery aggregation. | To Do |
| **2.3** | **Ingredient Management UI:** Page/component to add ingredients (name + unit from enum) and list existing ones. | To Do |
| **2.4** | **Meal Creation UI:** Form for meal title, rich-text instructions (Markdown), default servings, meal type (breakfast/lunch_dinner/snack), and dynamic ingredient lines (quantity + unit). | To Do |
| **2.5** | **Firestore CRUD Services:** Modular functions for Create, Read, Update, Delete for meals and ingredients (separate from UI). | To Do |
| **2.6** | **Infinite Scroll:** Implement cursor-based pagination for ingredients and meals (load more on scroll). | To Do |

**Deliverable:** Functional interface to add/delete ingredients and create meals with ingredient lines, using imperial enumerated units, with infinite scroll for large lists.

---

## 4. Phase 3: Meal Plan Generation (Week 3: Oct 6 - Oct 12)

**Goal:** Implement the headline feature of the application: automatically generating a meal plan from the user's saved meals.

| Task ID | Task Description | Status |
| :--- | :--- | :--- |
| **3.1** | **Plan Generator UI:** Inputs for number of days (N-day) and default servings per meal; "Generate Plan" button. | To Do |
| **3.2** | **Generation Algorithm:** Random selection from user meals (non-deterministic). Respect meal types (breakfast/lunch_dinner/snack) for each slot. | To Do |
| **3.3** | **State Management for Plan:** Hold generated plan data in structured state (array of entries). | To Do |
| **3.4** | **Display Generated Plan:** Render in calendar-style view. | To Do |
| **3.5** | **Adjust Servings:** Allow per-entry servings override without changing base meal defaults. | To Do |

**Deliverable:** A fully functional meal plan generator that creates and displays an N-day plan with type-aware meal slots.

---

## 5. Phase 4: Polish, Testing, and Deployment (Week 4: Oct 13 - Oct 19)

**Goal:** Refine the user experience, conduct testing to ensure quality, and deploy the application for public access.

| Task ID | Task Description | Status |
| :--- | :--- | :--- |
| **4.1** | **Responsive Styling:** Review and test on various screen sizes. Apply responsive Tailwind classes. | To Do |
| **4.2** | **UX Enhancements:** Add loading indicators, optimistic UI feedback, and user-friendly toasts for success/error. | To Do |
| **4.3** | **End-to-End Testing:** Manually test flows: auth, CRUD, pagination, offline behavior, generation and adjustment. Fix bugs/usability issues. | To Do |
| **4.4** | **Production Build:** Create optimized production build via `npm run build`. | To Do |
| **4.5** | **Deployment (Hosting Channels):** Deploy to Firebase Hosting using channels (dev/preview/production) within the single project. | To Do |

**Deliverable:** A polished, fully functional, and publicly accessible Meal Planner app with offline support and channel-based deployments.