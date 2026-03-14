/** Backend response shape for one dish suggestion (PRD §9) */
export interface Suggestion {
  dishName: string
  description: string
  ingredientsUsed: string[]
  rationale: string
  offMenuNote?: string
}

export type OutputStatus = 'loading' | 'success' | 'error' | 'empty'
