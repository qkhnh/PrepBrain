interface ResultHeaderProps {
  title?: string
  subtitle?: string
}

const DEFAULT_TITLE = 'Your dish suggestion'
const DEFAULT_SUBTITLE = 'Based on your leftover ingredients'

export function ResultHeader({ title = DEFAULT_TITLE, subtitle = DEFAULT_SUBTITLE }: ResultHeaderProps) {
  return (
    <header style={{ marginBottom: '1.5rem' }}>
      <h1
        style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: 600,
          color: 'var(--color-text)',
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            margin: '0.25rem 0 0',
            fontSize: '0.9375rem',
            color: 'var(--color-text-muted)',
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  )
}
