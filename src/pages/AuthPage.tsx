import { useState } from 'react'
import styles from './AuthPage.module.css'

type AuthMode = 'signin' | 'signup'

export interface AuthPageProps {
  onBack: () => void
}

function checkPasswordRequirements(password: string) {
  return {
    length: password.length >= 8,
    numberOrSymbol: /[0-9]|[^a-zA-Z0-9]/.test(password),
    upperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
  }
}

export function AuthPage({ onBack }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [retypeVisible, setRetypeVisible] = useState(false)

  const req = checkPasswordRequirements(password)
  const passwordsMatch = password === retypePassword
  const signUpValid = mode !== 'signup' || (req.length && req.numberOrSymbol && req.upperLower && passwordsMatch)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'signup' && !signUpValid) return
    if (mode === 'signup') alert('Sign up (demo). Replace with real auth.')
    else alert('Sign in (demo). Replace with real auth.')
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.card}>
          <div className={styles.backRow}>
            <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Back to PrepBrain">
              <BackIcon /> Back to PrepBrain
            </button>
            {mode === 'signup' ? (
              <span className={styles.toggleLink}>
                Already member? <a href="#" onClick={(e) => { e.preventDefault(); setMode('signin') }}>Sign in</a>
              </span>
            ) : (
              <span className={styles.toggleLink}>
                Don&apos;t have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode('signup') }}>Sign up</a>
              </span>
            )}
          </div>

          <h1 className={styles.title}>{mode === 'signup' ? 'Sign Up' : 'Sign In'}</h1>
          <p className={styles.subtitle}>
            {mode === 'signup'
              ? 'Create an account to save recipes and get suggestions.'
              : 'Welcome back to PrepBrain.'}
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon} aria-hidden><PersonIcon /></span>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            )}
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon} aria-hidden><EmailIcon /></span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon} aria-hidden><LockIcon /></span>
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
              />
              <button
                type="button"
                className={styles.inputIconRight}
                onClick={() => setPasswordVisible((v) => !v)}
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
              >
                {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {mode === 'signup' && (
              <>
                <ul className={styles.reqList}>
                  <li className={req.length ? styles.reqOk : styles.reqFail}>
                    {req.length ? <CheckIcon /> : <DotIcon />}
                    At least 8 characters
                  </li>
                  <li className={req.numberOrSymbol ? styles.reqOk : styles.reqFail}>
                    {req.numberOrSymbol ? <CheckIcon /> : <DotIcon />}
                    At least one number or symbol
                  </li>
                  <li className={req.upperLower ? styles.reqOk : styles.reqFail}>
                    {req.upperLower ? <CheckIcon /> : <DotIcon />}
                    Lowercase and uppercase
                  </li>
                </ul>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon} aria-hidden><LockIcon /></span>
                  <input
                    type={retypeVisible ? 'text' : 'password'}
                    placeholder="Re-type password"
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.inputIconRight}
                    onClick={() => setRetypeVisible((v) => !v)}
                    aria-label={retypeVisible ? 'Hide password' : 'Show password'}
                  >
                    {retypeVisible ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </>
            )}
            {mode === 'signin' && (
              <div className={styles.forgotLink}>
                <a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
              </div>
            )}
            <button type="submit" className={styles.primaryBtn} disabled={mode === 'signup' && !signUpValid}>
              {mode === 'signup' ? 'Sign Up' : 'Sign In'}
              <ArrowIcon />
            </button>
            <div className={styles.orRow}>
              <span className={styles.orLine} />
              <span className={styles.orText}>Or</span>
              <span className={styles.orLine} />
            </div>
            <div className={styles.socialRow}>
              <button type="button" className={styles.socialBtn} onClick={() => alert('Google (demo)')}>
                <GoogleIcon /> Google
              </button>
              <button type="button" className={styles.socialBtn} onClick={() => alert('Facebook (demo)')}>
                <FacebookIcon /> Facebook
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.panelCard}>
          <p className={styles.panelTitle}>Your leftovers, one dish</p>
          <p className={styles.panelText}>Enter what you have and get off-menu dish suggestions for your brunch or cafe.</p>
        </div>
        <div className={styles.panelCard}>
          <p className={styles.panelTagline}>Save recipes you love</p>
          <p className={styles.panelSub}>Keep your favourite suggestions in one place and use them when you need them.</p>
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
function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  )
}
function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  )
}
function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.7 13.3a4 4 0 0 1 5.3-5.3" />
      <path d="M17 8.5A10 10 0 0 0 2 12a10 10 0 0 0 15 7.5" />
      <path d="m2 2 20 20" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
function DotIcon() {
  return <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-text-secondary)', display: 'inline-block' }} />
}
function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}
