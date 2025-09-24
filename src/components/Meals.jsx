import { useEffect, useMemo, useState } from 'react'
import { getFirestore } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import { addMeal, deleteMeal, listMealsPage, ensureIngredientByName, listIngredientsPage } from '../services/firestore'
import { extractRecipeFromUrl, mapSpoonacularIngredientsToLines } from '../services/recipes'

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch_dinner', label: 'Lunch/Dinner' },
  { value: 'snack', label: 'Snack' }
]

function Meals() {
  const { user } = useAuth()
  const db = useMemo(() => getFirestore(), [])

  const [mealType, setMealType] = useState('lunch_dinner')
  const [urlImport, setUrlImport] = useState('')
  const [importing, setImporting] = useState(false)
  const [status, setStatus] = useState('')

  const [items, setItems] = useState([])
  const [nextCursor, setNextCursor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      setLoading(true)
      const [mealsPage] = await Promise.all([
        listMealsPage(db, user.uid)
      ])
      setItems(mealsPage.items)
      setNextCursor(mealsPage.nextCursor)
      setLoading(false)
    })()
  }, [db, user])

  // No manual add/edit form; only URL import remains

  const onImportUrl = async (e) => {
    e.preventDefault()
    const u = urlImport.trim()
    if (!u) return
    setImporting(true)
    setStatus('Fetching recipe…')
    try {
      const data = await extractRecipeFromUrl(u)
      const title = data.title || ''
      const servings = Number(data.servings || 0) || 1
      // Keep import minimal: store mapped ingredient lines with ensured ingredient IDs
      const mapped = mapSpoonacularIngredientsToLines(data)
      const linesWithIds = []
      for (const line of mapped) {
        const ensured = await ensureIngredientByName(db, user.uid, line.name, line.unit || 'pc')
        linesWithIds.push({ ingredientId: ensured.id, quantity: line.quantity || 1, unit: ensured.unit || line.unit || 'pc' })
      }
      setStatus('Saving meal…')
      await addMeal(db, user.uid, {
        name: title,
        instructions: data.instructions || data.summary || '',
        defaultServings: servings,
        mealType,
        ingredientLines: linesWithIds,
        url: u,
        servingsImported: servings,
        macros: Array.isArray(data?.nutrition?.nutrients)
          ? data.nutrition.nutrients.map((n) => `${n.name}: ${n.amount}${n.unit}`).join(', ')
          : ''
      })
      const { items: newItems, nextCursor: nc } = await listMealsPage(db, user.uid)
      setItems(newItems)
      setNextCursor(nc)
      setUrlImport('')
      setStatus('Recipe saved!')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert(err.message || 'Import failed')
      setStatus('')
    } finally {
      setImporting(false)
      setTimeout(() => setStatus(''), 3000)
    }
  }

  const onDelete = async (id) => {
    await deleteMeal(db, user.uid, id)
    setItems((prev) => prev.filter((x) => x.id !== id))
  }

  const loadMore = async () => {
    if (!nextCursor) return
    setLoading(true)
    const { items: more, nextCursor: nc } = await listMealsPage(db, user.uid, 20, nextCursor)
    setItems((prev) => [...prev, ...more])
    setNextCursor(nc)
    setLoading(false)
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="card space-y-2">
        <div className="grid sm:grid-cols-3 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Add Recipe by URL</label>
            <input
              type="url"
              value={urlImport}
              onChange={(e) => setUrlImport(e.target.value)}
              placeholder="Paste recipe URL here"
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Meal Type</label>
            <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="border rounded px-3 py-2 w-full">
              {MEAL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onImportUrl} disabled={importing} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            {importing ? 'Saving…' : 'Save Recipe'}
          </button>
          <span className="text-sm text-gray-500">{status}</span>
        </div>
      </div>

      <div className="space-y-4">
        {['breakfast','lunch_dinner','snack'].map((type) => {
          const group = items.filter((m) => m.mealType === type)
          if (group.length === 0) return null
          const title = type === 'breakfast' ? 'Breakfasts' : type === 'snack' ? 'Snacks' : 'Dinners'
          return (
            <div key={type} className="border rounded">
              <div className="px-4 py-2 bg-gray-50 font-semibold border-b">{title}</div>
              {group.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">
                      {meal.url ? (
                        <a href={meal.url} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">{meal.name}</a>
                      ) : (
                        meal.name
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {meal.defaultServings ? <span className="mr-3"><b>Servings:</b> {meal.defaultServings}</span> : null}
                      {meal.macros ? <span><b>Macros:</b> {meal.macros}</span> : null}
                    </div>
                  </div>
                  <button onClick={() => onDelete(meal.id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              ))}
            </div>
          )
        })}
        <div className="p-3 flex justify-between items-center">
          <span className="text-sm text-gray-500">{loading ? 'Loading…' : ''}</span>
          <button onClick={loadMore} disabled={!nextCursor || loading} className="text-blue-600 hover:underline disabled:opacity-50">
            Load more
          </button>
        </div>
      </div>
    </div>
  )
}

export default Meals


