import { useState, useRef } from 'react'
import type { Dish } from '@/types/suggestion'
import type { OutputStatus } from '@/types/suggestion'
import { AppNav } from '@/components/AppNav'
import { Sidebar } from '@/components/Sidebar'
import { AuthPage } from '@/pages/AuthPage'
import { OutputPage } from '@/pages/OutputPage'
import PrepPage from '@/pages/PrepPage'
import type { PrepPayload } from '@/pages/PrepPage'
import { runSession } from '@/lib/session'

function App() {
  const [view, setView] = useState<'input' | 'output' | 'auth'>('input')
  const [status, setStatus] = useState<OutputStatus>('success')
  const [suggestions, setSuggestions] = useState<Dish[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [savedRecipes, setSavedRecipes] = useState<Dish[]>([])
  const prepDataRef = useRef<PrepPayload | null>(null)

  const handlePrepSubmit = async (data: PrepPayload) => {
    prepDataRef.current = data
    setView('output')
    setStatus('loading')
    setSuggestions([])
    setErrorMessage(null)

    try {
      const dishes = await runSession(data)
      setSuggestions(dishes.length > 0 ? dishes : [])
      setStatus(dishes.length > 0 ? 'success' : 'empty')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  const handleBackToIngredients = () => setView('input')

  const handleSave = (recipe: Dish) => {
    const alreadySaved = savedRecipes.some((r) => r.name === recipe.name)
    if (!alreadySaved) setSavedRecipes((prev) => [...prev, recipe])
  }

  const handleRemoveSaved = (index: number) => {
    setSavedRecipes((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRetry = async () => {
    const data = prepDataRef.current
    if (!data) return
    setStatus('loading')
    try {
      const dishes = await runSession(data)
      setSuggestions(dishes.length > 0 ? dishes : [])
      setStatus(dishes.length > 0 ? 'success' : 'empty')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
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
