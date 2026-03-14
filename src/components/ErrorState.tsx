interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  onBackToIngredients: () => void
}

const DEFAULT_MESSAGE = 'Something went wrong. Check your connection and try again.'
const LABEL_TRY_AGAIN = 'Try again'
const LABEL_BACK = 'Back to ingredients'

const primaryStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  fontSize: '0.9375rem',
  marginRight: '0.5rem',
  marginTop: '1rem',
  cursor: 'pointer',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  background: 'var(--color-primary-dark)',
  color: '#fff',
  fontWeight: 600,
}

const secondaryStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  fontSize: '0.9375rem',
  marginRight: '0.5rem',
  marginTop: '1rem',
  cursor: 'pointer',
  border: `1px solid var(--color-border)`,
  borderRadius: 'var(--radius-md)',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
}

export function ErrorState({ message = DEFAULT_MESSAGE, onRetry, onBackToIngredients }: ErrorStateProps) {
  return (
    <div
      style={{
        padding: '1.5rem',
        border: `1px solid var(--color-border)`,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-bg-card)',
      }}
    >
      <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--color-text)' }}>{message}</p>
      <div>
        {onRetry && (
          <button type="button" style={primaryStyle} onClick={onRetry}>
            {LABEL_TRY_AGAIN}
          </button>
        )}
        <button type="button" style={secondaryStyle} onClick={onBackToIngredients}>
          {LABEL_BACK}
        </button>
      </div>
    </div>
  )
}
