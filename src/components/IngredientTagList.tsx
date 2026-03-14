import type { DishIngredient } from '@/types/suggestion'

interface IngredientTagListProps {
  ingredients: DishIngredient[]
}

const SECTION_HEADING = 'Ingredients used'

export function IngredientTagList({ ingredients }: IngredientTagListProps) {
  if (!ingredients.length) return null

  return (
    <section style={{ marginBottom: '1.5rem' }} aria-labelledby="ingredients-heading">
      <h3
        id="ingredients-heading"
        style={{
          margin: '0 0 0.5rem',
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--color-text)',
        }}
      >
        {SECTION_HEADING}
      </h3>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        {ingredients.map((ing) => (
          <li
            key={ing.name}
            style={{
              padding: '0.25rem 0.5rem',
              background: ing.atRisk ? 'var(--color-warning-bg)' : 'var(--color-surface)',
              border: `1px solid ${ing.atRisk ? 'var(--color-warning)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              color: ing.atRisk ? 'var(--color-warning)' : 'var(--color-text)',
              fontWeight: ing.atRisk ? 500 : 400,
            }}
          >
            {ing.name}
            {ing.quantity > 0 && (
              <span style={{ marginLeft: '0.25rem', opacity: 0.75 }}>
                {ing.quantity}{ing.unit ? ` ${ing.unit}` : ''}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
