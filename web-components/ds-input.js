/**
 * Web component <ds-input> — champ texte ou mot de passe (même markup que la doc input).
 * Pas de Shadow DOM : styles main.css sur <label> / input / .password-field.
 */
(function () {
  "use strict";

  var uid = 0;

  function scriptDir() {
    var el = document.currentScript;
    if (el && el.src) return el.src.replace(/[^/]*$/, "");
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
      var s = scripts[i].src;
      if (s && /\/ds-input\.js(\?|$)/.test(s)) return s.replace(/[^/]*$/, "");
    }
    return "";
  }

  var _scriptDir = scriptDir();

  function assetUrl(file) {
    if (!_scriptDir) return "../" + file;
    try {
      return new URL("../" + file, _scriptDir).href;
    } catch (e) {
      return "../" + file;
    }
  }

  class DSInput extends HTMLElement {
    static get observedAttributes() {
      return [
        "label",
        "helper",
        "placeholder",
        "type",
        "field-id",
        "name",
        "value",
        "required",
        "pattern",
        "minlength",
        "maxlength",
        "disabled",
        "autocomplete",
        "class",
        "data-field",
        "data-error",
        "inputmode",
        "aria-invalid",
      ];
    }

    constructor() {
      super();
      /** @type {HTMLLabelElement | null} */
      this._labelEl = null;
      /** @type {HTMLSpanElement | null} */
      this._span = null;
      /** @type {HTMLSmallElement | null} */
      this._small = null;
      /** @type {HTMLInputElement | null} */
      this._input = null;
      /** @type {HTMLButtonElement | null} */
      this._toggleBtn = null;
      /** @type {"text" | "password" | null} */
      this._kind = null;
      /** @type {string} */
      this._resolvedFieldId = "";
    }

    connectedCallback() {
      if (!this._labelEl) {
        this._build();
      }
      this._syncFromAttributes();
    }

    attributeChangedCallback() {
      if (!this._labelEl) return;
      var typeNow = (this.getAttribute("type") || "text").toLowerCase() === "password" ? "password" : "text";
      if (this._kind !== typeNow) {
        this._rebuildMiddle(typeNow);
      }
      this._syncFromAttributes();
    }

    _build() {
      this._labelEl = document.createElement("label");
      this._span = document.createElement("span");
      this._small = document.createElement("small");
      this._labelEl.appendChild(this._span);
      this._labelEl.appendChild(this._small);
      this.appendChild(this._labelEl);

      var kind = (this.getAttribute("type") || "text").toLowerCase() === "password" ? "password" : "text";
      this._rebuildMiddle(kind);
    }

    _ensureFieldId() {
      var fromHost = this.getAttribute("field-id");
      if (fromHost) {
        this._resolvedFieldId = fromHost;
        return;
      }
      if (!this._resolvedFieldId) {
        this._resolvedFieldId = "ds-input-" + String(++uid);
      }
    }

    _rebuildMiddle(kind) {
      var hadFocus = this._input && document.activeElement === this._input;
      var prevValue = this._input ? this._input.value : "";

      if (this._input && this._kind === "password" && this._input.parentNode) {
        this._input.closest(".password-field").remove();
      } else if (this._input && this._kind === "text") {
        this._input.remove();
      }

      this._toggleBtn = null;
      this._input = null;
      this._kind = kind;

      if (kind === "password") {
        var wrap = document.createElement("span");
        wrap.className = "password-field";
        var input = document.createElement("input");
        input.type = "password";
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "password-toggle";
        btn.setAttribute("aria-pressed", "false");
        btn.setAttribute("aria-label", "Afficher le mot de passe");
        var img = document.createElement("img");
        img.alt = "";
        img.src = assetUrl("oeil_ouvert.svg");
        btn.appendChild(img);
        wrap.appendChild(input);
        wrap.appendChild(btn);
        this._labelEl.insertBefore(wrap, this._small);
        this._input = input;
        this._toggleBtn = btn;
      } else {
        var textInput = document.createElement("input");
        textInput.type = "text";
        this._labelEl.insertBefore(textInput, this._small);
        this._input = textInput;
      }

      this._ensureFieldId();
      this._input.id = this._resolvedFieldId;
      if (this._toggleBtn) {
        this._toggleBtn.setAttribute("aria-controls", this._resolvedFieldId);
      }

      if (prevValue) this._input.value = prevValue;
      if (hadFocus) this._input.focus();
    }

    _syncLabelClasses() {
      var hadError = this._labelEl.classList.contains("is-error");
      var hostClass = (this.getAttribute("class") || "").trim();
      this._labelEl.className = hostClass;
      if (hadError) this._labelEl.classList.add("is-error");
    }

    _syncFromAttributes() {
      if (!this._labelEl || !this._input) return;

      this._syncLabelClasses();

      var labelText = this.getAttribute("label");
      this._span.textContent = labelText != null ? labelText : "";

      var helper = this.getAttribute("helper");
      if (helper != null) {
        this._small.textContent = helper;
        this._small.setAttribute("data-default-text", helper);
      } else {
        this._small.textContent = "";
        this._small.removeAttribute("data-default-text");
      }

      if (this.hasAttribute("data-field")) {
        this._labelEl.setAttribute("data-field", this.getAttribute("data-field"));
      } else {
        this._labelEl.removeAttribute("data-field");
      }

      this._ensureFieldId();
      this._input.id = this._resolvedFieldId;
      if (this._toggleBtn) {
        this._toggleBtn.setAttribute("aria-controls", this._resolvedFieldId);
      }

      var ph = this.getAttribute("placeholder");
      if (ph != null) this._input.setAttribute("placeholder", ph);
      else this._input.removeAttribute("placeholder");

      if (this.hasAttribute("name")) this._input.setAttribute("name", this.getAttribute("name"));
      else this._input.removeAttribute("name");

      if (this.hasAttribute("value")) {
        this._input.value = this.getAttribute("value");
      }

      if (this.hasAttribute("pattern")) this._input.setAttribute("pattern", this.getAttribute("pattern"));
      else this._input.removeAttribute("pattern");

      if (this.hasAttribute("minlength")) this._input.setAttribute("minlength", this.getAttribute("minlength"));
      else this._input.removeAttribute("minlength");

      if (this.hasAttribute("maxlength")) this._input.setAttribute("maxlength", this.getAttribute("maxlength"));
      else this._input.removeAttribute("maxlength");

      if (this.hasAttribute("autocomplete")) this._input.setAttribute("autocomplete", this.getAttribute("autocomplete"));
      else this._input.removeAttribute("autocomplete");

      if (this.hasAttribute("inputmode")) this._input.setAttribute("inputmode", this.getAttribute("inputmode"));
      else this._input.removeAttribute("inputmode");

      if (this.hasAttribute("data-error")) this._input.setAttribute("data-error", this.getAttribute("data-error"));
      else this._input.removeAttribute("data-error");

      if (this.hasAttribute("aria-invalid")) {
        this._input.setAttribute("aria-invalid", this.getAttribute("aria-invalid"));
      }

      this._input.required = this.hasAttribute("required");
      this._input.disabled = this.hasAttribute("disabled");
    }
  }

  if (!customElements.get("ds-input")) {
    customElements.define("ds-input", DSInput);
  }
})();
