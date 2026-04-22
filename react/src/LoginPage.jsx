import { useState, useRef, useEffect } from 'react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(v) {
  if (!v.trim()) return 'Veuillez entrer une adresse email valide'
  return EMAIL_RE.test(v.trim()) ? '' : 'Veuillez entrer une adresse email valide'
}

function validatePassword(v) {
  if (!v) return 'Le mot de passe doit faire au moins 8 caractères'
  return v.length >= 8 ? '' : 'Le mot de passe doit faire au moins 8 caractères'
}

export default function LoginPage() {
  const [errors, setErrors] = useState({ email: '', password: '', terms: '' })

  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const termsRef = useRef(null)
  const themeRef = useRef(null)

  // Valeurs courantes des champs (sans re-render sur chaque frappe)
  const emailVal = useRef('')
  const passwordVal = useRef('')
  const termsChecked = useRef(false)

  // Synchronise la classe is-error sur le <label> interne du ds-input
  useEffect(() => {
    const label = emailRef.current?.querySelector('label')
    if (label) label.classList.toggle('is-error', !!errors.email)
  }, [errors.email])

  useEffect(() => {
    const label = passwordRef.current?.querySelector('label')
    if (label) label.classList.toggle('is-error', !!errors.password)
  }, [errors.password])

  // Toggle password visibility — main.js n'est pas chargé dans la version React
  useEffect(() => {
    const handleToggle = e => {
      const btn = e.target.closest('.password-toggle')
      if (!btn) return
      const input = btn.closest('.password-field')?.querySelector('input')
      if (!input) return
      const show = input.type === 'password'
      input.type = show ? 'text' : 'password'
      btn.setAttribute('aria-pressed', show ? 'true' : 'false')
      btn.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe')
      const img = btn.querySelector('img')
      if (img) img.src = show ? '/oeil_ferme.svg' : '/oeil_ouvert.svg'
    }
    document.addEventListener('click', handleToggle)
    return () => document.removeEventListener('click', handleToggle)
  }, [])

  // Branche tous les événements DOM une seule fois après le premier mount
  useEffect(() => {
    const emailEl = emailRef.current
    const passwordEl = passwordRef.current
    const termsEl = termsRef.current
    const themeEl = themeRef.current

    const onEmailInput    = e => { emailVal.current = e.target.value }
    const onPasswordInput = e => { passwordVal.current = e.target.value }
    const onEmailBlur     = () => setErrors(prev => ({ ...prev, email: validateEmail(emailVal.current) }))
    const onPasswordBlur  = () => setErrors(prev => ({ ...prev, password: validatePassword(passwordVal.current) }))
    const onTermsChange   = e => {
      termsChecked.current = e.target.checked
      if (e.target.checked) setErrors(prev => ({ ...prev, terms: '' }))
    }
    const onThemeChange   = e => document.body.classList.toggle('theme-dark', e.target.checked)

    emailEl?.addEventListener('input', onEmailInput)
    emailEl?.addEventListener('focusout', onEmailBlur)
    passwordEl?.addEventListener('input', onPasswordInput)
    passwordEl?.addEventListener('focusout', onPasswordBlur)
    termsEl?.addEventListener('change', onTermsChange)
    themeEl?.addEventListener('change', onThemeChange)

    return () => {
      emailEl?.removeEventListener('input', onEmailInput)
      emailEl?.removeEventListener('focusout', onEmailBlur)
      passwordEl?.removeEventListener('input', onPasswordInput)
      passwordEl?.removeEventListener('focusout', onPasswordBlur)
      termsEl?.removeEventListener('change', onTermsChange)
      themeEl?.removeEventListener('change', onThemeChange)
    }
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    const emailErr    = validateEmail(emailVal.current)
    const passwordErr = validatePassword(passwordVal.current)
    const termsErr    = termsChecked.current ? '' : 'Vous devez accepter les conditions d\'utilisation'
    setErrors({ email: emailErr, password: passwordErr, terms: termsErr })
    if (emailErr || passwordErr || termsErr) return
    console.log('Login :', emailVal.current)
  }

  return (
    <div className="login-page">
      <section className="login-form-panel">
        <h1 className="login-title">Connexion</h1>

        <form id="login-form" className="login-fields" noValidate onSubmit={handleSubmit}>

          <ds-input
            ref={emailRef}
            data-field="email"
            label="Adresse email"
            helper="Votre adresse email de connexion"
            placeholder="vous@exemple.com"
            field-id="login-email-react"
            type="text"
            required=""
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            data-error="Veuillez entrer une adresse email valide"
            aria-invalid={errors.email ? 'true' : 'false'}
          />

          <ds-input
            ref={passwordRef}
            data-field="password"
            label="Mot de passe"
            helper="8 caractères minimum"
            placeholder="password"
            field-id="login-password-react"
            type="password"
            required=""
            minlength="8"
            data-error="Le mot de passe doit faire au moins 8 caractères"
            aria-invalid={errors.password ? 'true' : 'false'}
          />

          <ds-link href="#" variant="primary" class="login-forgot">
            Mot de passe oublié ?
          </ds-link>

          <ds-checkbox
            ref={termsRef}
            class="login-terms"
            label="J'accepte les conditions d'utilisation"
            field-id="login-terms-react"
            required=""
          />
          {errors.terms && (
            <small className="terms-error" role="alert">{errors.terms}</small>
          )}

          <div className="login-actions">
            <ds-button type="submit" variant="secondary" lang="ja">ログイン</ds-button>
            <ds-button href="#" variant="primary" lang="ja">アカウントを作成</ds-button>
          </div>

        </form>

        <div className="login-theme-toggle">
          <ds-checkbox
            ref={themeRef}
            variant="toggle"
            field-id="theme-toggle-react"
            label="Mode sombre"
          />
        </div>

      </section>

      <aside className="login-visual" aria-hidden="true">
        <h2 className="login-visual-quote">Design<br />System</h2>
        <p className="login-visual-sub">Tokens · Composants · UI</p>
      </aside>
    </div>
  )
}
