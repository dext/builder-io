import { TARGET as e } from "./server-entry-df819e6c.js";
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
