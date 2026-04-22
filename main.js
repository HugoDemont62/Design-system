(function () {
  // ── Password toggle ──────────────────────────────────────
  /** Répertoire de main.js (SVG à côté), pour que les pages dans un sous-dossier (ex. web-components/) chargent les bons fichiers. */
  function mainScriptBase() {
    var el = document.currentScript;
    if (el && el.src) return el.src.replace(/[^/]+$/, "");
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].src;
      if (src && /\/main\.js(\?|$)/.test(src)) return src.replace(/[^/]+$/, "");
    }
    return "";
  }

  var _iconBase = mainScriptBase();

  function isDarkTheme() {
    return document.body.classList.contains("theme-dark");
  }

  function openIconPath() {
    return _iconBase + (isDarkTheme() ? "oeil_ouvert_blanc.svg" : "oeil_ouvert.svg");
  }

  function closedIconPath() {
    return _iconBase + (isDarkTheme() ? "oeil_ferme_blanc.svg" : "oeil_ferme.svg");
  }

  function refreshPasswordToggleIcons() {
    document.querySelectorAll(".password-toggle").forEach(function (button) {
      var icon = button.querySelector("img");
      if (!icon) return;
      var visible = button.getAttribute("aria-pressed") === "true";
      icon.setAttribute("src", visible ? closedIconPath() : openIconPath());
    });
  }

  function resolvePasswordInput(button) {
    var targetId = button.getAttribute("aria-controls") || button.getAttribute("data-target");
    if (targetId) {
      var targetInput = document.getElementById(targetId);
      if (targetInput && targetInput.tagName === "INPUT") return targetInput;
    }
    var fieldWrapper = button.closest(".password-field");
    return fieldWrapper ? fieldWrapper.querySelector("input") : null;
  }

  function handleToggleClick(button) {
    var passwordInput = resolvePasswordInput(button);
    var icon = button.querySelector("img");
    if (!passwordInput || (passwordInput.type !== "password" && passwordInput.type !== "text")) return;
    var showPassword = passwordInput.type === "password";
    passwordInput.type = showPassword ? "text" : "password";
    button.setAttribute("aria-pressed", showPassword ? "true" : "false");
    button.setAttribute("aria-label", showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe");
    if (icon) icon.setAttribute("src", showPassword ? closedIconPath() : openIconPath());
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest(".password-toggle")) {
      handleToggleClick(e.target.closest(".password-toggle"));
    }
  });

  // ── Form validation ──────────────────────────────────────
  function setFieldErrorState(input, hasError) {
    var label = input.closest("label");
    if (!label) return;
    var helper = label.querySelector("small");
    var defaultText = helper ? helper.getAttribute("data-default-text") || helper.textContent : "";
    var customError = input.getAttribute("data-error");
    input.setAttribute("aria-invalid", hasError ? "true" : "false");
    label.classList.toggle("is-error", hasError);
    if (helper) helper.textContent = hasError ? (customError || input.validationMessage || defaultText) : defaultText;
  }

  function validateInput(input) {
    var value = input.value.trim();
    if (value.length === 0) { setFieldErrorState(input, false); return true; }
    var isValid = input.checkValidity();
    setFieldErrorState(input, !isValid);
    return isValid;
  }

  document.querySelectorAll("form input[type='text'], form input[type='password']").forEach(function (input) {
    input.addEventListener("input", function () { validateInput(input); });
    input.addEventListener("blur", function () { validateInput(input); });
    setFieldErrorState(input, false);
  });

  document.querySelectorAll("form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      var hasInvalid = false;
      form.querySelectorAll("input[type='text'], input[type='password']").forEach(function (input) {
        if (!validateInput(input)) hasInvalid = true;
      });
      if (hasInvalid) event.preventDefault();
    });
  });

  // ── Indeterminate checkboxes ─────────────────────────────
  document.querySelectorAll("input[type='checkbox'][data-indeterminate]").forEach(function (cb) {
    cb.indeterminate = true;
  });

  // ── Theme toggle ─────────────────────────────────────────
  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    var saved = localStorage.getItem("ds-theme");
    if (saved === "dark") {
      document.body.classList.add("theme-dark");
      themeToggle.checked = true;
    }
    refreshPasswordToggleIcons();
    themeToggle.addEventListener("change", function () {
      if (themeToggle.checked) {
        document.body.classList.add("theme-dark");
        localStorage.setItem("ds-theme", "dark");
      } else {
        document.body.classList.remove("theme-dark");
        localStorage.setItem("ds-theme", "light");
      }
      refreshPasswordToggleIcons();
    });
  } else {
    refreshPasswordToggleIcons();
  }
})();
