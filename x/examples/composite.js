import component from "../src/component.js";
import counter from "./counter.js";

const wrapper = component("x-wrapper", ({ children = [] } = {}) => html => {
  html.h3("Parent component with children");
  html.render(children);
});

const composite = component("x-composite", () => html =>
  html.render(wrapper({ children: [counter(), counter()] }))
);

export default composite;
