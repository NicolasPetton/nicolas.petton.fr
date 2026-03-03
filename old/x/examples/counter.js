import component from "../src/component.js";
import { useState, useAttribute } from "../src/hooks.js";

let counter = component("x-counter", ({ count = 0 } = {}) => html => {
  let [currentCount, setCount] = useState(count);

  html.h2(currentCount);
  html.button({ click: () => setCount(currentCount + 1) }, "++");
  html.button({ click: () => setCount(currentCount - 1) }, "--");
});

export default counter;
