import component from "../src/component.js";
import { useState, useAttribute } from "../src/hooks.js";

let fullname = component(
  "x-fullname",
  ({ firstName = "John", lastName = "Doe" } = {}) => html => {
    let [currentFirstName, setFirstName] = useState(firstName);
    let [currentLastName, setLastName] = useState(lastName);

    html.h3(`Your fullname is ${currentFirstName} ${currentLastName}`);
    html.form(
      html.input({
        placeholder: "First name",
        value: currentFirstName,
        change: ({ target }) => setFirstName(target.value)
      }),
      html.input({
        placeholder: "Last name",
        value: currentLastName,
        change: ({ target }) => setLastName(target.value)
      })
    );
  }
);

export default fullname;
