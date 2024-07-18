"use client";
var Ne = Object.defineProperty;
var $e = (e, t, n) => t in e ? Ne(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var G = (e, t, n) => ($e(e, typeof t != "symbol" ? t + "" : t, n), n);
import { jsx as s, Fragment as T, jsxs as N } from "react/jsx-runtime";
import { createContext as ye, useState as B, useEffect as P, useContext as ce, useRef as Ve } from "react";
import { isEditing as F, isBrowser as H, getUserAttributes as Oe, checkIsDefined as U, logger as K, fastClone as Z, TARGET as D, setupBrowserForEditing as Le, createRegisterComponentMessage as Fe, getDefaultCanTrack as _, _track as se, isPreviewing as He, fetchOneEntry as ke, createEditorListener as Ke, fetch as Me, serializeComponentInfo as de, handleABTestingSync as De } from "./server-entry-3045f8ca.js";
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
  isEditing: F(),
  isBrowser: H(),
  isServer: !H(),
  getUserAttributes: () => Oe()
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
    state: Ce({
      rootState: r,
      localState: o,
      rootSetState: a
    })
  });
  return new Function(...l.map(([c]) => c), e)(...l.map(([, c]) => c));
};
function Ce({
  rootState: e,
  localState: t,
  rootSetState: n
}) {
  return new Proxy(e, {
    get: (i, o) => {
      if (t && o in t)
        return t[o];
      const a = i[o];
      return typeof a == "object" && a !== null ? Ce({
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
  return e && t && !n ? (K.log("Skipping usage of `isolated-vm` to avoid crashes in Node v20 on an arm64 machine.\n    If you would like to use the `isolated-vm` package on this machine, please provide the `NODE_OPTIONS=--no-node-snapshot` config to your Node process.\n    See https://github.com/BuilderIO/builder/blob/main/packages/sdks/README.md#node-v20--m1-macs-apple-silicon-support for more information.\n    "), !0) : !1;
}, Je = (e) => (H() || Ye(), ue(e)), E = class E {
  static getCacheKey(t) {
    return JSON.stringify({
      ...t,
      // replace the event with a random number to break cache
      // thats because we can't serialize the event object due to circular refs in DOM node refs.
      event: t.event ? Math.random() : void 0
    });
  }
  static getCachedValue(t) {
    return E.cache.get(t);
  }
  static setCachedValue(t, n) {
    E.cache.size > 20 && E.cache.delete(E.cache.keys().next().value), E.cache.set(t, {
      value: n
    });
  }
};
G(E, "cacheLimit", 20), G(E, "cache", /* @__PURE__ */ new Map());
let L = E;
function M({
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
    K.warn("Skipping evaluation of empty code block.");
    return;
  }
  const c = {
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
    const d = L.getCacheKey(c), m = L.getCachedValue(d);
    if (m)
      return m.value;
  }
  try {
    const d = Je(c);
    if (l) {
      const m = L.getCacheKey(c);
      L.setCachedValue(m, d);
    }
    return d;
  } catch (d) {
    K.error("Failed code evaluation: " + d.message, {
      code: e
    });
    return;
  }
}
const Ge = (e, t, n) => {
  if (Object(e) !== e)
    return e;
  const i = Array.isArray(t) ? t : t.toString().match(/[^.[\]]+/g);
  return i.slice(0, -1).reduce((o, a, r) => Object(o[a]) === o[a] ? o[a] : o[a] = Math.abs(Number(i[r + 1])) >> 0 === +i[r + 1] ? [] : {}, e)[i[i.length - 1]] = n, e;
};
const Qe = ({
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
    const c = e.bindings[l], d = M({
      code: c,
      localState: n,
      rootState: i,
      rootSetState: o,
      context: t,
      enableCache: !0
    });
    Ge(r, l, d);
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
  return n ? Qe({
    block: r,
    localState: i,
    rootState: o,
    rootSetState: a,
    context: t
  }) : r;
}
function Xe(e, t, n = {}) {
  let i, o, a, r = null, l = 0;
  const c = function() {
    l = n.leading === !1 ? 0 : Date.now(), r = null, a = e.apply(i, o), r || (i = o = null);
  };
  return function() {
    const d = Date.now();
    !l && n.leading === !1 && (l = d);
    const m = t - (d - l);
    return i = this, o = arguments, m <= 0 || m > t ? (r && (clearTimeout(r), r = null), l = d, a = e.apply(i, o), r || (i = o = null)) : !r && n.trailing !== !1 && (r = setTimeout(c, m)), a;
  };
}
function $(e, ...t) {
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
        ve(t);
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
    for (const c of n)
      c in l || (l[c] = i[c]);
}
function et(e) {
  const t = [];
  for (const n of e.steps)
    for (const i in n.styles)
      t.indexOf(i) === -1 && t.push(i);
  return t;
}
function ve(e) {
  const t = Array.prototype.slice.call(document.getElementsByClassName(e.elementId || e.id || ""));
  if (!t.length) {
    ne(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    ie(e, n), n.style.transition = "none", n.style.transitionDelay = "0", $(n.style, e.steps[0].styles), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${te(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s"), $(n.style, e.steps[1].styles), setTimeout(() => {
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
      $(n.style, i);
    }
    function r() {
      $(n.style, o);
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
        $(n.style, e.steps[1].styles), e.repeat || document.removeEventListener("scroll", r), setTimeout(() => {
          o = !1, e.repeat || (n.style.transition = "", n.style.transitionDelay = "");
        }, (e.duration + (e.delay || 0)) * 1e3 + 100);
      })) : e.repeat && i && !o && !l(n) && (i = !1, $(n.style, e.steps[0].styles));
    }
    const r = Xe(a, 200, {
      leading: !1
    });
    function l(m) {
      const g = m.getBoundingClientRect(), b = window.innerHeight, h = (e.thresholdPercent || 0) / 100 * b;
      return g.bottom > h && g.top < b - h;
    }
    const c = e.steps[0].styles;
    function d() {
      $(n.style, c);
    }
    d(), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${te(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s");
    }), document.addEventListener("scroll", r, {
      capture: !0,
      passive: !0
    }), a();
  });
}
const it = (e) => e.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase(), we = (e) => Object.entries(e).map(([n, i]) => {
  if (typeof i == "string")
    return `${it(n)}: ${i};`;
}).filter(U), ot = (e) => we(e).join(`
`), Q = ({
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
function rt({
  style: e
}) {
  return e;
}
const at = ({
  block: e,
  context: t
}) => Ie(rt({
  style: e.style || {},
  context: t,
  block: e
}));
function Ie(e) {
  switch (D) {
    case "svelte":
    case "vue":
    case "solid":
      return we(e).join(" ");
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
  const o = M({
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
  return o.map((c, d) => ({
    context: {
      ...t,
      localState: {
        ...t.localState,
        $index: d,
        $item: c,
        [r]: c,
        [`$${r}Index`]: d
      }
    },
    block: i
  }));
}, Te = {
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
}, me = (e, t = Te) => `@media (max-width: ${t[e].max}px)`, Ae = ({
  small: e,
  medium: t
}) => {
  const n = Z(Te);
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
  return /* @__PURE__ */ s(
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
    var h;
    const i = z({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    }), o = i.responsiveStyles, a = e.context.content, r = Ae(
      ((h = a == null ? void 0 : a.meta) == null ? void 0 : h.breakpoints) || {}
    ), l = o == null ? void 0 : o.large, c = o == null ? void 0 : o.medium, d = o == null ? void 0 : o.small, m = i.id;
    if (!m)
      return "";
    const g = l ? Q({
      className: m,
      styles: l
    }) : "", b = c ? Q({
      className: m,
      styles: c,
      mediaQuery: me(
        "medium",
        r
      )
    }) : "", y = d ? Q({
      className: m,
      styles: d,
      mediaQuery: me(
        "small",
        r
      )
    }) : "";
    return [g, b, y].join(" ");
  }
  return /* @__PURE__ */ s(T, { children: n() && t() ? /* @__PURE__ */ s(T, { children: /* @__PURE__ */ s(q, { id: "builderio-block", styles: n() }) }) : null });
}
function dt(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
const ut = (e) => `on${dt(e)}`, mt = (e, t) => (n) => M({
  code: e,
  context: t.context,
  localState: t.localState,
  rootState: t.rootState,
  rootSetState: t.rootSetState,
  event: n,
  isExpression: !1,
  enableCache: !0
});
function Pe(e) {
  var i;
  const t = {}, n = (i = e.block.actions) != null ? i : {};
  for (const o in n) {
    if (!n.hasOwnProperty(o))
      continue;
    const a = n[o];
    let r = ut(o);
    if (e.stripPrefix)
      switch (D) {
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
  switch (D) {
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
function re({
  block: e,
  context: t
}) {
  var i;
  const n = {
    ...ht(e),
    ...e.properties,
    "builder-id": e.id,
    style: at({
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
function Be(e) {
  return /* @__PURE__ */ s(T, { children: bt(e.TagName) ? /* @__PURE__ */ s(T, { children: /* @__PURE__ */ s(e.TagName, { ...e.attributes, ...e.actionAttributes }) }) : /* @__PURE__ */ s(T, { children: typeof e.TagName == "string" ? /* @__PURE__ */ s(e.TagName, { ...e.attributes, ...e.actionAttributes, children: e.children }) : /* @__PURE__ */ s(e.TagName, { ...e.attributes, ...e.actionAttributes, children: e.children }) }) });
}
function St(e) {
  return /* @__PURE__ */ s(
    Be,
    {
      TagName: e.Wrapper,
      attributes: re({
        block: e.block,
        context: e.context
      }),
      actionAttributes: Pe({
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
  return /* @__PURE__ */ s(
    e.Wrapper,
    {
      ...e.wrapperProps,
      attributes: e.includeBlockProps ? {
        ...re({
          block: e.block,
          context: e.context
        }),
        ...Pe({
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
      attributes: re({
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
  const [t, n] = B(
    () => e.isInteractive ? yt : e.componentRef
  );
  return /* @__PURE__ */ s(T, { children: e.componentRef ? /* @__PURE__ */ s(T, { children: /* @__PURE__ */ s(
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
      children: (i = e.blockChildren) == null ? void 0 : i.map((o) => /* @__PURE__ */ s(
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
  const [t, n] = B(() => e.repeatContext);
  return /* @__PURE__ */ s(ee.Provider, { value: t, children: /* @__PURE__ */ s(
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
  var c, d, m;
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
    var g;
    return (g = e.block.repeat) != null && g.collection ? e.block : z({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    });
  }
  function o() {
    var b;
    return e.block.tagName === "a" || ((b = i().properties) == null ? void 0 : b.href) || i().href ? e.linkComponent || "a" : e.block.tagName || "div";
  }
  function a() {
    var y, h;
    if ((y = e.block.repeat) != null && y.collection)
      return !!((h = n == null ? void 0 : n()) != null && h.length);
    const g = "hide" in i() ? i().hide : !1;
    return ("show" in i() ? i().show : !0) && !g;
  }
  function r() {
    var b, y;
    return !((b = t == null ? void 0 : t()) != null && b.component) && !n() ? (y = i().children) != null ? y : [] : [];
  }
  function l() {
    var g, b, y, h, u, f, S, C, R, W, V;
    return {
      blockChildren: (g = i().children) != null ? g : [],
      componentRef: (b = t == null ? void 0 : t()) == null ? void 0 : b.component,
      componentOptions: {
        ...je(i()),
        builderContext: e.context,
        ...((y = t == null ? void 0 : t()) == null ? void 0 : y.name) === "Core:Button" || ((h = t == null ? void 0 : t()) == null ? void 0 : h.name) === "Symbol" || ((u = t == null ? void 0 : t()) == null ? void 0 : u.name) === "Columns" || ((f = t == null ? void 0 : t()) == null ? void 0 : f.name) === "Form:Form" ? {
          builderLinkComponent: e.linkComponent
        } : {},
        ...((S = t == null ? void 0 : t()) == null ? void 0 : S.name) === "Symbol" || ((C = t == null ? void 0 : t()) == null ? void 0 : C.name) === "Columns" || ((R = t == null ? void 0 : t()) == null ? void 0 : R.name) === "Form:Form" ? {
          builderComponents: e.registeredComponents
        } : {}
      },
      context: e.context,
      linkComponent: e.linkComponent,
      registeredComponents: e.registeredComponents,
      builderBlock: i(),
      includeBlockProps: ((W = t == null ? void 0 : t()) == null ? void 0 : W.noWrap) === !0,
      isInteractive: !((V = t == null ? void 0 : t()) != null && V.isRSC)
    };
  }
  return P(() => {
    const g = i().id, b = i().animations;
    b && g && Ze(
      b.filter((y) => y.trigger !== "hover").map((y) => ({
        ...y,
        elementId: g
      }))
    );
  }, []), /* @__PURE__ */ s(T, { children: a() ? /* @__PURE__ */ N(T, { children: [
    /* @__PURE__ */ s(st, { block: e.block, context: e.context }),
    (c = t == null ? void 0 : t()) != null && c.noWrap ? /* @__PURE__ */ s(T, { children: /* @__PURE__ */ s(
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
    ) }) : /* @__PURE__ */ s(T, { children: n() ? /* @__PURE__ */ s(T, { children: (m = n()) == null ? void 0 : m.map((g, b) => /* @__PURE__ */ s(
      xt,
      {
        repeatContext: g.context,
        block: g.block,
        registeredComponents: e.registeredComponents,
        linkComponent: e.linkComponent
      },
      b
    )) }) : /* @__PURE__ */ N(
      St,
      {
        Wrapper: o(),
        block: i(),
        context: e.context,
        linkComponent: e.linkComponent,
        children: [
          /* @__PURE__ */ s(
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
          (d = r()) == null ? void 0 : d.map((g) => /* @__PURE__ */ s(
            Y,
            {
              block: g,
              registeredComponents: e.registeredComponents,
              linkComponent: e.linkComponent,
              context: e.context
            },
            g.id
          ))
        ]
      }
    ) })
  ] }) : null });
}
function Ct(e) {
  function t() {
    var o;
    return "builder-blocks" + ((o = e.blocks) != null && o.length ? "" : " no-blocks");
  }
  function n() {
    var o, a;
    F() && !((o = e.blocks) != null && o.length) && ((a = window.parent) == null || a.postMessage(
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
    F() && !((o = e.blocks) != null && o.length) && ((a = window.parent) == null || a.postMessage(
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
  return /* @__PURE__ */ N(T, { children: [
    /* @__PURE__ */ s(
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
    /* @__PURE__ */ s("style", { children: `.props-blocks-wrapper-7cd1560e {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}` })
  ] });
}
function ae(e) {
  var i, o, a;
  const t = ce(ee), n = ce(xe);
  return /* @__PURE__ */ s(
    Ct,
    {
      blocks: e.blocks,
      parent: e.parent,
      path: e.path,
      styleProp: e.styleProp,
      BlocksWrapper: ((i = e.context) == null ? void 0 : i.BlocksWrapper) || t.BlocksWrapper,
      BlocksWrapperProps: ((o = e.context) == null ? void 0 : o.BlocksWrapperProps) || t.BlocksWrapperProps,
      children: e.blocks ? /* @__PURE__ */ s(T, { children: (a = e.blocks) == null ? void 0 : a.map((r) => /* @__PURE__ */ s(
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
function vt(e) {
  var h;
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
    var S;
    const f = n();
    return ((S = f[u]) == null ? void 0 : S.width) || 100 / f.length;
  }
  function a(u) {
    const f = n(), S = t() * (f.length - 1) / f.length;
    return `calc(${o(u)}% - ${S}px)`;
  }
  function r({
    stackedStyle: u,
    desktopStyle: f
  }) {
    return i() === "tablet" ? u : f;
  }
  function l({
    stackedStyle: u,
    desktopStyle: f
  }) {
    return i() === "never" ? f : u;
  }
  const [c, d] = B(
    () => e.stackColumnsAt === "never" ? "row" : e.reverseColumnsWhenStacked ? "column-reverse" : "column"
  );
  function m() {
    return {
      "--flex-dir": c,
      "--flex-dir-tablet": r({
        stackedStyle: c,
        desktopStyle: "row"
      })
    };
  }
  function g(u) {
    const f = u === 0 ? 0 : t(), S = a(u), C = `${f}px`, R = "100%", W = 0;
    return {
      ...{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
      },
      width: S,
      ["marginLeft"]: C,
      "--column-width-mobile": l({
        stackedStyle: R,
        desktopStyle: S
      }),
      "--column-margin-left-mobile": l({
        stackedStyle: W,
        desktopStyle: C
      }),
      "--column-width-tablet": r({
        stackedStyle: R,
        desktopStyle: S
      }),
      "--column-margin-left-tablet": r({
        stackedStyle: W,
        desktopStyle: C
      })
    };
  }
  function b(u) {
    var S, C;
    return Ae(
      ((C = (S = e.builderContext.content) == null ? void 0 : S.meta) == null ? void 0 : C.breakpoints) || {}
    )[u].max;
  }
  function y() {
    return `
        @media (max-width: ${b("medium")}px) {
          .${e.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir-tablet);
            align-items: stretch;
          }

          .${e.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-tablet) !important;
            margin-left: var(--column-margin-left-tablet) !important;
          }
        }

        @media (max-width: ${b("small")}px) {
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
  return /* @__PURE__ */ N(T, { children: [
    /* @__PURE__ */ N(
      "div",
      {
        className: `builder-columns ${e.builderBlock.id}-breakpoints div-a6ce8b7c`,
        style: m(),
        children: [
          /* @__PURE__ */ s(q, { id: "builderio-columns", styles: y() }),
          (h = e.columns) == null ? void 0 : h.map((u, f) => /* @__PURE__ */ s(
            Be,
            {
              TagName: u.link ? e.builderLinkComponent || "a" : "div",
              actionAttributes: {},
              attributes: {
                ...u.link ? {
                  href: u.link
                } : {},
                [oe()]: "builder-column",
                style: Ie(g(f))
              },
              children: /* @__PURE__ */ s(
                ae,
                {
                  path: `component.options.columns.${f}.blocks`,
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
            f
          ))
        ]
      }
    ),
    /* @__PURE__ */ s("style", { children: `.div-a6ce8b7c {
  display: flex;
  line-height: normal;
}` })
  ] });
}
const wt = {
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
      Array.isArray(n) && n.find((o) => o.get("width")) && (n.find((a) => !a.get("width")) || n.reduce((l, c) => l + c.get("width"), 0) !== 100) && t();
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
}, It = {
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
function Tt(e) {
  var t, n, i;
  return /* @__PURE__ */ s(
    "div",
    {
      style: {
        pointerEvents: "auto"
      },
      ...!((t = e.builderContext.context) != null && t.symbolId) && {
        "builder-slot": e.name
      },
      children: /* @__PURE__ */ s(
        ae,
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
const At = {
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
}, Pt = {
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
function Bt(e) {
  var t;
  return /* @__PURE__ */ s(
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
  component: vt,
  ...wt
}, {
  component: Tt,
  ...It
}, {
  component: Xt,
  ...At
}, {
  component: Bt,
  ...Pt
}];
function pt(e, t, n) {
  var r;
  function i() {
    function l(h, u, f) {
      let S = "";
      if (f) {
        const C = /* @__PURE__ */ new Date();
        C.setTime(C.getTime() + f * 24 * 60 * 60 * 1e3), S = "; expires=" + C.toUTCString();
      }
      document.cookie = h + "=" + (u || "") + S + "; path=/; Secure; SameSite=None";
    }
    function c(h) {
      const u = h + "=", f = document.cookie.split(";");
      for (let S = 0; S < f.length; S++) {
        let C = f[S];
        for (; C.charAt(0) === " "; )
          C = C.substring(1, C.length);
        if (C.indexOf(u) === 0)
          return C.substring(u.length, C.length);
      }
      return null;
    }
    const d = `builder.tests.${e}`, m = c(d), g = t.map((h) => h.id).concat(e);
    if (m && g.includes(m))
      return m;
    let b = 0;
    const y = Math.random();
    for (let h = 0; h < t.length; h++) {
      const u = t[h], f = u.testRatio;
      if (b += f, y < b)
        return l(d, u.id), u.id;
    }
    return l(d, e), e;
  }
  const o = i(), a = (r = document.currentScript) == null ? void 0 : r.previousElementSibling;
  if (n) {
    a.remove();
    const l = document.currentScript;
    l == null || l.remove();
  } else {
    const l = t.concat({
      id: e
    }).filter((c) => c.id !== o).map((c) => `.variant-${c.id} {  display: none; }
        `).join("");
    a.innerHTML = l;
  }
}
function Et(e, t, n) {
  var d;
  if (!navigator.cookieEnabled)
    return;
  function i(m) {
    const g = m + "=", b = document.cookie.split(";");
    for (let y = 0; y < b.length; y++) {
      let h = b[y];
      for (; h.charAt(0) === " "; )
        h = h.substring(1, h.length);
      if (h.indexOf(g) === 0)
        return h.substring(g.length, h.length);
    }
    return null;
  }
  const o = `builder.tests.${t}`, a = i(o), r = (d = document.currentScript) == null ? void 0 : d.parentElement, l = e === t, c = a === e;
  if (c && !l ? (r == null || r.removeAttribute("hidden"), r == null || r.removeAttribute("aria-hidden")) : !c && l && (r == null || r.setAttribute("hidden", "true"), r == null || r.setAttribute("aria-hidden", "true")), n) {
    c || r == null || r.remove();
    const m = document.currentScript;
    m == null || m.remove();
  }
}
const Rt = pt.toString().replace(/\s+/g, " "), Wt = Et.toString().replace(/\s+/g, " "), pe = "builderIoAbTest", Ee = "builderIoRenderContent", j = (e) => Object.values((e == null ? void 0 : e.variations) || {}).map((t) => ({
  ...t,
  testVariationId: t.id,
  id: e == null ? void 0 : e.id
})), Nt = ({
  canTrack: e,
  content: t
}) => !(!(j(t).length > 0) || !e || H()), $t = (e) => e === "react" || e === "reactNative", Re = $t(D), Vt = () => `
  window.${pe} = ${Rt}
  window.${Ee} = ${Wt}
  `, Ot = (e, t) => `
  window.${pe}(
    "${t}",${JSON.stringify(e)}, ${Re}
  )`, Lt = ({
  contentId: e,
  variationId: t
}) => `window.${Ee}(
    "${t}", "${e}", ${Re}
  )`;
function X(e) {
  return /* @__PURE__ */ s(
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
const Ft = (e, t, n = !0) => {
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
}, Ht = (e) => Ft(e, (t) => {
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
}, Kt = (e) => {
  const t = e.target, n = t && Ht(t), i = (n == null ? void 0 : n.getAttribute("builder-id")) || (n == null ? void 0 : n.id);
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
function Mt(e) {
  var S, C, R, W, V, J, le;
  const t = Ve(null);
  function n(k) {
    var I, v;
    const w = {
      ...e.builderContextSignal.rootState,
      ...k
    };
    e.builderContextSignal.rootSetState ? (v = (I = e.builderContextSignal).rootSetState) == null || v.call(I, w) : e.setBuilderContextSignal((x) => ({
      ...x,
      rootState: w
    }));
  }
  function i(k) {
    var I, v, x, A, O;
    const w = {
      ...e.builderContextSignal.content,
      ...k,
      data: {
        ...(I = e.builderContextSignal.content) == null ? void 0 : I.data,
        ...k == null ? void 0 : k.data
      },
      meta: {
        ...(v = e.builderContextSignal.content) == null ? void 0 : v.meta,
        ...k == null ? void 0 : k.meta,
        breakpoints: ((x = k == null ? void 0 : k.meta) == null ? void 0 : x.breakpoints) || ((O = (A = e.builderContextSignal.content) == null ? void 0 : A.meta) == null ? void 0 : O.breakpoints)
      }
    };
    e.setBuilderContextSignal((p) => ({
      ...p,
      content: w
    }));
  }
  const [o, a] = B(
    () => e.contentWrapper || "div"
  );
  function r(k) {
    return Ke({
      model: e.model,
      trustedHosts: e.trustedHosts,
      callbacks: {
        configureSdk: (w) => {
          var x;
          const { breakpoints: I, contentId: v } = w;
          !v || v !== ((x = e.builderContextSignal.content) == null ? void 0 : x.id) || I && i({
            meta: {
              breakpoints: I
            }
          });
        },
        animation: (w) => {
          ve(w);
        },
        contentUpdate: (w) => {
          i(w);
        }
      }
    })(k);
  }
  function l() {
    var w, I;
    const k = (I = (w = e.builderContextSignal.content) == null ? void 0 : w.data) == null ? void 0 : I.jsCode;
    k && M({
      code: k,
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
  const [c, d] = B(() => ({})), [m, g] = B(() => ({})), [b, y] = B(() => !1);
  function h(k) {
    var w, I;
    if (e.builderContextSignal.content) {
      const v = (w = e.builderContextSignal.content) == null ? void 0 : w.testVariationId, x = (I = e.builderContextSignal.content) == null ? void 0 : I.id;
      se({
        type: "click",
        canTrack: _(e.canTrack),
        contentId: x,
        apiKey: e.apiKey,
        variationId: v !== x ? v : void 0,
        ...Kt(k),
        unique: !b
      });
    }
    b || y(!0);
  }
  function u() {
    var w, I, v;
    const k = (v = (I = (w = e.builderContextSignal.content) == null ? void 0 : w.data) == null ? void 0 : I.httpRequests) != null ? v : {};
    Object.entries(k).forEach(([x, A]) => {
      if (!A || m[x] || c[x] && !F())
        return;
      m[x] = !0;
      const O = A.replace(
        /{{([^}]+)}}/g,
        (p, We) => String(
          M({
            code: We,
            context: e.context || {},
            localState: void 0,
            rootState: e.builderContextSignal.rootState,
            rootSetState: e.builderContextSignal.rootSetState,
            enableCache: !0
          })
        )
      );
      Me(O).then((p) => p.json()).then((p) => {
        n({
          [x]: p
        }), c[x] = !0;
      }).catch((p) => {
        console.error("error fetching dynamic data", A, p);
      }).finally(() => {
        m[x] = !1;
      });
    });
  }
  function f() {
    F() && window.dispatchEvent(
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
  return P(() => {
    var k, w;
    if (H()) {
      if (F() && (window.addEventListener("message", r), Le({
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
      ).forEach((v) => {
        var A;
        const x = Fe(v);
        (A = window.parent) == null || A.postMessage(x, "*");
      }), window.addEventListener(
        "builder:component:stateChangeListenerActivated",
        f
      )), e.builderContextSignal.content && _(e.canTrack)) {
        const v = (k = e.builderContextSignal.content) == null ? void 0 : k.testVariationId, x = (w = e.builderContextSignal.content) == null ? void 0 : w.id, A = e.apiKey;
        se({
          type: "impression",
          canTrack: !0,
          contentId: x,
          apiKey: A,
          variationId: v !== x ? v : void 0
        });
      }
      if (He()) {
        const v = new URL(location.href).searchParams, x = v.get("builder.preview"), A = v.get(
          `builder.preview.${x}`
        ), O = v.get("apiKey") || v.get("builder.space");
        x === e.model && O === e.apiKey && (!e.content || A === e.content.id) && ke({
          model: e.model,
          apiKey: e.apiKey,
          apiVersion: e.builderContextSignal.apiVersion
        }).then((p) => {
          p && i(p);
        });
      }
    }
  }, []), P(() => {
    e.apiKey || K.error(
      "No API key provided to `RenderContent` component. This can cause issues. Please provide an API key using the `apiKey` prop."
    ), l(), u(), f();
  }, []), P(() => {
    e.content && i(e.content);
  }, [e.content]), P(() => {
    l();
  }, [(C = (S = e.builderContextSignal.content) == null ? void 0 : S.data) == null ? void 0 : C.jsCode]), P(() => {
    u();
  }, [(W = (R = e.builderContextSignal.content) == null ? void 0 : R.data) == null ? void 0 : W.httpRequests]), P(() => {
    f();
  }, [e.builderContextSignal.rootState]), P(() => {
    e.data && n(e.data);
  }, [e.data]), P(() => {
    e.locale && n({
      locale: e.locale
    });
  }, [e.locale]), P(() => () => {
    H() && (window.removeEventListener("message", r), window.removeEventListener(
      "builder:component:stateChangeListenerActivated",
      f
    ));
  }, []), /* @__PURE__ */ s(ee.Provider, { value: e.builderContextSignal, children: e.builderContextSignal.content ? /* @__PURE__ */ s(
    o,
    {
      ref: t,
      onClick: (k) => h(k),
      "builder-content-id": (V = e.builderContextSignal.content) == null ? void 0 : V.id,
      "builder-model": e.model,
      ...e.showContent ? {} : {
        hidden: !0,
        "aria-hidden": !0
      },
      ...e.contentWrapperProps,
      className: `variant-${((J = e.content) == null ? void 0 : J.testVariationId) || ((le = e.content) == null ? void 0 : le.id)}`,
      children: e.children
    }
  ) : null });
}
const Dt = (e) => {
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
}, jt = ({
  customFonts: e
}) => {
  var t;
  return ((t = e == null ? void 0 : e.map((n) => Dt(n))) == null ? void 0 : t.join(" ")) || "";
}, Ut = ({
  cssCode: e,
  contentId: t
}) => e ? t ? (e == null ? void 0 : e.replace(/&/g, `div[builder-content-id="${t}"]`)) || "" : e : "", _t = `
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
`, zt = (e) => e ? "" : _t;
function qt(e) {
  const [t, n] = B(
    () => `
${Ut({
      cssCode: e.cssCode,
      contentId: e.contentId
    })}
${jt({
      customFonts: e.customFonts
    })}
${zt(e.isNestedRender)}
`.trim()
  );
  return /* @__PURE__ */ s(q, { id: "builderio-content", styles: t });
}
const Yt = ({
  content: e,
  data: t,
  locale: n
}) => {
  var a, r, l;
  const i = {}, o = ((a = e == null ? void 0 : e.data) == null ? void 0 : a.state) || {};
  return (l = (r = e == null ? void 0 : e.data) == null ? void 0 : r.inputs) == null || l.forEach((c) => {
    c.name && c.defaultValue !== void 0 && (i[c.name] = c.defaultValue);
  }), {
    ...i,
    ...o,
    ...t,
    ...n ? {
      locale: n
    } : {}
  };
}, Jt = ({
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
  var c, d, m, g, b, y, h;
  const [t, n] = B(
    () => {
      var u, f;
      return Lt({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        variationId: (u = e.content) == null ? void 0 : u.testVariationId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        contentId: (f = e.content) == null ? void 0 : f.id
      });
    }
  );
  function i(u) {
    l((f) => ({
      ...f,
      rootState: u
    }));
  }
  const [o, a] = B(
    () => [
      ...he(),
      ...e.customComponents || []
    ].reduce(
      (u, { component: f, ...S }) => ({
        ...u,
        [S.name]: {
          component: f,
          ...de(S)
        }
      }),
      {}
    )
  ), [r, l] = B(() => ({
    content: Jt({
      content: e.content,
      data: e.data
    }),
    localState: void 0,
    rootState: Yt({
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
      (u, { component: f, ...S }) => ({
        ...u,
        [S.name]: de(S)
      }),
      {}
    ),
    inheritedStyles: {},
    BlocksWrapper: e.blocksWrapper || "div",
    BlocksWrapperProps: e.blocksWrapperProps || {}
  }));
  return /* @__PURE__ */ s(
    xe.Provider,
    {
      value: {
        registeredComponents: o
      },
      children: /* @__PURE__ */ N(
        Mt,
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
            e.isSsrAbTest ? /* @__PURE__ */ s(
              X,
              {
                id: "builderio-variant-visibility",
                scriptStr: t
              }
            ) : null,
            /* @__PURE__ */ s(
              qt,
              {
                isNestedRender: e.isNestedRender,
                contentId: (c = r.content) == null ? void 0 : c.id,
                cssCode: (m = (d = r.content) == null ? void 0 : d.data) == null ? void 0 : m.cssCode,
                customFonts: (b = (g = r.content) == null ? void 0 : g.data) == null ? void 0 : b.customFonts
              }
            ),
            /* @__PURE__ */ s(
              ae,
              {
                blocks: (h = (y = r.content) == null ? void 0 : y.data) == null ? void 0 : h.blocks,
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
function Gt(e) {
  var r;
  const [t, n] = B(
    () => Nt({
      canTrack: _(e.canTrack),
      content: e.content
    })
  );
  function i() {
    var l;
    return Ot(
      j(e.content).map((c) => ({
        id: c.testVariationId,
        testRatio: c.testRatio
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
    } : De({
      item: e.content,
      canTrack: _(e.canTrack)
    });
  }
  return P(() => {
  }, []), /* @__PURE__ */ N(T, { children: [
    !e.isNestedRender && D !== "reactNative" ? /* @__PURE__ */ s(
      X,
      {
        id: "builderio-init-variants-fns",
        scriptStr: Vt()
      }
    ) : null,
    t ? /* @__PURE__ */ N(T, { children: [
      /* @__PURE__ */ s(
        q,
        {
          id: "builderio-variants",
          styles: o()
        }
      ),
      /* @__PURE__ */ s(
        X,
        {
          id: "builderio-variants-visibility",
          scriptStr: i()
        }
      ),
      (r = j(e.content)) == null ? void 0 : r.map((l) => /* @__PURE__ */ s(
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
    /* @__PURE__ */ s(
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
      K.error("Could not fetch symbol content: ", n);
    });
};
function Xt(e) {
  var a, r, l, c;
  function t() {
    var d, m;
    return [
      e.attributes[oe()],
      "builder-symbol",
      (d = e.symbol) != null && d.inline ? "builder-inline-symbol" : void 0,
      (m = e.symbol) != null && m.dynamic || e.dynamic ? "builder-dynamic-symbol" : void 0
    ].filter(Boolean).join(" ");
  }
  const [n, i] = B(() => {
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
  return P(() => {
  }, []), P(() => {
    o();
  }, [e.symbol]), /* @__PURE__ */ s("div", { ...e.attributes, className: t(), children: /* @__PURE__ */ s(
    Gt,
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
        ...e.builderContext.rootState,
        ...(r = e.symbol) == null ? void 0 : r.data,
        ...e.builderContext.localState,
        ...(l = n == null ? void 0 : n.data) == null ? void 0 : l.state
      },
      model: (c = e.symbol) == null ? void 0 : c.model,
      content: n,
      linkComponent: e.builderLinkComponent,
      blocksWrapper: "div",
      contentWrapper: "div"
    }
  ) });
}
export {
  ae as Blocks,
  vt as Columns,
  Gt as Content,
  Xt as Symbol,
  Bt as Text
};
