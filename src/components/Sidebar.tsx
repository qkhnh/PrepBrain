import type { Suggestion } from '@/types/suggestion'
import styles from './Sidebar.module.css'

interface SidebarProps {
  savedRecipes: Suggestion[]
  onRemoveSaved?: (index: number) => void
  onNavigateToAuth?: () => void
}

export function Sidebar({ savedRecipes, onRemoveSaved, onNavigateToAuth }: SidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Sidebar">
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Saved recipes</h2>
        {savedRecipes.length === 0 ? (
          <p className={styles.empty}>No saved recipes yet. Save a suggestion to see it here.</p>
        ) : (
          <ul className={styles.list}>
            {savedRecipes.map((recipe, index) => (
              <li key={`${recipe.dishName}-${index}`}>
                <div className={styles.item}>
                  <span className={styles.itemName} title={recipe.dishName}>
                    {recipe.dishName}
                  </span>
                  {onRemoveSaved && (
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => onRemoveSaved(index)}
                      title="Remove from saved"
                      aria-label={`Remove ${recipe.dishName} from saved`}
                    >
                      ×
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Account</h2>
        <div
          className={`${styles.accountBlock} ${onNavigateToAuth ? styles.accountBlockClickable : ''}`}
          role={onNavigateToAuth ? 'button' : undefined}
          tabIndex={onNavigateToAuth ? 0 : undefined}
          onClick={onNavigateToAuth}
          onKeyDown={onNavigateToAuth ? (e) => { if (e.key === 'Enter' || e.key === ' ') onNavigateToAuth() } : undefined}
        >
          <p className={styles.accountText}>Sign in or create an account</p>
          <span className={styles.accountLink}>
            Account settings
          </span>
        </div>
      </div>
    </aside>
  )
}
