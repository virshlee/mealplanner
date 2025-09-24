import { getAuth } from 'firebase/auth'
import { getFirestore, collection, doc, addDoc, getDocs, query, orderBy, limit, startAfter, serverTimestamp, deleteDoc, where } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

// Reuse app initialization from AuthContext by expecting Firebase to be initialized already.
// This file should only be imported after AuthContext has initialized Firebase.

export function getUserCollections(db, uid) {
  return {
    ingredientsCol: collection(db, `users/${uid}/ingredients`),
    mealsCol: collection(db, `users/${uid}/meals`)
  }
}

export async function addIngredient(db, uid, ingredient) {
  const { ingredientsCol } = getUserCollections(db, uid)
  return await addDoc(ingredientsCol, {
    ...ingredient,
    nameLower: ingredient.name?.toLowerCase?.().trim?.() || '',
    // amount: number of unit for the given number of servings (defaults to 1)
    amount: typeof ingredient.amount === 'number' ? ingredient.amount : 1,
    servings: typeof ingredient.servings === 'number' ? ingredient.servings : 1,
    createdAt: serverTimestamp()
  })
}

export async function findIngredientByName(db, uid, name) {
  const { ingredientsCol } = getUserCollections(db, uid)
  const n = (name || '').toLowerCase().trim()
  if (!n) return null
  const q = query(ingredientsCol, where('nameLower', '==', n), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function ensureIngredientByName(db, uid, name, unitFallback = 'pc') {
  const found = await findIngredientByName(db, uid, name)
  if (found) return found
  const ref = await addIngredient(db, uid, { name, unit: unitFallback })
  return { id: ref.id, name, unit: unitFallback }
}

export async function listIngredientsPage(db, uid, pageSize = 20, cursor = null) {
  const { ingredientsCol } = getUserCollections(db, uid)
  let q = query(ingredientsCol, orderBy('name'), limit(pageSize))
  if (cursor) {
    q = query(ingredientsCol, orderBy('name'), startAfter(cursor), limit(pageSize))
  }
  const snap = await getDocs(q)
  const items = []
  snap.forEach((docSnap) => items.push({ id: docSnap.id, ...docSnap.data() }))
  const nextCursor = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null
  return { items, nextCursor }
}

export async function deleteIngredient(db, uid, ingredientId) {
  const ref = doc(db, `users/${uid}/ingredients/${ingredientId}`)
  await deleteDoc(ref)
}

export async function addMeal(db, uid, meal) {
  const { mealsCol } = getUserCollections(db, uid)
  return await addDoc(mealsCol, {
    ...meal,
    createdAt: serverTimestamp()
  })
}

export async function listMealsPage(db, uid, pageSize = 20, cursor = null) {
  const { mealsCol } = getUserCollections(db, uid)
  let q = query(mealsCol, orderBy('name'), limit(pageSize))
  if (cursor) {
    q = query(mealsCol, orderBy('name'), startAfter(cursor), limit(pageSize))
  }
  const snap = await getDocs(q)
  const items = []
  snap.forEach((docSnap) => items.push({ id: docSnap.id, ...docSnap.data() }))
  const nextCursor = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null
  return { items, nextCursor }
}

export async function deleteMeal(db, uid, mealId) {
  const ref = doc(db, `users/${uid}/meals/${mealId}`)
  await deleteDoc(ref)
}


// Plans
export async function addPlan(db, uid, plan) {
  const col = collection(db, `users/${uid}/plans`)
  return await addDoc(col, {
    ...plan,
    createdAt: serverTimestamp()
  })
}

export async function listPlansPage(db, uid, pageSize = 10, cursor = null) {
  const col = collection(db, `users/${uid}/plans`)
  let q = query(col, orderBy('startDate'), limit(pageSize))
  if (cursor) {
    q = query(col, orderBy('startDate'), startAfter(cursor), limit(pageSize))
  }
  const snap = await getDocs(q)
  const items = []
  snap.forEach((docSnap) => items.push({ id: docSnap.id, ...docSnap.data() }))
  const nextCursor = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null
  return { items, nextCursor }
}

export async function deletePlan(db, uid, planId) {
  const ref = doc(db, `users/${uid}/plans/${planId}`)
  await deleteDoc(ref)
}


