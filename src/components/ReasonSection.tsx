import type { Dish } from '@/types/suggestion'

interface ReasonSectionProps {
  dish: Dish
}

const SECTION_HEADING = 'Instructions'

function buildInstructions(dish: Dish): string[] {
  const provided = dish.instructions
  if (Array.isArray(provided) && provided.length > 0) {
    return provided.slice(0, 6).filter((s): s is string => typeof s === 'string')
  }

  const names = dish.ingredients.map((i) => i.name)
  const first = names[0]
  const second = names[1]
  const third = names[2]
  const rest = names.slice(3)
  const equipment = dish.equipmentRequired
  const hasOven = equipment.some((e) => e.toLowerCase().includes('oven'))
  const hasGrill = equipment.some((e) => e.toLowerCase().includes('grill'))

  const prepList =
    names.length <= 2
      ? names.join(' and ')
      : names.length === 3
        ? `${first}, ${second} and ${third}`
        : `${first}, ${second}, ${third}${rest.length ? ` and ${rest.length} more` : ''}`

  const steps: string[] = []

  steps.push(`Dice or chop the ${prepList} into small, even pieces.`)

  if (hasOven && !hasGrill) {
    steps.push('Preheat the oven to 200°C (400°F).')
    steps.push(`Heat a little oil in an ovenproof pan over medium heat. Add ${first}${second ? ` and ${second}` : ''} and cook for 4–5 minutes.`)
    if (names.length > 2) {
      steps.push(`Add ${third}${rest.length ? ` and the remaining ingredients` : ''} and stir. Transfer to the oven and bake until golden and cooked through, about 12–15 minutes.`)
    } else {
      steps.push('Transfer the pan to the oven and bake until golden, about 12–15 minutes.')
    }
  } else if (hasGrill) {
    steps.push('Heat the grill to medium-high.')
    steps.push(`Heat oil in a pan over medium heat. Add ${first}${second ? ` and ${second}` : ''} and cook for 4–6 minutes.`)
    if (names.length > 2) {
      steps.push(`Add ${third}${rest.length ? ` and the rest` : ''}, then grill or pan-fry until cooked through and slightly charred.`)
    } else {
      steps.push('Grill or pan-fry until cooked through and slightly charred.')
    }
  } else {
    steps.push('Heat a little oil in a pan over medium heat.')
    steps.push(`Add ${first}${second ? ` and ${second}` : ''} and cook for 4–6 minutes until starting to soften.`)
    if (names.length > 2) {
      steps.push(`Add ${third}${rest.length ? ` and the remaining ingredients` : ''} and sauté until tender.`)
    }
  }

  steps.push('Season with salt and pepper and serve hot.')

  return steps.slice(0, 6)
}

export function ReasonSection({ dish }: ReasonSectionProps) {
  const steps = buildInstructions(dish)

  return (
    <section
      style={{
        marginBottom: '1.5rem',
        padding: '1rem 1.25rem',
        background: 'var(--color-bg-card)',
        border: `1px solid var(--color-border)`,
        borderRadius: 'var(--radius-lg)',
      }}
      aria-labelledby="reason-heading"
    >
      <h3
        id="reason-heading"
        style={{
          margin: '0 0 0.5rem',
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--color-text)',
        }}
      >
        {SECTION_HEADING}
      </h3>
      <ol
        style={{
          margin: 0,
          paddingLeft: '1.25rem',
          fontSize: '0.9375rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.5,
        }}
      >
        {steps.map((step, i) => (
          <li key={i} style={{ marginBottom: '0.35rem' }}>
            {step}
          </li>
        ))}
      </ol>
    </section>
  )
}
