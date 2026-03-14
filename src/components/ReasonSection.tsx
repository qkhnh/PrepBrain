interface ReasonSectionProps {
  rationale: string
}

const SECTION_HEADING = 'Why this works'

export function ReasonSection({ rationale }: ReasonSectionProps) {
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
      <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--color-text-muted)' }}>
        {rationale}
      </p>
    </section>
  )
}
