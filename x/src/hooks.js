import HookRegistry from "./HookRegistry.js";

export const useCallback = f => {
  return HookRegistry.current.use(() => {
    f();
    return () => {};
  });
};

export const useState = initialState => {
  return HookRegistry.current.use(() => {
    let state = initialState;
    let component = HookRegistry.current.component;

    return () => {
      return [
        state,
        value => {
          state = value;
          component.update();
        }
      ];
    };
  });
};

export const useAttribute = (name, initialValue) => {
  let component = HookRegistry.current.component;

  useCallback(() => {
    if (initialValue !== undefined) {
      component.withoutUpdating(() => {
        component.setAttribute(name, initialValue);
      });
    }
  });

  return [
    component.getAttribute(name),
    component.setAttribute.bind(component, name),
    component.removeAttribute.bind(component, name)
  ];
};

export const useAsync = promise => {
  const [pending, setPending] = useState(true);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  useCallback(() => {
    promise
      .then(setValue)
      .catch(setError)
      .finally(() => setPending(false));
  });

  return {
    value,
    error,
    pending
  };
};
