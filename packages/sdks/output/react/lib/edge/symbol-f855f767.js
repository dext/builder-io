import { jsx as c } from "react/jsx-runtime";
import { useState as y, useEffect as l } from "react";
import { Content as b } from "./blocks-exports.mjs";
import { getClassPropName as s } from "./get-class-prop-name-3d9f65e0.js";
import { fetchOneEntry as C, logger as v } from "./server-entry-895605b0.js";
const h = async ({
  builderContextValue: t,
  symbol: e
}) => {
  if (e != null && e.model && // This is a hack, we should not need to check for this, but it is needed for Svelte.
  (t != null && t.apiKey))
    return C({
      model: e.model,
      apiKey: t.apiKey,
      apiVersion: t.apiVersion,
      ...(e == null ? void 0 : e.entry) && {
        query: {
          id: e.entry
        }
      }
    }).catch((i) => {
      v.error("Could not fetch symbol content: ", i);
    });
};
function g(t) {
  var o, a, r, d;
  function e() {
    var n, m;
    return [
      t.attributes[s()],
      "builder-symbol",
      (n = t.symbol) != null && n.inline ? "builder-inline-symbol" : void 0,
      (m = t.symbol) != null && m.dynamic || t.dynamic ? "builder-dynamic-symbol" : void 0
    ].filter(Boolean).join(" ");
  }
  const [i, u] = y(() => {
    var n;
    return (n = t.symbol) == null ? void 0 : n.content;
  });
  function f() {
    i || h({
      symbol: t.symbol,
      builderContextValue: t.builderContext
    }).then((n) => {
      n && u(n);
    });
  }
  return l(() => {
  }, []), l(() => {
    f();
  }, [t.symbol]), /* @__PURE__ */ c("div", { ...t.attributes, className: e(), children: /* @__PURE__ */ c(
    b,
    {
      isNestedRender: !0,
      apiVersion: t.builderContext.apiVersion,
      apiKey: t.builderContext.apiKey,
      context: {
        ...t.builderContext.context,
        symbolId: (o = t.builderBlock) == null ? void 0 : o.id
      },
      customComponents: Object.values(t.builderComponents),
      data: {
        ...t.builderContext.rootState,
        ...(a = t.symbol) == null ? void 0 : a.data,
        ...t.builderContext.localState,
        ...(r = i == null ? void 0 : i.data) == null ? void 0 : r.state
      },
      model: (d = t.symbol) == null ? void 0 : d.model,
      content: i,
      linkComponent: t.builderLinkComponent,
      blocksWrapper: "div",
      contentWrapper: "div"
    }
  ) });
}
export {
  g as default
};
