import { jsx as l } from "react/jsx-runtime";
import { Blocks as i } from "./blocks-83caba33.js";
import "react";
import "./server-entry-df819e6c.js";
import "./get-class-prop-name-775bd8d0.js";
function u(t) {
  var e, o, n;
  return /* @__PURE__ */ l(
    "div",
    {
      style: {
        pointerEvents: "auto"
      },
      ...!((e = t.builderContext.context) != null && e.symbolId) && {
        "builder-slot": t.name
      },
      children: /* @__PURE__ */ l(
        i,
        {
          parent: (o = t.builderContext.context) == null ? void 0 : o.symbolId,
          path: `symbol.data.${t.name}`,
          context: t.builderContext,
          blocks: (n = t.builderContext.rootState) == null ? void 0 : n[t.name]
        }
      )
    }
  );
}
export {
  u as default
};
