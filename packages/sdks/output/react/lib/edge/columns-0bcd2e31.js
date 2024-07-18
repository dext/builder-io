import { jsxs as g, Fragment as v, jsx as o } from "react/jsx-runtime";
import { useState as p } from "react";
import { InlinedStyles as w, DynamicRenderer as $, mapStyleObjToStrIfNeeded as B, Blocks as L, getSizesForBreakpoints as W } from "./blocks-8cece0b1.js";
import { getClassPropName as z } from "./get-class-prop-name-3d9f65e0.js";
import "./server-entry-895605b0.js";
function G(t) {
  var b;
  function a() {
    return typeof t.space == "number" ? t.space || 0 : 20;
  }
  function c() {
    return t.columns || [];
  }
  function s() {
    return t.stackColumnsAt || "tablet";
  }
  function h(e) {
    var i;
    const n = c();
    return ((i = n[e]) == null ? void 0 : i.width) || 100 / n.length;
  }
  function y(e) {
    const n = c(), i = a() * (n.length - 1) / n.length;
    return `calc(${h(e)}% - ${i}px)`;
  }
  function r({
    stackedStyle: e,
    desktopStyle: n
  }) {
    return s() === "tablet" ? e : n;
  }
  function m({
    stackedStyle: e,
    desktopStyle: n
  }) {
    return s() === "never" ? n : e;
  }
  const [u, A] = p(
    () => t.stackColumnsAt === "never" ? "row" : t.reverseColumnsWhenStacked ? "column-reverse" : "column"
  );
  function S() {
    return {
      "--flex-dir": u,
      "--flex-dir-tablet": r({
        stackedStyle: u,
        desktopStyle: "row"
      })
    };
  }
  function x(e) {
    const n = e === 0 ? 0 : a(), i = y(e), l = `${n}px`, f = "100%", k = 0;
    return {
      ...{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
      },
      width: i,
      ["marginLeft"]: l,
      "--column-width-mobile": m({
        stackedStyle: f,
        desktopStyle: i
      }),
      "--column-margin-left-mobile": m({
        stackedStyle: k,
        desktopStyle: l
      }),
      "--column-width-tablet": r({
        stackedStyle: f,
        desktopStyle: i
      }),
      "--column-margin-left-tablet": r({
        stackedStyle: k,
        desktopStyle: l
      })
    };
  }
  function d(e) {
    var i, l;
    return W(
      ((l = (i = t.builderContext.content) == null ? void 0 : i.meta) == null ? void 0 : l.breakpoints) || {}
    )[e].max;
  }
  function C() {
    return `
        @media (max-width: ${d("medium")}px) {
          .${t.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir-tablet);
            align-items: stretch;
          }

          .${t.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-tablet) !important;
            margin-left: var(--column-margin-left-tablet) !important;
          }
        }

        @media (max-width: ${d("small")}px) {
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
  return /* @__PURE__ */ g(v, { children: [
    /* @__PURE__ */ g(
      "div",
      {
        className: `builder-columns ${t.builderBlock.id}-breakpoints div-a6ce8b7c`,
        style: S(),
        children: [
          /* @__PURE__ */ o(w, { id: "builderio-columns", styles: C() }),
          (b = t.columns) == null ? void 0 : b.map((e, n) => /* @__PURE__ */ o(
            $,
            {
              TagName: e.link ? t.builderLinkComponent || "a" : "div",
              actionAttributes: {},
              attributes: {
                ...e.link ? {
                  href: e.link
                } : {},
                [z()]: "builder-column",
                style: B(x(n))
              },
              children: /* @__PURE__ */ o(
                L,
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
    /* @__PURE__ */ o("style", { children: `.div-a6ce8b7c {
  display: flex;
  line-height: normal;
}` })
  ] });
}
export {
  G as default
};
