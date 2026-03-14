import { useState, useRef } from 'react'
import type { Suggestion } from '@/types/suggestion'
import type { OutputStatus } from '@/types/suggestion'
import { AppNav } from '@/components/AppNav'
import { Sidebar } from '@/components/Sidebar'
import { AuthPage } from '@/pages/AuthPage'
import { OutputPage } from '@/pages/OutputPage'
import PrepPage from '@/pages/PrepPage'
import type { PrepPayload } from '@/pages/PrepPage'

/** Build one mock suggestion; used to generate multiple variations (until API exists) */
function mockSuggestionFromIngredients(ingredientNames: string[], variant = 0): Suggestion {
  const used = ingredientNames.length > 0 ? ingredientNames : ['tomatoes', 'basil', 'eggs']
  const first = used[0] ?? 'ingredients'
  const names = used.slice(0, 3).join(', ')
  const variants: Suggestion[] = [
    {
      dishName: `${first.charAt(0).toUpperCase() + first.slice(1)} & More Bowl`,
      description: `A simple dish using ${names}${used.length > 3 ? ' and more' : ''}. Perfect for a quick special.`,
      ingredientsUsed: used,
      rationale: `Uses your leftover ${used.join(', ')} without needing new stock. Great for a limited-time special.`,
      offMenuNote: 'Off-menu special — use while supplies last.',
    },
    {
      dishName: `Kitchen Sink Frittata`,
      description: `Hearty frittata with ${names}. Ideal for brunch or a light dinner.`,
      ingredientsUsed: used,
      rationale: `Eggs and your selected ingredients come together in one pan. Minimal waste, maximum flavour.`,
      offMenuNote: 'Off-menu special — use while supplies last.',
    },
    {
      dishName: `Chef’s Choice Hash`,
      description: `Roasted hash featuring ${names}. Crispy and satisfying.`,
      ingredientsUsed: used,
      rationale: `Everything gets a quick roast or pan-fry. Works with whatever you have on hand.`,
      offMenuNote: 'Off-menu special — use while supplies last.',
    },
    {
      dishName: `Seasonal Bowl`,
      description: `Bowl built around ${names}. Fresh, flexible, and easy to scale.`,
      ingredientsUsed: used,
      rationale: `Designed to use your current ingredients as the base. Add grains or protein as you like.`,
      offMenuNote: 'Off-menu special — use while supplies last.',
    },
  ]
  return variants[variant % variants.length]!
}

/** Number of recipe cards to show on the suggestions page (scrollable list) */
const SUGGESTIONS_COUNT = 4

function App() {
  const [view, setView] = useState<'input' | 'output' | 'auth'>('input')
  const [status, setStatus] = useState<OutputStatus>('success')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [savedRecipes, setSavedRecipes] = useState<Suggestion[]>([])
  const prepDataRef = useRef<PrepPayload | null>(null)

  const handlePrepSubmit = (data: PrepPayload) => {
    prepDataRef.current = data
    const names = data.ingredients.map((i) => i.name)
    setView('output')
    setStatus('loading')
    setSuggestions([])
    setErrorMessage(null)

    // Mock API: generate multiple suggestions for scrollable list (replace with real fetch later)
    setTimeout(() => {
      const list = Array.from({ length: SUGGESTIONS_COUNT }, (_, i) =>
        mockSuggestionFromIngredients(names, i)
      )
      setSuggestions(list)
      setStatus('success')
    }, 1000)
  }

  const handleBackToIngredients = () => setView('input')

  const handleSave = (recipe: Suggestion) => {
    const alreadySaved = savedRecipes.some((r) => r.dishName === recipe.dishName)
    if (!alreadySaved) setSavedRecipes((prev) => [...prev, recipe])
  }

  const handleRemoveSaved = (index: number) => {
    setSavedRecipes((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRetry = () => {
    setStatus('loading')
    setTimeout(() => {
      const data = prepDataRef.current
      const names = data?.ingredients?.map((i) => i.name) ?? []
      setSuggestions(
        Array.from({ length: SUGGESTIONS_COUNT }, (_, i) =>
          mockSuggestionFromIngredients(names, i)
        )
      )
      setStatus('success')
    }, 600)
  }

  if (view === 'auth') {
    return <AuthPage onBack={() => setView('input')} />
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppNav
        currentStep={view === 'input' ? 1 : 2}
        onSignIn={() => setView('auth')}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar
          savedRecipes={savedRecipes}
          onRemoveSaved={handleRemoveSaved}
          onNavigateToAuth={() => setView('auth')}
        />
        <main style={{ flex: 1, width: 0, overflowY: 'auto' }}>
          {view === 'input' && <PrepPage onSubmit={handlePrepSubmit} />}
          {view === 'output' && (
            <OutputPage
              status={status}
              suggestions={suggestions}
              errorMessage={errorMessage}
              onBackToIngredients={handleBackToIngredients}
              onSave={handleSave}
              onRetry={handleRetry}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default App
