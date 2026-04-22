/**
 * Web component <ds-button> — API CustomElementRegistry (MDN).
 * Rend un <button> ou un <a> avec les classes du design system (main.css)
 * pour conserver les variables SASS/CSS existantes (pas de Shadow DOM).
 */
(function () {
  "use strict";

  var VARIANTS = ["primary", "secondary", "tertiary"];

  class DSButton extends HTMLElement {
    static get observedAttributes() {
      return ["variant", "size", "disabled", "href", "type", "lang"];
    }

    constructor() {
      super();
      /** @type {HTMLButtonElement | HTMLAnchorElement | null} */
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
      var el = this.hasAttribute("href")
        ? document.createElement("a")
        : document.createElement("button");

      while (this.firstChild) {
        el.appendChild(this.firstChild);
      }
      this.appendChild(el);
      this._root = el;
    }

    _rebuildRootIfNeeded() {
      var needAnchor = this.hasAttribute("href");
      var isAnchor = this._root && this._root.tagName === "A";
      if (needAnchor === isAnchor) return;

      var next = needAnchor ? document.createElement("a") : document.createElement("button");
      while (this._root.firstChild) {
        next.appendChild(this._root.firstChild);
      }
      this._root.replaceWith(next);
      this._root = next;
    }

    _syncFromAttributes() {
      if (!this._root) return;

      this._rebuildRootIfNeeded();

      var variant = this.getAttribute("variant") || "primary";
      if (VARIANTS.indexOf(variant) === -1) variant = "primary";

      var size = this.getAttribute("size");
      var className = "btn-" + variant;
      if (size === "sm") className += " btn-sm";
      this._root.className = className;

      var disabled = this.hasAttribute("disabled");

      if (this._root.tagName === "A") {
        var href = this.getAttribute("href");
        this._root.setAttribute("href", href || "#");
        if (disabled) {
          this._root.setAttribute("aria-disabled", "true");
          this._root.setAttribute("tabindex", "-1");
        } else {
          this._root.removeAttribute("aria-disabled");
          this._root.removeAttribute("tabindex");
        }
      } else {
        this._root.type = this.getAttribute("type") || "button";
        this._root.disabled = disabled;
      }

      if (this.hasAttribute("lang")) {
        this._root.setAttribute("lang", this.getAttribute("lang"));
      } else {
        this._root.removeAttribute("lang");
      }
    }
  }

  if (!customElements.get("ds-button")) {
    customElements.define("ds-button", DSButton);
  }
})();
