"use client";
var Ne = Object.defineProperty;
var Ve = (e, t, n) => t in e ? Ne(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var G = (e, t, n) => (Ve(e, typeof t != "symbol" ? t + "" : t, n), n);
import { jsx as c, Fragment as p, jsxs as V } from "react/jsx-runtime";
import { createContext as ye, useState as E, useEffect as P, useContext as ce, useRef as $e } from "react";
import { isEditing as H, isBrowser as L, getUserAttributes as De, checkIsDefined as _, logger as K, fastClone as ee, TARGET as j, setupBrowserForEditing as Oe, createRegisterComponentMessage as He, getDefaultCanTrack as z, _track as se, isPreviewing as Le, fetchOneEntry as ke, createEditorListener as Fe, fetch as Ke, serializeComponentInfo as de, handleABTestingSync as Me } from "./server-entry-6055a923.js";
const te = ye({
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
  rootState: l
}) => {
  const r = Ue({
    builder: t,
    context: n,
    event: i,
    state: ve({
      rootState: l,
      localState: o,
      rootSetState: a
    })
  });
  return new Function(...r.map(([s]) => s), e)(...r.map(([, s]) => s));
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
        rootSetState: n ? (l) => {
          i[o] = l, n(i);
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
  return typeof process != "undefined" && _((e = process == null ? void 0 : process.versions) == null ? void 0 : e.node);
}
const Ye = () => {
  var i;
  if (!qe())
    return !1;
  const e = process.arch === "arm64", t = process.version.startsWith("v20"), n = (i = process.env.NODE_OPTIONS) == null ? void 0 : i.includes("--no-node-snapshot");
  return e && t && !n ? (K.log("Skipping usage of `isolated-vm` to avoid crashes in Node v20 on an arm64 machine.\n    If you would like to use the `isolated-vm` package on this machine, please provide the `NODE_OPTIONS=--no-node-snapshot` config to your Node process.\n    See https://github.com/BuilderIO/builder/blob/main/packages/sdks/README.md#node-v20--m1-macs-apple-silicon-support for more information.\n    "), !0) : !1;
}, Qe = (e) => (L() || Ye(), ue(e)), R = class R {
  static getCacheKey(t) {
    return JSON.stringify({
      ...t,
      // replace the event with a random number to break cache
      // thats because we can't serialize the event object due to circular refs in DOM node refs.
      event: t.event ? Math.random() : void 0
    });
  }
  static getCachedValue(t) {
    return R.cache.get(t);
  }
  static setCachedValue(t, n) {
    R.cache.size > 20 && R.cache.delete(R.cache.keys().next().value), R.cache.set(t, {
      value: n
    });
  }
};
G(R, "cacheLimit", 20), G(R, "cache", /* @__PURE__ */ new Map());
let O = R;
function M({
  code: e,
  context: t,
  localState: n,
  rootState: i,
  rootSetState: o,
  event: a,
  isExpression: l = !0,
  enableCache: r
}) {
  if (e === "") {
    K.warn("Skipping evaluation of empty code block.");
    return;
  }
  const s = {
    code: ze(e, {
      isExpression: l
    }),
    builder: _e(),
    context: t,
    event: a,
    rootSetState: o,
    rootState: i,
    localState: n
  };
  if (r) {
    const d = O.getCacheKey(s), u = O.getCachedValue(d);
    if (u)
      return u.value;
  }
  try {
    const d = Qe(s);
    if (r) {
      const u = O.getCacheKey(s);
      O.setCachedValue(u, d);
    }
    return d;
  } catch (d) {
    K.error("Failed code evaluation: " + d.message, {
      code: e
    });
    return;
  }
}
const Je = (e, t, n) => {
  if (Object(e) !== e)
    return e;
  const i = Array.isArray(t) ? t : t.toString().match(/[^.[\]]+/g);
  return i.slice(0, -1).reduce((o, a, l) => Object(o[a]) === o[a] ? o[a] : o[a] = Math.abs(Number(i[l + 1])) >> 0 === +i[l + 1] ? [] : {}, e)[i[i.length - 1]] = n, e;
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
  const a = ee(e), l = {
    ...a,
    properties: {
      ...a.properties
    },
    actions: {
      ...a.actions
    }
  };
  for (const r in e.bindings) {
    const s = e.bindings[r], d = M({
      code: s,
      localState: n,
      rootState: i,
      rootSetState: o,
      context: t,
      enableCache: !0
    });
    Je(l, r, d);
  }
  return l;
};
function q({
  block: e,
  context: t,
  shouldEvaluateBindings: n,
  localState: i,
  rootState: o,
  rootSetState: a
}) {
  const l = e;
  return n ? Ge({
    block: l,
    localState: i,
    rootState: o,
    rootSetState: a,
    context: t
  }) : l;
}
function Xe(e, t, n = {}) {
  let i, o, a, l = null, r = 0;
  const s = function() {
    r = n.leading === !1 ? 0 : Date.now(), l = null, a = e.apply(i, o), l || (i = o = null);
  };
  return function() {
    const d = Date.now();
    !r && n.leading === !1 && (r = d);
    const u = t - (d - r);
    return i = this, o = arguments, u <= 0 || u > t ? (l && (clearTimeout(l), l = null), r = d, a = e.apply(i, o), l || (i = o = null)) : !l && n.trailing !== !1 && (l = setTimeout(s, u)), a;
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
const ne = (e) => e ? e.replace(/([A-Z])/g, (t) => `-${t[0].toLowerCase()}`) : "";
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
function ie(e) {
  console.warn(`Cannot animate element: element with ID ${e} not found!`);
}
function oe(e, t) {
  const n = et(e), i = getComputedStyle(t), o = e.steps[0].styles, a = e.steps[e.steps.length - 1].styles, l = [o, a];
  for (const r of l)
    for (const s of n)
      s in r || (r[s] = i[s]);
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
    ie(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    oe(e, n), n.style.transition = "none", n.style.transitionDelay = "0", $(n.style, e.steps[0].styles), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${ne(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s"), $(n.style, e.steps[1].styles), setTimeout(() => {
        n.style.transition = "", n.style.transitionDelay = "";
      }, (e.delay || 0) * 1e3 + e.duration * 1e3 + 100);
    });
  });
}
function tt(e) {
  const t = Array.prototype.slice.call(document.getElementsByClassName(e.elementId || e.id || ""));
  if (!t.length) {
    ie(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    oe(e, n);
    const i = e.steps[0].styles, o = e.steps[1].styles;
    function a() {
      $(n.style, i);
    }
    function l() {
      $(n.style, o);
    }
    a(), n.addEventListener("mouseenter", l), n.addEventListener("mouseleave", a), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${ne(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s");
    });
  });
}
function nt(e) {
  const t = Array.prototype.slice.call(document.getElementsByClassName(e.elementId || e.id || ""));
  if (!t.length) {
    ie(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    oe(e, n);
    let i = !1, o = !1;
    function a() {
      !i && r(n) ? (i = !0, o = !0, setTimeout(() => {
        $(n.style, e.steps[1].styles), e.repeat || document.removeEventListener("scroll", l), setTimeout(() => {
          o = !1, e.repeat || (n.style.transition = "", n.style.transitionDelay = "");
        }, (e.duration + (e.delay || 0)) * 1e3 + 100);
      })) : e.repeat && i && !o && !r(n) && (i = !1, $(n.style, e.steps[0].styles));
    }
    const l = Xe(a, 200, {
      leading: !1
    });
    function r(u) {
      const f = u.getBoundingClientRect(), h = window.innerHeight, v = (e.thresholdPercent || 0) / 100 * h;
      return f.bottom > v && f.top < h - v;
    }
    const s = e.steps[0].styles;
    function d() {
      $(n.style, s);
    }
    d(), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${ne(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s");
    }), document.addEventListener("scroll", l, {
      capture: !0,
      passive: !0
    }), a();
  });
}
const it = (e) => e.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase(), Ie = (e) => Object.entries(e).map(([n, i]) => {
  if (typeof i == "string")
    return `${it(n)}: ${i};`;
}).filter(_), ot = (e) => Ie(e).join(`
`), X = ({
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
  switch (j) {
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
  const i = (a = q({
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
  const a = n.collection.split(".").pop(), l = n.itemName || (a ? a + "Item" : "item");
  return o.map((s, d) => ({
    context: {
      ...t,
      localState: {
        ...t.localState,
        $index: d,
        $item: s,
        [l]: s,
        [`$${l}Index`]: d
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
  const n = ee(pe);
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
function Y(e) {
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
    const i = q({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    });
    return _(i.hide) ? !i.hide : _(i.show) ? i.show : !0;
  }
  function n() {
    var v;
    const i = q({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    }), o = i.responsiveStyles, a = e.context.content, l = Te(
      ((v = a == null ? void 0 : a.meta) == null ? void 0 : v.breakpoints) || {}
    ), r = o == null ? void 0 : o.large, s = o == null ? void 0 : o.medium, d = o == null ? void 0 : o.small, u = i.id;
    if (!u)
      return "";
    const f = r ? X({
      className: u,
      styles: r
    }) : "", h = s ? X({
      className: u,
      styles: s,
      mediaQuery: me(
        "medium",
        l
      )
    }) : "", y = d ? X({
      className: u,
      styles: d,
      mediaQuery: me(
        "small",
        l
      )
    }) : "";
    return [f, h, y].join(" ");
  }
  return /* @__PURE__ */ c(p, { children: n() && t() ? /* @__PURE__ */ c(p, { children: /* @__PURE__ */ c(Y, { id: "builderio-block", styles: n() }) }) : null });
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
function Ee(e) {
  var i;
  const t = {}, n = (i = e.block.actions) != null ? i : {};
  for (const o in n) {
    if (!n.hasOwnProperty(o))
      continue;
    const a = n[o];
    let l = ut(o);
    if (e.stripPrefix)
      switch (j) {
        case "vue":
          l = l.replace("v-on:", "");
          break;
        case "svelte":
          l = l.replace("on:", "");
          break;
      }
    t[l] = mt(a, e);
  }
  return t;
}
const ae = () => {
  switch (j) {
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
    style: rt({
      block: e,
      context: t
    }),
    [ae()]: [e.id, "builder-block", e.class, (i = e.properties) == null ? void 0 : i.class].filter(Boolean).join(" ")
  };
  return ft({
    properties: n,
    context: t,
    block: e
  });
}
const gt = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]), bt = (e) => typeof e == "string" && gt.has(e.toLowerCase());
function Ae(e) {
  return /* @__PURE__ */ c(p, { children: bt(e.TagName) ? /* @__PURE__ */ c(p, { children: /* @__PURE__ */ c(e.TagName, { ...e.attributes, ...e.actionAttributes }) }) : /* @__PURE__ */ c(p, { children: typeof e.TagName == "string" ? /* @__PURE__ */ c(e.TagName, { ...e.attributes, ...e.actionAttributes, children: e.children }) : /* @__PURE__ */ c(e.TagName, { ...e.attributes, ...e.actionAttributes, children: e.children }) }) });
}
function St(e) {
  return /* @__PURE__ */ c(
    Ae,
    {
      TagName: e.Wrapper,
      attributes: re({
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
        ...re({
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
  contextValue: l
}) => {
  const r = {
    ...e,
    /**
     * If `noWrap` is set to `true`, then the block's props/attributes are provided to the
     * component itself directly. Otherwise, they are provided to the wrapper element.
     */
    ...o ? {
      attributes: re({
        block: t,
        context: l
      })
    } : {}
  };
  return a ? {
    Wrapper: i,
    block: t,
    context: n,
    wrapperProps: e,
    includeBlockProps: o
  } : r;
};
function fe(e) {
  var i;
  const [t, n] = E(
    () => e.isInteractive ? yt : e.componentRef
  );
  return /* @__PURE__ */ c(p, { children: e.componentRef ? /* @__PURE__ */ c(p, { children: /* @__PURE__ */ c(
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
        Q,
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
  return /* @__PURE__ */ c(te.Provider, { value: t, children: /* @__PURE__ */ c(
    Q,
    {
      block: e.block,
      context: t,
      registeredComponents: e.registeredComponents,
      linkComponent: e.linkComponent
    }
  ) });
}
function Q(e) {
  var s, d, u;
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
    var f;
    return (f = e.block.repeat) != null && f.collection ? e.block : q({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    });
  }
  function o() {
    var h;
    return e.block.tagName === "a" || ((h = i().properties) == null ? void 0 : h.href) || i().href ? e.linkComponent || "a" : e.block.tagName || "div";
  }
  function a() {
    var y, v;
    if ((y = e.block.repeat) != null && y.collection)
      return !!((v = n == null ? void 0 : n()) != null && v.length);
    const f = "hide" in i() ? i().hide : !1;
    return ("show" in i() ? i().show : !0) && !f;
  }
  function l() {
    var h, y;
    return !((h = t == null ? void 0 : t()) != null && h.component) && !n() ? (y = i().children) != null ? y : [] : [];
  }
  function r() {
    var f, h, y, v, T, C, m, k, w, B, N;
    return {
      blockChildren: (f = i().children) != null ? f : [],
      componentRef: (h = t == null ? void 0 : t()) == null ? void 0 : h.component,
      componentOptions: {
        ...je(i()),
        builderContext: e.context,
        ...((y = t == null ? void 0 : t()) == null ? void 0 : y.name) === "Core:Button" || ((v = t == null ? void 0 : t()) == null ? void 0 : v.name) === "Symbol" || ((T = t == null ? void 0 : t()) == null ? void 0 : T.name) === "Columns" || ((C = t == null ? void 0 : t()) == null ? void 0 : C.name) === "Form:Form" ? {
          builderLinkComponent: e.linkComponent
        } : {},
        ...((m = t == null ? void 0 : t()) == null ? void 0 : m.name) === "Symbol" || ((k = t == null ? void 0 : t()) == null ? void 0 : k.name) === "Columns" || ((w = t == null ? void 0 : t()) == null ? void 0 : w.name) === "Form:Form" ? {
          builderComponents: e.registeredComponents
        } : {}
      },
      context: e.context,
      linkComponent: e.linkComponent,
      registeredComponents: e.registeredComponents,
      builderBlock: i(),
      includeBlockProps: ((B = t == null ? void 0 : t()) == null ? void 0 : B.noWrap) === !0,
      isInteractive: !((N = t == null ? void 0 : t()) != null && N.isRSC)
    };
  }
  return P(() => {
    const f = i().id, h = i().animations;
    h && f && Ze(
      h.filter((y) => y.trigger !== "hover").map((y) => ({
        ...y,
        elementId: f
      }))
    );
  }, []), /* @__PURE__ */ c(p, { children: a() ? /* @__PURE__ */ V(p, { children: [
    /* @__PURE__ */ c(st, { block: e.block, context: e.context }),
    (s = t == null ? void 0 : t()) != null && s.noWrap ? /* @__PURE__ */ c(p, { children: /* @__PURE__ */ c(
      fe,
      {
        componentRef: r().componentRef,
        componentOptions: r().componentOptions,
        blockChildren: r().blockChildren,
        context: r().context,
        registeredComponents: r().registeredComponents,
        linkComponent: r().linkComponent,
        builderBlock: r().builderBlock,
        includeBlockProps: r().includeBlockProps,
        isInteractive: r().isInteractive
      }
    ) }) : /* @__PURE__ */ c(p, { children: n() ? /* @__PURE__ */ c(p, { children: (u = n()) == null ? void 0 : u.map((f, h) => /* @__PURE__ */ c(
      xt,
      {
        repeatContext: f.context,
        block: f.block,
        registeredComponents: e.registeredComponents,
        linkComponent: e.linkComponent
      },
      h
    )) }) : /* @__PURE__ */ V(
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
              componentRef: r().componentRef,
              componentOptions: r().componentOptions,
              blockChildren: r().blockChildren,
              context: r().context,
              registeredComponents: r().registeredComponents,
              linkComponent: r().linkComponent,
              builderBlock: r().builderBlock,
              includeBlockProps: r().includeBlockProps,
              isInteractive: r().isInteractive
            }
          ),
          (d = l()) == null ? void 0 : d.map((f) => /* @__PURE__ */ c(
            Q,
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
  return /* @__PURE__ */ V(p, { children: [
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
function le(e) {
  var i, o, a;
  const t = ce(te), n = ce(xe);
  return /* @__PURE__ */ c(
    vt,
    {
      blocks: e.blocks,
      parent: e.parent,
      path: e.path,
      styleProp: e.styleProp,
      BlocksWrapper: ((i = e.context) == null ? void 0 : i.BlocksWrapper) || t.BlocksWrapper,
      BlocksWrapperProps: ((o = e.context) == null ? void 0 : o.BlocksWrapperProps) || t.BlocksWrapperProps,
      children: e.blocks ? /* @__PURE__ */ c(p, { children: (a = e.blocks) == null ? void 0 : a.map((l) => /* @__PURE__ */ c(
        Q,
        {
          block: l,
          linkComponent: e.linkComponent,
          context: e.context || t,
          registeredComponents: e.registeredComponents || n.registeredComponents
        },
        l.id
      )) }) : null
    }
  );
}
function Ct(e) {
  var C;
  const [t, n] = E(
    () => typeof e.space == "number" ? e.space || 0 : 20
  );
  function i() {
    return e.columns || [];
  }
  const [o, a] = E(
    () => e.stackColumnsAt || "tablet"
  );
  function l(m) {
    var w;
    const k = i();
    return ((w = k[m]) == null ? void 0 : w.width) || 100 / k.length;
  }
  function r(m) {
    const k = i(), w = t * (k.length - 1) / k.length;
    return `calc(${l(m)}% - ${w}px)`;
  }
  function s({
    stackedStyle: m,
    desktopStyle: k
  }) {
    return o === "tablet" ? m : k;
  }
  function d({
    stackedStyle: m,
    desktopStyle: k
  }) {
    return o === "never" ? k : m;
  }
  const [u, f] = E(
    () => e.stackColumnsAt === "never" ? "row" : e.reverseColumnsWhenStacked ? "column-reverse" : "column"
  );
  function h() {
    return {
      "--flex-dir": u,
      "--flex-dir-tablet": s({
        stackedStyle: u,
        desktopStyle: "row"
      })
    };
  }
  function y(m) {
    const k = m === 0 ? 0 : t, w = r(m), B = `${k}px`, N = "100%", F = 0;
    return {
      ...{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
      },
      width: w,
      ["marginLeft"]: B,
      "--column-width-mobile": d({
        stackedStyle: N,
        desktopStyle: w
      }),
      "--column-margin-left-mobile": d({
        stackedStyle: F,
        desktopStyle: B
      }),
      "--column-width-tablet": s({
        stackedStyle: N,
        desktopStyle: w
      }),
      "--column-margin-left-tablet": s({
        stackedStyle: F,
        desktopStyle: B
      })
    };
  }
  function v(m) {
    var w, B;
    return Te(
      ((B = (w = e.builderContext.content) == null ? void 0 : w.meta) == null ? void 0 : B.breakpoints) || {}
    )[m].max;
  }
  function T() {
    return `
        @media (max-width: ${v("medium")}px) {
          .${e.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir-tablet);
            align-items: stretch;
          }

          .${e.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-tablet) !important;
            margin-left: var(--column-margin-left-tablet) !important;
          }
        }

        @media (max-width: ${v("small")}px) {
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
  return /* @__PURE__ */ V(p, { children: [
    /* @__PURE__ */ V(
      "div",
      {
        className: `builder-columns ${e.builderBlock.id}-breakpoints div-452958ba`,
        style: h(),
        children: [
          /* @__PURE__ */ c(Y, { id: "builderio-columns", styles: T() }),
          (C = e.columns) == null ? void 0 : C.map((m, k) => /* @__PURE__ */ c(
            Ae,
            {
              TagName: m.link ? e.builderLinkComponent || "a" : "div",
              actionAttributes: {},
              attributes: {
                ...m.link ? {
                  href: m.link
                } : {},
                [ae()]: "builder-column",
                style: we(y(k))
              },
              children: /* @__PURE__ */ c(
                le,
                {
                  path: `component.options.columns.${k}.blocks`,
                  parent: e.builderBlock.id,
                  styleProp: {
                    flexGrow: "1"
                  },
                  context: e.builderContext,
                  registeredComponents: e.builderComponents,
                  linkComponent: e.builderLinkComponent,
                  blocks: m.blocks
                }
              )
            },
            k
          ))
        ]
      }
    ),
    /* @__PURE__ */ c("style", { children: `.div-452958ba {
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
      Array.isArray(n) && n.find((o) => o.get("width")) && (n.find((a) => !a.get("width")) || n.reduce((r, s) => r + s.get("width"), 0) !== 100) && t();
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
        le,
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
}`, Pe = "builderIoAbTest", Be = "builderIoRenderContent", U = (e) => Object.values((e == null ? void 0 : e.variations) || {}).map((t) => ({
  ...t,
  testVariationId: t.id,
  id: e == null ? void 0 : e.id
})), Wt = ({
  canTrack: e,
  content: t
}) => !(!(U(t).length > 0) || !e || L()), Rt = (e) => e === "react" || e === "reactNative", We = Rt(j), Nt = () => `
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
function Z(e) {
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
  const n = t.getBoundingClientRect(), i = e.clientX - n.left, o = e.clientY - n.top, a = ge(i / n.width), l = ge(o / n.height);
  return {
    x: a,
    y: l
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
  var m, k, w, B, N, F, J;
  const t = $e(null);
  function n(g) {
    var I, S;
    const x = {
      ...e.builderContextSignal.rootState,
      ...g
    };
    e.builderContextSignal.rootSetState ? (S = (I = e.builderContextSignal).rootSetState) == null || S.call(I, x) : e.setBuilderContextSignal((b) => ({
      ...b,
      rootState: x
    }));
  }
  function i(g) {
    var I, S, b, A, D;
    const x = {
      ...e.builderContextSignal.content,
      ...g,
      data: {
        ...(I = e.builderContextSignal.content) == null ? void 0 : I.data,
        ...g == null ? void 0 : g.data
      },
      meta: {
        ...(S = e.builderContextSignal.content) == null ? void 0 : S.meta,
        ...g == null ? void 0 : g.meta,
        breakpoints: ((b = g == null ? void 0 : g.meta) == null ? void 0 : b.breakpoints) || ((D = (A = e.builderContextSignal.content) == null ? void 0 : A.meta) == null ? void 0 : D.breakpoints)
      }
    };
    e.setBuilderContextSignal((W) => ({
      ...W,
      content: x
    }));
  }
  const [o, a] = E(
    () => e.contentWrapper || "div"
  );
  function l(g) {
    return Fe({
      model: e.model,
      trustedHosts: e.trustedHosts,
      callbacks: {
        configureSdk: (x) => {
          var b;
          const { breakpoints: I, contentId: S } = x;
          !S || S !== ((b = e.builderContextSignal.content) == null ? void 0 : b.id) || I && i({
            meta: {
              breakpoints: I
            }
          });
        },
        animation: (x) => {
          Ce(x);
        },
        contentUpdate: (x) => {
          i(x);
        }
      }
    })(g);
  }
  function r() {
    var x, I;
    const g = (I = (x = e.builderContextSignal.content) == null ? void 0 : x.data) == null ? void 0 : I.jsCode;
    g && M({
      code: g,
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
  const [s, d] = E(() => ({})), [u, f] = E(() => ({})), [h, y] = E(() => !1);
  function v(g) {
    var x, I;
    if (e.builderContextSignal.content) {
      const S = (x = e.builderContextSignal.content) == null ? void 0 : x.testVariationId, b = (I = e.builderContextSignal.content) == null ? void 0 : I.id;
      se({
        type: "click",
        canTrack: z(e.canTrack),
        contentId: b,
        apiKey: e.apiKey,
        variationId: S !== b ? S : void 0,
        ...Ht(g),
        unique: !h
      });
    }
    h || y(!0);
  }
  function T() {
    var x, I, S;
    const g = (S = (I = (x = e.builderContextSignal.content) == null ? void 0 : x.data) == null ? void 0 : I.httpRequests) != null ? S : {};
    Object.entries(g).forEach(([b, A]) => {
      if (!A || u[b] || s[b] && !H())
        return;
      u[b] = !0;
      const D = A.replace(
        /{{([^}]+)}}/g,
        (W, Re) => String(
          M({
            code: Re,
            context: e.context || {},
            localState: void 0,
            rootState: e.builderContextSignal.rootState,
            rootSetState: e.builderContextSignal.rootSetState,
            enableCache: !0
          })
        )
      );
      Ke(D).then((W) => W.json()).then((W) => {
        n({
          [b]: W
        }), s[b] = !0;
      }).catch((W) => {
        console.error("error fetching dynamic data", A, W);
      }).finally(() => {
        u[b] = !1;
      });
    });
  }
  function C() {
    H() && window.dispatchEvent(
      new CustomEvent(
        "builder:component:stateChange",
        {
          detail: {
            state: ee(e.builderContextSignal.rootState),
            ref: {
              name: e.model
            }
          }
        }
      )
    );
  }
  return P(() => {
    var g, x;
    if (L()) {
      if (H() && (window.addEventListener("message", l), Oe({
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
      ).forEach((S) => {
        var A;
        const b = He(S);
        (A = window.parent) == null || A.postMessage(b, "*");
      }), window.addEventListener(
        "builder:component:stateChangeListenerActivated",
        C
      )), e.builderContextSignal.content && z(e.canTrack)) {
        const S = (g = e.builderContextSignal.content) == null ? void 0 : g.testVariationId, b = (x = e.builderContextSignal.content) == null ? void 0 : x.id, A = e.apiKey;
        se({
          type: "impression",
          canTrack: !0,
          contentId: b,
          apiKey: A,
          variationId: S !== b ? S : void 0
        });
      }
      if (Le()) {
        const S = new URL(location.href).searchParams, b = S.get("builder.preview"), A = S.get(
          `builder.preview.${b}`
        ), D = S.get("apiKey") || S.get("builder.space");
        b === e.model && D === e.apiKey && (!e.content || A === e.content.id) && ke({
          model: e.model,
          apiKey: e.apiKey,
          apiVersion: e.builderContextSignal.apiVersion
        }).then((W) => {
          W && i(W);
        });
      }
    }
  }, []), P(() => {
    e.apiKey || K.error(
      "No API key provided to `RenderContent` component. This can cause issues. Please provide an API key using the `apiKey` prop."
    ), r(), T(), C();
  }, []), P(() => {
    e.content && i(e.content);
  }, [e.content]), P(() => {
    r();
  }, [(k = (m = e.builderContextSignal.content) == null ? void 0 : m.data) == null ? void 0 : k.jsCode]), P(() => {
    T();
  }, [(B = (w = e.builderContextSignal.content) == null ? void 0 : w.data) == null ? void 0 : B.httpRequests]), P(() => {
    C();
  }, [e.builderContextSignal.rootState]), P(() => {
    e.data && n(e.data);
  }, [e.data]), P(() => {
    e.locale && n({
      locale: e.locale
    });
  }, [e.locale]), P(() => () => {
    L() && (window.removeEventListener("message", l), window.removeEventListener(
      "builder:component:stateChangeListenerActivated",
      C
    ));
  }, []), /* @__PURE__ */ c(te.Provider, { value: e.builderContextSignal, children: e.builderContextSignal.content ? /* @__PURE__ */ c(
    o,
    {
      ref: t,
      onClick: (g) => v(g),
      "builder-content-id": (N = e.builderContextSignal.content) == null ? void 0 : N.id,
      "builder-model": e.model,
      ...e.showContent ? {} : {
        hidden: !0,
        "aria-hidden": !0
      },
      ...e.contentWrapperProps,
      className: `variant-${((F = e.content) == null ? void 0 : F.testVariationId) || ((J = e.content) == null ? void 0 : J.id)}`,
      children: e.children
    }
  ) : null });
}
const Ft = (e) => {
  var a, l;
  const t = e.family + (e.kind && !e.kind.includes("#") ? ", " + e.kind : ""), n = t.split(",")[0], i = (l = e.fileUrl) != null ? l : (a = e == null ? void 0 : e.files) == null ? void 0 : a.regular;
  let o = "";
  if (i && t && n && (o += `
@font-face {
font-family: "${t}";
src: local("${n}"), url('${i}') format('woff2');
font-display: fallback;
font-weight: 400;
}
      `.trim()), e.files)
    for (const r in e.files) {
      if (!(String(Number(r)) === r))
        continue;
      const d = e.files[r];
      d && d !== i && (o += `
@font-face {
font-family: "${t}";
src: url('${d}') format('woff2');
font-display: fallback;
font-weight: ${r};
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
  return /* @__PURE__ */ c(Y, { id: "builderio-content", styles: t });
}
const zt = ({
  content: e,
  data: t,
  locale: n
}) => {
  var a, l, r;
  const i = {}, o = ((a = e == null ? void 0 : e.data) == null ? void 0 : a.state) || {};
  return (r = (l = e == null ? void 0 : e.data) == null ? void 0 : l.inputs) == null || r.forEach((s) => {
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
  var s, d, u, f, h, y, v;
  const [t, n] = E(
    () => {
      var T, C;
      return $t({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        variationId: (T = e.content) == null ? void 0 : T.testVariationId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        contentId: (C = e.content) == null ? void 0 : C.id
      });
    }
  );
  function i(T) {
    r((C) => ({
      ...C,
      rootState: T
    }));
  }
  const [o, a] = E(
    () => [
      ...he(),
      ...e.customComponents || []
    ].reduce(
      (T, { component: C, ...m }) => ({
        ...T,
        [m.name]: {
          component: C,
          ...de(m)
        }
      }),
      {}
    )
  ), [l, r] = E(() => ({
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
      (T, { component: C, ...m }) => ({
        ...T,
        [m.name]: de(m)
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
      children: /* @__PURE__ */ V(
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
          builderContextSignal: l,
          contentWrapper: e.contentWrapper,
          contentWrapperProps: e.contentWrapperProps,
          linkComponent: e.linkComponent,
          trustedHosts: e.trustedHosts,
          setBuilderContextSignal: r,
          children: [
            e.isSsrAbTest ? /* @__PURE__ */ c(
              Z,
              {
                id: "builderio-variant-visibility",
                scriptStr: t
              }
            ) : null,
            /* @__PURE__ */ c(
              _t,
              {
                isNestedRender: e.isNestedRender,
                contentId: (s = l.content) == null ? void 0 : s.id,
                cssCode: (u = (d = l.content) == null ? void 0 : d.data) == null ? void 0 : u.cssCode,
                customFonts: (h = (f = l.content) == null ? void 0 : f.data) == null ? void 0 : h.customFonts
              }
            ),
            /* @__PURE__ */ c(
              le,
              {
                blocks: (v = (y = l.content) == null ? void 0 : y.data) == null ? void 0 : v.blocks,
                context: l,
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
  var l;
  const [t, n] = E(
    () => Wt({
      canTrack: z(e.canTrack),
      content: e.content
    })
  );
  function i() {
    var r;
    return Vt(
      U(e.content).map((s) => ({
        id: s.testVariationId,
        testRatio: s.testRatio
      })),
      ((r = e.content) == null ? void 0 : r.id) || ""
    );
  }
  function o() {
    return U(e.content).map((r) => `.variant-${r.testVariationId} { display: none; } `).join("");
  }
  function a() {
    var r;
    return t ? {
      ...e.content,
      testVariationId: (r = e.content) == null ? void 0 : r.id
    } : Me({
      item: e.content,
      canTrack: z(e.canTrack)
    });
  }
  return P(() => {
  }, []), /* @__PURE__ */ V(p, { children: [
    !e.isNestedRender && j !== "reactNative" ? /* @__PURE__ */ c(
      Z,
      {
        id: "builderio-init-variants-fns",
        scriptStr: Nt()
      }
    ) : null,
    t ? /* @__PURE__ */ V(p, { children: [
      /* @__PURE__ */ c(
        Y,
        {
          id: "builderio-variants",
          styles: o()
        }
      ),
      /* @__PURE__ */ c(
        Z,
        {
          id: "builderio-variants-visibility",
          scriptStr: i()
        }
      ),
      (l = U(e.content)) == null ? void 0 : l.map((r) => /* @__PURE__ */ c(
        Se,
        {
          isNestedRender: e.isNestedRender,
          content: r,
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
        r.testVariationId
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
      K.error("Could not fetch symbol content: ", n);
    });
};
function Jt(e) {
  var a, l, r, s;
  function t() {
    var d, u;
    return [
      e.attributes[ae()],
      "builder-symbol",
      (d = e.symbol) != null && d.inline ? "builder-inline-symbol" : void 0,
      (u = e.symbol) != null && u.dynamic || e.dynamic ? "builder-dynamic-symbol" : void 0
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
  return P(() => {
  }, []), P(() => {
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
        ...(l = e.symbol) == null ? void 0 : l.data,
        ...e.builderContext.localState,
        ...(r = n == null ? void 0 : n.data) == null ? void 0 : r.state
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
  le as Blocks,
  Ct as Columns,
  Yt as Content,
  Jt as Symbol,
  At as Text
};
