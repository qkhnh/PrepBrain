const MESSAGE = 'Finding a dish for your leftovers…'

export function LoadingState() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }} role="status" aria-live="polite">
      <p
        style={{
          margin: 0,
          fontSize: '0.9375rem',
          color: 'var(--color-text-muted)',
        }}
      >
        {MESSAGE}
      </p>
      <div
        style={{
          marginTop: '1rem',
          width: '32px',
          height: '32px',
          border: '3px solid var(--color-surface)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
