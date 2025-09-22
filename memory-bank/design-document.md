# Project: Meal Planner Web App - Design Document

**Version:** 1.1
**Date:** September 22, 2025
**Author:** AI Assistant

---

## 1. Introduction

This document outlines the design and architecture for a web application aimed at simplifying meal planning. The application allows users to manage a personal library of meals and ingredients, and automatically generate N-day meal plans. The core goal is to provide a user-friendly tool that helps with organization, reduces the mental load of deciding what to eat, and aids in grocery planning.

---

## 2. Goals and Objectives

* **Simplify Meal Planning:** Provide a centralized platform for users to store recipes and generate plans effortlessly.
* **User-Friendly Interface:** Create a clean, intuitive, and responsive UI that works seamlessly on desktop and mobile devices.
* **Secure Authentication:** Ensure user data is private and secure using Google Authentication via Firebase.
* **Flexible Meal Creation:** Allow users to easily add their own meals, specify ingredients, and set default serving sizes.
* **Dynamic Plan Generation:** Enable instant generation of meal plans from the user's saved meals with adjustable servings.
* **Offline-First:** Support offline usage with Firestore's local cache and robust synchronization.

---

## 3. Features

### 3.1. User Authentication
* **Google Sign-In (Firebase Auth):** Users log in with their Google account.
* **User Profile:** Each user has a private dataset scoped under their user document.

### 3.2. Meal and Ingredient Management
* **Add Meals:** Create meals with name, rich-text instructions (Markdown allowed), default servings, and meal type.
* **Add Ingredients:** Maintain a library of ingredients with name and unit of measurement from an enumerated set (stored in imperial units; conversions possible in UI).
* **Link Ingredients to Meals:** Associate ingredient lines (ingredient reference + quantity in imperial + unit) for the default serving size.
* **CRUD Operations:** Full Create, Read, Update, and Delete for meals and ingredients.

### 3.3. Meal Plan Generation
* **Automated Generation:** Generate plans for N days (e.g., 3/5/7/14). Selection is random and non-deterministic.
* **Meal Categories:** Breakfast, Lunch/Dinner, Snack. Generator selects meals matching slot type.
* **View Plan:** Display in a clean, calendar-like view.
* **Adjust Servings:** Override default servings per planned meal; quantities scale accordingly within the plan (does not change the base meal).

### 3.4. Performance & UX
* **Offline Support:** Firestore persistence for reading/writing offline with sync when online.
* **Pagination:** Infinite scroll for lists (ingredients, meals) to handle large datasets.

---

## 4. Technical Stack

* **Frontend:** React with Vite
* **Backend/Services:** Firebase (Auth, Firestore, Hosting)
* **Database:** Firestore (multi-tenant by user)
* **Authentication:** Firebase Authentication (Google provider)
* **Deployment:** Firebase Hosting (single project, multiple channels)
* **Region:** Europe

---

## 5. Data Models (Firestore Collections)

All user-owned data is namespaced under the user document. Ingredient names are not enforced unique; duplicates are allowed. Units are from an enumerated set and stored in imperial units; conversions can be applied at the UI/service layer when needed.

```
/users/{userId}
  email: string
  name: string

/users/{userId}/ingredients/{ingredientId}
  name: string
  unit: 'oz' | 'lb' | 'cup' | 'tbsp' | 'tsp' | 'pc' | 'pint' | 'quart' | 'gallon' // enumerated, stored as imperial unit
  // future: canonicalUnit: 'oz' | ... (for grocery list aggregation)

/users/{userId}/meals/{mealId}
  name: string
  instructions: string // markdown
  defaultServings: number
  mealType: 'breakfast' | 'lunch_dinner' | 'snack'
  ingredientLines: Array<{
    ingredientId: string
    quantity: number // for defaultServings, in imperial unit
    unit: 'oz' | 'lb' | 'cup' | 'tbsp' | 'tsp' | 'pc' | 'pint' | 'quart' | 'gallon'
  }>

/users/{userId}/plans/{planId}
  startDate: string // ISO date
  numDays: number
  entries: Array<{
    date: string // ISO date
    slot: 'breakfast' | 'lunch_dinner' | 'snack'
    mealId: string
    servings: number // per-entry override
  }>
```

Notes:
* Meal type is saved on each meal and used by the generator. It may be set explicitly by user or inferred from name/website and then editable.
* Instructions support Markdown for rich text.
* Future grocery list generation will aggregate ingredient lines across plans; storing canonical units in imperial simplifies summation. We will keep a conversion map to display metric as needed.

---

## 6. User Flow

1. **Login:** User visits the site → Clicks "Login with Google" → sees Dashboard.
2. **Populate Data:**
   * Navigate to Ingredients page; add items like "Chicken Breast", "Rice", "Onion" with units.
   * Navigate to Meals page; create a meal (e.g., "Chicken and Rice"), set default servings, add ingredient lines.
3. **Generate Plan:**
   * Go to Meal Plan page; choose N days and defaults; click "Generate Plan".
   * App populates a calendar with meals matching slot types.
4. **Adjust Plan:**
   * User increases servings for a planned meal; only that entry changes.
5. **Offline:**
   * User can add/edit while offline; data syncs when reconnected.

---

## 7. Future Enhancements

* **Grocery List Generation:** Aggregate a shopping list per plan with unit-aware summation and conversion.
* **Meal Tagging/Filtering:** Add tags (e.g., vegetarian, quick) to filter generation.
* **Manual Plan Building:** Drag and drop meals to build or edit a plan.
* **Nutritional Information:** Integrate an API to pull nutrition data.