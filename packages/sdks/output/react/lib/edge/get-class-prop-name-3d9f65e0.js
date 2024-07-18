import { TARGET as e } from "./server-entry-895605b0.js";
const a = () => {
  switch (e) {
    case "react":
    case "reactNative":
    case "rsc":
      return "className";
    case "svelte":
    case "vue":
    case "solid":
    case "qwik":
      return "class";
  }
};
export {
  a as getClassPropName
};
