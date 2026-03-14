interface DishSuggestionCardProps {
  dishName: string
  description: string
  offMenuNote?: string
}

const DEFAULT_OFF_MENU = 'Off-menu special — use while supplies last.'

export function DishSuggestionCard({ dishName, description, offMenuNote }: DishSuggestionCardProps) {
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
      {(offMenuNote ?? DEFAULT_OFF_MENU) && (
        <p
          style={{
            margin: '0.75rem 0 0',
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
            fontStyle: 'italic',
          }}
        >
          {offMenuNote ?? DEFAULT_OFF_MENU}
        </p>
      )}
    </section>
  )
}
