export const IMPERIAL_UNITS = [
  'oz',
  'lb',
  'cup',
  'tbsp',
  'tsp',
  'pc',
  'pint',
  'quart',
  'gallon'
]

// Minimal placeholder conversion map. Values are multipliers to base unit groups where applicable.
// This is intentionally simple for Step 2 and can be extended in Step 4 or grocery feature.
export const UNIT_CONVERSIONS = {
  // weight
  oz: { lb: 1 / 16 },
  lb: { oz: 16 },
  // volume (rough approximations for cooking)
  tsp: { tbsp: 1 / 3, cup: 1 / 48 },
  tbsp: { tsp: 3, cup: 1 / 16 },
  cup: { tbsp: 16, tsp: 48, pint: 0.5, quart: 0.25, gallon: 1 / 16 },
  pint: { cup: 2, quart: 0.5, gallon: 0.125 },
  quart: { cup: 4, pint: 2, gallon: 0.25 },
  gallon: { cup: 16, pint: 8, quart: 4 },
  // count
  pc: {}
}

export function convertUnit(quantity, fromUnit, toUnit) {
  if (fromUnit === toUnit) return quantity
  const map = UNIT_CONVERSIONS[fromUnit]
  if (map && typeof map[toUnit] === 'number') {
    return quantity * map[toUnit]
  }
  // Fallback: no direct conversion; return original quantity
  return quantity
}



