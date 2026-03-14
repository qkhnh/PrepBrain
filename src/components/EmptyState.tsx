interface EmptyStateProps {
  onBackToIngredients: () => void
  onTryAgain?: () => void
}

const MESSAGE = "We couldn't suggest a dish for these ingredients. Try adding or changing a few and submit again."
const LABEL_BACK = 'Back to ingredients'
const LABEL_TRY_AGAIN = 'Try again'

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

export function EmptyState({ onBackToIngredients, onTryAgain }: EmptyStateProps) {
  return (
    <div
      style={{
        padding: '1.5rem',
        border: `1px solid var(--color-border)`,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-bg-card)',
      }}
    >
      <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--color-text)' }}>{MESSAGE}</p>
      <div>
        {onTryAgain && (
          <button type="button" style={primaryStyle} onClick={onTryAgain}>
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
