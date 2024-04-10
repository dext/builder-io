"use client";
var De = Object.defineProperty;
var Me = (e, t, n) => t in e ? De(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var ee = (e, t, n) => (Me(e, typeof t != "symbol" ? t + "" : t, n), n);
import { jsx as s, Fragment as T, jsxs as B } from "react/jsx-runtime";
import { createContext as ke, useState as w, useEffect as V, useContext as ue, useRef as X, createElement as Ce } from "react";
import { isEditing as N, isBrowser as U, getUserAttributes as Oe, checkIsDefined as Y, logger as H, fastClone as oe, TARGET as z, setupBrowserForEditing as Ue, createRegisterComponentMessage as je, getDefaultCanTrack as G, _track as me, isPreviewing as He, fetchOneEntry as we, createEditorListener as Ke, fetch as qe, serializeComponentInfo as fe, handleABTestingSync as ze } from "./server-entry-6055a923.js";
const ae = ke({
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
}), Ie = ke({ registeredComponents: {} });
function _e(e) {
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
const Je = ({
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
}), Ye = () => ({
  isEditing: N(),
  isBrowser: U(),
  isServer: !U(),
  getUserAttributes: () => Oe()
}), Ge = (e, {
  isExpression: t = !0
}) => /* we disable this for cases where we definitely don't want a return */ t && !(e.includes(";") || e.includes(" return ") || e.trim().startsWith("return ")) ? `return (${e});` : e, he = ({
  code: e,
  builder: t,
  context: n,
  event: i,
  localState: o,
  rootSetState: r,
  rootState: a
}) => {
  const l = Je({
    builder: t,
    context: n,
    event: i,
    state: Te({
      rootState: a,
      localState: o,
      rootSetState: r
    })
  });
  return new Function(...l.map(([d]) => d), e)(...l.map(([, d]) => d));
};
function Te({
  rootState: e,
  localState: t,
  rootSetState: n
}) {
  return new Proxy(e, {
    get: (i, o) => {
      if (t && o in t)
        return t[o];
      const r = i[o];
      return typeof r == "object" && r !== null ? Te({
        rootState: r,
        localState: void 0,
        rootSetState: n ? (a) => {
          i[o] = a, n(i);
        } : void 0
      }) : r;
    },
    set: (i, o, r) => {
      if (t && o in t)
        throw new Error("Writing to local state is not allowed as it is read-only.");
      return i[o] = r, n == null || n(i), !0;
    }
  });
}
function Qe() {
  var e;
  return typeof process != "undefined" && Y((e = process == null ? void 0 : process.versions) == null ? void 0 : e.node);
}
const Xe = () => {
  var i;
  if (!Qe())
    return !1;
  const e = process.arch === "arm64", t = process.version.startsWith("v20"), n = (i = process.env.NODE_OPTIONS) == null ? void 0 : i.includes("--no-node-snapshot");
  return e && t && !n ? (H.log("Skipping usage of `isolated-vm` to avoid crashes in Node v20 on an arm64 machine.\n    If you would like to use the `isolated-vm` package on this machine, please provide the `NODE_OPTIONS=--no-node-snapshot` config to your Node process.\n    See https://github.com/BuilderIO/builder/blob/main/packages/sdks/README.md#node-v20--m1-macs-apple-silicon-support for more information.\n    "), !0) : !1;
}, Ze = (e) => (U() || Xe(), he(e)), F = class F {
  static getCacheKey(t) {
    return JSON.stringify({
      ...t,
      // replace the event with a random number to break cache
      // thats because we can't serialize the event object due to circular refs in DOM node refs.
      event: t.event ? Math.random() : void 0
    });
  }
  static getCachedValue(t) {
    return F.cache.get(t);
  }
  static setCachedValue(t, n) {
    F.cache.size > 20 && F.cache.delete(F.cache.keys().next().value), F.cache.set(t, {
      value: n
    });
  }
};
ee(F, "cacheLimit", 20), ee(F, "cache", /* @__PURE__ */ new Map());
let M = F;
function K({
  code: e,
  context: t,
  localState: n,
  rootState: i,
  rootSetState: o,
  event: r,
  isExpression: a = !0,
  enableCache: l
}) {
  if (e === "") {
    H.warn("Skipping evaluation of empty code block.");
    return;
  }
  const d = {
    code: Ge(e, {
      isExpression: a
    }),
    builder: Ye(),
    context: t,
    event: r,
    rootSetState: o,
    rootState: i,
    localState: n
  };
  if (l) {
    const c = M.getCacheKey(d), m = M.getCachedValue(c);
    if (m)
      return m.value;
  }
  try {
    const c = Ze(d);
    if (l) {
      const m = M.getCacheKey(d);
      M.setCachedValue(m, c);
    }
    return c;
  } catch (c) {
    H.error("Failed code evaluation: " + c.message, {
      code: e
    });
    return;
  }
}
const Ee = (e, t, n) => {
  if (Object(e) !== e)
    return e;
  const i = Array.isArray(t) ? t : t.toString().match(/[^.[\]]+/g);
  return i.slice(0, -1).reduce((o, r, a) => Object(o[r]) === o[r] ? o[r] : o[r] = Math.abs(Number(i[a + 1])) >> 0 === +i[a + 1] ? [] : {}, e)[i[i.length - 1]] = n, e;
};
const et = ({
  block: e,
  context: t,
  localState: n,
  rootState: i,
  rootSetState: o
}) => {
  if (!e.bindings)
    return e;
  const r = oe(e), a = {
    ...r,
    properties: {
      ...r.properties
    },
    actions: {
      ...r.actions
    }
  };
  for (const l in e.bindings) {
    const d = e.bindings[l], c = K({
      code: d,
      localState: n,
      rootState: i,
      rootSetState: o,
      context: t,
      enableCache: !0
    });
    Ee(a, l, c);
  }
  return a;
};
function Q({
  block: e,
  context: t,
  shouldEvaluateBindings: n,
  localState: i,
  rootState: o,
  rootSetState: r
}) {
  const a = e;
  return n ? et({
    block: a,
    localState: i,
    rootState: o,
    rootSetState: r,
    context: t
  }) : a;
}
function tt(e, t, n = {}) {
  let i, o, r, a = null, l = 0;
  const d = function() {
    l = n.leading === !1 ? 0 : Date.now(), a = null, r = e.apply(i, o), a || (i = o = null);
  };
  return function() {
    const c = Date.now();
    !l && n.leading === !1 && (l = c);
    const m = t - (c - l);
    return i = this, o = arguments, m <= 0 || m > t ? (a && (clearTimeout(a), a = null), l = c, r = e.apply(i, o), a || (i = o = null)) : !a && n.trailing !== !1 && (a = setTimeout(d, m)), r;
  };
}
function L(e, ...t) {
  const n = Object(e);
  for (let i = 1; i < arguments.length; i++) {
    const o = arguments[i];
    if (o != null)
      for (const r in o)
        Object.prototype.hasOwnProperty.call(o, r) && (n[r] = o[r]);
  }
  return n;
}
const re = (e) => e ? e.replace(/([A-Z])/g, (t) => `-${t[0].toLowerCase()}`) : "";
function nt(e) {
  for (const t of e)
    switch (t.trigger) {
      case "pageLoad":
        Re(t);
        break;
      case "hover":
        ot(t);
        break;
      case "scrollInView":
        at(t);
        break;
    }
}
function le(e) {
  console.warn(`Cannot animate element: element with ID ${e} not found!`);
}
function se(e, t) {
  const n = it(e), i = getComputedStyle(t), o = e.steps[0].styles, r = e.steps[e.steps.length - 1].styles, a = [o, r];
  for (const l of a)
    for (const d of n)
      d in l || (l[d] = i[d]);
}
function it(e) {
  const t = [];
  for (const n of e.steps)
    for (const i in n.styles)
      t.indexOf(i) === -1 && t.push(i);
  return t;
}
function Re(e) {
  const t = Array.prototype.slice.call(document.getElementsByClassName(e.elementId || e.id || ""));
  if (!t.length) {
    le(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    se(e, n), n.style.transition = "none", n.style.transitionDelay = "0", L(n.style, e.steps[0].styles), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${re(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s"), L(n.style, e.steps[1].styles), setTimeout(() => {
        n.style.transition = "", n.style.transitionDelay = "";
      }, (e.delay || 0) * 1e3 + e.duration * 1e3 + 100);
    });
  });
}
function ot(e) {
  const t = Array.prototype.slice.call(document.getElementsByClassName(e.elementId || e.id || ""));
  if (!t.length) {
    le(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    se(e, n);
    const i = e.steps[0].styles, o = e.steps[1].styles;
    function r() {
      L(n.style, i);
    }
    function a() {
      L(n.style, o);
    }
    r(), n.addEventListener("mouseenter", a), n.addEventListener("mouseleave", r), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${re(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s");
    });
  });
}
function at(e) {
  const t = Array.prototype.slice.call(document.getElementsByClassName(e.elementId || e.id || ""));
  if (!t.length) {
    le(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    se(e, n);
    let i = !1, o = !1;
    function r() {
      !i && l(n) ? (i = !0, o = !0, setTimeout(() => {
        L(n.style, e.steps[1].styles), e.repeat || document.removeEventListener("scroll", a), setTimeout(() => {
          o = !1, e.repeat || (n.style.transition = "", n.style.transitionDelay = "");
        }, (e.duration + (e.delay || 0)) * 1e3 + 100);
      })) : e.repeat && i && !o && !l(n) && (i = !1, L(n.style, e.steps[0].styles));
    }
    const a = tt(r, 200, {
      leading: !1
    });
    function l(m) {
      const f = m.getBoundingClientRect(), g = window.innerHeight, S = (e.thresholdPercent || 0) / 100 * g;
      return f.bottom > S && f.top < g - S;
    }
    const d = e.steps[0].styles;
    function c() {
      L(n.style, d);
    }
    c(), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${re(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s");
    }), document.addEventListener("scroll", a, {
      capture: !0,
      passive: !0
    }), r();
  });
}
const rt = (e) => e.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase(), Pe = (e) => Object.entries(e).map(([n, i]) => {
  if (typeof i == "string")
    return `${rt(n)}: ${i};`;
}).filter(Y), lt = (e) => Pe(e).join(`
`), te = ({
  mediaQuery: e,
  className: t,
  styles: n
}) => {
  const i = `.${t} {
    ${lt(n)}
  }`;
  return e ? `${e} {
      ${i}
    }` : i;
};
function st({
  style: e
}) {
  return e;
}
const ct = ({
  block: e,
  context: t
}) => Ve(st({
  style: e.style || {},
  context: t,
  block: e
}));
function Ve(e) {
  switch (z) {
    case "svelte":
    case "vue":
    case "solid":
      return Pe(e).join(" ");
    case "qwik":
    case "reactNative":
    case "react":
    case "rsc":
      return e;
  }
}
const dt = ({
  block: e,
  context: t,
  registeredComponents: n
}) => {
  var r;
  const i = (r = Q({
    block: e,
    localState: t.localState,
    rootState: t.rootState,
    rootSetState: t.rootSetState,
    context: t.context,
    shouldEvaluateBindings: !1
  }).component) == null ? void 0 : r.name;
  if (!i)
    return null;
  const o = n[i];
  if (o)
    return o;
  console.warn(`
      Could not find a registered component named "${i}". 
      If you registered it, is the file that registered it imported by the file that needs to render it?`);
}, ut = ({
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
  const r = n.collection.split(".").pop(), a = n.itemName || (r ? r + "Item" : "item");
  return o.map((d, c) => ({
    context: {
      ...t,
      localState: {
        ...t.localState,
        $index: c,
        $item: d,
        [a]: d,
        [`$${a}Index`]: c
      }
    },
    block: i
  }));
}, Be = {
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
}, ge = (e, t = Be) => `@media (max-width: ${t[e].max}px)`, Ae = ({
  small: e,
  medium: t
}) => {
  const n = oe(Be);
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
  const r = n.medium.max + 1;
  return n.large = {
    max: 2e3,
    // TODO: decide upper limit
    min: r,
    default: r + 1
  }, n;
};
function Z(e) {
  return /* @__PURE__ */ s(
    "style",
    {
      dangerouslySetInnerHTML: { __html: e.styles },
      "data-id": e.id
    }
  );
}
function mt(e) {
  function t() {
    const i = Q({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    });
    return Y(i.hide) ? !i.hide : Y(i.show) ? i.show : !0;
  }
  function n() {
    var S;
    const i = Q({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    }), o = i.responsiveStyles, r = e.context.content, a = Ae(
      ((S = r == null ? void 0 : r.meta) == null ? void 0 : S.breakpoints) || {}
    ), l = o == null ? void 0 : o.large, d = o == null ? void 0 : o.medium, c = o == null ? void 0 : o.small, m = i.id;
    if (!m)
      return "";
    const f = l ? te({
      className: m,
      styles: l
    }) : "", g = d ? te({
      className: m,
      styles: d,
      mediaQuery: ge(
        "medium",
        a
      )
    }) : "", y = c ? te({
      className: m,
      styles: c,
      mediaQuery: ge(
        "small",
        a
      )
    }) : "";
    return [f, g, y].join(" ");
  }
  return /* @__PURE__ */ s(T, { children: n() && t() ? /* @__PURE__ */ s(T, { children: /* @__PURE__ */ s(Z, { id: "builderio-block", styles: n() }) }) : null });
}
function ft(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
const ht = (e) => `on${ft(e)}`, gt = (e, t) => (n) => K({
  code: e,
  context: t.context,
  localState: t.localState,
  rootState: t.rootState,
  rootSetState: t.rootSetState,
  event: n,
  isExpression: !1,
  enableCache: !0
});
function We(e) {
  var i;
  const t = {}, n = (i = e.block.actions) != null ? i : {};
  for (const o in n) {
    if (!n.hasOwnProperty(o))
      continue;
    const r = n[o];
    let a = ht(o);
    if (e.stripPrefix)
      switch (z) {
        case "vue":
          a = a.replace("v-on:", "");
          break;
        case "svelte":
          a = a.replace("on:", "");
          break;
      }
    t[a] = gt(r, e);
  }
  return t;
}
const q = () => {
  switch (z) {
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
function bt({
  properties: e
}) {
  return e;
}
const yt = (e) => ({
  href: e.href
});
function ce({
  block: e,
  context: t
}) {
  var i;
  const n = {
    ...yt(e),
    ...e.properties,
    "builder-id": e.id,
    style: ct({
      block: e,
      context: t
    }),
    [q()]: [e.id, "builder-block", e.class, (i = e.properties) == null ? void 0 : i.class].filter(Boolean).join(" ")
  };
  return bt({
    properties: n,
    context: t,
    block: e
  });
}
const pt = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]), xt = (e) => typeof e == "string" && pt.has(e.toLowerCase());
function de(e) {
  return /* @__PURE__ */ s(T, { children: xt(e.TagName) ? /* @__PURE__ */ s(T, { children: /* @__PURE__ */ s(e.TagName, { ...e.attributes, ...e.actionAttributes }) }) : /* @__PURE__ */ s(T, { children: typeof e.TagName == "string" ? /* @__PURE__ */ s(e.TagName, { ...e.attributes, ...e.actionAttributes, children: e.children }) : /* @__PURE__ */ s(e.TagName, { ...e.attributes, ...e.actionAttributes, children: e.children }) }) });
}
function St(e) {
  return /* @__PURE__ */ s(
    de,
    {
      TagName: e.Wrapper,
      attributes: ce({
        block: e.block,
        context: e.context
      }),
      actionAttributes: We({
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
function vt(e) {
  return /* @__PURE__ */ s(
    e.Wrapper,
    {
      ...e.wrapperProps,
      attributes: e.includeBlockProps ? {
        ...ce({
          block: e.block,
          context: e.context
        }),
        ...We({
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
  isInteractive: r,
  contextValue: a
}) => {
  const l = {
    ...e,
    /**
     * If `noWrap` is set to `true`, then the block's props/attributes are provided to the
     * component itself directly. Otherwise, they are provided to the wrapper element.
     */
    ...o ? {
      attributes: ce({
        block: t,
        context: a
      })
    } : {}
  };
  return r ? {
    Wrapper: i,
    block: t,
    context: n,
    wrapperProps: e,
    includeBlockProps: o
  } : l;
};
function be(e) {
  var i;
  const [t, n] = w(
    () => e.isInteractive ? vt : e.componentRef
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
        _,
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
function Ct(e) {
  const [t, n] = w(() => e.repeatContext);
  return /* @__PURE__ */ s(ae.Provider, { value: t, children: /* @__PURE__ */ s(
    _,
    {
      block: e.block,
      context: t,
      registeredComponents: e.registeredComponents,
      linkComponent: e.linkComponent
    }
  ) });
}
function _(e) {
  var d, c, m;
  function t() {
    return dt({
      block: e.block,
      context: e.context,
      registeredComponents: e.registeredComponents
    });
  }
  function n() {
    return ut({
      block: e.block,
      context: e.context
    });
  }
  function i() {
    var f;
    return (f = e.block.repeat) != null && f.collection ? e.block : Q({
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
  function r() {
    var y, S;
    if ((y = e.block.repeat) != null && y.collection)
      return !!((S = n == null ? void 0 : n()) != null && S.length);
    const f = "hide" in i() ? i().hide : !1;
    return ("show" in i() ? i().show : !0) && !f;
  }
  function a() {
    var g, y;
    return !((g = t == null ? void 0 : t()) != null && g.component) && !n() ? (y = i().children) != null ? y : [] : [];
  }
  function l() {
    var f, g, y, S, I, C, p, v, E, R, P;
    return {
      blockChildren: (f = i().children) != null ? f : [],
      componentRef: (g = t == null ? void 0 : t()) == null ? void 0 : g.component,
      componentOptions: {
        ..._e(i()),
        builderContext: e.context,
        ...((y = t == null ? void 0 : t()) == null ? void 0 : y.name) === "Core:Button" || ((S = t == null ? void 0 : t()) == null ? void 0 : S.name) === "Symbol" || ((I = t == null ? void 0 : t()) == null ? void 0 : I.name) === "Columns" || ((C = t == null ? void 0 : t()) == null ? void 0 : C.name) === "Form:Form" ? {
          builderLinkComponent: e.linkComponent
        } : {},
        ...((p = t == null ? void 0 : t()) == null ? void 0 : p.name) === "Symbol" || ((v = t == null ? void 0 : t()) == null ? void 0 : v.name) === "Columns" || ((E = t == null ? void 0 : t()) == null ? void 0 : E.name) === "Form:Form" ? {
          builderComponents: e.registeredComponents
        } : {}
      },
      context: e.context,
      linkComponent: e.linkComponent,
      registeredComponents: e.registeredComponents,
      builderBlock: i(),
      includeBlockProps: ((R = t == null ? void 0 : t()) == null ? void 0 : R.noWrap) === !0,
      isInteractive: !((P = t == null ? void 0 : t()) != null && P.isRSC)
    };
  }
  return V(() => {
    const f = i().id, g = i().animations;
    g && f && nt(
      g.filter((y) => y.trigger !== "hover").map((y) => ({
        ...y,
        elementId: f
      }))
    );
  }, []), /* @__PURE__ */ s(T, { children: r() ? /* @__PURE__ */ B(T, { children: [
    /* @__PURE__ */ s(mt, { block: e.block, context: e.context }),
    (d = t == null ? void 0 : t()) != null && d.noWrap ? /* @__PURE__ */ s(T, { children: /* @__PURE__ */ s(
      be,
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
    ) }) : /* @__PURE__ */ s(T, { children: n() ? /* @__PURE__ */ s(T, { children: (m = n()) == null ? void 0 : m.map((f, g) => /* @__PURE__ */ s(
      Ct,
      {
        repeatContext: f.context,
        block: f.block,
        registeredComponents: e.registeredComponents,
        linkComponent: e.linkComponent
      },
      g
    )) }) : /* @__PURE__ */ B(
      St,
      {
        Wrapper: o(),
        block: i(),
        context: e.context,
        linkComponent: e.linkComponent,
        children: [
          /* @__PURE__ */ s(
            be,
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
          (c = a()) == null ? void 0 : c.map((f) => /* @__PURE__ */ s(
            _,
            {
              block: f,
              registeredComponents: e.registeredComponents,
              linkComponent: e.linkComponent,
              context: e.context
            },
            f.id
          ))
        ]
      }
    ) })
  ] }) : null });
}
function wt(e) {
  function t() {
    var o;
    return "builder-blocks" + ((o = e.blocks) != null && o.length ? "" : " no-blocks");
  }
  function n() {
    var o, r;
    N() && !((o = e.blocks) != null && o.length) && ((r = window.parent) == null || r.postMessage(
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
    var o, r;
    N() && !((o = e.blocks) != null && o.length) && ((r = window.parent) == null || r.postMessage(
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
  return /* @__PURE__ */ B(T, { children: [
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
function O(e) {
  var i, o, r;
  const t = ue(ae), n = ue(Ie);
  return /* @__PURE__ */ s(
    wt,
    {
      blocks: e.blocks,
      parent: e.parent,
      path: e.path,
      styleProp: e.styleProp,
      BlocksWrapper: ((i = e.context) == null ? void 0 : i.BlocksWrapper) || t.BlocksWrapper,
      BlocksWrapperProps: ((o = e.context) == null ? void 0 : o.BlocksWrapperProps) || t.BlocksWrapperProps,
      children: e.blocks ? /* @__PURE__ */ s(T, { children: (r = e.blocks) == null ? void 0 : r.map((a) => /* @__PURE__ */ s(
        _,
        {
          block: a,
          linkComponent: e.linkComponent,
          context: e.context || t,
          registeredComponents: e.registeredComponents || n.registeredComponents
        },
        a.id
      )) }) : null
    }
  );
}
function It(e) {
  var C;
  const [t, n] = w(
    () => typeof e.space == "number" ? e.space || 0 : 20
  );
  function i() {
    return e.columns || [];
  }
  const [o, r] = w(
    () => e.stackColumnsAt || "tablet"
  );
  function a(p) {
    var E;
    const v = i();
    return ((E = v[p]) == null ? void 0 : E.width) || 100 / v.length;
  }
  function l(p) {
    const v = i(), E = t * (v.length - 1) / v.length;
    return `calc(${a(p)}% - ${E}px)`;
  }
  function d({
    stackedStyle: p,
    desktopStyle: v
  }) {
    return o === "tablet" ? p : v;
  }
  function c({
    stackedStyle: p,
    desktopStyle: v
  }) {
    return o === "never" ? v : p;
  }
  const [m, f] = w(
    () => e.stackColumnsAt === "never" ? "row" : e.reverseColumnsWhenStacked ? "column-reverse" : "column"
  );
  function g() {
    return {
      "--flex-dir": m,
      "--flex-dir-tablet": d({
        stackedStyle: m,
        desktopStyle: "row"
      })
    };
  }
  function y(p) {
    const v = p === 0 ? 0 : t, E = l(p), R = `${v}px`, P = "100%", $ = 0;
    return {
      ...{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
      },
      width: E,
      ["marginLeft"]: R,
      "--column-width-mobile": c({
        stackedStyle: P,
        desktopStyle: E
      }),
      "--column-margin-left-mobile": c({
        stackedStyle: $,
        desktopStyle: R
      }),
      "--column-width-tablet": d({
        stackedStyle: P,
        desktopStyle: E
      }),
      "--column-margin-left-tablet": d({
        stackedStyle: $,
        desktopStyle: R
      })
    };
  }
  function S(p) {
    var E, R;
    return Ae(
      ((R = (E = e.builderContext.content) == null ? void 0 : E.meta) == null ? void 0 : R.breakpoints) || {}
    )[p].max;
  }
  function I() {
    return `
        @media (max-width: ${S("medium")}px) {
          .${e.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir-tablet);
            align-items: stretch;
          }

          .${e.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-tablet) !important;
            margin-left: var(--column-margin-left-tablet) !important;
          }
        }

        @media (max-width: ${S("small")}px) {
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
  return /* @__PURE__ */ B(T, { children: [
    /* @__PURE__ */ B(
      "div",
      {
        className: `builder-columns ${e.builderBlock.id}-breakpoints div-452958ba`,
        style: g(),
        children: [
          /* @__PURE__ */ s(Z, { id: "builderio-columns", styles: I() }),
          (C = e.columns) == null ? void 0 : C.map((p, v) => /* @__PURE__ */ s(
            de,
            {
              TagName: p.link ? e.builderLinkComponent || "a" : "div",
              actionAttributes: {},
              attributes: {
                ...p.link ? {
                  href: p.link
                } : {},
                [q()]: "builder-column",
                style: Ve(y(v))
              },
              children: /* @__PURE__ */ s(
                O,
                {
                  path: `component.options.columns.${v}.blocks`,
                  parent: e.builderBlock.id,
                  styleProp: {
                    flexGrow: "1"
                  },
                  context: e.builderContext,
                  registeredComponents: e.builderComponents,
                  linkComponent: e.builderLinkComponent,
                  blocks: p.blocks
                }
              )
            },
            v
          ))
        ]
      }
    ),
    /* @__PURE__ */ s("style", { children: `.div-452958ba {
  display: flex;
  line-height: normal;
}` })
  ] });
}
const Tt = {
  name: "Core:Button",
  image: "https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2F81a15681c3e74df09677dfc57a615b13",
  defaultStyles: {
    // TODO: make min width more intuitive and set one
    appearance: "none",
    paddingTop: "15px",
    paddingBottom: "15px",
    paddingLeft: "25px",
    paddingRight: "25px",
    backgroundColor: "#000000",
    color: "white",
    borderRadius: "4px",
    textAlign: "center",
    cursor: "pointer"
  },
  inputs: [{
    name: "text",
    type: "text",
    defaultValue: "Click me!",
    bubble: !0
  }, {
    name: "link",
    type: "url",
    bubble: !0
  }, {
    name: "openLinkInNewTab",
    type: "boolean",
    defaultValue: !1,
    friendlyName: "Open link in new tab"
  }],
  static: !0,
  noWrap: !0
};
function Et(e) {
  return /* @__PURE__ */ s(
    de,
    {
      attributes: {
        ...e.attributes,
        [q()]: `${e.link ? "" : "builder-button"} ${e.attributes[q()] || ""}`,
        ...e.link ? {
          href: e.link,
          target: e.openLinkInNewTab ? "_blank" : void 0,
          role: "link"
        } : {
          role: "button"
        }
      },
      TagName: e.link ? e.builderLinkComponent || "a" : "button",
      actionAttributes: {},
      children: e.text
    }
  );
}
const Rt = {
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
      Array.isArray(n) && n.find((o) => o.get("width")) && (n.find((r) => !r.get("width")) || n.reduce((l, d) => l + d.get("width"), 0) !== 100) && t();
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
}, Pt = {
  name: "Fragment",
  static: !0,
  hidden: !0,
  canHaveChildren: !0,
  noWrap: !0
};
function Vt(e) {
  return /* @__PURE__ */ s("span", { children: e.children });
}
const Bt = {
  name: "Image",
  static: !0,
  image: "https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-insert_photo-24px.svg?alt=media&token=4e5d0ef4-f5e8-4e57-b3a9-38d63a9b9dc4",
  defaultStyles: {
    position: "relative",
    minHeight: "20px",
    minWidth: "20px",
    overflow: "hidden"
  },
  canHaveChildren: !0,
  inputs: [{
    name: "image",
    type: "file",
    bubble: !0,
    allowedFileTypes: ["jpeg", "jpg", "png", "svg"],
    required: !0,
    defaultValue: "https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a",
    onChange: (e) => {
      e.delete("srcset"), e.delete("noWebp");
      function n(a, l = 6e4) {
        return new Promise((d, c) => {
          const m = document.createElement("img");
          let f = !1;
          m.onload = () => {
            f = !0, d(m);
          }, m.addEventListener("error", (g) => {
            console.warn("Image load failed", g.error), c(g.error);
          }), m.src = a, setTimeout(() => {
            f || c(new Error("Image load timed out"));
          }, l);
        });
      }
      function i(a) {
        return Math.round(a * 1e3) / 1e3;
      }
      const o = e.get("image"), r = e.get("aspectRatio");
      if (fetch(o).then((a) => a.blob()).then((a) => {
        a.type.includes("svg") && e.set("noWebp", !0);
      }), o && (!r || r === 0.7041))
        return n(o).then((a) => {
          const l = e.get("aspectRatio");
          e.get("image") === o && (!l || l === 0.7041) && a.width && a.height && (e.set("aspectRatio", i(a.height / a.width)), e.set("height", a.height), e.set("width", a.width));
        });
    }
  }, {
    name: "backgroundSize",
    type: "text",
    defaultValue: "cover",
    enum: [{
      label: "contain",
      value: "contain",
      helperText: "The image should never get cropped"
    }, {
      label: "cover",
      value: "cover",
      helperText: "The image should fill it's box, cropping when needed"
    }]
  }, {
    name: "backgroundPosition",
    type: "text",
    defaultValue: "center",
    enum: ["center", "top", "left", "right", "bottom", "top left", "top right", "bottom left", "bottom right"]
  }, {
    name: "altText",
    type: "string",
    helperText: "Text to display when the user has images off"
  }, {
    name: "height",
    type: "number",
    hideFromUI: !0
  }, {
    name: "width",
    type: "number",
    hideFromUI: !0
  }, {
    name: "sizes",
    type: "string",
    hideFromUI: !0
  }, {
    name: "srcset",
    type: "string",
    hideFromUI: !0
  }, {
    name: "lazy",
    type: "boolean",
    defaultValue: !0,
    hideFromUI: !0
  }, {
    name: "fitContent",
    type: "boolean",
    helperText: "When child blocks are provided, fit to them instead of using the image's aspect ratio",
    defaultValue: !0
  }, {
    name: "aspectRatio",
    type: "number",
    helperText: "This is the ratio of height/width, e.g. set to 1.5 for a 300px wide and 200px tall photo. Set to 0 to not force the image to maintain it's aspect ratio",
    advanced: !0,
    defaultValue: 0.7041
  }]
};
function ye(e) {
  return e.replace(/http(s)?:/, "");
}
function At(e = "", t, n) {
  const i = new RegExp("([?&])" + t + "=.*?(&|$)", "i"), o = e.indexOf("?") !== -1 ? "&" : "?";
  return e.match(i) ? e.replace(i, "$1" + t + "=" + encodeURIComponent(n) + "$2") : e + o + t + "=" + encodeURIComponent(n);
}
function Wt(e, t) {
  if (!e || !(e != null && e.match(/cdn\.shopify\.com/)) || !t)
    return e;
  if (t === "master")
    return ye(e);
  const n = e.match(/(_\d+x(\d+)?)?(\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?)/i);
  if (n) {
    const i = e.split(n[0]), o = n[3], r = t.match("x") ? t : `${t}x`;
    return ye(`${i[0]}_${r}${o}`);
  }
  return null;
}
function ne(e) {
  if (!e)
    return e;
  const t = [100, 200, 400, 800, 1200, 1600, 2e3];
  if (e.match(/builder\.io/)) {
    let n = e;
    const i = Number(e.split("?width=")[1]);
    return isNaN(i) || (n = `${n} ${i}w`), t.filter((o) => o !== i).map((o) => `${At(e, "width", o)} ${o}w`).concat([n]).join(", ");
  }
  return e.match(/cdn\.shopify\.com/) ? t.map((n) => [Wt(e, `${n}x${n}`), n]).filter(([n]) => !!n).map(([n, i]) => `${n} ${i}w`).concat([e]).join(", ") : e;
}
function Nt(e) {
  var o, r, a, l;
  function t() {
    var m;
    const c = e.image || e.src;
    if (!c || // We can auto add srcset for cdn.builder.io and shopify
    // images, otherwise you can supply this prop manually
    !(c.match(/builder\.io/) || c.match(/cdn\.shopify\.com/)))
      return e.srcset;
    if (e.srcset && ((m = e.image) != null && m.includes("builder.io/api/v1/image"))) {
      if (!e.srcset.includes(e.image.split("?")[0]))
        return console.debug("Removed given srcset"), ne(c);
    } else if (e.image && !e.srcset)
      return ne(c);
    return ne(c);
  }
  function n() {
    var d;
    return (d = t == null ? void 0 : t()) != null && d.match(/builder\.io/) && !e.noWebp ? t().replace(/\?/g, "?format=webp&") : "";
  }
  function i() {
    const d = {
      position: "absolute",
      height: "100%",
      width: "100%",
      left: "0px",
      top: "0px"
    };
    return e.aspectRatio ? d : void 0;
  }
  return /* @__PURE__ */ B(T, { children: [
    /* @__PURE__ */ B(T, { children: [
      /* @__PURE__ */ B("picture", { children: [
        n() ? /* @__PURE__ */ s("source", { type: "image/webp", srcSet: n() }) : null,
        /* @__PURE__ */ s(
          "img",
          {
            loading: "lazy",
            alt: e.altText,
            role: e.altText ? void 0 : "presentation",
            style: {
              objectPosition: e.backgroundPosition || "center",
              objectFit: e.backgroundSize || "cover",
              ...i()
            },
            className: "builder-image" + (e.className ? " " + e.className : "") + " img-a0c95e8c",
            src: e.image,
            srcSet: t(),
            sizes: e.sizes
          }
        )
      ] }),
      e.aspectRatio && !((r = (o = e.builderBlock) == null ? void 0 : o.children) != null && r.length && e.fitContent) ? /* @__PURE__ */ s(
        "div",
        {
          className: "builder-image-sizer div-a0c95e8c",
          style: {
            paddingTop: e.aspectRatio * 100 + "%"
          }
        }
      ) : null,
      (l = (a = e.builderBlock) == null ? void 0 : a.children) != null && l.length && e.fitContent ? /* @__PURE__ */ s(T, { children: e.children }) : null,
      !e.fitContent && e.children ? /* @__PURE__ */ s("div", { className: "div-a0c95e8c-2", children: e.children }) : null
    ] }),
    /* @__PURE__ */ s("style", { children: `.img-a0c95e8c {
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}.div-a0c95e8c {
  width: 100%;
  pointer-events: none;
  font-size: 0;
}.div-a0c95e8c-2 {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}` })
  ] });
}
const Ft = {
  name: "Core:Section",
  static: !0,
  image: "https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2F682efef23ace49afac61748dd305c70a",
  inputs: [{
    name: "maxWidth",
    type: "number",
    defaultValue: 1200
  }, {
    name: "lazyLoad",
    type: "boolean",
    defaultValue: !1,
    advanced: !0,
    description: "Only render this section when in view"
  }],
  defaultStyles: {
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "50px",
    paddingBottom: "50px",
    marginTop: "0px",
    width: "100vw",
    marginLeft: "calc(50% - 50vw)"
  },
  canHaveChildren: !0,
  defaultChildren: [{
    "@type": "@builder.io/sdk:Element",
    responsiveStyles: {
      large: {
        textAlign: "center"
      }
    },
    component: {
      name: "Text",
      options: {
        text: "<p><b>I am a section! My content keeps from getting too wide, so that it's easy to read even on big screens.</b></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur</p>"
      }
    }
  }]
};
function $t(e) {
  return /* @__PURE__ */ s(
    "section",
    {
      ...e.attributes,
      style: {
        width: "100%",
        alignSelf: "stretch",
        flexGrow: 1,
        boxSizing: "border-box",
        maxWidth: e.maxWidth || 1200,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        marginLeft: "auto",
        marginRight: "auto"
      },
      children: e.children
    }
  );
}
const Lt = {
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
function Dt(e) {
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
        O,
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
const Mt = {
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
}, Ot = {
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
function Ut(e) {
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
const jt = {
  name: "Custom Code",
  static: !0,
  requiredPermissions: ["editCode"],
  inputs: [{
    name: "code",
    type: "html",
    required: !0,
    defaultValue: "<p>Hello there, I am custom HTML code!</p>",
    code: !0
  }, {
    name: "replaceNodes",
    type: "boolean",
    helperText: "Preserve server rendered dom nodes",
    advanced: !0
  }, {
    name: "scriptsClientOnly",
    type: "boolean",
    defaultValue: !1,
    helperText: "Only print and run scripts on the client. Important when scripts influence DOM that could be replaced when client loads",
    advanced: !0
  }]
};
function Ht(e) {
  const t = X(null), [n, i] = w(() => []), [o, r] = w(() => []);
  return V(() => {
    var l;
    if (!((l = t.current) != null && l.getElementsByTagName) || typeof window == "undefined")
      return;
    const a = t.current.getElementsByTagName("script");
    for (let d = 0; d < a.length; d++) {
      const c = a[d];
      if (c.src) {
        if (n.includes(c.src))
          continue;
        n.push(c.src);
        const m = document.createElement("script");
        m.async = !0, m.src = c.src, document.head.appendChild(m);
      } else if (!c.type || [
        "text/javascript",
        "application/javascript",
        "application/ecmascript"
      ].includes(c.type)) {
        if (o.includes(c.innerText))
          continue;
        try {
          o.push(c.innerText), new Function(c.innerText)();
        } catch (m) {
          console.warn("`CustomCode`: Error running script:", m);
        }
      }
    }
  }, []), /* @__PURE__ */ s(
    "div",
    {
      ref: t,
      className: "builder-custom-code" + (e.replaceNodes ? " replace-nodes" : ""),
      dangerouslySetInnerHTML: { __html: e.code }
    }
  );
}
const Kt = {
  name: "Embed",
  static: !0,
  inputs: [{
    name: "url",
    type: "url",
    required: !0,
    defaultValue: "",
    helperText: "e.g. enter a youtube url, google map, etc",
    onChange: (e) => {
      const t = e.get("url");
      if (t)
        return e.set("content", "Loading..."), fetch(`https://iframe.ly/api/iframely?url=${t}&api_key=ae0e60e78201a3f2b0de4b`).then((i) => i.json()).then((i) => {
          e.get("url") === t && (i.html ? e.set("content", i.html) : e.set("content", "Invalid url, please try another"));
        }).catch((i) => {
          e.set("content", "There was an error embedding this URL, please try again or another URL");
        });
      e.delete("content");
    }
  }, {
    name: "content",
    type: "html",
    defaultValue: '<div style="padding: 20px; text-align: center">(Choose an embed URL)<div>',
    hideFromUI: !0
  }]
}, qt = ["text/javascript", "application/javascript", "application/ecmascript"], zt = (e) => qt.includes(e.type);
function _t(e) {
  const t = X(null), [n, i] = w(() => []), [o, r] = w(() => []), [a, l] = w(() => !1);
  function d() {
    if (!t.current || !t.current.getElementsByTagName)
      return;
    const c = t.current.getElementsByTagName("script");
    for (let m = 0; m < c.length; m++) {
      const f = c[m];
      if (f.src && !n.includes(f.src)) {
        n.push(f.src);
        const g = document.createElement("script");
        g.async = !0, g.src = f.src, document.head.appendChild(g);
      } else if (zt(f) && !o.includes(f.innerText))
        try {
          o.push(f.innerText), new Function(f.innerText)();
        } catch (g) {
          console.warn("`Embed`: Error running script:", g);
        }
    }
  }
  return V(() => {
    t.current && !a && (l(!0), d());
  }, [t.current, a]), /* @__PURE__ */ s(
    "div",
    {
      className: "builder-embed",
      ref: t,
      dangerouslySetInnerHTML: { __html: e.content }
    }
  );
}
const Jt = {
  name: "Form:Form",
  // editableTags: ['builder-form-error']
  defaults: {
    responsiveStyles: {
      large: {
        marginTop: "15px",
        paddingBottom: "15px"
      }
    }
  },
  image: "https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2Fef36d2a846134910b64b88e6d18c5ca5",
  inputs: [{
    name: "sendSubmissionsTo",
    type: "string",
    // TODO: save to builder data and user can download as csv
    // TODO: easy for mode too or computed add/remove fields form mode
    // so you can edit details and high level mode at same time...
    // Later - more integrations like mailchimp
    // /api/v1/form-submit?to=mailchimp
    enum: [{
      label: "Send to email",
      value: "email",
      helperText: "Send form submissions to the email address of your choosing"
    }, {
      label: "Custom",
      value: "custom",
      helperText: "Handle where the form requests go manually with a little code, e.g. to your own custom backend"
    }],
    defaultValue: "email"
  }, {
    name: "sendSubmissionsToEmail",
    type: "string",
    required: !0,
    // TODO: required: () => options.get("sendSubmissionsTo") === "email"
    defaultValue: "your@email.com",
    showIf: 'options.get("sendSubmissionsTo") === "email"'
  }, {
    name: "sendWithJs",
    type: "boolean",
    helperText: "Set to false to use basic html form action",
    defaultValue: !0,
    showIf: 'options.get("sendSubmissionsTo") === "custom"'
  }, {
    name: "name",
    type: "string",
    defaultValue: "My form"
    // advanced: true
  }, {
    name: "action",
    type: "string",
    helperText: "URL to send the form data to",
    showIf: 'options.get("sendSubmissionsTo") === "custom"'
  }, {
    name: "contentType",
    type: "string",
    defaultValue: "application/json",
    advanced: !0,
    // TODO: do automatically if file input
    enum: ["application/json", "multipart/form-data", "application/x-www-form-urlencoded"],
    showIf: 'options.get("sendSubmissionsTo") === "custom" && options.get("sendWithJs") === true'
  }, {
    name: "method",
    type: "string",
    showIf: 'options.get("sendSubmissionsTo") === "custom"',
    defaultValue: "POST",
    advanced: !0
  }, {
    name: "previewState",
    type: "string",
    // TODO: persist: false flag
    enum: ["unsubmitted", "sending", "success", "error"],
    defaultValue: "unsubmitted",
    helperText: 'Choose a state to edit, e.g. choose "success" to show what users see on success and edit the message',
    showIf: 'options.get("sendSubmissionsTo") !== "zapier" && options.get("sendWithJs") === true'
  }, {
    name: "successUrl",
    type: "url",
    helperText: "Optional URL to redirect the user to on form submission success",
    showIf: 'options.get("sendSubmissionsTo") !== "zapier" && options.get("sendWithJs") === true'
  }, {
    name: "resetFormOnSubmit",
    type: "boolean",
    showIf: "options.get('sendSubmissionsTo') === 'custom' && options.get('sendWithJs') === true",
    advanced: !0
  }, {
    name: "successMessage",
    type: "uiBlocks",
    hideFromUI: !0,
    defaultValue: [{
      "@type": "@builder.io/sdk:Element",
      responsiveStyles: {
        large: {
          marginTop: "10px"
        }
      },
      component: {
        name: "Text",
        options: {
          text: "<span>Thanks!</span>"
        }
      }
    }]
  }, {
    name: "validate",
    type: "boolean",
    defaultValue: !0,
    advanced: !0
  }, {
    name: "errorMessagePath",
    type: "text",
    advanced: !0,
    helperText: 'Path to where to get the error message from in a JSON response to display to the user, e.g. "error.message" for a response like { "error": { "message": "this username is taken" }}'
  }, {
    name: "errorMessage",
    type: "uiBlocks",
    hideFromUI: !0,
    defaultValue: [{
      "@type": "@builder.io/sdk:Element",
      responsiveStyles: {
        large: {
          marginTop: "10px"
        }
      },
      bindings: {
        "component.options.text": "state.formErrorMessage || block.component.options.text"
      },
      component: {
        name: "Text",
        options: {
          text: "<span>Form submission error :( Please check your answers and try again</span>"
        }
      }
    }]
  }, {
    name: "sendingMessage",
    type: "uiBlocks",
    hideFromUI: !0,
    defaultValue: [{
      "@type": "@builder.io/sdk:Element",
      responsiveStyles: {
        large: {
          marginTop: "10px"
        }
      },
      component: {
        name: "Text",
        options: {
          text: "<span>Sending...</span>"
        }
      }
    }]
  }, {
    name: "customHeaders",
    type: "map",
    valueType: {
      type: "string"
    },
    advanced: !0,
    showIf: 'options.get("sendSubmissionsTo") === "custom" && options.get("sendWithJs") === true'
  }],
  noWrap: !0,
  canHaveChildren: !0,
  defaultChildren: [{
    "@type": "@builder.io/sdk:Element",
    responsiveStyles: {
      large: {
        marginTop: "10px"
      }
    },
    component: {
      name: "Text",
      options: {
        text: "<span>Enter your name</span>"
      }
    }
  }, {
    "@type": "@builder.io/sdk:Element",
    responsiveStyles: {
      large: {
        marginTop: "10px"
      }
    },
    component: {
      name: "Form:Input",
      options: {
        name: "name",
        placeholder: "Jane Doe"
      }
    }
  }, {
    "@type": "@builder.io/sdk:Element",
    responsiveStyles: {
      large: {
        marginTop: "10px"
      }
    },
    component: {
      name: "Text",
      options: {
        text: "<span>Enter your email</span>"
      }
    }
  }, {
    "@type": "@builder.io/sdk:Element",
    responsiveStyles: {
      large: {
        marginTop: "10px"
      }
    },
    component: {
      name: "Form:Input",
      options: {
        name: "email",
        placeholder: "jane@doe.com"
      }
    }
  }, {
    "@type": "@builder.io/sdk:Element",
    responsiveStyles: {
      large: {
        marginTop: "10px"
      }
    },
    component: {
      name: "Form:SubmitButton",
      options: {
        text: "Submit"
      }
    }
  }]
}, Yt = ["production", "qa", "test", "development", "dev", "cdn-qa", "cloud", "fast", "cdn2", "cdn-prod"], Gt = () => {
  const e = process.env.NODE_ENV || "production";
  return Yt.includes(e) ? e : "production";
}, Qt = (e, t, n) => {
  const i = String.prototype.split.call(t, /[,[\].]+?/).filter(Boolean).reduce((o, r) => o != null ? o[r] : o, e);
  return i === void 0 || i === e ? n : i;
};
function Xt(e) {
  var f, g;
  const t = X(null), [n, i] = w(() => "unsubmitted"), [o, r] = w(() => null), [a, l] = w(() => "");
  function d(y) {
    var I, C;
    const S = {
      ...e.builderContext.rootState,
      ...y
    };
    e.builderContext.rootSetState ? (C = (I = e.builderContext).rootSetState) == null || C.call(I, S) : e.builderContext.rootState = S;
  }
  function c() {
    return N() && e.previewState || n;
  }
  function m(y) {
    var I;
    const S = e.sendWithJs || e.sendSubmissionsTo === "email";
    if (e.sendSubmissionsTo === "zapier")
      y.preventDefault();
    else if (S) {
      if (!(e.action || e.sendSubmissionsTo === "email")) {
        y.preventDefault();
        return;
      }
      y.preventDefault();
      const C = y.currentTarget, p = e.customHeaders || {};
      let v;
      const E = new FormData(C), R = Array.from(
        y.currentTarget.querySelectorAll("input,select,textarea")
      ).filter((u) => !!u.name).map((u) => {
        let h;
        const k = u.name;
        if (u instanceof HTMLInputElement)
          if (u.type === "radio") {
            if (u.checked)
              return h = u.name, {
                key: k,
                value: h
              };
          } else if (u.type === "checkbox")
            h = u.checked;
          else if (u.type === "number" || u.type === "range") {
            const b = u.valueAsNumber;
            isNaN(b) || (h = b);
          } else
            u.type === "file" ? h = u.files : h = u.value;
        else
          h = u.value;
        return {
          key: k,
          value: h
        };
      });
      let P = e.contentType;
      if (e.sendSubmissionsTo === "email" && (P = "multipart/form-data"), Array.from(R).forEach(({ value: u }) => {
        (u instanceof File || Array.isArray(u) && u[0] instanceof File || u instanceof FileList) && (P = "multipart/form-data");
      }), P !== "application/json")
        v = E;
      else {
        const u = {};
        Array.from(R).forEach(({ value: h, key: k }) => {
          Ee(u, k, h);
        }), v = JSON.stringify(u);
      }
      P && P !== "multipart/form-data" && (S && ((I = e.action) != null && I.includes("zapier.com")) || (p["content-type"] = P));
      const $ = new CustomEvent("presubmit", { detail: { body: v } });
      if (t.current && (t.current.dispatchEvent($), $.defaultPrevented))
        return;
      i("sending");
      const j = `${Gt() === "dev" ? "http://localhost:5000" : "https://builder.io"}/api/v1/form-submit?apiKey=${e.builderContext.apiKey}&to=${btoa(
        e.sendSubmissionsToEmail || ""
      )}&name=${encodeURIComponent(e.name || "")}`;
      fetch(
        e.sendSubmissionsTo === "email" ? j : e.action,
        { body: v, headers: p, method: e.method || "post" }
      ).then(
        async (u) => {
          let h;
          const k = u.headers.get("content-type");
          if (k && k.indexOf("application/json") !== -1 ? h = await u.json() : h = await u.text(), !u.ok && e.errorMessagePath) {
            let b = Qt(h, e.errorMessagePath);
            b && (typeof b != "string" && (b = JSON.stringify(b)), l(b), d({ formErrorMessage: b }));
          }
          if (r(h), i(u.ok ? "success" : "error"), u.ok) {
            const b = new CustomEvent("submit:success", {
              detail: { res: u, body: h }
            });
            if (t.current) {
              if (t.current.dispatchEvent(b), b.defaultPrevented)
                return;
              e.resetFormOnSubmit !== !1 && t.current.reset();
            }
            if (e.successUrl)
              if (t.current) {
                const x = new CustomEvent("route", {
                  detail: { url: e.successUrl }
                });
                t.current.dispatchEvent(x), x.defaultPrevented || (location.href = e.successUrl);
              } else
                location.href = e.successUrl;
          }
        },
        (u) => {
          const h = new CustomEvent("submit:error", {
            detail: { error: u }
          });
          t.current && (t.current.dispatchEvent(h), h.defaultPrevented) || (r(u), i("error"));
        }
      );
    }
  }
  return /* @__PURE__ */ B(T, { children: [
    " ",
    /* @__PURE__ */ B(
      "form",
      {
        validate: e.validate,
        ref: t,
        action: !e.sendWithJs && e.action,
        method: e.method,
        name: e.name,
        onSubmit: (y) => m(y),
        ...e.attributes,
        children: [
          e.builderBlock && e.builderBlock.children ? /* @__PURE__ */ s(T, { children: (g = (f = e.builderBlock) == null ? void 0 : f.children) == null ? void 0 : g.map((y, S) => /* @__PURE__ */ s(
            _,
            {
              block: y,
              context: e.builderContext,
              registeredComponents: e.builderComponents,
              linkComponent: e.builderLinkComponent
            },
            `form-block-${S}`
          )) }) : null,
          c() === "error" ? /* @__PURE__ */ s(
            O,
            {
              path: "errorMessage",
              blocks: e.errorMessage,
              context: e.builderContext
            }
          ) : null,
          c() === "sending" ? /* @__PURE__ */ s(
            O,
            {
              path: "sendingMessage",
              blocks: e.sendingMessage,
              context: e.builderContext
            }
          ) : null,
          c() === "error" && o ? /* @__PURE__ */ s("pre", { className: "builder-form-error-text pre-31bf8a14", children: JSON.stringify(o, null, 2) }) : null,
          c() === "success" ? /* @__PURE__ */ s(
            O,
            {
              path: "successMessage",
              blocks: e.successMessage,
              context: e.builderContext
            }
          ) : null
        ]
      }
    ),
    " ",
    /* @__PURE__ */ s("style", { children: ".pre-31bf8a14 {   padding: 10px;   color: red;   text-align: center; }" }),
    " "
  ] });
}
const Zt = {
  name: "Form:Input",
  image: "https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2Fad6f37889d9e40bbbbc72cdb5875d6ca",
  inputs: [
    {
      name: "type",
      type: "text",
      enum: ["text", "number", "email", "url", "checkbox", "radio", "range", "date", "datetime-local", "search", "tel", "time", "file", "month", "week", "password", "color", "hidden"],
      defaultValue: "text"
    },
    {
      name: "name",
      type: "string",
      required: !0,
      helperText: 'Every input in a form needs a unique name describing what it takes, e.g. "email"'
    },
    {
      name: "placeholder",
      type: "string",
      defaultValue: "Hello there",
      helperText: "Text to display when there is no value"
    },
    // TODO: handle value vs default value automatically like ng-model
    {
      name: "defaultValue",
      type: "string"
    },
    {
      name: "value",
      type: "string",
      advanced: !0
    },
    {
      name: "required",
      type: "boolean",
      helperText: "Is this input required to be filled out to submit a form",
      defaultValue: !1
    }
  ],
  noWrap: !0,
  static: !0,
  defaultStyles: {
    paddingTop: "10px",
    paddingBottom: "10px",
    paddingLeft: "10px",
    paddingRight: "10px",
    borderRadius: "3px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#ccc"
  }
};
function en(e) {
  return /* @__PURE__ */ Ce(
    "input",
    {
      ...e.attributes,
      key: N() && e.defaultValue ? e.defaultValue : "default-key",
      placeholder: e.placeholder,
      type: e.type,
      name: e.name,
      value: e.value,
      defaultValue: e.defaultValue,
      required: e.required
    }
  );
}
const tn = {
  name: "Form:Select",
  image: "https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2F83acca093fb24aaf94dee136e9a4b045",
  defaultStyles: {
    alignSelf: "flex-start"
  },
  inputs: [{
    name: "options",
    type: "list",
    required: !0,
    subFields: [{
      name: "value",
      type: "text",
      required: !0
    }, {
      name: "name",
      type: "text"
    }],
    defaultValue: [{
      value: "option 1"
    }, {
      value: "option 2"
    }]
  }, {
    name: "name",
    type: "string",
    required: !0,
    helperText: 'Every select in a form needs a unique name describing what it gets, e.g. "email"'
  }, {
    name: "defaultValue",
    type: "string"
  }, {
    name: "value",
    type: "string",
    advanced: !0
  }, {
    name: "required",
    type: "boolean",
    defaultValue: !1
  }],
  static: !0,
  noWrap: !0
};
function nn(e) {
  var t;
  return /* @__PURE__ */ Ce(
    "select",
    {
      ...e.attributes,
      value: e.value,
      key: N() && e.defaultValue ? e.defaultValue : "default-key",
      defaultValue: e.defaultValue,
      name: e.name
    },
    (t = e.options) == null ? void 0 : t.map((n) => /* @__PURE__ */ s("option", { value: n.value, children: n.name || n.value }))
  );
}
const on = {
  name: "Form:SubmitButton",
  image: "https://cdn.builder.io/api/v1/image/assets%2FIsxPKMo2gPRRKeakUztj1D6uqed2%2Fdf2820ffed1f4349a94c40b3221f5b98",
  defaultStyles: {
    appearance: "none",
    paddingTop: "15px",
    paddingBottom: "15px",
    paddingLeft: "25px",
    paddingRight: "25px",
    backgroundColor: "#3898EC",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer"
  },
  inputs: [{
    name: "text",
    type: "text",
    defaultValue: "Click me"
  }],
  static: !0,
  noWrap: !0
  // TODO: optional children? maybe as optional form input
  // that only shows if advanced setting is flipped
  // TODO: defaultChildren
  // canHaveChildren: true,
};
function an(e) {
  return /* @__PURE__ */ s("button", { type: "submit", ...e.attributes, children: e.text });
}
const rn = {
  // friendlyName?
  name: "Raw:Img",
  hideFromInsertMenu: !0,
  image: "https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-insert_photo-24px.svg?alt=media&token=4e5d0ef4-f5e8-4e57-b3a9-38d63a9b9dc4",
  inputs: [{
    name: "image",
    bubble: !0,
    type: "file",
    allowedFileTypes: ["jpeg", "jpg", "png", "svg", "gif", "webp"],
    required: !0
  }],
  noWrap: !0,
  static: !0
};
function ln(e) {
  return /* @__PURE__ */ s(
    "img",
    {
      style: {
        objectFit: e.backgroundSize || "cover",
        objectPosition: e.backgroundPosition || "center"
      },
      alt: e.altText,
      src: e.imgSrc || e.image,
      ...e.attributes
    },
    N() && e.imgSrc || "default-key"
  );
}
const sn = {
  name: "Video",
  canHaveChildren: !0,
  defaultStyles: {
    minHeight: "20px",
    minWidth: "20px"
  },
  image: "https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-videocam-24px%20(1).svg?alt=media&token=49a84e4a-b20e-4977-a650-047f986874bb",
  inputs: [{
    name: "video",
    type: "file",
    allowedFileTypes: ["mp4"],
    bubble: !0,
    defaultValue: "https://cdn.builder.io/o/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fd27731a526464deba0016216f5f9e570%2Fcompressed?apiKey=YJIGb4i01jvw0SRdL5Bt&token=d27731a526464deba0016216f5f9e570&alt=media&optimized=true",
    required: !0
  }, {
    name: "posterImage",
    type: "file",
    allowedFileTypes: ["jpeg", "png"],
    helperText: "Image to show before the video plays"
  }, {
    name: "autoPlay",
    type: "boolean",
    defaultValue: !0
  }, {
    name: "controls",
    type: "boolean",
    defaultValue: !1
  }, {
    name: "muted",
    type: "boolean",
    defaultValue: !0
  }, {
    name: "loop",
    type: "boolean",
    defaultValue: !0
  }, {
    name: "playsInline",
    type: "boolean",
    defaultValue: !0
  }, {
    name: "fit",
    type: "text",
    defaultValue: "cover",
    enum: ["contain", "cover", "fill", "auto"]
  }, {
    name: "preload",
    type: "text",
    defaultValue: "metadata",
    enum: ["auto", "metadata", "none"]
  }, {
    name: "fitContent",
    type: "boolean",
    helperText: "When child blocks are provided, fit to them instead of using the aspect ratio",
    defaultValue: !0,
    advanced: !0
  }, {
    name: "position",
    type: "text",
    defaultValue: "center",
    enum: ["center", "top", "left", "right", "bottom", "top left", "top right", "bottom left", "bottom right"]
  }, {
    name: "height",
    type: "number",
    advanced: !0
  }, {
    name: "width",
    type: "number",
    advanced: !0
  }, {
    name: "aspectRatio",
    type: "number",
    advanced: !0,
    defaultValue: 0.7004048582995948
  }, {
    name: "lazyLoad",
    type: "boolean",
    helperText: 'Load this video "lazily" - as in only when a user scrolls near the video. Recommended for optmized performance and bandwidth consumption',
    defaultValue: !0,
    advanced: !0
  }]
};
function cn(e) {
  var i, o, r, a, l, d, c;
  function t() {
    return {
      ...e.autoPlay === !0 ? {
        autoPlay: !0
      } : {},
      ...e.muted === !0 ? {
        muted: !0
      } : {},
      ...e.controls === !0 ? {
        controls: !0
      } : {},
      ...e.loop === !0 ? {
        loop: !0
      } : {},
      ...e.playsInline === !0 ? {
        playsInline: !0
      } : {}
    };
  }
  function n() {
    return {
      ...t()
    };
  }
  return /* @__PURE__ */ B(
    "div",
    {
      style: {
        position: "relative"
      },
      children: [
        /* @__PURE__ */ s(
          "video",
          {
            className: "builder-video",
            ...n(),
            preload: e.preload || "metadata",
            style: {
              width: "100%",
              height: "100%",
              ...(i = e.attributes) == null ? void 0 : i.style,
              objectFit: e.fit,
              objectPosition: e.position,
              // Hack to get object fit to work as expected and
              // not have the video overflow
              zIndex: 2,
              borderRadius: "1px",
              ...e.aspectRatio ? {
                position: "absolute"
              } : null
            },
            src: e.video || "no-src",
            poster: e.posterImage,
            children: e.lazyLoad ? null : /* @__PURE__ */ s("source", { type: "video/mp4", src: e.video })
          }
        ),
        e.aspectRatio && !(e.fitContent && ((r = (o = e.builderBlock) == null ? void 0 : o.children) != null && r.length)) ? /* @__PURE__ */ s(
          "div",
          {
            style: {
              width: "100%",
              paddingTop: e.aspectRatio * 100 + "%",
              pointerEvents: "none",
              fontSize: "0px"
            }
          }
        ) : null,
        (l = (a = e.builderBlock) == null ? void 0 : a.children) != null && l.length && e.fitContent ? /* @__PURE__ */ s(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch"
            },
            children: e.children
          }
        ) : null,
        (c = (d = e.builderBlock) == null ? void 0 : d.children) != null && c.length && !e.fitContent ? /* @__PURE__ */ s(
          "div",
          {
            style: {
              pointerEvents: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%"
            },
            children: e.children
          }
        ) : null
      ]
    }
  );
}
const dn = () => [{
  component: Ht,
  ...jt
}, {
  component: _t,
  ...Kt
}, {
  component: Xt,
  ...Jt
}, {
  component: en,
  ...Zt
}, {
  component: an,
  ...on
}, {
  component: nn,
  ...tn
}, {
  component: ln,
  ...rn
}, {
  component: cn,
  ...sn
}], pe = () => [{
  component: Et,
  ...Tt
}, {
  component: It,
  ...Rt
}, {
  component: Vt,
  ...Pt
}, {
  component: Nt,
  ...Bt
}, {
  component: $t,
  ...Ft
}, {
  component: Dt,
  ...Lt
}, {
  component: An,
  ...Mt
}, {
  component: Ut,
  ...Ot
}, ...dn()], un = `function updateCookiesAndStyles(contentId, variants, isHydrationTarget) {
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
}`, mn = `function updateVariantVisibility(variantContentId, defaultContentId, isHydrationTarget) {
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
}`, Ne = "builderIoAbTest", Fe = "builderIoRenderContent", J = (e) => Object.values((e == null ? void 0 : e.variations) || {}).map((t) => ({
  ...t,
  testVariationId: t.id,
  id: e == null ? void 0 : e.id
})), fn = ({
  canTrack: e,
  content: t
}) => !(!(J(t).length > 0) || !e || U()), hn = (e) => e === "react" || e === "reactNative", $e = hn(z), gn = () => `
  window.${Ne} = ${un}
  window.${Fe} = ${mn}
  `, bn = (e, t) => `
  window.${Ne}(
    "${t}",${JSON.stringify(e)}, ${$e}
  )`, yn = ({
  contentId: e,
  variationId: t
}) => `window.${Fe}(
    "${t}", "${e}", ${$e}
  )`;
function ie(e) {
  return /* @__PURE__ */ s(
    "script",
    {
      dangerouslySetInnerHTML: { __html: e.scriptStr },
      "data-id": e.id
    }
  );
}
function xe(e) {
  return Math.round(e * 1e3) / 1e3;
}
const pn = (e, t, n = !0) => {
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
}, xn = (e) => pn(e, (t) => {
  const n = t.getAttribute("builder-id") || t.id;
  return (n == null ? void 0 : n.indexOf("builder-")) === 0;
}), Se = ({
  event: e,
  target: t
}) => {
  const n = t.getBoundingClientRect(), i = e.clientX - n.left, o = e.clientY - n.top, r = xe(i / n.width), a = xe(o / n.height);
  return {
    x: r,
    y: a
  };
}, Sn = (e) => {
  const t = e.target, n = t && xn(t), i = (n == null ? void 0 : n.getAttribute("builder-id")) || (n == null ? void 0 : n.id);
  return {
    targetBuilderElement: i || void 0,
    metadata: {
      targetOffset: t ? Se({
        event: e,
        target: t
      }) : void 0,
      builderTargetOffset: n ? Se({
        event: e,
        target: n
      }) : void 0,
      builderElementIndex: n && i ? [].slice.call(document.getElementsByClassName(i)).indexOf(n) : void 0
    }
  };
};
function vn(e) {
  var p, v, E, R, P, $, j;
  const t = X(null);
  function n(u) {
    var k, b;
    const h = {
      ...e.builderContextSignal.rootState,
      ...u
    };
    e.builderContextSignal.rootSetState ? (b = (k = e.builderContextSignal).rootSetState) == null || b.call(k, h) : e.setBuilderContextSignal((x) => ({
      ...x,
      rootState: h
    }));
  }
  function i(u) {
    var k, b, x, A, D;
    const h = {
      ...e.builderContextSignal.content,
      ...u,
      data: {
        ...(k = e.builderContextSignal.content) == null ? void 0 : k.data,
        ...u == null ? void 0 : u.data
      },
      meta: {
        ...(b = e.builderContextSignal.content) == null ? void 0 : b.meta,
        ...u == null ? void 0 : u.meta,
        breakpoints: ((x = u == null ? void 0 : u.meta) == null ? void 0 : x.breakpoints) || ((D = (A = e.builderContextSignal.content) == null ? void 0 : A.meta) == null ? void 0 : D.breakpoints)
      }
    };
    e.setBuilderContextSignal((W) => ({
      ...W,
      content: h
    }));
  }
  const [o, r] = w(
    () => e.contentWrapper || "div"
  );
  function a(u) {
    return Ke({
      model: e.model,
      trustedHosts: e.trustedHosts,
      callbacks: {
        configureSdk: (h) => {
          var x;
          const { breakpoints: k, contentId: b } = h;
          !b || b !== ((x = e.builderContextSignal.content) == null ? void 0 : x.id) || k && i({
            meta: {
              breakpoints: k
            }
          });
        },
        animation: (h) => {
          Re(h);
        },
        contentUpdate: (h) => {
          i(h);
        }
      }
    })(u);
  }
  function l() {
    var h, k;
    const u = (k = (h = e.builderContextSignal.content) == null ? void 0 : h.data) == null ? void 0 : k.jsCode;
    u && K({
      code: u,
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
  const [d, c] = w(() => ({})), [m, f] = w(() => ({})), [g, y] = w(() => !1);
  function S(u) {
    var h, k;
    if (e.builderContextSignal.content) {
      const b = (h = e.builderContextSignal.content) == null ? void 0 : h.testVariationId, x = (k = e.builderContextSignal.content) == null ? void 0 : k.id;
      me({
        type: "click",
        canTrack: G(e.canTrack),
        contentId: x,
        apiKey: e.apiKey,
        variationId: b !== x ? b : void 0,
        ...Sn(u),
        unique: !g
      });
    }
    g || y(!0);
  }
  function I() {
    var h, k, b;
    const u = (b = (k = (h = e.builderContextSignal.content) == null ? void 0 : h.data) == null ? void 0 : k.httpRequests) != null ? b : {};
    Object.entries(u).forEach(([x, A]) => {
      if (!A || m[x] || d[x] && !N())
        return;
      m[x] = !0;
      const D = A.replace(
        /{{([^}]+)}}/g,
        (W, Le) => String(
          K({
            code: Le,
            context: e.context || {},
            localState: void 0,
            rootState: e.builderContextSignal.rootState,
            rootSetState: e.builderContextSignal.rootSetState,
            enableCache: !0
          })
        )
      );
      qe(D).then((W) => W.json()).then((W) => {
        n({
          [x]: W
        }), d[x] = !0;
      }).catch((W) => {
        console.error("error fetching dynamic data", A, W);
      }).finally(() => {
        m[x] = !1;
      });
    });
  }
  function C() {
    N() && window.dispatchEvent(
      new CustomEvent(
        "builder:component:stateChange",
        {
          detail: {
            state: oe(e.builderContextSignal.rootState),
            ref: {
              name: e.model
            }
          }
        }
      )
    );
  }
  return V(() => {
    var u, h;
    if (U()) {
      if (N() && (window.addEventListener("message", a), Ue({
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
      ).forEach((b) => {
        var A;
        const x = je(b);
        (A = window.parent) == null || A.postMessage(x, "*");
      }), window.addEventListener(
        "builder:component:stateChangeListenerActivated",
        C
      )), e.builderContextSignal.content && G(e.canTrack)) {
        const b = (u = e.builderContextSignal.content) == null ? void 0 : u.testVariationId, x = (h = e.builderContextSignal.content) == null ? void 0 : h.id, A = e.apiKey;
        me({
          type: "impression",
          canTrack: !0,
          contentId: x,
          apiKey: A,
          variationId: b !== x ? b : void 0
        });
      }
      if (He()) {
        const b = new URL(location.href).searchParams, x = b.get("builder.preview"), A = b.get(
          `builder.preview.${x}`
        ), D = b.get("apiKey") || b.get("builder.space");
        x === e.model && D === e.apiKey && (!e.content || A === e.content.id) && we({
          model: e.model,
          apiKey: e.apiKey,
          apiVersion: e.builderContextSignal.apiVersion
        }).then((W) => {
          W && i(W);
        });
      }
    }
  }, []), V(() => {
    e.apiKey || H.error(
      "No API key provided to `RenderContent` component. This can cause issues. Please provide an API key using the `apiKey` prop."
    ), l(), I(), C();
  }, []), V(() => {
    e.content && i(e.content);
  }, [e.content]), V(() => {
    l();
  }, [(v = (p = e.builderContextSignal.content) == null ? void 0 : p.data) == null ? void 0 : v.jsCode]), V(() => {
    I();
  }, [(R = (E = e.builderContextSignal.content) == null ? void 0 : E.data) == null ? void 0 : R.httpRequests]), V(() => {
    C();
  }, [e.builderContextSignal.rootState]), V(() => {
    e.data && n(e.data);
  }, [e.data]), V(() => {
    e.locale && n({
      locale: e.locale
    });
  }, [e.locale]), V(() => () => {
    U() && (window.removeEventListener("message", a), window.removeEventListener(
      "builder:component:stateChangeListenerActivated",
      C
    ));
  }, []), /* @__PURE__ */ s(ae.Provider, { value: e.builderContextSignal, children: e.builderContextSignal.content ? /* @__PURE__ */ s(
    o,
    {
      ref: t,
      onClick: (u) => S(u),
      "builder-content-id": (P = e.builderContextSignal.content) == null ? void 0 : P.id,
      "builder-model": e.model,
      ...e.showContent ? {} : {
        hidden: !0,
        "aria-hidden": !0
      },
      ...e.contentWrapperProps,
      className: `variant-${(($ = e.content) == null ? void 0 : $.testVariationId) || ((j = e.content) == null ? void 0 : j.id)}`,
      children: e.children
    }
  ) : null });
}
const kn = (e) => {
  var r, a;
  const t = e.family + (e.kind && !e.kind.includes("#") ? ", " + e.kind : ""), n = t.split(",")[0], i = (a = e.fileUrl) != null ? a : (r = e == null ? void 0 : e.files) == null ? void 0 : r.regular;
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
      const c = e.files[l];
      c && c !== i && (o += `
@font-face {
font-family: "${t}";
src: url('${c}') format('woff2');
font-display: fallback;
font-weight: ${l};
}
        `.trim());
    }
  return o;
}, Cn = ({
  customFonts: e
}) => {
  var t;
  return ((t = e == null ? void 0 : e.map((n) => kn(n))) == null ? void 0 : t.join(" ")) || "";
}, wn = ({
  cssCode: e,
  contentId: t
}) => e ? t ? (e == null ? void 0 : e.replace(/&/g, `div[builder-content-id="${t}"]`)) || "" : e : "", In = `
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
`, Tn = (e) => e ? "" : In;
function En(e) {
  const [t, n] = w(
    () => `
${wn({
      cssCode: e.cssCode,
      contentId: e.contentId
    })}
${Cn({
      customFonts: e.customFonts
    })}
${Tn(e.isNestedRender)}
`.trim()
  );
  return /* @__PURE__ */ s(Z, { id: "builderio-content", styles: t });
}
const Rn = ({
  content: e,
  data: t,
  locale: n
}) => {
  var r, a, l;
  const i = {}, o = ((r = e == null ? void 0 : e.data) == null ? void 0 : r.state) || {};
  return (l = (a = e == null ? void 0 : e.data) == null ? void 0 : a.inputs) == null || l.forEach((d) => {
    d.name && d.defaultValue !== void 0 && (i[d.name] = d.defaultValue);
  }), {
    ...i,
    ...o,
    ...t,
    ...n ? {
      locale: n
    } : {}
  };
}, Pn = ({
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
function ve(e) {
  var d, c, m, f, g, y, S;
  const [t, n] = w(
    () => {
      var I, C;
      return yn({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        variationId: (I = e.content) == null ? void 0 : I.testVariationId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        contentId: (C = e.content) == null ? void 0 : C.id
      });
    }
  );
  function i(I) {
    l((C) => ({
      ...C,
      rootState: I
    }));
  }
  const [o, r] = w(
    () => [
      ...pe(),
      ...e.customComponents || []
    ].reduce(
      (I, { component: C, ...p }) => ({
        ...I,
        [p.name]: {
          component: C,
          ...fe(p)
        }
      }),
      {}
    )
  ), [a, l] = w(() => ({
    content: Pn({
      content: e.content,
      data: e.data
    }),
    localState: void 0,
    rootState: Rn({
      content: e.content,
      data: e.data,
      locale: e.locale
    }),
    rootSetState: i,
    context: e.context || {},
    apiKey: e.apiKey,
    apiVersion: e.apiVersion,
    componentInfos: [
      ...pe(),
      ...e.customComponents || []
    ].reduce(
      (I, { component: C, ...p }) => ({
        ...I,
        [p.name]: fe(p)
      }),
      {}
    ),
    inheritedStyles: {},
    BlocksWrapper: e.blocksWrapper || "div",
    BlocksWrapperProps: e.blocksWrapperProps || {}
  }));
  return /* @__PURE__ */ s(
    Ie.Provider,
    {
      value: {
        registeredComponents: o
      },
      children: /* @__PURE__ */ B(
        vn,
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
          builderContextSignal: a,
          contentWrapper: e.contentWrapper,
          contentWrapperProps: e.contentWrapperProps,
          linkComponent: e.linkComponent,
          trustedHosts: e.trustedHosts,
          setBuilderContextSignal: l,
          children: [
            e.isSsrAbTest ? /* @__PURE__ */ s(
              ie,
              {
                id: "builderio-variant-visibility",
                scriptStr: t
              }
            ) : null,
            /* @__PURE__ */ s(
              En,
              {
                isNestedRender: e.isNestedRender,
                contentId: (d = a.content) == null ? void 0 : d.id,
                cssCode: (m = (c = a.content) == null ? void 0 : c.data) == null ? void 0 : m.cssCode,
                customFonts: (g = (f = a.content) == null ? void 0 : f.data) == null ? void 0 : g.customFonts
              }
            ),
            /* @__PURE__ */ s(
              O,
              {
                blocks: (S = (y = a.content) == null ? void 0 : y.data) == null ? void 0 : S.blocks,
                context: a,
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
function Vn(e) {
  var a;
  const [t, n] = w(
    () => fn({
      canTrack: G(e.canTrack),
      content: e.content
    })
  );
  function i() {
    var l;
    return bn(
      J(e.content).map((d) => ({
        id: d.testVariationId,
        testRatio: d.testRatio
      })),
      ((l = e.content) == null ? void 0 : l.id) || ""
    );
  }
  function o() {
    return J(e.content).map((l) => `.variant-${l.testVariationId} { display: none; } `).join("");
  }
  function r() {
    var l;
    return t ? {
      ...e.content,
      testVariationId: (l = e.content) == null ? void 0 : l.id
    } : ze({
      item: e.content,
      canTrack: G(e.canTrack)
    });
  }
  return V(() => {
  }, []), /* @__PURE__ */ B(T, { children: [
    !e.isNestedRender && z !== "reactNative" ? /* @__PURE__ */ s(
      ie,
      {
        id: "builderio-init-variants-fns",
        scriptStr: gn()
      }
    ) : null,
    t ? /* @__PURE__ */ B(T, { children: [
      /* @__PURE__ */ s(
        Z,
        {
          id: "builderio-variants",
          styles: o()
        }
      ),
      /* @__PURE__ */ s(
        ie,
        {
          id: "builderio-variants-visibility",
          scriptStr: i()
        }
      ),
      (a = J(e.content)) == null ? void 0 : a.map((l) => /* @__PURE__ */ s(
        ve,
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
      ve,
      {
        isNestedRender: e.isNestedRender,
        content: r(),
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
const Bn = async ({
  builderContextValue: e,
  symbol: t
}) => {
  if (t != null && t.model && // This is a hack, we should not need to check for this, but it is needed for Svelte.
  (e != null && e.apiKey))
    return we({
      model: t.model,
      apiKey: e.apiKey,
      apiVersion: e.apiVersion,
      ...(t == null ? void 0 : t.entry) && {
        query: {
          id: t.entry
        }
      }
    }).catch((n) => {
      H.error("Could not fetch symbol content: ", n);
    });
};
function An(e) {
  var r, a, l, d;
  function t() {
    var c, m;
    return [
      e.attributes[q()],
      "builder-symbol",
      (c = e.symbol) != null && c.inline ? "builder-inline-symbol" : void 0,
      (m = e.symbol) != null && m.dynamic || e.dynamic ? "builder-dynamic-symbol" : void 0
    ].filter(Boolean).join(" ");
  }
  const [n, i] = w(() => {
    var c;
    return (c = e.symbol) == null ? void 0 : c.content;
  });
  function o() {
    n || Bn({
      symbol: e.symbol,
      builderContextValue: e.builderContext
    }).then((c) => {
      c && i(c);
    });
  }
  return V(() => {
  }, []), V(() => {
    o();
  }, [e.symbol]), /* @__PURE__ */ s("div", { ...e.attributes, className: t(), children: /* @__PURE__ */ s(
    Vn,
    {
      isNestedRender: !0,
      apiVersion: e.builderContext.apiVersion,
      apiKey: e.builderContext.apiKey,
      context: {
        ...e.builderContext.context,
        symbolId: (r = e.builderBlock) == null ? void 0 : r.id
      },
      customComponents: Object.values(e.builderComponents),
      data: {
        ...(a = e.symbol) == null ? void 0 : a.data,
        ...e.builderContext.localState,
        ...(l = n == null ? void 0 : n.data) == null ? void 0 : l.state
      },
      model: (d = e.symbol) == null ? void 0 : d.model,
      content: n,
      linkComponent: e.builderLinkComponent,
      blocksWrapper: "div",
      contentWrapper: "div"
    }
  ) });
}
export {
  O as Blocks,
  It as Columns,
  Vn as Content,
  An as Symbol,
  Ut as Text
};
