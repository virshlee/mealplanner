export async function extractRecipeFromUrl(url) {
  const apiKey = '5d6046bf1bb545898ee653b773cac47e'
  if (!apiKey) {
    throw new Error('Missing VITE_SPOONACULAR_KEY')
  }
  
  const apiUrl = `https://api.spoonacular.com/recipes/extract?apiKey=${apiKey}&url=${encodeURIComponent(url)}`
  const res = await fetch(apiUrl)
  if (!res.ok) {
    throw new Error(`Recipe API error: ${res.status}`)
  }
  const data = await res.json()
  if (data.status === 'failure') {
    throw new Error(data.message || 'Recipe API failure')
  }
  return data
}

export function mapSpoonacularIngredientsToLines(data) {
  const lines = []
  const extended = data.extendedIngredients || []
  for (const ing of extended) {
    const name = ing.name || ing.originalName || ''
    const amount = typeof ing.amount === 'number' ? ing.amount : 0
    const unit = (ing.unit || 'pc').toLowerCase()
    lines.push({ name, quantity: amount, unit })
  }
  return lines
}




