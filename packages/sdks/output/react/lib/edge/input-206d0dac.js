import { createElement as t } from "react";
import { isEditing as a } from "./server-entry-df819e6c.js";
function d(e) {
  return /* @__PURE__ */ t(
    "input",
    {
      ...e.attributes,
      key: a() && e.defaultValue ? e.defaultValue : "default-key",
      placeholder: e.placeholder,
      type: e.type,
      name: e.name,
      value: e.value,
      defaultValue: e.defaultValue,
      required: e.required
    }
  );
}
export {
  d as default
};
