import component from "../src/component.js";
import counter2 from "./counter2.js";

const damienComp = component("x-damien-comp", () => {
  const count = counter2();

  return html => {
    html.render(count);
    html.render(
      html.input({
        value: count.count,
        change: evt => (count.count = evt.target.value)
      })
    );
  };
});

export default damienComp;
