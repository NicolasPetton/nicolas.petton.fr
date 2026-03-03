const registries = new WeakMap();

class HookRegistry {
  constructor(component) {
    this._component = component;
    this._hookIndex = 0;
    this._hooks = [];
  }

  get component() {
    return this._component;
  }

  resetHookIndex() {
    this._hookIndex = 0;
  }

  use(f) {
    let hook = this._hooks[this._hookIndex];
    if (!hook) {
      hook = f();
      this._hooks.push(hook);
    }

    this._hookIndex++;
    return hook();
  }

  static get current() {
    return this._current;
  }

  static setCurrent(component) {
    this._current = this._hookRegistryFor(component);
    this._current.resetHookIndex();
  }

  static clearCurrent() {
    this._current = null;
  }

  static unregister(component) {
    if (registries.has(component)) {
      registries.delete(component);
    }
  }

  static _hookRegistryFor(component) {
    if (!registries.has(component)) {
      registries.set(component, new this(component));
    }

    return registries.get(component);
  }
}

export default HookRegistry;
