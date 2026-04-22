# React Login Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer une app React/Vite dans `react/` qui reproduit la page de login en réutilisant les Web Components existants (`ds-input`, `ds-button`, `ds-checkbox`, `ds-link`).

**Architecture:** Vite avec `root` pointant vers la racine du projet (`C:/wamp64/www/DS/`) pour servir `main.css` et `web-components/*.js` sans les déplacer. Les WC sont chargés via `<script>` dans `index.html` (avant React). Un seul composant React `LoginPage` gère tout l'état et la validation via des `ref`s sur les custom elements.

**Tech Stack:** React 19, Vite 6, @vitejs/plugin-react — zéro TypeScript, zéro autre dépendance.

---

## Fichiers à créer

| Fichier | Rôle |
|---|---|
| `react/package.json` | Config npm + scripts Vite |
| `react/vite.config.js` | Root = `..`, entry = `react/index.html` |
| `react/index.html` | HTML Vite : charge `main.css` + WC scripts |
| `react/src/main.jsx` | ReactDOM.createRoot |
| `react/src/LoginPage.jsx` | Composant unique — état, validation, JSX WC |

Fichiers **non modifiés** : `main.css`, `main.sass`, `web-components/*.js`, toutes les pages HTML existantes.

---

### Task 1 : Scaffold Vite + React

**Files:**
- Create: `react/package.json`
- Create: `react/vite.config.js`

- [ ] **Step 1 : Créer `react/package.json`**

```json
{
  "name": "ds-react-login",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.3.2"
  }
}
```

- [ ] **Step 2 : Installer les dépendances**

Depuis `react/` :
```bash
npm install
```
Expected : dossier `react/node_modules` créé, aucune erreur.

- [ ] **Step 3 : Créer `react/vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: path.resolve(__dirname, '..'),
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    }
  },
  server: {
    open: '/react/'
  }
})
```

> `root: '..'` expose tout `C:/wamp64/www/DS/` au serveur Vite : `main.css` répond à `/main.css`, les WC répondent à `/web-components/ds-*.js`, les SVG répondent à `/oeil_ouvert.svg` etc.

- [ ] **Step 4 : Commit**

```bash
git add react/package.json react/package-lock.json react/vite.config.js
git commit -m "feat: scaffold Vite + React project in react/"
```

---

### Task 2 : Créer `react/index.html`

**Files:**
- Create: `react/index.html`

- [ ] **Step 1 : Créer `react/index.html`**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Connexion — Design System (React)</title>
  <link rel="stylesheet" href="/main.css">
  <script src="/web-components/ds-button.js" defer></script>
  <script src="/web-components/ds-link.js" defer></script>
  <script src="/web-components/ds-input.js" defer></script>
  <script src="/web-components/ds-checkbox.js" defer></script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./src/main.jsx"></script>
</body>
</html>
```

> Les WC sont chargés en `defer` (avant React) pour que `customElements.define()` s'exécute avant le premier render. `document.currentScript` fonctionne correctement car les scripts sont dans des balises `<script>` séparées, non bundlées — les SVG du password toggle seront résolus depuis `/oeil_ouvert.svg`.

- [ ] **Step 2 : Commit**

```bash
git add react/index.html
git commit -m "feat: add Vite entry HTML with WC scripts and main.css"
```

---

### Task 3 : Créer `react/src/main.jsx`

**Files:**
- Create: `react/src/main.jsx`

- [ ] **Step 1 : Créer `react/src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginPage from './LoginPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LoginPage />
  </React.StrictMode>
)
```

- [ ] **Step 2 : Vérifier que Vite démarre sans erreur**

Depuis `react/` :
```bash
npm run dev
```
Expected : le serveur démarre sur `http://localhost:5173`, ouvre `/react/` dans le navigateur. La page est blanche (LoginPage pas encore créé) mais sans erreur dans la console.

- [ ] **Step 3 : Commit**

```bash
git add react/src/main.jsx
git commit -m "feat: add React entry point"
```

---

### Task 4 : Créer `react/src/LoginPage.jsx`

**Files:**
- Create: `react/src/LoginPage.jsx`

- [ ] **Step 1 : Créer `react/src/LoginPage.jsx`**

```jsx
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
  const [errors, setErrors] = useState({ email: '', password: '' })

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
    const onTermsChange   = e => { termsChecked.current = e.target.checked }
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
    setErrors({ email: emailErr, password: passwordErr })
    if (emailErr || passwordErr || !termsChecked.current) return
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
```

> **Pourquoi `ref` + `addEventListener` plutôt que `onInput` JSX ?** Les custom elements sans Shadow DOM font buller les événements normalement, mais React 18/19 a un comportement inconsistant avec `onChange` sur les custom elements (ne mappe pas toujours sur `change`). Les refs garantissent le bon listener natif dans tous les cas.
>
> **Pourquoi `emailVal.current` ?** Évite de dépendre de la closure state dans les handlers `focusout`, ce qui éviterait de recréer les listeners à chaque frappe.
>
> **Pourquoi `required=""`** et non `required` seul ? React transmet les booléens `true` comme attribut vide `""` sur les custom elements — cohérent avec l'API HTML des WC.

- [ ] **Step 2 : Commit**

```bash
git add react/src/LoginPage.jsx
git commit -m "feat: add LoginPage React component with WC integration"
```

---

### Task 5 : Vérification dans le navigateur

- [ ] **Step 1 : Lancer le serveur de dev**

Depuis `react/` :
```bash
npm run dev
```
Naviguer sur `http://localhost:5173/react/`

- [ ] **Step 2 : Vérifier le rendu visuel**

Checklist :
- [ ] La page ressemble à `web-components/login-web-components.html`
- [ ] `main.css` est bien chargé (tokens de couleur, typo, layout deux colonnes)
- [ ] Les deux champs `ds-input` s'affichent avec leur label et helper text
- [ ] Le champ mot de passe a bien le bouton œil

- [ ] **Step 3 : Vérifier la validation**

- [ ] Cliquer "ログイン" sans rien remplir → les deux champs passent en état erreur (classe `is-error`, message d'erreur sous le champ)
- [ ] Entrer un email invalide puis sortir du champ → message d'erreur email
- [ ] Entrer un email valide → message d'erreur disparaît
- [ ] Entrer un mot de passe < 8 caractères puis sortir → message d'erreur password
- [ ] Entrer 8+ caractères → message disparaît

- [ ] **Step 4 : Vérifier le toggle password**

- [ ] Cliquer l'œil → le mot de passe est visible, l'icône change
- [ ] Recliquer → le mot de passe est masqué

- [ ] **Step 5 : Vérifier le toggle thème**

- [ ] Cocher "Mode sombre" → `document.body` reçoit la classe `theme-dark`, la page passe en thème sombre
- [ ] Décocher → thème clair restauré

- [ ] **Step 6 : Commit final**

```bash
git add .
git commit -m "feat: React login page using DS web components — Vite setup complete"
```
