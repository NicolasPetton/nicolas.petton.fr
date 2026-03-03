import component from "../src/component.js";
import { useState, useAttribute } from "../src/hooks.js";

let counter = ({ initialCount = 0 } = {}) => html => {
  let [count, setCount] = useAttribute("count", initialCount);

  html.h2(count);
  html.button({ click: () => setCount(Number(count) + 1) }, "++");
  html.button({ click: () => setCount(Number(count) - 1) }, "--");
};

counter.observedAttributes = ["count"];

export default component("x-counter2", counter);
