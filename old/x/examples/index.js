import "./counter.js";
import "./counter2.js";
import "./fullname.js";
import "./composite.js";
import "./damienComp.js";

document.body.querySelector("#counter").innerHTML = "<x-counter></x-counter>";
document.body.querySelector("#counter-attr").innerHTML =
  "<x-counter2 count=\"0\"></x-counter2>";
document.body.querySelector("#fullname").innerHTML =
  "<x-fullname></x-fullname>";

document.body.querySelector("#composite").innerHTML =
  "<x-composite></x-composite>";

document.body.querySelector("#damien-comp").innerHTML =
  "<x-damien-comp></x-damien-comp>";
