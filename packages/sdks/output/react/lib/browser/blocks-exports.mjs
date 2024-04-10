"use client";
var Ne = Object.defineProperty;
var Ve = (e, t, n) => t in e ? Ne(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var J = (e, t, n) => (Ve(e, typeof t != "symbol" ? t + "" : t, n), n);
import { jsx as c, Fragment as w, jsxs as N } from "react/jsx-runtime";
import { createContext as ye, useState as E, useEffect as T, useContext as ce, useRef as $e } from "react";
import { isEditing as H, isBrowser as L, getUserAttributes as De, checkIsDefined as U, logger as F, fastClone as Z, TARGET as M, setupBrowserForEditing as Oe, createRegisterComponentMessage as He, getDefaultCanTrack as _, _track as se, isPreviewing as Le, fetchOneEntry as ke, createEditorListener as Fe, fetch as Ke, serializeComponentInfo as de, handleABTestingSync as Me } from "./server-entry-6055a923.js";
const ee = ye({
  content: null,
  context: {},
  localState: void 0,
  rootSetState() {
  },
  rootState: {},
  apiKey: null,
  apiVersion: void 0,
  componentInfos: {},
  inheritedStyles: {},
  BlocksWrapper: "div",
  BlocksWrapperProps: {}
}), xe = ye({ registeredComponents: {} });
function je(e) {
  var t;
  return {
    ...(t = e.component) == null ? void 0 : t.options,
    ...e.options,
    /**
     * Our built-in components frequently make use of the block, so we provide all of it under `builderBlock`
     */
    builderBlock: e
  };
}
const Ue = ({
  builder: e,
  context: t,
  event: n,
  state: i
}) => Object.entries({
  state: i,
  Builder: e,
  // legacy
  builder: e,
  context: t,
  event: n
}), _e = () => ({
  isEditing: H(),
  isBrowser: L(),
  isServer: !L(),
  getUserAttributes: () => De()
}), ze = (e, {
  isExpression: t = !0
}) => /* we disable this for cases where we definitely don't want a return */ t && !(e.includes(";") || e.includes(" return ") || e.trim().startsWith("return ")) ? `return (${e});` : e, ue = ({
  code: e,
  builder: t,
  context: n,
  event: i,
  localState: o,
  rootSetState: a,
  rootState: r
}) => {
  const l = Ue({
    builder: t,
    context: n,
    event: i,
    state: ve({
      rootState: r,
      localState: o,
      rootSetState: a
    })
  });
  return new Function(...l.map(([s]) => s), e)(...l.map(([, s]) => s));
};
function ve({
  rootState: e,
  localState: t,
  rootSetState: n
}) {
  return new Proxy(e, {
    get: (i, o) => {
      if (t && o in t)
        return t[o];
      const a = i[o];
      return typeof a == "object" && a !== null ? ve({
        rootState: a,
        localState: void 0,
        rootSetState: n ? (r) => {
          i[o] = r, n(i);
        } : void 0
      }) : a;
    },
    set: (i, o, a) => {
      if (t && o in t)
        throw new Error("Writing to local state is not allowed as it is read-only.");
      return i[o] = a, n == null || n(i), !0;
    }
  });
}
function qe() {
  var e;
  return typeof process != "undefined" && U((e = process == null ? void 0 : process.versions) == null ? void 0 : e.node);
}
const Ye = () => {
  var i;
  if (!qe())
    return !1;
  const e = process.arch === "arm64", t = process.version.startsWith("v20"), n = (i = process.env.NODE_OPTIONS) == null ? void 0 : i.includes("--no-node-snapshot");
  return e && t && !n ? (F.log("Skipping usage of `isolated-vm` to avoid crashes in Node v20 on an arm64 machine.\n    If you would like to use the `isolated-vm` package on this machine, please provide the `NODE_OPTIONS=--no-node-snapshot` config to your Node process.\n    See https://github.com/BuilderIO/builder/blob/main/packages/sdks/README.md#node-v20--m1-macs-apple-silicon-support for more information.\n    "), !0) : !1;
}, Qe = (e) => (L() || Ye(), ue(e)), B = class B {
  static getCacheKey(t) {
    return JSON.stringify({
      ...t,
      // replace the event with a random number to break cache
      // thats because we can't serialize the event object due to circular refs in DOM node refs.
      event: t.event ? Math.random() : void 0
    });
  }
  static getCachedValue(t) {
    return B.cache.get(t);
  }
  static setCachedValue(t, n) {
    B.cache.size > 20 && B.cache.delete(B.cache.keys().next().value), B.cache.set(t, {
      value: n
    });
  }
};
J(B, "cacheLimit", 20), J(B, "cache", /* @__PURE__ */ new Map());
let O = B;
function K({
  code: e,
  context: t,
  localState: n,
  rootState: i,
  rootSetState: o,
  event: a,
  isExpression: r = !0,
  enableCache: l
}) {
  if (e === "") {
    F.warn("Skipping evaluation of empty code block.");
    return;
  }
  const s = {
    code: ze(e, {
      isExpression: r
    }),
    builder: _e(),
    context: t,
    event: a,
    rootSetState: o,
    rootState: i,
    localState: n
  };
  if (l) {
    const d = O.getCacheKey(s), f = O.getCachedValue(d);
    if (f)
      return f.value;
  }
  try {
    const d = Qe(s);
    if (l) {
      const f = O.getCacheKey(s);
      O.setCachedValue(f, d);
    }
    return d;
  } catch (d) {
    F.error("Failed code evaluation: " + d.message, {
      code: e
    });
    return;
  }
}
const Je = (e, t, n) => {
  if (Object(e) !== e)
    return e;
  const i = Array.isArray(t) ? t : t.toString().match(/[^.[\]]+/g);
  return i.slice(0, -1).reduce((o, a, r) => Object(o[a]) === o[a] ? o[a] : o[a] = Math.abs(Number(i[r + 1])) >> 0 === +i[r + 1] ? [] : {}, e)[i[i.length - 1]] = n, e;
};
const Ge = ({
  block: e,
  context: t,
  localState: n,
  rootState: i,
  rootSetState: o
}) => {
  if (!e.bindings)
    return e;
  const a = Z(e), r = {
    ...a,
    properties: {
      ...a.properties
    },
    actions: {
      ...a.actions
    }
  };
  for (const l in e.bindings) {
    const s = e.bindings[l], d = K({
      code: s,
      localState: n,
      rootState: i,
      rootSetState: o,
      context: t,
      enableCache: !0
    });
    Je(r, l, d);
  }
  return r;
};
function z({
  block: e,
  context: t,
  shouldEvaluateBindings: n,
  localState: i,
  rootState: o,
  rootSetState: a
}) {
  const r = e;
  return n ? Ge({
    block: r,
    localState: i,
    rootState: o,
    rootSetState: a,
    context: t
  }) : r;
}
function Xe(e, t, n = {}) {
  let i, o, a, r = null, l = 0;
  const s = function() {
    l = n.leading === !1 ? 0 : Date.now(), r = null, a = e.apply(i, o), r || (i = o = null);
  };
  return function() {
    const d = Date.now();
    !l && n.leading === !1 && (l = d);
    const f = t - (d - l);
    return i = this, o = arguments, f <= 0 || f > t ? (r && (clearTimeout(r), r = null), l = d, a = e.apply(i, o), r || (i = o = null)) : !r && n.trailing !== !1 && (r = setTimeout(s, f)), a;
  };
}
function V(e, ...t) {
  const n = Object(e);
  for (let i = 1; i < arguments.length; i++) {
    const o = arguments[i];
    if (o != null)
      for (const a in o)
        Object.prototype.hasOwnProperty.call(o, a) && (n[a] = o[a]);
  }
  return n;
}
const te = (e) => e ? e.replace(/([A-Z])/g, (t) => `-${t[0].toLowerCase()}`) : "";
function Ze(e) {
  for (const t of e)
    switch (t.trigger) {
      case "pageLoad":
        Ce(t);
        break;
      case "hover":
        tt(t);
        break;
      case "scrollInView":
        nt(t);
        break;
    }
}
function ne(e) {
  console.warn(`Cannot animate element: element with ID ${e} not found!`);
}
function ie(e, t) {
  const n = et(e), i = getComputedStyle(t), o = e.steps[0].styles, a = e.steps[e.steps.length - 1].styles, r = [o, a];
  for (const l of r)
    for (const s of n)
      s in l || (l[s] = i[s]);
}
function et(e) {
  const t = [];
  for (const n of e.steps)
    for (const i in n.styles)
      t.indexOf(i) === -1 && t.push(i);
  return t;
}
function Ce(e) {
  const t = Array.prototype.slice.call(document.getElementsByClassName(e.elementId || e.id || ""));
  if (!t.length) {
    ne(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    ie(e, n), n.style.transition = "none", n.style.transitionDelay = "0", V(n.style, e.steps[0].styles), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${te(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s"), V(n.style, e.steps[1].styles), setTimeout(() => {
        n.style.transition = "", n.style.transitionDelay = "";
      }, (e.delay || 0) * 1e3 + e.duration * 1e3 + 100);
    });
  });
}
function tt(e) {
  const t = Array.prototype.slice.call(document.getElementsByClassName(e.elementId || e.id || ""));
  if (!t.length) {
    ne(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    ie(e, n);
    const i = e.steps[0].styles, o = e.steps[1].styles;
    function a() {
      V(n.style, i);
    }
    function r() {
      V(n.style, o);
    }
    a(), n.addEventListener("mouseenter", r), n.addEventListener("mouseleave", a), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${te(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s");
    });
  });
}
function nt(e) {
  const t = Array.prototype.slice.call(document.getElementsByClassName(e.elementId || e.id || ""));
  if (!t.length) {
    ne(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    ie(e, n);
    let i = !1, o = !1;
    function a() {
      !i && l(n) ? (i = !0, o = !0, setTimeout(() => {
        V(n.style, e.steps[1].styles), e.repeat || document.removeEventListener("scroll", r), setTimeout(() => {
          o = !1, e.repeat || (n.style.transition = "", n.style.transitionDelay = "");
        }, (e.duration + (e.delay || 0)) * 1e3 + 100);
      })) : e.repeat && i && !o && !l(n) && (i = !1, V(n.style, e.steps[0].styles));
    }
    const r = Xe(a, 200, {
      leading: !1
    });
    function l(f) {
      const h = f.getBoundingClientRect(), g = window.innerHeight, C = (e.thresholdPercent || 0) / 100 * g;
      return h.bottom > C && h.top < g - C;
    }
    const s = e.steps[0].styles;
    function d() {
      V(n.style, s);
    }
    d(), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${te(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s");
    }), document.addEventListener("scroll", r, {
      capture: !0,
      passive: !0
    }), a();
  });
}
const it = (e) => e.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase(), Ie = (e) => Object.entries(e).map(([n, i]) => {
  if (typeof i == "string")
    return `${it(n)}: ${i};`;
}).filter(U), ot = (e) => Ie(e).join(`
`), G = ({
  mediaQuery: e,
  className: t,
  styles: n
}) => {
  const i = `.${t} {
    ${ot(n)}
  }`;
  return e ? `${e} {
      ${i}
    }` : i;
};
function at({
  style: e
}) {
  return e;
}
const rt = ({
  block: e,
  context: t
}) => we(at({
  style: e.style || {},
  context: t,
  block: e
}));
function we(e) {
  switch (M) {
    case "svelte":
    case "vue":
    case "solid":
      return Ie(e).join(" ");
    case "qwik":
    case "reactNative":
    case "react":
    case "rsc":
      return e;
  }
}
const lt = ({
  block: e,
  context: t,
  registeredComponents: n
}) => {
  var a;
  const i = (a = z({
    block: e,
    localState: t.localState,
    rootState: t.rootState,
    rootSetState: t.rootSetState,
    context: t.context,
    shouldEvaluateBindings: !1
  }).component) == null ? void 0 : a.name;
  if (!i)
    return null;
  const o = n[i];
  if (o)
    return o;
  console.warn(`
      Could not find a registered component named "${i}". 
      If you registered it, is the file that registered it imported by the file that needs to render it?`);
}, ct = ({
  block: e,
  context: t
}) => {
  const {
    repeat: n,
    ...i
  } = e;
  if (!(n != null && n.collection))
    return;
  const o = K({
    code: n.collection,
    localState: t.localState,
    rootState: t.rootState,
    rootSetState: t.rootSetState,
    context: t.context,
    enableCache: !0
  });
  if (!Array.isArray(o))
    return;
  const a = n.collection.split(".").pop(), r = n.itemName || (a ? a + "Item" : "item");
  return o.map((s, d) => ({
    context: {
      ...t,
      localState: {
        ...t.localState,
        $index: d,
        $item: s,
        [r]: s,
        [`$${r}Index`]: d
      }
    },
    block: i
  }));
}, pe = {
  small: {
    min: 320,
    default: 321,
    max: 640
  },
  medium: {
    min: 641,
    default: 642,
    max: 991
  },
  large: {
    min: 990,
    default: 991,
    max: 1200
  }
}, me = (e, t = pe) => `@media (max-width: ${t[e].max}px)`, Te = ({
  small: e,
  medium: t
}) => {
  const n = Z(pe);
  if (!e || !t)
    return n;
  const i = Math.floor(e / 2);
  n.small = {
    max: e,
    min: i,
    default: i + 1
  };
  const o = n.small.max + 1;
  n.medium = {
    max: t,
    min: o,
    default: o + 1
  };
  const a = n.medium.max + 1;
  return n.large = {
    max: 2e3,
    // TODO: decide upper limit
    min: a,
    default: a + 1
  }, n;
};
function q(e) {
  return /* @__PURE__ */ c(
    "style",
    {
      dangerouslySetInnerHTML: { __html: e.styles },
      "data-id": e.id
    }
  );
}
function st(e) {
  function t() {
    const i = z({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    });
    return U(i.hide) ? !i.hide : U(i.show) ? i.show : !0;
  }
  function n() {
    var C;
    const i = z({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    }), o = i.responsiveStyles, a = e.context.content, r = Te(
      ((C = a == null ? void 0 : a.meta) == null ? void 0 : C.breakpoints) || {}
    ), l = o == null ? void 0 : o.large, s = o == null ? void 0 : o.medium, d = o == null ? void 0 : o.small, f = i.id;
    if (!f)
      return "";
    const h = l ? G({
      className: f,
      styles: l
    }) : "", g = s ? G({
      className: f,
      styles: s,
      mediaQuery: me(
        "medium",
        r
      )
    }) : "", x = d ? G({
      className: f,
      styles: d,
      mediaQuery: me(
        "small",
        r
      )
    }) : "";
    return [h, g, x].join(" ");
  }
  return /* @__PURE__ */ c(w, { children: n() && t() ? /* @__PURE__ */ c(w, { children: /* @__PURE__ */ c(q, { id: "builderio-block", styles: n() }) }) : null });
}
function dt(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
const ut = (e) => `on${dt(e)}`, mt = (e, t) => (n) => K({
  code: e,
  context: t.context,
  localState: t.localState,
  rootState: t.rootState,
  rootSetState: t.rootSetState,
  event: n,
  isExpression: !1,
  enableCache: !0
});
function Ee(e) {
  var i;
  const t = {}, n = (i = e.block.actions) != null ? i : {};
  for (const o in n) {
    if (!n.hasOwnProperty(o))
      continue;
    const a = n[o];
    let r = ut(o);
    if (e.stripPrefix)
      switch (M) {
        case "vue":
          r = r.replace("v-on:", "");
          break;
        case "svelte":
          r = r.replace("on:", "");
          break;
      }
    t[r] = mt(a, e);
  }
  return t;
}
const oe = () => {
  switch (M) {
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
function ft({
  properties: e
}) {
  return e;
}
const ht = (e) => ({
  href: e.href
});
function ae({
  block: e,
  context: t
}) {
  var i;
  const n = {
    ...ht(e),
    ...e.properties,
    "builder-id": e.id,
    style: rt({
      block: e,
      context: t
    }),
    [oe()]: [e.id, "builder-block", e.class, (i = e.properties) == null ? void 0 : i.class].filter(Boolean).join(" ")
  };
  return ft({
    properties: n,
    context: t,
    block: e
  });
}
const gt = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]), bt = (e) => typeof e == "string" && gt.has(e.toLowerCase());
function Ae(e) {
  return /* @__PURE__ */ c(w, { children: bt(e.TagName) ? /* @__PURE__ */ c(w, { children: /* @__PURE__ */ c(e.TagName, { ...e.attributes, ...e.actionAttributes }) }) : /* @__PURE__ */ c(w, { children: typeof e.TagName == "string" ? /* @__PURE__ */ c(e.TagName, { ...e.attributes, ...e.actionAttributes, children: e.children }) : /* @__PURE__ */ c(e.TagName, { ...e.attributes, ...e.actionAttributes, children: e.children }) }) });
}
function St(e) {
  return /* @__PURE__ */ c(
    Ae,
    {
      TagName: e.Wrapper,
      attributes: ae({
        block: e.block,
        context: e.context
      }),
      actionAttributes: Ee({
        block: e.block,
        rootState: e.context.rootState,
        rootSetState: e.context.rootSetState,
        localState: e.context.localState,
        context: e.context.context,
        stripPrefix: !0
      }),
      children: e.children
    }
  );
}
function yt(e) {
  return /* @__PURE__ */ c(
    e.Wrapper,
    {
      ...e.wrapperProps,
      attributes: e.includeBlockProps ? {
        ...ae({
          block: e.block,
          context: e.context
        }),
        ...Ee({
          block: e.block,
          rootState: e.context.rootState,
          rootSetState: e.context.rootSetState,
          localState: e.context.localState,
          context: e.context.context
        })
      } : {},
      children: e.children
    }
  );
}
const kt = ({
  componentOptions: e,
  builderBlock: t,
  context: n,
  componentRef: i,
  includeBlockProps: o,
  isInteractive: a,
  contextValue: r
}) => {
  const l = {
    ...e,
    /**
     * If `noWrap` is set to `true`, then the block's props/attributes are provided to the
     * component itself directly. Otherwise, they are provided to the wrapper element.
     */
    ...o ? {
      attributes: ae({
        block: t,
        context: r
      })
    } : {}
  };
  return a ? {
    Wrapper: i,
    block: t,
    context: n,
    wrapperProps: e,
    includeBlockProps: o
  } : l;
};
function fe(e) {
  var i;
  const [t, n] = E(
    () => e.isInteractive ? yt : e.componentRef
  );
  return /* @__PURE__ */ c(w, { children: e.componentRef ? /* @__PURE__ */ c(w, { children: /* @__PURE__ */ c(
    t,
    {
      ...kt({
        componentOptions: e.componentOptions,
        builderBlock: e.builderBlock,
        context: e.context,
        componentRef: e.componentRef,
        linkComponent: e.linkComponent,
        includeBlockProps: e.includeBlockProps,
        isInteractive: e.isInteractive,
        contextValue: e.context
      }),
      children: (i = e.blockChildren) == null ? void 0 : i.map((o) => /* @__PURE__ */ c(
        Y,
        {
          block: o,
          context: e.context,
          registeredComponents: e.registeredComponents,
          linkComponent: e.linkComponent
        },
        o.id
      ))
    }
  ) }) : null });
}
function xt(e) {
  const [t, n] = E(() => e.repeatContext);
  return /* @__PURE__ */ c(ee.Provider, { value: t, children: /* @__PURE__ */ c(
    Y,
    {
      block: e.block,
      context: t,
      registeredComponents: e.registeredComponents,
      linkComponent: e.linkComponent
    }
  ) });
}
function Y(e) {
  var s, d, f;
  function t() {
    return lt({
      block: e.block,
      context: e.context,
      registeredComponents: e.registeredComponents
    });
  }
  function n() {
    return ct({
      block: e.block,
      context: e.context
    });
  }
  function i() {
    var h;
    return (h = e.block.repeat) != null && h.collection ? e.block : z({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    });
  }
  function o() {
    var g;
    return e.block.tagName === "a" || ((g = i().properties) == null ? void 0 : g.href) || i().href ? e.linkComponent || "a" : e.block.tagName || "div";
  }
  function a() {
    var x, C;
    if ((x = e.block.repeat) != null && x.collection)
      return !!((C = n == null ? void 0 : n()) != null && C.length);
    const h = "hide" in i() ? i().hide : !1;
    return ("show" in i() ? i().show : !0) && !h;
  }
  function r() {
    var g, x;
    return !((g = t == null ? void 0 : t()) != null && g.component) && !n() ? (x = i().children) != null ? x : [] : [];
  }
  function l() {
    var h, g, x, C, u, m, k, A, W, R, $;
    return {
      blockChildren: (h = i().children) != null ? h : [],
      componentRef: (g = t == null ? void 0 : t()) == null ? void 0 : g.component,
      componentOptions: {
        ...je(i()),
        builderContext: e.context,
        ...((x = t == null ? void 0 : t()) == null ? void 0 : x.name) === "Core:Button" || ((C = t == null ? void 0 : t()) == null ? void 0 : C.name) === "Symbol" || ((u = t == null ? void 0 : t()) == null ? void 0 : u.name) === "Columns" || ((m = t == null ? void 0 : t()) == null ? void 0 : m.name) === "Form:Form" ? {
          builderLinkComponent: e.linkComponent
        } : {},
        ...((k = t == null ? void 0 : t()) == null ? void 0 : k.name) === "Symbol" || ((A = t == null ? void 0 : t()) == null ? void 0 : A.name) === "Columns" || ((W = t == null ? void 0 : t()) == null ? void 0 : W.name) === "Form:Form" ? {
          builderComponents: e.registeredComponents
        } : {}
      },
      context: e.context,
      linkComponent: e.linkComponent,
      registeredComponents: e.registeredComponents,
      builderBlock: i(),
      includeBlockProps: ((R = t == null ? void 0 : t()) == null ? void 0 : R.noWrap) === !0,
      isInteractive: !(($ = t == null ? void 0 : t()) != null && $.isRSC)
    };
  }
  return T(() => {
    const h = i().id, g = i().animations;
    g && h && Ze(
      g.filter((x) => x.trigger !== "hover").map((x) => ({
        ...x,
        elementId: h
      }))
    );
  }, []), /* @__PURE__ */ c(w, { children: a() ? /* @__PURE__ */ N(w, { children: [
    /* @__PURE__ */ c(st, { block: e.block, context: e.context }),
    (s = t == null ? void 0 : t()) != null && s.noWrap ? /* @__PURE__ */ c(w, { children: /* @__PURE__ */ c(
      fe,
      {
        componentRef: l().componentRef,
        componentOptions: l().componentOptions,
        blockChildren: l().blockChildren,
        context: l().context,
        registeredComponents: l().registeredComponents,
        linkComponent: l().linkComponent,
        builderBlock: l().builderBlock,
        includeBlockProps: l().includeBlockProps,
        isInteractive: l().isInteractive
      }
    ) }) : /* @__PURE__ */ c(w, { children: n() ? /* @__PURE__ */ c(w, { children: (f = n()) == null ? void 0 : f.map((h, g) => /* @__PURE__ */ c(
      xt,
      {
        repeatContext: h.context,
        block: h.block,
        registeredComponents: e.registeredComponents,
        linkComponent: e.linkComponent
      },
      g
    )) }) : /* @__PURE__ */ N(
      St,
      {
        Wrapper: o(),
        block: i(),
        context: e.context,
        linkComponent: e.linkComponent,
        children: [
          /* @__PURE__ */ c(
            fe,
            {
              componentRef: l().componentRef,
              componentOptions: l().componentOptions,
              blockChildren: l().blockChildren,
              context: l().context,
              registeredComponents: l().registeredComponents,
              linkComponent: l().linkComponent,
              builderBlock: l().builderBlock,
              includeBlockProps: l().includeBlockProps,
              isInteractive: l().isInteractive
            }
          ),
          (d = r()) == null ? void 0 : d.map((h) => /* @__PURE__ */ c(
            Y,
            {
              block: h,
              registeredComponents: e.registeredComponents,
              linkComponent: e.linkComponent,
              context: e.context
            },
            h.id
          ))
        ]
      }
    ) })
  ] }) : null });
}
function vt(e) {
  function t() {
    var o;
    return "builder-blocks" + ((o = e.blocks) != null && o.length ? "" : " no-blocks");
  }
  function n() {
    var o, a;
    H() && !((o = e.blocks) != null && o.length) && ((a = window.parent) == null || a.postMessage(
      {
        type: "builder.clickEmptyBlocks",
        data: {
          parentElementId: e.parent,
          dataPath: e.path
        }
      },
      "*"
    ));
  }
  function i() {
    var o, a;
    H() && !((o = e.blocks) != null && o.length) && ((a = window.parent) == null || a.postMessage(
      {
        type: "builder.hoverEmptyBlocks",
        data: {
          parentElementId: e.parent,
          dataPath: e.path
        }
      },
      "*"
    ));
  }
  return /* @__PURE__ */ N(w, { children: [
    /* @__PURE__ */ c(
      e.BlocksWrapper,
      {
        className: t() + " props-blocks-wrapper-7cd1560e",
        "builder-path": e.path,
        "builder-parent-id": e.parent,
        style: e.styleProp,
        onClick: (o) => n(),
        onMouseEnter: (o) => i(),
        onKeyPress: (o) => n(),
        ...e.BlocksWrapperProps,
        children: e.children
      }
    ),
    /* @__PURE__ */ c("style", { children: `.props-blocks-wrapper-7cd1560e {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}` })
  ] });
}
function re(e) {
  var i, o, a;
  const t = ce(ee), n = ce(xe);
  return /* @__PURE__ */ c(
    vt,
    {
      blocks: e.blocks,
      parent: e.parent,
      path: e.path,
      styleProp: e.styleProp,
      BlocksWrapper: ((i = e.context) == null ? void 0 : i.BlocksWrapper) || t.BlocksWrapper,
      BlocksWrapperProps: ((o = e.context) == null ? void 0 : o.BlocksWrapperProps) || t.BlocksWrapperProps,
      children: e.blocks ? /* @__PURE__ */ c(w, { children: (a = e.blocks) == null ? void 0 : a.map((r) => /* @__PURE__ */ c(
        Y,
        {
          block: r,
          linkComponent: e.linkComponent,
          context: e.context || t,
          registeredComponents: e.registeredComponents || n.registeredComponents
        },
        r.id
      )) }) : null
    }
  );
}
function Ct(e) {
  var C;
  function t() {
    return typeof e.space == "number" ? e.space || 0 : 20;
  }
  function n() {
    return e.columns || [];
  }
  function i() {
    return e.stackColumnsAt || "tablet";
  }
  function o(u) {
    var k;
    const m = n();
    return ((k = m[u]) == null ? void 0 : k.width) || 100 / m.length;
  }
  function a(u) {
    const m = n(), k = t() * (m.length - 1) / m.length;
    return `calc(${o(u)}% - ${k}px)`;
  }
  function r({
    stackedStyle: u,
    desktopStyle: m
  }) {
    return i() === "tablet" ? u : m;
  }
  function l({
    stackedStyle: u,
    desktopStyle: m
  }) {
    return i() === "never" ? m : u;
  }
  const [s, d] = E(
    () => e.stackColumnsAt === "never" ? "row" : e.reverseColumnsWhenStacked ? "column-reverse" : "column"
  );
  function f() {
    return {
      "--flex-dir": s,
      "--flex-dir-tablet": r({
        stackedStyle: s,
        desktopStyle: "row"
      })
    };
  }
  function h(u) {
    const m = u === 0 ? 0 : t(), k = a(u), A = `${m}px`, W = "100%", R = 0;
    return {
      ...{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
      },
      width: k,
      ["marginLeft"]: A,
      "--column-width-mobile": l({
        stackedStyle: W,
        desktopStyle: k
      }),
      "--column-margin-left-mobile": l({
        stackedStyle: R,
        desktopStyle: A
      }),
      "--column-width-tablet": r({
        stackedStyle: W,
        desktopStyle: k
      }),
      "--column-margin-left-tablet": r({
        stackedStyle: R,
        desktopStyle: A
      })
    };
  }
  function g(u) {
    var k, A;
    return Te(
      ((A = (k = e.builderContext.content) == null ? void 0 : k.meta) == null ? void 0 : A.breakpoints) || {}
    )[u].max;
  }
  function x() {
    return `
        @media (max-width: ${g("medium")}px) {
          .${e.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir-tablet);
            align-items: stretch;
          }

          .${e.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-tablet) !important;
            margin-left: var(--column-margin-left-tablet) !important;
          }
        }

        @media (max-width: ${g("small")}px) {
          .${e.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir);
            align-items: stretch;
          }

          .${e.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-mobile) !important;
            margin-left: var(--column-margin-left-mobile) !important;
          }
        },
      `;
  }
  return /* @__PURE__ */ N(w, { children: [
    /* @__PURE__ */ N(
      "div",
      {
        className: `builder-columns ${e.builderBlock.id}-breakpoints div-a6ce8b7c`,
        style: f(),
        children: [
          /* @__PURE__ */ c(q, { id: "builderio-columns", styles: x() }),
          (C = e.columns) == null ? void 0 : C.map((u, m) => /* @__PURE__ */ c(
            Ae,
            {
              TagName: u.link ? e.builderLinkComponent || "a" : "div",
              actionAttributes: {},
              attributes: {
                ...u.link ? {
                  href: u.link
                } : {},
                [oe()]: "builder-column",
                style: we(h(m))
              },
              children: /* @__PURE__ */ c(
                re,
                {
                  path: `component.options.columns.${m}.blocks`,
                  parent: e.builderBlock.id,
                  styleProp: {
                    flexGrow: "1"
                  },
                  context: e.builderContext,
                  registeredComponents: e.builderComponents,
                  linkComponent: e.builderLinkComponent,
                  blocks: u.blocks
                }
              )
            },
            m
          ))
        ]
      }
    ),
    /* @__PURE__ */ c("style", { children: `.div-a6ce8b7c {
  display: flex;
  line-height: normal;
}` })
  ] });
}
const It = {
  // TODO: ways to statically preprocess JSON for references, functions, etc
  name: "Columns",
  isRSC: !0,
  inputs: [{
    name: "columns",
    type: "array",
    broadcast: !0,
    subFields: [{
      name: "blocks",
      type: "array",
      hideFromUI: !0,
      defaultValue: [{
        "@type": "@builder.io/sdk:Element",
        responsiveStyles: {
          large: {
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flexShrink: "0",
            position: "relative",
            marginTop: "30px",
            textAlign: "center",
            lineHeight: "normal",
            height: "auto",
            minHeight: "20px",
            minWidth: "20px",
            overflow: "hidden"
          }
        },
        component: {
          name: "Image",
          options: {
            image: "https://builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
            backgroundPosition: "center",
            backgroundSize: "cover",
            aspectRatio: 0.7004048582995948
          }
        }
      }, {
        "@type": "@builder.io/sdk:Element",
        responsiveStyles: {
          large: {
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flexShrink: "0",
            position: "relative",
            marginTop: "30px",
            textAlign: "center",
            lineHeight: "normal",
            height: "auto"
          }
        },
        component: {
          name: "Text",
          options: {
            text: "<p>Enter some text...</p>"
          }
        }
      }]
    }, {
      name: "width",
      type: "number",
      hideFromUI: !0,
      helperText: "Width %, e.g. set to 50 to fill half of the space"
    }, {
      name: "link",
      type: "url",
      helperText: "Optionally set a url that clicking this column will link to"
    }],
    defaultValue: [{
      blocks: [{
        "@type": "@builder.io/sdk:Element",
        responsiveStyles: {
          large: {
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flexShrink: "0",
            position: "relative",
            marginTop: "30px",
            textAlign: "center",
            lineHeight: "normal",
            height: "auto",
            minHeight: "20px",
            minWidth: "20px",
            overflow: "hidden"
          }
        },
        component: {
          name: "Image",
          options: {
            image: "https://builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
            backgroundPosition: "center",
            backgroundSize: "cover",
            aspectRatio: 0.7004048582995948
          }
        }
      }, {
        "@type": "@builder.io/sdk:Element",
        responsiveStyles: {
          large: {
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flexShrink: "0",
            position: "relative",
            marginTop: "30px",
            textAlign: "center",
            lineHeight: "normal",
            height: "auto"
          }
        },
        component: {
          name: "Text",
          options: {
            text: "<p>Enter some text...</p>"
          }
        }
      }]
    }, {
      blocks: [{
        "@type": "@builder.io/sdk:Element",
        responsiveStyles: {
          large: {
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flexShrink: "0",
            position: "relative",
            marginTop: "30px",
            textAlign: "center",
            lineHeight: "normal",
            height: "auto",
            minHeight: "20px",
            minWidth: "20px",
            overflow: "hidden"
          }
        },
        component: {
          name: "Image",
          options: {
            image: "https://builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",
            backgroundPosition: "center",
            backgroundSize: "cover",
            aspectRatio: 0.7004048582995948
          }
        }
      }, {
        "@type": "@builder.io/sdk:Element",
        responsiveStyles: {
          large: {
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flexShrink: "0",
            position: "relative",
            marginTop: "30px",
            textAlign: "center",
            lineHeight: "normal",
            height: "auto"
          }
        },
        component: {
          name: "Text",
          options: {
            text: "<p>Enter some text...</p>"
          }
        }
      }]
    }],
    onChange: (e) => {
      function t() {
        n.forEach((i) => {
          i.delete("width");
        });
      }
      const n = e.get("columns");
      Array.isArray(n) && n.find((o) => o.get("width")) && (n.find((a) => !a.get("width")) || n.reduce((l, s) => l + s.get("width"), 0) !== 100) && t();
    }
  }, {
    name: "space",
    type: "number",
    defaultValue: 20,
    helperText: "Size of gap between columns",
    advanced: !0
  }, {
    name: "stackColumnsAt",
    type: "string",
    defaultValue: "tablet",
    helperText: "Convert horizontal columns to vertical at what device size",
    enum: ["tablet", "mobile", "never"],
    advanced: !0
  }, {
    name: "reverseColumnsWhenStacked",
    type: "boolean",
    defaultValue: !1,
    helperText: "When stacking columns for mobile devices, reverse the ordering",
    advanced: !0
  }]
}, wt = {
  name: "Slot",
  isRSC: !0,
  description: "Allow child blocks to be inserted into this content when used as a Symbol",
  docsLink: "https://www.builder.io/c/docs/symbols-with-blocks",
  image: "https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F3aad6de36eae43b59b52c85190fdef56",
  // Maybe wrap this for canHaveChildren so bind children to this hm
  inputs: [{
    name: "name",
    type: "string",
    required: !0,
    defaultValue: "children"
  }]
};
function pt(e) {
  var t, n, i;
  return /* @__PURE__ */ c(
    "div",
    {
      style: {
        pointerEvents: "auto"
      },
      ...!((t = e.builderContext.context) != null && t.symbolId) && {
        "builder-slot": e.name
      },
      children: /* @__PURE__ */ c(
        re,
        {
          parent: (n = e.builderContext.context) == null ? void 0 : n.symbolId,
          path: `symbol.data.${e.name}`,
          context: e.builderContext,
          blocks: (i = e.builderContext.rootState) == null ? void 0 : i[e.name]
        }
      )
    }
  );
}
const Tt = {
  name: "Symbol",
  noWrap: !0,
  static: !0,
  isRSC: !0,
  inputs: [{
    name: "symbol",
    type: "uiSymbol"
  }, {
    name: "dataOnly",
    helperText: "Make this a data symbol that doesn't display any UI",
    type: "boolean",
    defaultValue: !1,
    advanced: !0,
    hideFromUI: !0
  }, {
    name: "inheritState",
    helperText: "Inherit the parent component state and data",
    type: "boolean",
    defaultValue: !1,
    advanced: !0
  }, {
    name: "renderToLiquid",
    helperText: "Render this symbols contents to liquid. Turn off to fetch with javascript and use custom targeting",
    type: "boolean",
    defaultValue: !1,
    advanced: !0,
    hideFromUI: !0
  }, {
    name: "useChildren",
    hideFromUI: !0,
    type: "boolean"
  }]
}, Et = {
  name: "Text",
  static: !0,
  isRSC: !0,
  image: "https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-text_fields-24px%20(1).svg?alt=media&token=12177b73-0ee3-42ca-98c6-0dd003de1929",
  inputs: [{
    name: "text",
    type: "html",
    required: !0,
    autoFocus: !0,
    bubble: !0,
    defaultValue: "Enter some text..."
  }],
  defaultStyles: {
    lineHeight: "normal",
    height: "auto",
    textAlign: "center"
  }
};
function At(e) {
  var t;
  return /* @__PURE__ */ c(
    "div",
    {
      className: "builder-text",
      dangerouslySetInnerHTML: { __html: ((t = e.text) == null ? void 0 : t.toString()) || "" },
      style: {
        outline: "none"
      }
    }
  );
}
const he = () => [{
  component: Ct,
  ...It
}, {
  component: pt,
  ...wt
}, {
  component: Jt,
  ...Tt
}, {
  component: At,
  ...Et
}], Pt = `function updateCookiesAndStyles(contentId, variants, isHydrationTarget) {
  function getAndSetVariantId() {
    function setCookie(name, value, days) {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + (value || '') + expires + '; path=/' + '; Secure; SameSite=None';
    }
    function getCookie(name) {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
    const cookieName = \`builder.tests.\${contentId}\`;
    const variantInCookie = getCookie(cookieName);
    const availableIDs = variants.map(vr => vr.id).concat(contentId);
    if (variantInCookie && availableIDs.includes(variantInCookie)) {
      return variantInCookie;
    }
    let n = 0;
    const random = Math.random();
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      const testRatio = variant.testRatio;
      n += testRatio;
      if (random < n) {
        setCookie(cookieName, variant.id);
        return variant.id;
      }
    }
    setCookie(cookieName, contentId);
    return contentId;
  }
  const winningVariantId = getAndSetVariantId();
  const styleEl = document.currentScript?.previousElementSibling;
  if (isHydrationTarget) {
    styleEl.remove();
    const thisScriptEl = document.currentScript;
    thisScriptEl?.remove();
  } else {
    const newStyleStr = variants.concat({
      id: contentId
    }).filter(variant => variant.id !== winningVariantId).map(value => {
      return \`.variant-\${value.id} {  display: none; }
        \`;
    }).join('');
    styleEl.innerHTML = newStyleStr;
  }
}`, Bt = `function updateVariantVisibility(variantContentId, defaultContentId, isHydrationTarget) {
  if (!navigator.cookieEnabled) {
    return;
  }
  function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  const cookieName = \`builder.tests.\${defaultContentId}\`;
  const winningVariant = getCookie(cookieName);
  const parentDiv = document.currentScript?.parentElement;
  const isDefaultContent = variantContentId === defaultContentId;
  const isWinningVariant = winningVariant === variantContentId;
  if (isWinningVariant && !isDefaultContent) {
    parentDiv?.removeAttribute('hidden');
    parentDiv?.removeAttribute('aria-hidden');
  } else if (!isWinningVariant && isDefaultContent) {
    parentDiv?.setAttribute('hidden', 'true');
    parentDiv?.setAttribute('aria-hidden', 'true');
  }
  if (isHydrationTarget) {
    if (!isWinningVariant) {
      parentDiv?.remove();
    }
    const thisScriptEl = document.currentScript;
    thisScriptEl?.remove();
  }
  return;
}`, Pe = "builderIoAbTest", Be = "builderIoRenderContent", j = (e) => Object.values((e == null ? void 0 : e.variations) || {}).map((t) => ({
  ...t,
  testVariationId: t.id,
  id: e == null ? void 0 : e.id
})), Wt = ({
  canTrack: e,
  content: t
}) => !(!(j(t).length > 0) || !e || L()), Rt = (e) => e === "react" || e === "reactNative", We = Rt(M), Nt = () => `
  window.${Pe} = ${Pt}
  window.${Be} = ${Bt}
  `, Vt = (e, t) => `
  window.${Pe}(
    "${t}",${JSON.stringify(e)}, ${We}
  )`, $t = ({
  contentId: e,
  variationId: t
}) => `window.${Be}(
    "${t}", "${e}", ${We}
  )`;
function X(e) {
  return /* @__PURE__ */ c(
    "script",
    {
      dangerouslySetInnerHTML: { __html: e.scriptStr },
      "data-id": e.id
    }
  );
}
function ge(e) {
  return Math.round(e * 1e3) / 1e3;
}
const Dt = (e, t, n = !0) => {
  if (!(e instanceof HTMLElement))
    return null;
  let i = n ? e : e.parentElement;
  do {
    if (!i)
      return null;
    if (t(i))
      return i;
  } while (i = i.parentElement);
  return null;
}, Ot = (e) => Dt(e, (t) => {
  const n = t.getAttribute("builder-id") || t.id;
  return (n == null ? void 0 : n.indexOf("builder-")) === 0;
}), be = ({
  event: e,
  target: t
}) => {
  const n = t.getBoundingClientRect(), i = e.clientX - n.left, o = e.clientY - n.top, a = ge(i / n.width), r = ge(o / n.height);
  return {
    x: a,
    y: r
  };
}, Ht = (e) => {
  const t = e.target, n = t && Ot(t), i = (n == null ? void 0 : n.getAttribute("builder-id")) || (n == null ? void 0 : n.id);
  return {
    targetBuilderElement: i || void 0,
    metadata: {
      targetOffset: t ? be({
        event: e,
        target: t
      }) : void 0,
      builderTargetOffset: n ? be({
        event: e,
        target: n
      }) : void 0,
      builderElementIndex: n && i ? [].slice.call(document.getElementsByClassName(i)).indexOf(n) : void 0
    }
  };
};
function Lt(e) {
  var k, A, W, R, $, Q, le;
  const t = $e(null);
  function n(b) {
    var I, y;
    const v = {
      ...e.builderContextSignal.rootState,
      ...b
    };
    e.builderContextSignal.rootSetState ? (y = (I = e.builderContextSignal).rootSetState) == null || y.call(I, v) : e.setBuilderContextSignal((S) => ({
      ...S,
      rootState: v
    }));
  }
  function i(b) {
    var I, y, S, p, D;
    const v = {
      ...e.builderContextSignal.content,
      ...b,
      data: {
        ...(I = e.builderContextSignal.content) == null ? void 0 : I.data,
        ...b == null ? void 0 : b.data
      },
      meta: {
        ...(y = e.builderContextSignal.content) == null ? void 0 : y.meta,
        ...b == null ? void 0 : b.meta,
        breakpoints: ((S = b == null ? void 0 : b.meta) == null ? void 0 : S.breakpoints) || ((D = (p = e.builderContextSignal.content) == null ? void 0 : p.meta) == null ? void 0 : D.breakpoints)
      }
    };
    e.setBuilderContextSignal((P) => ({
      ...P,
      content: v
    }));
  }
  const [o, a] = E(
    () => e.contentWrapper || "div"
  );
  function r(b) {
    return Fe({
      model: e.model,
      trustedHosts: e.trustedHosts,
      callbacks: {
        configureSdk: (v) => {
          var S;
          const { breakpoints: I, contentId: y } = v;
          !y || y !== ((S = e.builderContextSignal.content) == null ? void 0 : S.id) || I && i({
            meta: {
              breakpoints: I
            }
          });
        },
        animation: (v) => {
          Ce(v);
        },
        contentUpdate: (v) => {
          i(v);
        }
      }
    })(b);
  }
  function l() {
    var v, I;
    const b = (I = (v = e.builderContextSignal.content) == null ? void 0 : v.data) == null ? void 0 : I.jsCode;
    b && K({
      code: b,
      context: e.context || {},
      localState: void 0,
      rootState: e.builderContextSignal.rootState,
      rootSetState: e.builderContextSignal.rootSetState,
      /**
       * We don't want to cache the result of the JS code, since it's arbitrary side effect code.
       */
      enableCache: !1
    });
  }
  const [s, d] = E(() => ({})), [f, h] = E(() => ({})), [g, x] = E(() => !1);
  function C(b) {
    var v, I;
    if (e.builderContextSignal.content) {
      const y = (v = e.builderContextSignal.content) == null ? void 0 : v.testVariationId, S = (I = e.builderContextSignal.content) == null ? void 0 : I.id;
      se({
        type: "click",
        canTrack: _(e.canTrack),
        contentId: S,
        apiKey: e.apiKey,
        variationId: y !== S ? y : void 0,
        ...Ht(b),
        unique: !g
      });
    }
    g || x(!0);
  }
  function u() {
    var v, I, y;
    const b = (y = (I = (v = e.builderContextSignal.content) == null ? void 0 : v.data) == null ? void 0 : I.httpRequests) != null ? y : {};
    Object.entries(b).forEach(([S, p]) => {
      if (!p || f[S] || s[S] && !H())
        return;
      f[S] = !0;
      const D = p.replace(
        /{{([^}]+)}}/g,
        (P, Re) => String(
          K({
            code: Re,
            context: e.context || {},
            localState: void 0,
            rootState: e.builderContextSignal.rootState,
            rootSetState: e.builderContextSignal.rootSetState,
            enableCache: !0
          })
        )
      );
      Ke(D).then((P) => P.json()).then((P) => {
        n({
          [S]: P
        }), s[S] = !0;
      }).catch((P) => {
        console.error("error fetching dynamic data", p, P);
      }).finally(() => {
        f[S] = !1;
      });
    });
  }
  function m() {
    H() && window.dispatchEvent(
      new CustomEvent(
        "builder:component:stateChange",
        {
          detail: {
            state: Z(e.builderContextSignal.rootState),
            ref: {
              name: e.model
            }
          }
        }
      )
    );
  }
  return T(() => {
    var b, v;
    if (L()) {
      if (H() && (window.addEventListener("message", r), Oe({
        ...e.locale ? {
          locale: e.locale
        } : {},
        ...e.enrich ? {
          enrich: e.enrich
        } : {},
        ...e.trustedHosts ? {
          trustedHosts: e.trustedHosts
        } : {}
      }), Object.values(
        e.builderContextSignal.componentInfos
      ).forEach((y) => {
        var p;
        const S = He(y);
        (p = window.parent) == null || p.postMessage(S, "*");
      }), window.addEventListener(
        "builder:component:stateChangeListenerActivated",
        m
      )), e.builderContextSignal.content && _(e.canTrack)) {
        const y = (b = e.builderContextSignal.content) == null ? void 0 : b.testVariationId, S = (v = e.builderContextSignal.content) == null ? void 0 : v.id, p = e.apiKey;
        se({
          type: "impression",
          canTrack: !0,
          contentId: S,
          apiKey: p,
          variationId: y !== S ? y : void 0
        });
      }
      if (Le()) {
        const y = new URL(location.href).searchParams, S = y.get("builder.preview"), p = y.get(
          `builder.preview.${S}`
        ), D = y.get("apiKey") || y.get("builder.space");
        S === e.model && D === e.apiKey && (!e.content || p === e.content.id) && ke({
          model: e.model,
          apiKey: e.apiKey,
          apiVersion: e.builderContextSignal.apiVersion
        }).then((P) => {
          P && i(P);
        });
      }
    }
  }, []), T(() => {
    e.apiKey || F.error(
      "No API key provided to `RenderContent` component. This can cause issues. Please provide an API key using the `apiKey` prop."
    ), l(), u(), m();
  }, []), T(() => {
    e.content && i(e.content);
  }, [e.content]), T(() => {
    l();
  }, [(A = (k = e.builderContextSignal.content) == null ? void 0 : k.data) == null ? void 0 : A.jsCode]), T(() => {
    u();
  }, [(R = (W = e.builderContextSignal.content) == null ? void 0 : W.data) == null ? void 0 : R.httpRequests]), T(() => {
    m();
  }, [e.builderContextSignal.rootState]), T(() => {
    e.data && n(e.data);
  }, [e.data]), T(() => {
    e.locale && n({
      locale: e.locale
    });
  }, [e.locale]), T(() => () => {
    L() && (window.removeEventListener("message", r), window.removeEventListener(
      "builder:component:stateChangeListenerActivated",
      m
    ));
  }, []), /* @__PURE__ */ c(ee.Provider, { value: e.builderContextSignal, children: e.builderContextSignal.content ? /* @__PURE__ */ c(
    o,
    {
      ref: t,
      onClick: (b) => C(b),
      "builder-content-id": ($ = e.builderContextSignal.content) == null ? void 0 : $.id,
      "builder-model": e.model,
      ...e.showContent ? {} : {
        hidden: !0,
        "aria-hidden": !0
      },
      ...e.contentWrapperProps,
      className: `variant-${((Q = e.content) == null ? void 0 : Q.testVariationId) || ((le = e.content) == null ? void 0 : le.id)}`,
      children: e.children
    }
  ) : null });
}
const Ft = (e) => {
  var a, r;
  const t = e.family + (e.kind && !e.kind.includes("#") ? ", " + e.kind : ""), n = t.split(",")[0], i = (r = e.fileUrl) != null ? r : (a = e == null ? void 0 : e.files) == null ? void 0 : a.regular;
  let o = "";
  if (i && t && n && (o += `
@font-face {
font-family: "${t}";
src: local("${n}"), url('${i}') format('woff2');
font-display: fallback;
font-weight: 400;
}
      `.trim()), e.files)
    for (const l in e.files) {
      if (!(String(Number(l)) === l))
        continue;
      const d = e.files[l];
      d && d !== i && (o += `
@font-face {
font-family: "${t}";
src: url('${d}') format('woff2');
font-display: fallback;
font-weight: ${l};
}
        `.trim());
    }
  return o;
}, Kt = ({
  customFonts: e
}) => {
  var t;
  return ((t = e == null ? void 0 : e.map((n) => Ft(n))) == null ? void 0 : t.join(" ")) || "";
}, Mt = ({
  cssCode: e,
  contentId: t
}) => e ? t ? (e == null ? void 0 : e.replace(/&/g, `div[builder-content-id="${t}"]`)) || "" : e : "", jt = `
.builder-button {
  all: unset;
}

.builder-text > p:first-of-type, .builder-text > .builder-paragraph:first-of-type {
  margin: 0;
}
.builder-text > p, .builder-text > .builder-paragraph {
  color: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  font-weight: inherit;
  font-size: inherit;
  text-align: inherit;
  font-family: inherit;
}
`, Ut = (e) => e ? "" : jt;
function _t(e) {
  const [t, n] = E(
    () => `
${Mt({
      cssCode: e.cssCode,
      contentId: e.contentId
    })}
${Kt({
      customFonts: e.customFonts
    })}
${Ut(e.isNestedRender)}
`.trim()
  );
  return /* @__PURE__ */ c(q, { id: "builderio-content", styles: t });
}
const zt = ({
  content: e,
  data: t,
  locale: n
}) => {
  var a, r, l;
  const i = {}, o = ((a = e == null ? void 0 : e.data) == null ? void 0 : a.state) || {};
  return (l = (r = e == null ? void 0 : e.data) == null ? void 0 : r.inputs) == null || l.forEach((s) => {
    s.name && s.defaultValue !== void 0 && (i[s.name] = s.defaultValue);
  }), {
    ...i,
    ...o,
    ...t,
    ...n ? {
      locale: n
    } : {}
  };
}, qt = ({
  content: e,
  data: t
}) => e ? {
  ...e,
  data: {
    ...e == null ? void 0 : e.data,
    ...t
  },
  meta: e == null ? void 0 : e.meta
} : void 0;
function Se(e) {
  var s, d, f, h, g, x, C;
  const [t, n] = E(
    () => {
      var u, m;
      return $t({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        variationId: (u = e.content) == null ? void 0 : u.testVariationId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        contentId: (m = e.content) == null ? void 0 : m.id
      });
    }
  );
  function i(u) {
    l((m) => ({
      ...m,
      rootState: u
    }));
  }
  const [o, a] = E(
    () => [
      ...he(),
      ...e.customComponents || []
    ].reduce(
      (u, { component: m, ...k }) => ({
        ...u,
        [k.name]: {
          component: m,
          ...de(k)
        }
      }),
      {}
    )
  ), [r, l] = E(() => ({
    content: qt({
      content: e.content,
      data: e.data
    }),
    localState: void 0,
    rootState: zt({
      content: e.content,
      data: e.data,
      locale: e.locale
    }),
    rootSetState: i,
    context: e.context || {},
    apiKey: e.apiKey,
    apiVersion: e.apiVersion,
    componentInfos: [
      ...he(),
      ...e.customComponents || []
    ].reduce(
      (u, { component: m, ...k }) => ({
        ...u,
        [k.name]: de(k)
      }),
      {}
    ),
    inheritedStyles: {},
    BlocksWrapper: e.blocksWrapper || "div",
    BlocksWrapperProps: e.blocksWrapperProps || {}
  }));
  return /* @__PURE__ */ c(
    xe.Provider,
    {
      value: {
        registeredComponents: o
      },
      children: /* @__PURE__ */ N(
        Lt,
        {
          content: e.content,
          data: e.data,
          model: e.model,
          context: e.context,
          apiKey: e.apiKey,
          canTrack: e.canTrack,
          locale: e.locale,
          enrich: e.enrich,
          showContent: e.showContent,
          builderContextSignal: r,
          contentWrapper: e.contentWrapper,
          contentWrapperProps: e.contentWrapperProps,
          linkComponent: e.linkComponent,
          trustedHosts: e.trustedHosts,
          setBuilderContextSignal: l,
          children: [
            e.isSsrAbTest ? /* @__PURE__ */ c(
              X,
              {
                id: "builderio-variant-visibility",
                scriptStr: t
              }
            ) : null,
            /* @__PURE__ */ c(
              _t,
              {
                isNestedRender: e.isNestedRender,
                contentId: (s = r.content) == null ? void 0 : s.id,
                cssCode: (f = (d = r.content) == null ? void 0 : d.data) == null ? void 0 : f.cssCode,
                customFonts: (g = (h = r.content) == null ? void 0 : h.data) == null ? void 0 : g.customFonts
              }
            ),
            /* @__PURE__ */ c(
              re,
              {
                blocks: (C = (x = r.content) == null ? void 0 : x.data) == null ? void 0 : C.blocks,
                context: r,
                registeredComponents: o,
                linkComponent: e.linkComponent
              }
            )
          ]
        }
      )
    }
  );
}
function Yt(e) {
  var r;
  const [t, n] = E(
    () => Wt({
      canTrack: _(e.canTrack),
      content: e.content
    })
  );
  function i() {
    var l;
    return Vt(
      j(e.content).map((s) => ({
        id: s.testVariationId,
        testRatio: s.testRatio
      })),
      ((l = e.content) == null ? void 0 : l.id) || ""
    );
  }
  function o() {
    return j(e.content).map((l) => `.variant-${l.testVariationId} { display: none; } `).join("");
  }
  function a() {
    var l;
    return t ? {
      ...e.content,
      testVariationId: (l = e.content) == null ? void 0 : l.id
    } : Me({
      item: e.content,
      canTrack: _(e.canTrack)
    });
  }
  return T(() => {
  }, []), /* @__PURE__ */ N(w, { children: [
    !e.isNestedRender && M !== "reactNative" ? /* @__PURE__ */ c(
      X,
      {
        id: "builderio-init-variants-fns",
        scriptStr: Nt()
      }
    ) : null,
    t ? /* @__PURE__ */ N(w, { children: [
      /* @__PURE__ */ c(
        q,
        {
          id: "builderio-variants",
          styles: o()
        }
      ),
      /* @__PURE__ */ c(
        X,
        {
          id: "builderio-variants-visibility",
          scriptStr: i()
        }
      ),
      (r = j(e.content)) == null ? void 0 : r.map((l) => /* @__PURE__ */ c(
        Se,
        {
          isNestedRender: e.isNestedRender,
          content: l,
          showContent: !1,
          model: e.model,
          data: e.data,
          context: e.context,
          apiKey: e.apiKey,
          apiVersion: e.apiVersion,
          customComponents: e.customComponents,
          linkComponent: e.linkComponent,
          canTrack: e.canTrack,
          locale: e.locale,
          enrich: e.enrich,
          isSsrAbTest: t,
          blocksWrapper: e.blocksWrapper,
          blocksWrapperProps: e.blocksWrapperProps,
          contentWrapper: e.contentWrapper,
          contentWrapperProps: e.contentWrapperProps,
          trustedHosts: e.trustedHosts
        },
        l.testVariationId
      ))
    ] }) : null,
    /* @__PURE__ */ c(
      Se,
      {
        isNestedRender: e.isNestedRender,
        content: a(),
        showContent: !0,
        model: e.model,
        data: e.data,
        context: e.context,
        apiKey: e.apiKey,
        apiVersion: e.apiVersion,
        customComponents: e.customComponents,
        linkComponent: e.linkComponent,
        canTrack: e.canTrack,
        locale: e.locale,
        enrich: e.enrich,
        isSsrAbTest: t,
        blocksWrapper: e.blocksWrapper,
        blocksWrapperProps: e.blocksWrapperProps,
        contentWrapper: e.contentWrapper,
        contentWrapperProps: e.contentWrapperProps,
        trustedHosts: e.trustedHosts
      }
    )
  ] });
}
const Qt = async ({
  builderContextValue: e,
  symbol: t
}) => {
  if (t != null && t.model && // This is a hack, we should not need to check for this, but it is needed for Svelte.
  (e != null && e.apiKey))
    return ke({
      model: t.model,
      apiKey: e.apiKey,
      apiVersion: e.apiVersion,
      ...(t == null ? void 0 : t.entry) && {
        query: {
          id: t.entry
        }
      }
    }).catch((n) => {
      F.error("Could not fetch symbol content: ", n);
    });
};
function Jt(e) {
  var a, r, l, s;
  function t() {
    var d, f;
    return [
      e.attributes[oe()],
      "builder-symbol",
      (d = e.symbol) != null && d.inline ? "builder-inline-symbol" : void 0,
      (f = e.symbol) != null && f.dynamic || e.dynamic ? "builder-dynamic-symbol" : void 0
    ].filter(Boolean).join(" ");
  }
  const [n, i] = E(() => {
    var d;
    return (d = e.symbol) == null ? void 0 : d.content;
  });
  function o() {
    n || Qt({
      symbol: e.symbol,
      builderContextValue: e.builderContext
    }).then((d) => {
      d && i(d);
    });
  }
  return T(() => {
  }, []), T(() => {
    o();
  }, [e.symbol]), /* @__PURE__ */ c("div", { ...e.attributes, className: t(), children: /* @__PURE__ */ c(
    Yt,
    {
      isNestedRender: !0,
      apiVersion: e.builderContext.apiVersion,
      apiKey: e.builderContext.apiKey,
      context: {
        ...e.builderContext.context,
        symbolId: (a = e.builderBlock) == null ? void 0 : a.id
      },
      customComponents: Object.values(e.builderComponents),
      data: {
        ...(r = e.symbol) == null ? void 0 : r.data,
        ...e.builderContext.localState,
        ...(l = n == null ? void 0 : n.data) == null ? void 0 : l.state
      },
      model: (s = e.symbol) == null ? void 0 : s.model,
      content: n,
      linkComponent: e.builderLinkComponent,
      blocksWrapper: "div",
      contentWrapper: "div"
    }
  ) });
}
export {
  re as Blocks,
  Ct as Columns,
  Yt as Content,
  Jt as Symbol,
  At as Text
};
