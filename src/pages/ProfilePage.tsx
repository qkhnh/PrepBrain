import { useState, useEffect } from 'react'
import styles from './AuthPage.module.css'
import { supabase } from '@/lib/supabase'
import type { CafeProfile } from '@/types/profile'
import { ALL_INGREDIENTS } from '@/data/Ingredients'

interface ProfilePageProps {
  profile: CafeProfile | null
  userId: string
  onBack: () => void
  onSaved: (profile: CafeProfile) => void
}

const EQUIPMENT_OPTIONS = [
  'Stovetop', 'Oven', 'Grill', 'Sandwich grill', 'Deep fryer',
  'Blender', 'Food processor', 'Microwave', 'Steamer', 'Rice cooker',
]

const MENU_CATEGORY_OPTIONS = [
  'sandwich', 'pastry', 'porridge', 'salad', 'soup', 'toast',
  'smoothie', 'coffee', 'tea', 'juice', 'cocktail', 'dessert',
  'breakfast', 'brunch', 'lunch', 'snack', 'other',
]

function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}

export function ProfilePage({ profile, userId, onBack, onSaved }: ProfilePageProps) {
  const [cafeName, setCafeName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedEquipment, setSelectedEquipment] = useState<Set<string>>(new Set())
  const [menuItems, setMenuItems] = useState<Array<{ name: string; category: string; ingredients: string[] }>>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [ingredientSearch, setIngredientSearch] = useState<Record<number, string>>({})

  useEffect(() => {
    setCafeName(profile?.cafe_name ?? '')
    setDescription(profile?.description ?? '')
    if (profile?.equipment?.length) {
      const normalised = new Set(
        profile.equipment.map((e) => {
          const match = EQUIPMENT_OPTIONS.find((o) => o.toLowerCase() === e.toLowerCase())
          return match ?? toTitleCase(e)
        })
      )
      setSelectedEquipment(normalised)
    } else {
      setSelectedEquipment(new Set())
    }
    if (profile?.menu_items?.length) {
      setMenuItems(profile.menu_items.map((item) => ({
        name: item.name,
        category: item.category,
        ingredients: item.ingredients,
      })))
    } else {
      setMenuItems([])
    }
  }, [profile])

  const toggleEquipment = (item: string) => {
    setSelectedEquipment((prev) => {
      const next = new Set(prev)
      next.has(item) ? next.delete(item) : next.add(item)
      return next
    })
  }

  const addMenuItem = () => {
    setMenuItems((prev) => [...prev, { name: '', category: 'breakfast', ingredients: [] }])
  }

  const removeMenuItem = (index: number) => {
    setMenuItems((prev) => prev.filter((_, i) => i !== index))
  }

  const updateMenuItem = (index: number, field: 'name' | 'category', value: string) => {
    setMenuItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const removeIngredient = (menuIndex: number, ingIndex: number) => {
    setMenuItems((prev) => prev.map((item, i) => (i === menuIndex ? { ...item, ingredients: item.ingredients.filter((_, j) => j !== ingIndex) } : item)))
  }

  const handleSave = async () => {
    setSaveError(null)
    setSaving(true)

    const profileData = {
      user_id: userId,
      cafe_name: cafeName.trim() || null,
      description: description.trim() || null,
      equipment: Array.from(selectedEquipment).map((e) => e.toLowerCase()),
      updated_at: new Date().toISOString(),
      pantry_staples: profile?.pantry_staples ?? [],
      menu_items: menuItems.filter((item) => item.name.trim()).map((item) => ({
        name: item.name.trim(),
        category: item.category,
        ingredients: item.ingredients.filter((ing) => ing.trim()),
      })),
      preferences: profile?.preferences ?? { chef_notes_examples: [], avoided_ingredients: [], cuisine_style_tags: [] },
      cuisine_type: profile?.cuisine_type ?? null,
      seating_capacity: profile?.seating_capacity ?? null,
    }

    const { data, error } = await supabase
      .from('cafe_profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select()
      .single()

    setSaving(false)

    if (error) {
      setSaveError(error.message)
      return
    }

    onSaved(data as CafeProfile)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.left} style={{ flex: '1 1 100%', maxWidth: '100%' }}>
        <div className={styles.card} style={{ maxWidth: '800px' }}>
          <div className={styles.backRow}>
            <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Back">
              <BackIcon /> Back
            </button>
          </div>

          <h1 className={styles.title}>
            {(cafeName.trim() || profile?.cafe_name || 'Cafe')} Profile
          </h1>
          <p className={styles.subtitle}>
            Update your cafe name, description, equipment, and your menu.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Row 1: Cafe name and Description side by side */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px', minWidth: '200px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                  Cafe name
                </h3>
                <input
                  type="text"
                  placeholder="e.g. The Corner Cafe"
                  value={cafeName}
                  onChange={(e) => setCafeName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9375rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ flex: '2 1 400px', minWidth: '200px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                  Description
                </h3>
                <textarea
                  placeholder="Brief description of your cafe and style..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontFamily: 'inherit',
                    fontSize: '0.9375rem',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Row 2: Equipment */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                Equipment
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {EQUIPMENT_OPTIONS.map((item) => {
                  const active = selectedEquipment.has(item)
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleEquipment(item)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: active ? 'var(--color-primary)' : 'var(--color-bg-card)',
                        color: active ? '#fff' : 'var(--color-text)',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                Your menu
              </h3>
              <button
                type="button"
                onClick={addMenuItem}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--color-border)',
                  background: 'var(--color-bg-card)',
                  color: 'var(--color-primary)',
                  fontSize: '0.8125rem',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  marginBottom: '0.75rem',
                }}
              >
                + Add menu item
              </button>

              {menuItems.map((item, menuIndex) => (
                <div
                  key={menuIndex}
                  style={{
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-card)',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ flex: 1, marginRight: '0.625rem' }}>
                      <input
                        type="text"
                        placeholder="Dish name"
                        value={item.name}
                        onChange={(e) => updateMenuItem(menuIndex, 'name', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>
                    <select
                      value={item.category}
                      onChange={(e) => updateMenuItem(menuIndex, 'category', e.target.value)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        background: 'var(--color-bg-card)',
                      }}
                    >
                      {MENU_CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeMenuItem(menuIndex)}
                      style={{
                        marginLeft: '0.5rem',
                        padding: '0.3125rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-warning)',
                        background: 'transparent',
                        color: 'var(--color-warning)',
                        fontSize: '0.6875rem',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {/* Search input */}
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Search ingredients..."
                        value={ingredientSearch[menuIndex] ?? ''}
                        onChange={(e) => setIngredientSearch(prev => ({ ...prev, [menuIndex]: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.3125rem 0.4375rem',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontFamily: 'inherit',
                          marginBottom: '0.25rem',
                        }}
                      />
                      
                      {/* Filtered suggestions */}
                      {(ingredientSearch[menuIndex]?.trim() ?? '') && (() => {
                        const query = ingredientSearch[menuIndex].toLowerCase().trim()
                        const filtered = ALL_INGREDIENTS.filter(ing => 
                          ing.name.toLowerCase().includes(query) && !item.ingredients.includes(ing.name.toLowerCase())
                        ).slice(0, 6)
                        return filtered.length > 0 ? (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            zIndex: 10,
                            maxHeight: '200px',
                            overflowY: 'auto',
                          }}>
                            {filtered.map(ing => (
                              <button
                                key={ing.name}
                                type="button"
                                onClick={() => {
                                  setMenuItems(prev => prev.map((itm, i) => 
                                    i === menuIndex ? { ...itm, ingredients: [...itm.ingredients, ing.name.toLowerCase()] } : itm
                                  ))
                                  setIngredientSearch(prev => ({ ...prev, [menuIndex]: '' }))
                                }}
                                style={{
                                  display: 'block',
                                  width: '100%',
                                  padding: '0.3125rem 0.4375rem',
                                  border: 'none',
                                  background: 'transparent',
                                  textAlign: 'left',
                                  fontSize: '0.75rem',
                                  fontFamily: 'inherit',
                                  cursor: 'pointer',
                                  color: 'var(--color-text)',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                {ing.name}
                              </button>
                            ))}
                          </div>
                        ) : null
                      })()}
                    </div>
                    
                    {/* Selected ingredients as tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                      {item.ingredients.map((ing, ingIndex) => (
                        <span
                          key={ingIndex}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.375rem 0.625rem',
                            background: 'var(--color-primary)',
                            color: '#fff',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                          }}
                        >
                          {ing}
                          <button
                            type="button"
                            onClick={() => removeIngredient(menuIndex, ingIndex)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#fff',
                              padding: 0,
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              lineHeight: 1,
                              opacity: 0.8,
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {menuItems.length === 0 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  No menu items added.
                </p>
              )}
            </div>

            {saveError && (
              <p style={{ color: 'var(--color-warning)', fontSize: '0.875rem', margin: 0 }}>
                {saveError}
              </p>
            )}

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}
