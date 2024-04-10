import { jsx as l } from "react/jsx-runtime";
import { createElement as u } from "react";
import { isEditing as m } from "./server-entry-df819e6c.js";
function d(e) {
  var t;
  return /* @__PURE__ */ u(
    "select",
    {
      ...e.attributes,
      value: e.value,
      key: m() && e.defaultValue ? e.defaultValue : "default-key",
      defaultValue: e.defaultValue,
      name: e.name
    },
    (t = e.options) == null ? void 0 : t.map((a) => /* @__PURE__ */ l("option", { value: a.value, children: a.name || a.value }))
  );
}
export {
  d as default
};
