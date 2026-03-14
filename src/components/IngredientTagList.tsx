interface IngredientTagListProps {
  ingredientsUsed: string[]
}

const SECTION_HEADING = 'Ingredients used'

export function IngredientTagList({ ingredientsUsed }: IngredientTagListProps) {
  if (!ingredientsUsed.length) return null

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
        {ingredientsUsed.map((ing) => (
          <li
            key={ing}
            style={{
              padding: '0.25rem 0.5rem',
              background: 'var(--color-surface)',
              border: `1px solid var(--color-border)`,
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              color: 'var(--color-text)',
            }}
          >
            {ing}
          </li>
        ))}
      </ul>
    </section>
  )
}
