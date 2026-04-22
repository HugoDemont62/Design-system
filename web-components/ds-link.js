/**
 * Web component <ds-link> — CustomElementRegistry (MDN).
 * Rend un <a class="link-primary|link-secondary"> pour réutiliser main.css (pas de Shadow DOM).
 */
(function () {
  "use strict";

  var VARIANTS = ["primary", "secondary"];
  var PASS_THROUGH = ["target", "rel", "download", "referrerpolicy"];

  class DSLink extends HTMLElement {
    static get observedAttributes() {
      return ["variant", "href", "target", "rel", "download", "referrerpolicy", "lang", "disabled", "class"];
    }

    constructor() {
      super();
      /** @type {HTMLAnchorElement | null} */
      this._root = null;
    }

    connectedCallback() {
      if (!this._root) {
        this._mountRoot();
      }
      this._syncFromAttributes();
    }

    attributeChangedCallback() {
      if (this._root) {
        this._syncFromAttributes();
      }
    }

    _mountRoot() {
      var el = document.createElement("a");
      while (this.firstChild) {
        el.appendChild(this.firstChild);
      }
      this.appendChild(el);
      this._root = el;
    }

    _syncFromAttributes() {
      if (!this._root) return;

      var variant = this.getAttribute("variant") || "primary";
      if (VARIANTS.indexOf(variant) === -1) variant = "primary";
      var baseClass = variant === "secondary" ? "link-secondary" : "link-primary";
      var hostClass = (this.getAttribute("class") || "").trim();
      this._root.className = hostClass ? baseClass + " " + hostClass : baseClass;

      var href = this.getAttribute("href");
      this._root.setAttribute("href", href != null ? href : "#");

      for (var i = 0; i < PASS_THROUGH.length; i++) {
        var name = PASS_THROUGH[i];
        if (this.hasAttribute(name)) {
          this._root.setAttribute(name, this.getAttribute(name));
        } else {
          this._root.removeAttribute(name);
        }
      }

      var disabled = this.hasAttribute("disabled");
      if (disabled) {
        this._root.setAttribute("aria-disabled", "true");
        this._root.setAttribute("tabindex", "-1");
      } else {
        this._root.removeAttribute("aria-disabled");
        this._root.removeAttribute("tabindex");
      }

      if (this.hasAttribute("lang")) {
        this._root.setAttribute("lang", this.getAttribute("lang"));
      } else {
        this._root.removeAttribute("lang");
      }
    }
  }

  if (!customElements.get("ds-link")) {
    customElements.define("ds-link", DSLink);
  }
})();
