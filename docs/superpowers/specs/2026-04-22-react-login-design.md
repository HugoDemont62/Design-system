# Design — Page de login React

**Date :** 2026-04-22

## Objectif

Réécrire la page de login en React (Vite) en réutilisant les Web Components existants (`ds-input`, `ds-button`, `ds-checkbox`, `ds-link`). Les tokens CSS, `main.css` et les WC `.js` ne bougent pas — React se pose simplement par-dessus.

## Structure des fichiers

```
react/
├── index.html           ← point d'entrée Vite, charge les WC via <script>
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx         ← ReactDOM.createRoot
    └── LoginPage.jsx    ← composant unique
```

## Architecture

- **Approche :** Web Components utilisés directement en JSX natif (pas de wrappers React).
- **Un seul composant :** `LoginPage` — pas de découpage supplémentaire.
- **CSS :** `import '../main.css'` dans `main.jsx`, bundlé par Vite.
- **WC JS :** chargés via `<script defer>` dans `index.html` avant le bundle React.

## État React

```js
const [email, setEmail]   = useState('')
const [password, setPassword] = useState('')
const [terms, setTerms]   = useState(false)
const [theme, setTheme]   = useState('light')
const [errors, setErrors] = useState({ email: '', password: '' })
```

## Validation

- Déclenchée au `blur` sur chaque champ et au `submit`.
- Email : regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- Password : longueur ≥ 8
- Terms : doit être coché pour soumettre
- Erreurs passées aux WC via `aria-invalid="true"` ; la classe `is-error` est gérée en interne par `ds-input`.

## Toggle thème

`document.body.classList.toggle('theme-dark', isDark)` piloté par le state React, via le `ds-checkbox` en variant `toggle`.

## Contenu du formulaire (fidèle au WC login existant)

- `ds-input` email
- `ds-input` password
- `ds-link` "Mot de passe oublié ?"
- `ds-checkbox` "J'accepte les conditions d'utilisation"
- `ds-button` submit (variant secondary, lang ja)
- `ds-button` lien création compte (variant primary, lang ja)
- `ds-checkbox` toggle thème sombre

## Ce qui ne change pas

- `main.css` et `main.sass`
- `web-components/ds-*.js`
- Toutes les pages HTML existantes
