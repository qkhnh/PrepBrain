interface DishSuggestionCardProps {
  dishName: string
  description: string
}

export function DishSuggestionCard({ dishName, description }: DishSuggestionCardProps) {
  return (
    <section
      style={{
        padding: '1.25rem',
        border: `1px solid var(--color-border)`,
        borderRadius: 'var(--radius-lg)',
        marginBottom: '1.5rem',
        background: 'var(--color-bg-card)',
      }}
      aria-labelledby="dish-name"
    >
      <h2
        id="dish-name"
        style={{
          margin: '0 0 0.5rem',
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--color-text)',
        }}
      >
        {dishName}
      </h2>
      <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
        {description}
      </p>
    </section>
  )
}
