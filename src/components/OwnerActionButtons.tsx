interface OwnerActionButtonsProps {
  onBackToIngredients: () => void
  onTryAnother?: () => void
  onSave?: () => void
  isLoading?: boolean
}

const LABEL_BACK = 'Back to ingredients'
const LABEL_TRY_ANOTHER = 'Try another suggestion'
const LABEL_SAVE = 'Save for later'

const primaryStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  fontSize: '0.9375rem',
  marginRight: '0.5rem',
  marginBottom: '0.5rem',
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
  marginBottom: '0.5rem',
  cursor: 'pointer',
  border: `1px solid var(--color-border)`,
  borderRadius: 'var(--radius-md)',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
}

export function OwnerActionButtons({
  onBackToIngredients,
  onTryAnother,
  onSave,
  isLoading = false,
}: OwnerActionButtonsProps) {
  return (
    <section style={{ marginTop: '1rem' }} aria-label="Actions">
      <button
        type="button"
        style={primaryStyle}
        onClick={onBackToIngredients}
        disabled={isLoading}
      >
        {LABEL_BACK}
      </button>
      {onTryAnother && (
        <button
          type="button"
          style={secondaryStyle}
          onClick={onTryAnother}
          disabled={isLoading}
        >
          {LABEL_TRY_ANOTHER}
        </button>
      )}
      {onSave && (
        <button
          type="button"
          style={secondaryStyle}
          onClick={onSave}
          disabled={isLoading}
        >
          {LABEL_SAVE}
        </button>
      )}
    </section>
  )
}
