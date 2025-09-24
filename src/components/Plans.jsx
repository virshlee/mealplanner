import { useEffect, useMemo, useState } from 'react'
import { getFirestore } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import { addPlan, deletePlan, listMealsPage, listPlansPage } from '../services/firestore'

const MEAL_SLOTS = ['breakfast', 'lunch_dinner', 'snack']

function formatISODate(d) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Plans() {
  const { user } = useAuth()
  const db = useMemo(() => getFirestore(), [])

  const [numDays, setNumDays] = useState(7)
  const [startDate, setStartDate] = useState(formatISODate(new Date()))
  const [generating, setGenerating] = useState(false)
  const [status, setStatus] = useState('')

  const [meals, setMeals] = useState([])
  const [plans, setPlans] = useState([])
  const [mealIdToName, setMealIdToName] = useState({})
  const [nextCursor, setNextCursor] = useState(null)
  const [loadingPlans, setLoadingPlans] = useState(false)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      // Preload meals for generator
      const { items: allMeals } = await listMealsPage(db, user.uid, 200)
      setMeals(allMeals)
      const map = {}
      allMeals.forEach((m) => { map[m.id] = m.name })
      setMealIdToName(map)
      // Load recent plans
      setLoadingPlans(true)
      const { items, nextCursor } = await listPlansPage(db, user.uid)
      setPlans(items)
      setNextCursor(nextCursor)
      setLoadingPlans(false)
    })()
  }, [db, user])

  const pickRandomByType = (type) => {
    const candidates = meals.filter((m) => m.mealType === type)
    if (candidates.length === 0) return null
    const idx = Math.floor(Math.random() * candidates.length)
    return candidates[idx]
  }

  const onGenerate = async () => {
    if (!user) return
    setGenerating(true)
    setStatus('Preparing…')
    try {
      const baseDate = new Date(startDate)
      const entries = []
      const daysInt = parseInt(numDays, 10) || 1
      for (let i = 0; i < daysInt; i++) {
        const d = new Date(baseDate)
        d.setDate(baseDate.getDate() + i)
        const iso = formatISODate(d)
        for (const slot of MEAL_SLOTS) {
          const meal = pickRandomByType(slot)
          if (meal) {
            entries.push({ date: iso, slot, mealId: meal.id, servings: meal.defaultServings || 1 })
          }
        }
      }
      const plan = { startDate, numDays: daysInt, entries }
      setStatus('Saving plan…')
      await addPlan(db, user.uid, plan)
      setStatus('Refreshing…')
      const { items, nextCursor } = await listPlansPage(db, user.uid)
      setPlans(items)
      setNextCursor(nextCursor)
      setStatus('Plan saved!')
      setTimeout(() => setStatus(''), 2000)
    } finally {
      setGenerating(false)
    }
  }

  const onGenerateSafe = async () => {
    try {
      await onGenerate()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setStatus(err?.message || 'Failed to generate plan')
      setGenerating(false)
      setTimeout(() => setStatus(''), 3000)
    }
  }

  const onDelete = async (id) => {
    await deletePlan(db, user.uid, id)
    setPlans((prev) => prev.filter((p) => p.id !== id))
  }

  const loadMore = async () => {
    if (!nextCursor) return
    setLoadingPlans(true)
    const { items: more, nextCursor: nc } = await listPlansPage(db, user.uid, 10, nextCursor)
    setPlans((prev) => [...prev, ...more])
    setNextCursor(nc)
    setLoadingPlans(false)
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="card space-y-3">
        <div className="font-semibold">Generate Plan</div>
        <div className="grid sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-3 py-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Days</label>
            <input type="number" min="1" max="28" value={numDays} onChange={(e) => setNumDays(e.target.value)} className="border rounded px-3 py-2 w-full" />
          </div>
          <div>
            <button onClick={onGenerateSafe} disabled={generating || meals.length === 0} className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded">
              {generating ? 'Generating…' : 'Generate Plan'}
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-500">Requires at least one meal per slot type for best results.</div>
        <div className="text-sm text-gray-600 h-5">{status}</div>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => {
          const days = []
          const base = new Date(plan.startDate)
          for (let i = 0; i < (plan.numDays || 0); i++) {
            const d = new Date(base)
            d.setDate(base.getDate() + i)
            days.push(formatISODate(d))
          }
          return (
            <div key={plan.id} className="border rounded">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 font-semibold border-b">
                <div>Plan starting {plan.startDate} ({plan.numDays} days)</div>
                <button onClick={() => onDelete(plan.id)} className="text-red-600 hover:underline">Delete</button>
              </div>
              <div className="grid sm:grid-cols-3 gap-0">
                {days.map((iso) => (
                  <div key={iso} className="border-r last:border-r-0">
                    <div className="px-3 py-2 font-medium border-b bg-white sticky top-0">{iso}</div>
                    <div className="divide-y">
                      {MEAL_SLOTS.map((slot) => {
                        const match = (plan.entries || []).find((e) => e.date === iso && e.slot === slot)
                        return (
                          <div key={slot} className="px-3 py-2">
                            <div className="text-xs uppercase text-gray-500">{slot === 'lunch_dinner' ? 'Dinner' : slot}</div>
                            {match ? (
                              <div className="text-sm">
                                <span className="font-medium">{mealIdToName[match.mealId] || match.mealId}</span>
                                <span className="ml-2 text-gray-600">Servings: {match.servings}</span>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-400">No meal</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        <div className="p-3 flex justify-between items-center">
          <span className="text-sm text-gray-500">{loadingPlans ? 'Loading…' : ''}</span>
          <button onClick={loadMore} disabled={!nextCursor || loadingPlans} className="text-blue-600 hover:underline disabled:opacity-50">
            Load more plans
          </button>
        </div>
      </div>
    </div>
  )
}

export default Plans


