import HtmlCanvas from "./HtmlCanvas.js";
import HookRegistry from "./HookRegistry.js";
import { useState } from "./hooks.js";

const attrsToProps = (component, attrs) => {
  attrs.forEach(attr => {
    Object.defineProperty(component, attr, {
      get() {
        return component.getAttribute(attr);
      },
      set(v) {
        component.setAttribute(attr, v);
      }
    });
  });
};

const component = (name, renderer, style) => {
  class Component extends HTMLElement {
    constructor(props) {
      super();

      this.attachShadow({ mode: "open" });
      this._props = props;
      this._renderable = renderer(this._props);
      attrsToProps(this, renderer.observedAttributes || []);
    }

    attributeChangedCallback(name, oldVal, newVal) {
      this.update();
    }

    connectedCallback() {
      // `connectedCallback` is called the first time before any of its custom
      // element children are upgraded. Any <child-element> is only an HTMLElement
      // when connectedCallback is called.
      setTimeout(this.update.bind(this));
    }

    disconnectedCallback() {
      HookRegistry.unregister(this);
    }

    update() {
      if (this._preventUpdates) {
        return;
      }

      this._withHookRegistry(() => {
        this._empty();

        let html = new HtmlCanvas(this.shadowRoot);

        html.render(this._renderable);

        if (style) {
          html.style(style);
        }
      });
    }

    withoutUpdating(f) {
      try {
        this._preventUpdates = true;
        f();
      } finally {
        this._preventUpdates = false;
      }
    }

    _withHookRegistry(f) {
      try {
        HookRegistry.setCurrent(this);
        f();
      } finally {
        HookRegistry.clearCurrent();
      }
    }

    _empty() {
      this._emptyElement(this.shadowRoot);
      this._emptyElement(this);
    }

    _emptyElement(element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }

    static get observedAttributes() {
      return renderer.observedAttributes;
    }
  }

  window.customElements.define(name, Component);

  return props => new Component(props);
};

export default component;
