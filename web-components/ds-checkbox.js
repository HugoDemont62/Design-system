/**
 * Web component <ds-checkbox> — case à cocher ou toggle (même markup / classes que la doc).
 * variant="toggle" → .toggle + .toggle__track + .toggle__label
 * Sinon → .checkbox + .checkbox__box + .checkbox__label
 */
(function () {
  "use strict";

  class DSCheckbox extends HTMLElement {
    static get observedAttributes() {
      return [
        "variant",
        "label",
        "field-id",
        "name",
        "checked",
        "disabled",
        "required",
        "class",
        "indeterminate",
        "aria-label",
      ];
    }

    constructor() {
      super();
      /** @type {HTMLLabelElement | null} */
      this._labelEl = null;
      /** @type {HTMLInputElement | null} */
      this._input = null;
      /** @type {HTMLSpanElement | null} */
      this._labelSpan = null;
    }

    connectedCallback() {
      if (!this._labelEl) {
        this._build();
      }
      this._syncFromAttributes();
      this._syncCheckedFromHost();
      this._applyIndeterminate();
    }

    attributeChangedCallback(name) {
      if (!this._labelEl || !this._input) return;

      if (name === "variant") {
        this._updateVariantStructure();
      }
      if (name === "checked") {
        this._syncCheckedFromHost();
      }
      if (name === "indeterminate") {
        this._applyIndeterminate();
      }

      this._syncFromAttributes();
    }

    _getVariant() {
      return (this.getAttribute("variant") || "checkbox").toLowerCase() === "toggle"
        ? "toggle"
        : "checkbox";
    }

    _build() {
      this._labelEl = document.createElement("label");
      this._input = document.createElement("input");
      this._input.type = "checkbox";
      this._labelEl.appendChild(this._input);
      this.appendChild(this._labelEl);
      this._updateVariantStructure();
    }

    _updateVariantStructure() {
      var n = this._input.nextSibling;
      while (n) {
        var next = n.nextSibling;
        n.remove();
        n = next;
      }
      this._labelSpan = null;

      if (this._getVariant() === "toggle") {
        var track = document.createElement("span");
        track.className = "toggle__track";
        var lbl = document.createElement("span");
        lbl.className = "toggle__label";
        this._labelEl.appendChild(track);
        this._labelEl.appendChild(lbl);
        this._labelSpan = lbl;
      } else {
        var box = document.createElement("span");
        box.className = "checkbox__box";
        var lbl = document.createElement("span");
        lbl.className = "checkbox__label";
        this._labelEl.appendChild(box);
        this._labelEl.appendChild(lbl);
        this._labelSpan = lbl;
      }
    }

    _syncLabelClass() {
      var base = this._getVariant() === "toggle" ? "toggle" : "checkbox";
      var extra = (this.getAttribute("class") || "").trim();
      this._labelEl.className = extra ? base + " " + extra : base;
    }

    _syncCheckedFromHost() {
      this._input.checked = this.hasAttribute("checked");
    }

    _applyIndeterminate() {
      if (this.hasAttribute("indeterminate")) {
        this._input.setAttribute("data-indeterminate", "");
        this._input.indeterminate = true;
      } else {
        this._input.removeAttribute("data-indeterminate");
        this._input.indeterminate = false;
      }
    }

    _syncFromAttributes() {
      if (!this._labelEl || !this._input) return;

      this._syncLabelClass();

      var labelText = this.getAttribute("label");
      if (this._labelSpan) {
        this._labelSpan.textContent = labelText != null ? labelText : "";
      }

      if (this.hasAttribute("field-id")) {
        this._input.id = this.getAttribute("field-id");
      } else {
        this._input.removeAttribute("id");
      }

      if (this.hasAttribute("name")) {
        this._input.setAttribute("name", this.getAttribute("name"));
      } else {
        this._input.removeAttribute("name");
      }

      if (this.hasAttribute("aria-label")) {
        this._input.setAttribute("aria-label", this.getAttribute("aria-label"));
      } else {
        this._input.removeAttribute("aria-label");
      }

      this._input.disabled = this.hasAttribute("disabled");
      this._input.required = this.hasAttribute("required");
    }
  }

  if (!customElements.get("ds-checkbox")) {
    customElements.define("ds-checkbox", DSCheckbox);
  }
})();
