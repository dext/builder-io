import { jsxs as g, Fragment as p, jsx as o } from "react/jsx-runtime";
import { useState as s } from "react";
import { InlinedStyles as w, DynamicRenderer as $, mapStyleObjToStrIfNeeded as B, Blocks as z, getSizesForBreakpoints as L } from "./blocks-83caba33.js";
import { getClassPropName as W } from "./get-class-prop-name-775bd8d0.js";
import "./server-entry-df819e6c.js";
function M(t) {
  var k;
  const [a, A] = s(
    () => typeof t.space == "number" ? t.space || 0 : 20
  );
  function c() {
    return t.columns || [];
  }
  const [m, D] = s(
    () => t.stackColumnsAt || "tablet"
  );
  function y(e) {
    var l;
    const n = c();
    return ((l = n[e]) == null ? void 0 : l.width) || 100 / n.length;
  }
  function S(e) {
    const n = c(), l = a * (n.length - 1) / n.length;
    return `calc(${y(e)}% - ${l}px)`;
  }
  function r({
    stackedStyle: e,
    desktopStyle: n
  }) {
    return m === "tablet" ? e : n;
  }
  function u({
    stackedStyle: e,
    desktopStyle: n
  }) {
    return m === "never" ? n : e;
  }
  const [d, F] = s(
    () => t.stackColumnsAt === "never" ? "row" : t.reverseColumnsWhenStacked ? "column-reverse" : "column"
  );
  function x() {
    return {
      "--flex-dir": d,
      "--flex-dir-tablet": r({
        stackedStyle: d,
        desktopStyle: "row"
      })
    };
  }
  function C(e) {
    const n = e === 0 ? 0 : a, l = S(e), i = `${n}px`, f = "100%", h = 0;
    return {
      ...{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
      },
      width: l,
      ["marginLeft"]: i,
      "--column-width-mobile": u({
        stackedStyle: f,
        desktopStyle: l
      }),
      "--column-margin-left-mobile": u({
        stackedStyle: h,
        desktopStyle: i
      }),
      "--column-width-tablet": r({
        stackedStyle: f,
        desktopStyle: l
      }),
      "--column-margin-left-tablet": r({
        stackedStyle: h,
        desktopStyle: i
      })
    };
  }
  function b(e) {
    var l, i;
    return L(
      ((i = (l = t.builderContext.content) == null ? void 0 : l.meta) == null ? void 0 : i.breakpoints) || {}
    )[e].max;
  }
  function v() {
    return `
        @media (max-width: ${b("medium")}px) {
          .${t.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir-tablet);
            align-items: stretch;
          }

          .${t.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-tablet) !important;
            margin-left: var(--column-margin-left-tablet) !important;
          }
        }

        @media (max-width: ${b("small")}px) {
          .${t.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir);
            align-items: stretch;
          }

          .${t.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-mobile) !important;
            margin-left: var(--column-margin-left-mobile) !important;
          }
        },
      `;
  }
  return /* @__PURE__ */ g(p, { children: [
    /* @__PURE__ */ g(
      "div",
      {
        className: `builder-columns ${t.builderBlock.id}-breakpoints div-452958ba`,
        style: x(),
        children: [
          /* @__PURE__ */ o(w, { id: "builderio-columns", styles: v() }),
          (k = t.columns) == null ? void 0 : k.map((e, n) => /* @__PURE__ */ o(
            $,
            {
              TagName: e.link ? t.builderLinkComponent || "a" : "div",
              actionAttributes: {},
              attributes: {
                ...e.link ? {
                  href: e.link
                } : {},
                [W()]: "builder-column",
                style: B(C(n))
              },
              children: /* @__PURE__ */ o(
                z,
                {
                  path: `component.options.columns.${n}.blocks`,
                  parent: t.builderBlock.id,
                  styleProp: {
                    flexGrow: "1"
                  },
                  context: t.builderContext,
                  registeredComponents: t.builderComponents,
                  linkComponent: t.builderLinkComponent,
                  blocks: e.blocks
                }
              )
            },
            n
          ))
        ]
      }
    ),
    /* @__PURE__ */ o("style", { children: `.div-452958ba {
  display: flex;
  line-height: normal;
}` })
  ] });
}
export {
  M as default
};
