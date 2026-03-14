/** Backend response shape for one dish suggestion (PRD §9) */
export interface Suggestion {
  dishName: string
  description: string
  ingredientsUsed: string[]
  rationale: string
  offMenuNote?: string
}

export interface DishIngredient {
  name: string
  quantity: number
  unit: string
  atRisk: boolean
}

export interface Dish {
  name: string
  description: string
  ingredients: DishIngredient[]
  equipmentRequired: string[]
  wasteScore: number
  portionsToClear: number
  rationale: string
  offMenuNote?: string
}

export type OutputStatus = 'loading' | 'success' | 'error' | 'empty'
