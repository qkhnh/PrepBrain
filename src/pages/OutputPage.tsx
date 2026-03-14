import type { Suggestion, OutputStatus } from '@/types/suggestion'
import { ResultHeader } from '@/components/ResultHeader'
import { DishSuggestionCard } from '@/components/DishSuggestionCard'
import { IngredientTagList } from '@/components/IngredientTagList'
import { ReasonSection } from '@/components/ReasonSection'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { EmptyState } from '@/components/EmptyState'

export interface OutputPageProps {
  status: OutputStatus
  suggestions: Suggestion[]
  errorMessage?: string | null
  onBackToIngredients: () => void
  onSave?: (recipe: Suggestion) => void
  onRetry?: () => void
}

const LABEL_BACK = 'Back to ingredients'
const LABEL_SAVE = 'Save for later'

/** Single recipe card with dish name, description, ingredients, rationale, and save action */
function RecipeCard({
  suggestion,
  onSave,
}: {
  suggestion: Suggestion
  onSave?: (recipe: Suggestion) => void
}) {
  return (
    <article
      style={{
        padding: '1.5rem',
        marginBottom: '1.5rem',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <DishSuggestionCard
        dishName={suggestion.dishName}
        description={suggestion.description}
        offMenuNote={suggestion.offMenuNote}
      />
      <IngredientTagList ingredientsUsed={suggestion.ingredientsUsed} />
      <ReasonSection rationale={suggestion.rationale} />
      {onSave && (
        <div style={{ marginTop: '1rem' }}>
          <button
            type="button"
            onClick={() => onSave(suggestion)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.9375rem',
              cursor: 'pointer',
              border: `1px solid var(--color-border)`,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
            }}
          >
            {LABEL_SAVE}
          </button>
        </div>
      )}
    </article>
  )
}

export function OutputPage({
  status,
  suggestions,
  errorMessage,
  onBackToIngredients,
  onSave,
  onRetry,
}: OutputPageProps) {
  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Back button: left-aligned at top of main content, just right of sidebar divider */}
      <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
        <button
          type="button"
          onClick={onBackToIngredients}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.9375rem',
            cursor: 'pointer',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-dark)',
            color: '#fff',
            fontWeight: 600,
          }}
        >
          {LABEL_BACK}
        </button>
      </div>

      {/* Centered column for header and recipe cards only */}
      <div
        style={{
          maxWidth: '36rem',
          margin: '0 auto',
        }}
      >
        <ResultHeader
          title="Your dish suggestions"
          subtitle="Based on your leftover ingredients — scroll to see more"
        />

        {status === 'loading' && <LoadingState />}

        {status === 'error' && (
          <ErrorState
            message={errorMessage ?? undefined}
            onRetry={onRetry}
            onBackToIngredients={onBackToIngredients}
          />
        )}

        {status === 'empty' && (
          <EmptyState onBackToIngredients={onBackToIngredients} onTryAgain={onRetry} />
        )}

        {/* Scrollable list of recipe cards */}
        {status === 'success' && suggestions.length > 0 && (
          <div style={{ paddingBottom: '2rem' }}>
            {suggestions.map((suggestion, index) => (
              <RecipeCard
                key={`${suggestion.dishName}-${index}`}
                suggestion={suggestion}
                onSave={onSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
