"use client";
var W = Object.defineProperty;
var _ = (e, t, n) => t in e ? W(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var N = (e, t, n) => (_(e, typeof t != "symbol" ? t + "" : t, n), n);
import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { createContext, useState, useEffect, useContext, useRef } from "react";
import { isEditing, isBrowser, getUserAttributes, fastClone, checkIsDefined, logger, TARGET, setupBrowserForEditing, createRegisterComponentMessage, getDefaultCanTrack, _track, isPreviewing, fetchOneEntry, createEditorListener, fetch, serializeComponentInfo, handleABTestingSync } from "./server-entry-48572741.js";
const builderContext = createContext({
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
}), ComponentsContext = createContext({ registeredComponents: {} });
function getBlockComponentOptions(e) {
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
const getFunctionArguments = ({
  builder: e,
  context: t,
  event: n,
  state: o
}) => Object.entries({
  state: o,
  Builder: e,
  // legacy
  builder: e,
  context: t,
  event: n
}), getBuilderGlobals = () => ({
  isEditing: isEditing(),
  isBrowser: isBrowser(),
  isServer: !isBrowser(),
  getUserAttributes: () => getUserAttributes()
}), parseCode = (e, {
  isExpression: t = !0
}) => /* we disable this for cases where we definitely don't want a return */ t && !(e.includes(";") || e.includes(" return ") || e.trim().startsWith("return ")) ? `return (${e});` : e, runInBrowser = ({
  code: e,
  builder: t,
  context: n,
  event: o,
  localState: i,
  rootSetState: a,
  rootState: r
}) => {
  const s = getFunctionArguments({
    builder: t,
    context: n,
    event: o,
    state: flattenState({
      rootState: r,
      localState: i,
      rootSetState: a
    })
  });
  return new Function(...s.map(([l]) => l), e)(...s.map(([, l]) => l));
};
function flattenState({
  rootState: e,
  localState: t,
  rootSetState: n
}) {
  return new Proxy(e, {
    get: (o, i) => {
      if (t && i in t)
        return t[i];
      const a = o[i];
      return typeof a == "object" && a !== null ? flattenState({
        rootState: a,
        localState: void 0,
        rootSetState: n ? (r) => {
          o[i] = r, n(o);
        } : void 0
      }) : a;
    },
    set: (o, i, a) => {
      if (t && i in t)
        throw new Error("Writing to local state is not allowed as it is read-only.");
      return o[i] = a, n == null || n(o), !0;
    }
  });
}
const set = (e, t, n) => {
  if (Object(e) !== e)
    return e;
  const o = Array.isArray(t) ? t : t.toString().match(/[^.[\]]+/g);
  return o.slice(0, -1).reduce((i, a, r) => Object(i[a]) === i[a] ? i[a] : i[a] = Math.abs(Number(o[r + 1])) >> 0 === +o[r + 1] ? [] : {}, e)[o[o.length - 1]] = n, e;
}, noop = () => {
};
let safeDynamicRequire = noop;
try {
  safeDynamicRequire = eval("require");
} catch (e) {
}
const getSyncValName = (e) => `bldr_${e}_sync`, BUILDER_SET_STATE_NAME = "BUILDER_SET_STATE", INJECTED_IVM_GLOBAL = "BUILDER_IVM", REF_TO_PROXY_FN = `
var refToProxy = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  return new Proxy({}, {
    get(target, key) {
        if (key === 'copySync') {
          return () => obj.copySync();
        }
        const val = obj.getSync(key);
        if (typeof val?.getSync === 'function') {
            return refToProxy(val);
        }
        return val;
    },
    set(target, key, value) {
        const v = typeof value === 'object' ? new ${INJECTED_IVM_GLOBAL}.Reference(value) : value;
        obj.setSync(key, v);
        ${BUILDER_SET_STATE_NAME}(key, value)
    },
    deleteProperty(target, key) {
        obj.deleteSync(key);
    }
  })
}
`, processCode = ({
  code: e,
  args: t
}) => {
  const n = t.map(([o]) => `var ${o} = refToProxy(${getSyncValName(o)}); `).join("");
  return `
${REF_TO_PROXY_FN}
${n}
function theFunction() {
  ${e}
}

let output = theFunction()

if (typeof output === 'object' && output !== null) {
  output = JSON.stringify(output.copySync ? output.copySync() : output);
}

output;
`;
}, getIsolateContext = () => {
  const e = safeDynamicRequire("isolated-vm");
  return new e.Isolate({
    memoryLimit: 128
  }).createContextSync();
}, runInNode = ({
  code: e,
  builder: t,
  context: n,
  event: o,
  localState: i,
  rootSetState: a,
  rootState: r
}) => {
  const s = safeDynamicRequire("isolated-vm"), l = fastClone({
    ...r,
    ...i
  }), c = getFunctionArguments({
    builder: t,
    context: n,
    event: o,
    state: l
  }), m = getIsolateContext(), g = m.global;
  g.setSync("global", g.derefInto()), g.setSync("log", function(...u) {
    console.log(...u);
  }), g.setSync(BUILDER_SET_STATE_NAME, function(u, d) {
    set(r, u, d), a == null || a(r);
  }), c.forEach(([u, d]) => {
    const f = typeof d == "object" ? new s.Reference(
      // workaround: methods with default values for arguments is not being cloned over
      u === "builder" ? {
        ...d,
        getUserAttributes: () => d.getUserAttributes()
      } : d
    ) : null;
    g.setSync(getSyncValName(u), f);
  }), g.setSync(INJECTED_IVM_GLOBAL, s);
  const h = processCode({
    code: e,
    args: c
  }), S = m.evalSync(h);
  try {
    return JSON.parse(S);
  } catch {
    return S;
  }
};
function isNodeRuntime() {
  var e;
  return typeof process != "undefined" && checkIsDefined((e = process == null ? void 0 : process.versions) == null ? void 0 : e.node);
}
const shouldForceBrowserRuntimeInNode = () => {
  var o;
  if (!isNodeRuntime())
    return !1;
  const e = process.arch === "arm64", t = process.version.startsWith("v20"), n = (o = process.env.NODE_OPTIONS) == null ? void 0 : o.includes("--no-node-snapshot");
  return e && t && !n ? (logger.log("Skipping usage of `isolated-vm` to avoid crashes in Node v20 on an arm64 machine.\n    If you would like to use the `isolated-vm` package on this machine, please provide the `NODE_OPTIONS=--no-node-snapshot` config to your Node process.\n    See https://github.com/BuilderIO/builder/blob/main/packages/sdks/README.md#node-v20--m1-macs-apple-silicon-support for more information.\n    "), !0) : !1;
}, chooseBrowserOrServerEval = (e) => isBrowser() || shouldForceBrowserRuntimeInNode() ? runInBrowser(e) : runInNode(e), p = class p {
  static getCacheKey(t) {
    return JSON.stringify({
      ...t,
      // replace the event with a random number to break cache
      // thats because we can't serialize the event object due to circular refs in DOM node refs.
      event: t.event ? Math.random() : void 0
    });
  }
  static getCachedValue(t) {
    return p.cache.get(t);
  }
  static setCachedValue(t, n) {
    p.cache.size > 20 && p.cache.delete(p.cache.keys().next().value), p.cache.set(t, {
      value: n
    });
  }
};
N(p, "cacheLimit", 20), N(p, "cache", /* @__PURE__ */ new Map());
let EvalCache = p;
function evaluate({
  code: e,
  context: t,
  localState: n,
  rootState: o,
  rootSetState: i,
  event: a,
  isExpression: r = !0,
  enableCache: s
}) {
  if (e === "") {
    logger.warn("Skipping evaluation of empty code block.");
    return;
  }
  const l = {
    code: parseCode(e, {
      isExpression: r
    }),
    builder: getBuilderGlobals(),
    context: t,
    event: a,
    rootSetState: i,
    rootState: o,
    localState: n
  };
  if (s) {
    const c = EvalCache.getCacheKey(l), m = EvalCache.getCachedValue(c);
    if (m)
      return m.value;
  }
  try {
    const c = chooseBrowserOrServerEval(l);
    if (s) {
      const m = EvalCache.getCacheKey(l);
      EvalCache.setCachedValue(m, c);
    }
    return c;
  } catch (c) {
    logger.error("Failed code evaluation: " + c.message, {
      code: e
    });
    return;
  }
}
function transformBlock(e) {
  return e;
}
const evaluateBindings = ({
  block: e,
  context: t,
  localState: n,
  rootState: o,
  rootSetState: i
}) => {
  if (!e.bindings)
    return e;
  const a = fastClone(e), r = {
    ...a,
    properties: {
      ...a.properties
    },
    actions: {
      ...a.actions
    }
  };
  for (const s in e.bindings) {
    const l = e.bindings[s], c = evaluate({
      code: l,
      localState: n,
      rootState: o,
      rootSetState: i,
      context: t,
      enableCache: !0
    });
    set(r, s, c);
  }
  return r;
};
function getProcessedBlock({
  block: e,
  context: t,
  shouldEvaluateBindings: n,
  localState: o,
  rootState: i,
  rootSetState: a
}) {
  const r = e;
  return n ? evaluateBindings({
    block: r,
    localState: o,
    rootState: i,
    rootSetState: a,
    context: t
  }) : r;
}
function throttle(e, t, n = {}) {
  let o, i, a, r = null, s = 0;
  const l = function() {
    s = n.leading === !1 ? 0 : Date.now(), r = null, a = e.apply(o, i), r || (o = i = null);
  };
  return function() {
    const c = Date.now();
    !s && n.leading === !1 && (s = c);
    const m = t - (c - s);
    return o = this, i = arguments, m <= 0 || m > t ? (r && (clearTimeout(r), r = null), s = c, a = e.apply(o, i), r || (o = i = null)) : !r && n.trailing !== !1 && (r = setTimeout(l, m)), a;
  };
}
function assign(e, ...t) {
  const n = Object(e);
  for (let o = 1; o < arguments.length; o++) {
    const i = arguments[o];
    if (i != null)
      for (const a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (n[a] = i[a]);
  }
  return n;
}
const camelCaseToKebabCase = (e) => e ? e.replace(/([A-Z])/g, (t) => `-${t[0].toLowerCase()}`) : "";
function bindAnimations(e) {
  for (const t of e)
    switch (t.trigger) {
      case "pageLoad":
        triggerAnimation(t);
        break;
      case "hover":
        bindHoverAnimation(t);
        break;
      case "scrollInView":
        bindScrollInViewAnimation(t);
        break;
    }
}
function warnElementNotPresent(e) {
  console.warn(`Cannot animate element: element with ID ${e} not found!`);
}
function augmentAnimation(e, t) {
  const n = getAllStylesUsed(e), o = getComputedStyle(t), i = e.steps[0].styles, a = e.steps[e.steps.length - 1].styles, r = [i, a];
  for (const s of r)
    for (const l of n)
      l in s || (s[l] = o[l]);
}
function getAllStylesUsed(e) {
  const t = [];
  for (const n of e.steps)
    for (const o in n.styles)
      t.indexOf(o) === -1 && t.push(o);
  return t;
}
function triggerAnimation(e) {
  const t = Array.prototype.slice.call(document.getElementsByClassName(e.elementId || e.id || ""));
  if (!t.length) {
    warnElementNotPresent(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    augmentAnimation(e, n), n.style.transition = "none", n.style.transitionDelay = "0", assign(n.style, e.steps[0].styles), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${camelCaseToKebabCase(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s"), assign(n.style, e.steps[1].styles), setTimeout(() => {
        n.style.transition = "", n.style.transitionDelay = "";
      }, (e.delay || 0) * 1e3 + e.duration * 1e3 + 100);
    });
  });
}
function bindHoverAnimation(e) {
  const t = Array.prototype.slice.call(document.getElementsByClassName(e.elementId || e.id || ""));
  if (!t.length) {
    warnElementNotPresent(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    augmentAnimation(e, n);
    const o = e.steps[0].styles, i = e.steps[1].styles;
    function a() {
      assign(n.style, o);
    }
    function r() {
      assign(n.style, i);
    }
    a(), n.addEventListener("mouseenter", r), n.addEventListener("mouseleave", a), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${camelCaseToKebabCase(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s");
    });
  });
}
function bindScrollInViewAnimation(e) {
  const t = Array.prototype.slice.call(document.getElementsByClassName(e.elementId || e.id || ""));
  if (!t.length) {
    warnElementNotPresent(e.elementId || e.id || "");
    return;
  }
  Array.from(t).forEach((n) => {
    augmentAnimation(e, n);
    let o = !1, i = !1;
    function a() {
      !o && s(n) ? (o = !0, i = !0, setTimeout(() => {
        assign(n.style, e.steps[1].styles), e.repeat || document.removeEventListener("scroll", r), setTimeout(() => {
          i = !1, e.repeat || (n.style.transition = "", n.style.transitionDelay = "");
        }, (e.duration + (e.delay || 0)) * 1e3 + 100);
      })) : e.repeat && o && !i && !s(n) && (o = !1, assign(n.style, e.steps[0].styles));
    }
    const r = throttle(a, 200, {
      leading: !1
    });
    function s(m) {
      const g = m.getBoundingClientRect(), h = window.innerHeight, u = (e.thresholdPercent || 0) / 100 * h;
      return g.bottom > u && g.top < h - u;
    }
    const l = e.steps[0].styles;
    function c() {
      assign(n.style, l);
    }
    c(), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${camelCaseToKebabCase(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s");
    }), document.addEventListener("scroll", r, {
      capture: !0,
      passive: !0
    }), a();
  });
}
const camelToKebabCase = (e) => e.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase(), convertStyleMapToCSSArray = (e) => Object.entries(e).map(([n, o]) => {
  if (typeof o == "string")
    return `${camelToKebabCase(n)}: ${o};`;
}).filter(checkIsDefined), convertStyleMapToCSS = (e) => convertStyleMapToCSSArray(e).join(`
`), createCssClass = ({
  mediaQuery: e,
  className: t,
  styles: n
}) => {
  const o = `.${t} {
    ${convertStyleMapToCSS(n)}
  }`;
  return e ? `${e} {
      ${o}
    }` : o;
};
function transformStyleProperty({
  style: e
}) {
  return e;
}
const getStyle = ({
  block: e,
  context: t
}) => mapStyleObjToStrIfNeeded(transformStyleProperty({
  style: e.style || {},
  context: t,
  block: e
}));
function mapStyleObjToStrIfNeeded(e) {
  switch (TARGET) {
    case "svelte":
    case "vue":
    case "solid":
      return convertStyleMapToCSSArray(e).join(" ");
    case "qwik":
    case "reactNative":
    case "react":
    case "rsc":
      return e;
  }
}
const getComponent = ({
  block: e,
  context: t,
  registeredComponents: n
}) => {
  var a;
  const o = (a = getProcessedBlock({
    block: e,
    localState: t.localState,
    rootState: t.rootState,
    rootSetState: t.rootSetState,
    context: t.context,
    shouldEvaluateBindings: !1
  }).component) == null ? void 0 : a.name;
  if (!o)
    return null;
  const i = n[o];
  if (i)
    return i;
  console.warn(`
      Could not find a registered component named "${o}". 
      If you registered it, is the file that registered it imported by the file that needs to render it?`);
}, getRepeatItemData = ({
  block: e,
  context: t
}) => {
  const {
    repeat: n,
    ...o
  } = e;
  if (!(n != null && n.collection))
    return;
  const i = evaluate({
    code: n.collection,
    localState: t.localState,
    rootState: t.rootState,
    rootSetState: t.rootSetState,
    context: t.context,
    enableCache: !0
  });
  if (!Array.isArray(i))
    return;
  const a = n.collection.split(".").pop(), r = n.itemName || (a ? a + "Item" : "item");
  return i.map((l, c) => ({
    context: {
      ...t,
      localState: {
        ...t.localState,
        $index: c,
        $item: l,
        [r]: l,
        [`$${r}Index`]: c
      }
    },
    block: o
  }));
}, SIZES = {
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
}, getMaxWidthQueryForSize = (e, t = SIZES) => `@media (max-width: ${t[e].max}px)`, getSizesForBreakpoints = ({
  small: e,
  medium: t
}) => {
  const n = fastClone(SIZES);
  if (!e || !t)
    return n;
  const o = Math.floor(e / 2);
  n.small = {
    max: e,
    min: o,
    default: o + 1
  };
  const i = n.small.max + 1;
  n.medium = {
    max: t,
    min: i,
    default: i + 1
  };
  const a = n.medium.max + 1;
  return n.large = {
    max: 2e3,
    // TODO: decide upper limit
    min: a,
    default: a + 1
  }, n;
};
function InlinedStyles(e) {
  return /* @__PURE__ */ jsx(
    "style",
    {
      dangerouslySetInnerHTML: { __html: e.styles },
      "data-id": e.id
    }
  );
}
function BlockStyles(e) {
  function t() {
    const o = getProcessedBlock({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    });
    return checkIsDefined(o.hide) ? !o.hide : checkIsDefined(o.show) ? o.show : !0;
  }
  function n() {
    var u;
    const o = getProcessedBlock({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    }), i = o.responsiveStyles, a = e.context.content, r = getSizesForBreakpoints(
      ((u = a == null ? void 0 : a.meta) == null ? void 0 : u.breakpoints) || {}
    ), s = i == null ? void 0 : i.large, l = i == null ? void 0 : i.medium, c = i == null ? void 0 : i.small, m = o.id;
    if (!m)
      return "";
    const g = s ? createCssClass({
      className: m,
      styles: s
    }) : "", h = l ? createCssClass({
      className: m,
      styles: l,
      mediaQuery: getMaxWidthQueryForSize(
        "medium",
        r
      )
    }) : "", S = c ? createCssClass({
      className: m,
      styles: c,
      mediaQuery: getMaxWidthQueryForSize(
        "small",
        r
      )
    }) : "";
    return [g, h, S].join(" ");
  }
  return /* @__PURE__ */ jsx(Fragment, { children: n() && t() ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(InlinedStyles, { id: "builderio-block", styles: n() }) }) : null });
}
function capitalizeFirstLetter(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
const getEventHandlerName = (e) => `on${capitalizeFirstLetter(e)}`, createEventHandler = (e, t) => (n) => evaluate({
  code: e,
  context: t.context,
  localState: t.localState,
  rootState: t.rootState,
  rootSetState: t.rootSetState,
  event: n,
  isExpression: !1,
  enableCache: !0
});
function getBlockActions(e) {
  var o;
  const t = {}, n = (o = e.block.actions) != null ? o : {};
  for (const i in n) {
    if (!n.hasOwnProperty(i))
      continue;
    const a = n[i];
    let r = getEventHandlerName(i);
    if (e.stripPrefix)
      switch (TARGET) {
        case "vue":
          r = r.replace("v-on:", "");
          break;
        case "svelte":
          r = r.replace("on:", "");
          break;
      }
    t[r] = createEventHandler(a, e);
  }
  return t;
}
const getClassPropName = () => {
  switch (TARGET) {
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
function transformBlockProperties({
  properties: e
}) {
  return e;
}
const extractRelevantRootBlockProperties = (e) => ({
  href: e.href
});
function getBlockProperties({
  block: e,
  context: t
}) {
  var o;
  const n = {
    ...extractRelevantRootBlockProperties(e),
    ...e.properties,
    "builder-id": e.id,
    style: getStyle({
      block: e,
      context: t
    }),
    [getClassPropName()]: [e.id, "builder-block", e.class, (o = e.properties) == null ? void 0 : o.class].filter(Boolean).join(" ")
  };
  return transformBlockProperties({
    properties: n,
    context: t,
    block: e
  });
}
const EMPTY_HTML_ELEMENTS = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]), isEmptyElement = (e) => typeof e == "string" && EMPTY_HTML_ELEMENTS.has(e.toLowerCase());
function DynamicRenderer(e) {
  return /* @__PURE__ */ jsx(Fragment, { children: isEmptyElement(e.TagName) ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(e.TagName, { ...e.attributes, ...e.actionAttributes }) }) : /* @__PURE__ */ jsx(Fragment, { children: typeof e.TagName == "string" ? /* @__PURE__ */ jsx(e.TagName, { ...e.attributes, ...e.actionAttributes, children: e.children }) : /* @__PURE__ */ jsx(e.TagName, { ...e.attributes, ...e.actionAttributes, children: e.children }) }) });
}
function BlockWrapper(e) {
  return /* @__PURE__ */ jsx(
    DynamicRenderer,
    {
      TagName: e.Wrapper,
      attributes: getBlockProperties({
        block: e.block,
        context: e.context
      }),
      actionAttributes: getBlockActions({
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
function InteractiveElement(e) {
  return /* @__PURE__ */ jsx(
    e.Wrapper,
    {
      ...e.wrapperProps,
      attributes: e.includeBlockProps ? {
        ...getBlockProperties({
          block: e.block,
          context: e.context
        }),
        ...getBlockActions({
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
const getWrapperProps = ({
  componentOptions: e,
  builderBlock: t,
  context: n,
  componentRef: o,
  includeBlockProps: i,
  isInteractive: a,
  contextValue: r
}) => {
  const s = {
    ...e,
    /**
     * If `noWrap` is set to `true`, then the block's props/attributes are provided to the
     * component itself directly. Otherwise, they are provided to the wrapper element.
     */
    ...i ? {
      attributes: getBlockProperties({
        block: t,
        context: r
      })
    } : {}
  };
  return a ? {
    Wrapper: o,
    block: t,
    context: n,
    wrapperProps: e,
    includeBlockProps: i
  } : s;
};
function ComponentRef(e) {
  var o;
  const [t, n] = useState(
    () => e.isInteractive ? InteractiveElement : e.componentRef
  );
  return /* @__PURE__ */ jsx(Fragment, { children: e.componentRef ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    t,
    {
      ...getWrapperProps({
        componentOptions: e.componentOptions,
        builderBlock: e.builderBlock,
        context: e.context,
        componentRef: e.componentRef,
        linkComponent: e.linkComponent,
        includeBlockProps: e.includeBlockProps,
        isInteractive: e.isInteractive,
        contextValue: e.context
      }),
      children: (o = e.blockChildren) == null ? void 0 : o.map((i) => /* @__PURE__ */ jsx(
        Block,
        {
          block: i,
          context: e.context,
          registeredComponents: e.registeredComponents,
          linkComponent: e.linkComponent
        },
        i.id
      ))
    }
  ) }) : null });
}
function RepeatedBlock(e) {
  const [t, n] = useState(() => e.repeatContext);
  return /* @__PURE__ */ jsx(builderContext.Provider, { value: t, children: /* @__PURE__ */ jsx(
    Block,
    {
      block: e.block,
      context: t,
      registeredComponents: e.registeredComponents,
      linkComponent: e.linkComponent
    }
  ) });
}
function Block(e) {
  var l, c, m;
  function t() {
    return getComponent({
      block: e.block,
      context: e.context,
      registeredComponents: e.registeredComponents
    });
  }
  function n() {
    return getRepeatItemData({
      block: e.block,
      context: e.context
    });
  }
  function o() {
    var g;
    return (g = e.block.repeat) != null && g.collection ? e.block : getProcessedBlock({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    });
  }
  function i() {
    var h;
    return e.block.tagName === "a" || ((h = o().properties) == null ? void 0 : h.href) || o().href ? e.linkComponent || "a" : e.block.tagName || "div";
  }
  function a() {
    var S, u;
    if ((S = e.block.repeat) != null && S.collection)
      return !!((u = n == null ? void 0 : n()) != null && u.length);
    const g = "hide" in o() ? o().hide : !1;
    return ("show" in o() ? o().show : !0) && !g;
  }
  function r() {
    var h, S;
    return !((h = t == null ? void 0 : t()) != null && h.component) && !n() ? (S = o().children) != null ? S : [] : [];
  }
  function s() {
    var g, h, S, u, d, f, b, k, w, A, B;
    return {
      blockChildren: (g = o().children) != null ? g : [],
      componentRef: (h = t == null ? void 0 : t()) == null ? void 0 : h.component,
      componentOptions: {
        ...getBlockComponentOptions(o()),
        builderContext: e.context,
        ...((S = t == null ? void 0 : t()) == null ? void 0 : S.name) === "Core:Button" || ((u = t == null ? void 0 : t()) == null ? void 0 : u.name) === "Symbol" || ((d = t == null ? void 0 : t()) == null ? void 0 : d.name) === "Columns" || ((f = t == null ? void 0 : t()) == null ? void 0 : f.name) === "Form:Form" ? {
          builderLinkComponent: e.linkComponent
        } : {},
        ...((b = t == null ? void 0 : t()) == null ? void 0 : b.name) === "Symbol" || ((k = t == null ? void 0 : t()) == null ? void 0 : k.name) === "Columns" || ((w = t == null ? void 0 : t()) == null ? void 0 : w.name) === "Form:Form" ? {
          builderComponents: e.registeredComponents
        } : {}
      },
      context: e.context,
      linkComponent: e.linkComponent,
      registeredComponents: e.registeredComponents,
      builderBlock: o(),
      includeBlockProps: ((A = t == null ? void 0 : t()) == null ? void 0 : A.noWrap) === !0,
      isInteractive: !((B = t == null ? void 0 : t()) != null && B.isRSC)
    };
  }
  return useEffect(() => {
    const g = o().id, h = o().animations;
    h && g && bindAnimations(
      h.filter((S) => S.trigger !== "hover").map((S) => ({
        ...S,
        elementId: g
      }))
    );
  }, []), /* @__PURE__ */ jsx(Fragment, { children: a() ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(BlockStyles, { block: e.block, context: e.context }),
    (l = t == null ? void 0 : t()) != null && l.noWrap ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
      ComponentRef,
      {
        componentRef: s().componentRef,
        componentOptions: s().componentOptions,
        blockChildren: s().blockChildren,
        context: s().context,
        registeredComponents: s().registeredComponents,
        linkComponent: s().linkComponent,
        builderBlock: s().builderBlock,
        includeBlockProps: s().includeBlockProps,
        isInteractive: s().isInteractive
      }
    ) }) : /* @__PURE__ */ jsx(Fragment, { children: n() ? /* @__PURE__ */ jsx(Fragment, { children: (m = n()) == null ? void 0 : m.map((g, h) => /* @__PURE__ */ jsx(
      RepeatedBlock,
      {
        repeatContext: g.context,
        block: g.block,
        registeredComponents: e.registeredComponents,
        linkComponent: e.linkComponent
      },
      h
    )) }) : /* @__PURE__ */ jsxs(
      BlockWrapper,
      {
        Wrapper: i(),
        block: o(),
        context: e.context,
        linkComponent: e.linkComponent,
        children: [
          /* @__PURE__ */ jsx(
            ComponentRef,
            {
              componentRef: s().componentRef,
              componentOptions: s().componentOptions,
              blockChildren: s().blockChildren,
              context: s().context,
              registeredComponents: s().registeredComponents,
              linkComponent: s().linkComponent,
              builderBlock: s().builderBlock,
              includeBlockProps: s().includeBlockProps,
              isInteractive: s().isInteractive
            }
          ),
          (c = r()) == null ? void 0 : c.map((g) => /* @__PURE__ */ jsx(
            Block,
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
function BlocksWrapper(e) {
  function t() {
    var i;
    return "builder-blocks" + ((i = e.blocks) != null && i.length ? "" : " no-blocks");
  }
  function n() {
    var i, a;
    isEditing() && !((i = e.blocks) != null && i.length) && ((a = window.parent) == null || a.postMessage(
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
  function o() {
    var i, a;
    isEditing() && !((i = e.blocks) != null && i.length) && ((a = window.parent) == null || a.postMessage(
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      e.BlocksWrapper,
      {
        className: t() + " props-blocks-wrapper-7cd1560e",
        "builder-path": e.path,
        "builder-parent-id": e.parent,
        style: e.styleProp,
        onClick: (i) => n(),
        onMouseEnter: (i) => o(),
        onKeyPress: (i) => n(),
        ...e.BlocksWrapperProps,
        children: e.children
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `.props-blocks-wrapper-7cd1560e {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}` })
  ] });
}
function Blocks(e) {
  var o, i, a;
  const t = useContext(builderContext), n = useContext(ComponentsContext);
  return /* @__PURE__ */ jsx(
    BlocksWrapper,
    {
      blocks: e.blocks,
      parent: e.parent,
      path: e.path,
      styleProp: e.styleProp,
      BlocksWrapper: ((o = e.context) == null ? void 0 : o.BlocksWrapper) || t.BlocksWrapper,
      BlocksWrapperProps: ((i = e.context) == null ? void 0 : i.BlocksWrapperProps) || t.BlocksWrapperProps,
      children: e.blocks ? /* @__PURE__ */ jsx(Fragment, { children: (a = e.blocks) == null ? void 0 : a.map((r) => /* @__PURE__ */ jsx(
        Block,
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
function Columns(e) {
  var u;
  function t() {
    return typeof e.space == "number" ? e.space || 0 : 20;
  }
  function n() {
    return e.columns || [];
  }
  function o() {
    return e.stackColumnsAt || "tablet";
  }
  function i(d) {
    var b;
    const f = n();
    return ((b = f[d]) == null ? void 0 : b.width) || 100 / f.length;
  }
  function a(d) {
    const f = n(), b = t() * (f.length - 1) / f.length;
    return `calc(${i(d)}% - ${b}px)`;
  }
  function r({
    stackedStyle: d,
    desktopStyle: f
  }) {
    return o() === "tablet" ? d : f;
  }
  function s({
    stackedStyle: d,
    desktopStyle: f
  }) {
    return o() === "never" ? f : d;
  }
  const [l, c] = useState(
    () => e.stackColumnsAt === "never" ? "row" : e.reverseColumnsWhenStacked ? "column-reverse" : "column"
  );
  function m() {
    return {
      "--flex-dir": l,
      "--flex-dir-tablet": r({
        stackedStyle: l,
        desktopStyle: "row"
      })
    };
  }
  function g(d) {
    const f = d === 0 ? 0 : t(), b = a(d), k = `${f}px`, w = "100%", A = 0;
    return {
      ...{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
      },
      width: b,
      ["marginLeft"]: k,
      "--column-width-mobile": s({
        stackedStyle: w,
        desktopStyle: b
      }),
      "--column-margin-left-mobile": s({
        stackedStyle: A,
        desktopStyle: k
      }),
      "--column-width-tablet": r({
        stackedStyle: w,
        desktopStyle: b
      }),
      "--column-margin-left-tablet": r({
        stackedStyle: A,
        desktopStyle: k
      })
    };
  }
  function h(d) {
    var b, k;
    return getSizesForBreakpoints(
      ((k = (b = e.builderContext.content) == null ? void 0 : b.meta) == null ? void 0 : k.breakpoints) || {}
    )[d].max;
  }
  function S() {
    return `
        @media (max-width: ${h("medium")}px) {
          .${e.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir-tablet);
            align-items: stretch;
          }

          .${e.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-tablet) !important;
            margin-left: var(--column-margin-left-tablet) !important;
          }
        }

        @media (max-width: ${h("small")}px) {
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `builder-columns ${e.builderBlock.id}-breakpoints div-a6ce8b7c`,
        style: m(),
        children: [
          /* @__PURE__ */ jsx(InlinedStyles, { id: "builderio-columns", styles: S() }),
          (u = e.columns) == null ? void 0 : u.map((d, f) => /* @__PURE__ */ jsx(
            DynamicRenderer,
            {
              TagName: d.link ? e.builderLinkComponent || "a" : "div",
              actionAttributes: {},
              attributes: {
                ...d.link ? {
                  href: d.link
                } : {},
                [getClassPropName()]: "builder-column",
                style: mapStyleObjToStrIfNeeded(g(f))
              },
              children: /* @__PURE__ */ jsx(
                Blocks,
                {
                  path: `component.options.columns.${f}.blocks`,
                  parent: e.builderBlock.id,
                  styleProp: {
                    flexGrow: "1"
                  },
                  context: e.builderContext,
                  registeredComponents: e.builderComponents,
                  linkComponent: e.builderLinkComponent,
                  blocks: d.blocks
                }
              )
            },
            f
          ))
        ]
      }
    ),
    /* @__PURE__ */ jsx("style", { children: `.div-a6ce8b7c {
  display: flex;
  line-height: normal;
}` })
  ] });
}
const componentInfo$3 = {
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
        n.forEach((o) => {
          o.delete("width");
        });
      }
      const n = e.get("columns");
      Array.isArray(n) && n.find((i) => i.get("width")) && (n.find((a) => !a.get("width")) || n.reduce((s, l) => s + l.get("width"), 0) !== 100) && t();
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
}, componentInfo$2 = {
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
function Slot(e) {
  var t, n, o;
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        pointerEvents: "auto"
      },
      ...!((t = e.builderContext.context) != null && t.symbolId) && {
        "builder-slot": e.name
      },
      children: /* @__PURE__ */ jsx(
        Blocks,
        {
          parent: (n = e.builderContext.context) == null ? void 0 : n.symbolId,
          path: `symbol.data.${e.name}`,
          context: e.builderContext,
          blocks: (o = e.builderContext.rootState) == null ? void 0 : o[e.name]
        }
      )
    }
  );
}
const componentInfo$1 = {
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
}, componentInfo = {
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
function Text(e) {
  var t;
  return /* @__PURE__ */ jsx(
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
const getDefaultRegisteredComponents = () => [{
  component: Columns,
  ...componentInfo$3
}, {
  component: Slot,
  ...componentInfo$2
}, {
  component: Symbol$1,
  ...componentInfo$1
}, {
  component: Text,
  ...componentInfo
}];
function updateCookiesAndStyles(e, t, n) {
  var r;
  function o() {
    function s(u, d, f) {
      let b = "";
      if (f) {
        const k = /* @__PURE__ */ new Date();
        k.setTime(k.getTime() + f * 24 * 60 * 60 * 1e3), b = "; expires=" + k.toUTCString();
      }
      document.cookie = u + "=" + (d || "") + b + "; path=/; Secure; SameSite=None";
    }
    function l(u) {
      const d = u + "=", f = document.cookie.split(";");
      for (let b = 0; b < f.length; b++) {
        let k = f[b];
        for (; k.charAt(0) === " "; )
          k = k.substring(1, k.length);
        if (k.indexOf(d) === 0)
          return k.substring(d.length, k.length);
      }
      return null;
    }
    const c = `builder.tests.${e}`, m = l(c), g = t.map((u) => u.id).concat(e);
    if (m && g.includes(m))
      return m;
    let h = 0;
    const S = Math.random();
    for (let u = 0; u < t.length; u++) {
      const d = t[u], f = d.testRatio;
      if (h += f, S < h)
        return s(c, d.id), d.id;
    }
    return s(c, e), e;
  }
  const i = o(), a = (r = document.currentScript) == null ? void 0 : r.previousElementSibling;
  if (n) {
    a.remove();
    const s = document.currentScript;
    s == null || s.remove();
  } else {
    const s = t.concat({
      id: e
    }).filter((l) => l.id !== i).map((l) => `.variant-${l.id} {  display: none; }
        `).join("");
    a.innerHTML = s;
  }
}
function updateVariantVisibility(e, t, n) {
  var c;
  if (!navigator.cookieEnabled)
    return;
  function o(m) {
    const g = m + "=", h = document.cookie.split(";");
    for (let S = 0; S < h.length; S++) {
      let u = h[S];
      for (; u.charAt(0) === " "; )
        u = u.substring(1, u.length);
      if (u.indexOf(g) === 0)
        return u.substring(g.length, u.length);
    }
    return null;
  }
  const i = `builder.tests.${t}`, a = o(i), r = (c = document.currentScript) == null ? void 0 : c.parentElement, s = e === t, l = a === e;
  if (l && !s ? (r == null || r.removeAttribute("hidden"), r == null || r.removeAttribute("aria-hidden")) : !l && s && (r == null || r.setAttribute("hidden", "true"), r == null || r.setAttribute("aria-hidden", "true")), n) {
    l || r == null || r.remove();
    const m = document.currentScript;
    m == null || m.remove();
  }
}
const UPDATE_COOKIES_AND_STYLES_SCRIPT = updateCookiesAndStyles.toString().replace(/\s+/g, " "), UPDATE_VARIANT_VISIBILITY_SCRIPT = updateVariantVisibility.toString().replace(/\s+/g, " "), UPDATE_COOKIES_AND_STYLES_SCRIPT_NAME = "builderIoAbTest", UPDATE_VARIANT_VISIBILITY_SCRIPT_FN_NAME = "builderIoRenderContent", getVariants = (e) => Object.values((e == null ? void 0 : e.variations) || {}).map((t) => ({
  ...t,
  testVariationId: t.id,
  id: e == null ? void 0 : e.id
})), checkShouldRenderVariants = ({
  canTrack: e,
  content: t
}) => !(!(getVariants(t).length > 0) || !e || isBrowser()), getIsHydrationTarget = (e) => e === "react" || e === "reactNative", isHydrationTarget = getIsHydrationTarget(TARGET), getInitVariantsFnsScriptString = () => `
  window.${UPDATE_COOKIES_AND_STYLES_SCRIPT_NAME} = ${UPDATE_COOKIES_AND_STYLES_SCRIPT}
  window.${UPDATE_VARIANT_VISIBILITY_SCRIPT_FN_NAME} = ${UPDATE_VARIANT_VISIBILITY_SCRIPT}
  `, getUpdateCookieAndStylesScript = (e, t) => `
  window.${UPDATE_COOKIES_AND_STYLES_SCRIPT_NAME}(
    "${t}",${JSON.stringify(e)}, ${isHydrationTarget}
  )`, getUpdateVariantVisibilityScript = ({
  contentId: e,
  variationId: t
}) => `window.${UPDATE_VARIANT_VISIBILITY_SCRIPT_FN_NAME}(
    "${t}", "${e}", ${isHydrationTarget}
  )`;
function InlinedScript(e) {
  return /* @__PURE__ */ jsx(
    "script",
    {
      dangerouslySetInnerHTML: { __html: e.scriptStr },
      "data-id": e.id
    }
  );
}
function round(e) {
  return Math.round(e * 1e3) / 1e3;
}
const findParentElement = (e, t, n = !0) => {
  if (!(e instanceof HTMLElement))
    return null;
  let o = n ? e : e.parentElement;
  do {
    if (!o)
      return null;
    if (t(o))
      return o;
  } while (o = o.parentElement);
  return null;
}, findBuilderParent = (e) => findParentElement(e, (t) => {
  const n = t.getAttribute("builder-id") || t.id;
  return (n == null ? void 0 : n.indexOf("builder-")) === 0;
}), computeOffset = ({
  event: e,
  target: t
}) => {
  const n = t.getBoundingClientRect(), o = e.clientX - n.left, i = e.clientY - n.top, a = round(o / n.width), r = round(i / n.height);
  return {
    x: a,
    y: r
  };
}, getInteractionPropertiesForEvent = (e) => {
  const t = e.target, n = t && findBuilderParent(t), o = (n == null ? void 0 : n.getAttribute("builder-id")) || (n == null ? void 0 : n.id);
  return {
    targetBuilderElement: o || void 0,
    metadata: {
      targetOffset: t ? computeOffset({
        event: e,
        target: t
      }) : void 0,
      builderTargetOffset: n ? computeOffset({
        event: e,
        target: n
      }) : void 0,
      builderElementIndex: n && o ? [].slice.call(document.getElementsByClassName(o)).indexOf(n) : void 0
    }
  };
};
function EnableEditor(e) {
  var b, k, w, A, B, R, j;
  const t = useRef(null);
  function n(y) {
    var I, C;
    const v = {
      ...e.builderContextSignal.rootState,
      ...y
    };
    e.builderContextSignal.rootSetState ? (C = (I = e.builderContextSignal).rootSetState) == null || C.call(I, v) : e.setBuilderContextSignal((x) => ({
      ...x,
      rootState: v
    }));
  }
  function o(y) {
    var I, C, x, E, P;
    const v = {
      ...e.builderContextSignal.content,
      ...y,
      data: {
        ...(I = e.builderContextSignal.content) == null ? void 0 : I.data,
        ...y == null ? void 0 : y.data
      },
      meta: {
        ...(C = e.builderContextSignal.content) == null ? void 0 : C.meta,
        ...y == null ? void 0 : y.meta,
        breakpoints: ((x = y == null ? void 0 : y.meta) == null ? void 0 : x.breakpoints) || ((P = (E = e.builderContextSignal.content) == null ? void 0 : E.meta) == null ? void 0 : P.breakpoints)
      }
    };
    e.setBuilderContextSignal((T) => ({
      ...T,
      content: v
    }));
  }
  const [i, a] = useState(
    () => e.contentWrapper || "div"
  );
  function r(y) {
    return createEditorListener({
      model: e.model,
      trustedHosts: e.trustedHosts,
      callbacks: {
        configureSdk: (v) => {
          var x;
          const { breakpoints: I, contentId: C } = v;
          !C || C !== ((x = e.builderContextSignal.content) == null ? void 0 : x.id) || I && o({
            meta: {
              breakpoints: I
            }
          });
        },
        animation: (v) => {
          triggerAnimation(v);
        },
        contentUpdate: (v) => {
          o(v);
        }
      }
    })(y);
  }
  function s() {
    var v, I;
    const y = (I = (v = e.builderContextSignal.content) == null ? void 0 : v.data) == null ? void 0 : I.jsCode;
    y && evaluate({
      code: y,
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
  const [l, c] = useState(() => ({})), [m, g] = useState(() => ({})), [h, S] = useState(() => !1);
  function u(y) {
    var v, I;
    if (e.builderContextSignal.content) {
      const C = (v = e.builderContextSignal.content) == null ? void 0 : v.testVariationId, x = (I = e.builderContextSignal.content) == null ? void 0 : I.id;
      _track({
        type: "click",
        canTrack: getDefaultCanTrack(e.canTrack),
        contentId: x,
        apiKey: e.apiKey,
        variationId: C !== x ? C : void 0,
        ...getInteractionPropertiesForEvent(y),
        unique: !h
      });
    }
    h || S(!0);
  }
  function d() {
    var v, I, C;
    const y = (C = (I = (v = e.builderContextSignal.content) == null ? void 0 : v.data) == null ? void 0 : I.httpRequests) != null ? C : {};
    Object.entries(y).forEach(([x, E]) => {
      if (!E || m[x] || l[x] && !isEditing())
        return;
      m[x] = !0;
      const P = E.replace(
        /{{([^}]+)}}/g,
        (T, V) => String(
          evaluate({
            code: V,
            context: e.context || {},
            localState: void 0,
            rootState: e.builderContextSignal.rootState,
            rootSetState: e.builderContextSignal.rootSetState,
            enableCache: !0
          })
        )
      );
      fetch(P).then((T) => T.json()).then((T) => {
        n({
          [x]: T
        }), l[x] = !0;
      }).catch((T) => {
        console.error("error fetching dynamic data", E, T);
      }).finally(() => {
        m[x] = !1;
      });
    });
  }
  function f() {
    isEditing() && window.dispatchEvent(
      new CustomEvent(
        "builder:component:stateChange",
        {
          detail: {
            state: fastClone(e.builderContextSignal.rootState),
            ref: {
              name: e.model
            }
          }
        }
      )
    );
  }
  return useEffect(() => {
    var y, v;
    if (isBrowser()) {
      if (isEditing() && (window.addEventListener("message", r), setupBrowserForEditing({
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
      ).forEach((C) => {
        var E;
        const x = createRegisterComponentMessage(C);
        (E = window.parent) == null || E.postMessage(x, "*");
      }), window.addEventListener(
        "builder:component:stateChangeListenerActivated",
        f
      )), e.builderContextSignal.content && getDefaultCanTrack(e.canTrack)) {
        const C = (y = e.builderContextSignal.content) == null ? void 0 : y.testVariationId, x = (v = e.builderContextSignal.content) == null ? void 0 : v.id, E = e.apiKey;
        _track({
          type: "impression",
          canTrack: !0,
          contentId: x,
          apiKey: E,
          variationId: C !== x ? C : void 0
        });
      }
      if (isPreviewing()) {
        const C = new URL(location.href).searchParams, x = C.get("builder.preview"), E = C.get(
          `builder.preview.${x}`
        ), P = C.get("apiKey") || C.get("builder.space");
        x === e.model && P === e.apiKey && (!e.content || E === e.content.id) && fetchOneEntry({
          model: e.model,
          apiKey: e.apiKey,
          apiVersion: e.builderContextSignal.apiVersion
        }).then((T) => {
          T && o(T);
        });
      }
    }
  }, []), useEffect(() => {
    e.apiKey || logger.error(
      "No API key provided to `RenderContent` component. This can cause issues. Please provide an API key using the `apiKey` prop."
    ), s(), d(), f();
  }, []), useEffect(() => {
    e.content && o(e.content);
  }, [e.content]), useEffect(() => {
    s();
  }, [(k = (b = e.builderContextSignal.content) == null ? void 0 : b.data) == null ? void 0 : k.jsCode]), useEffect(() => {
    d();
  }, [(A = (w = e.builderContextSignal.content) == null ? void 0 : w.data) == null ? void 0 : A.httpRequests]), useEffect(() => {
    f();
  }, [e.builderContextSignal.rootState]), useEffect(() => {
    e.data && n(e.data);
  }, [e.data]), useEffect(() => {
    e.locale && n({
      locale: e.locale
    });
  }, [e.locale]), useEffect(() => () => {
    isBrowser() && (window.removeEventListener("message", r), window.removeEventListener(
      "builder:component:stateChangeListenerActivated",
      f
    ));
  }, []), /* @__PURE__ */ jsx(builderContext.Provider, { value: e.builderContextSignal, children: e.builderContextSignal.content ? /* @__PURE__ */ jsx(
    i,
    {
      ref: t,
      onClick: (y) => u(y),
      "builder-content-id": (B = e.builderContextSignal.content) == null ? void 0 : B.id,
      "builder-model": e.model,
      ...e.showContent ? {} : {
        hidden: !0,
        "aria-hidden": !0
      },
      ...e.contentWrapperProps,
      className: `variant-${((R = e.content) == null ? void 0 : R.testVariationId) || ((j = e.content) == null ? void 0 : j.id)}`,
      children: e.children
    }
  ) : null });
}
const getCssFromFont = (e) => {
  var a, r;
  const t = e.family + (e.kind && !e.kind.includes("#") ? ", " + e.kind : ""), n = t.split(",")[0], o = (r = e.fileUrl) != null ? r : (a = e == null ? void 0 : e.files) == null ? void 0 : a.regular;
  let i = "";
  if (o && t && n && (i += `
@font-face {
font-family: "${t}";
src: local("${n}"), url('${o}') format('woff2');
font-display: fallback;
font-weight: 400;
}
      `.trim()), e.files)
    for (const s in e.files) {
      if (!(String(Number(s)) === s))
        continue;
      const c = e.files[s];
      c && c !== o && (i += `
@font-face {
font-family: "${t}";
src: url('${c}') format('woff2');
font-display: fallback;
font-weight: ${s};
}
        `.trim());
    }
  return i;
}, getFontCss = ({
  customFonts: e
}) => {
  var t;
  return ((t = e == null ? void 0 : e.map((n) => getCssFromFont(n))) == null ? void 0 : t.join(" ")) || "";
}, getCss = ({
  cssCode: e,
  contentId: t
}) => e ? t ? (e == null ? void 0 : e.replace(/&/g, `div[builder-content-id="${t}"]`)) || "" : e : "", DEFAULT_STYLES = `
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
`, getDefaultStyles = (e) => e ? "" : DEFAULT_STYLES;
function ContentStyles(e) {
  const [t, n] = useState(
    () => `
${getCss({
      cssCode: e.cssCode,
      contentId: e.contentId
    })}
${getFontCss({
      customFonts: e.customFonts
    })}
${getDefaultStyles(e.isNestedRender)}
`.trim()
  );
  return /* @__PURE__ */ jsx(InlinedStyles, { id: "builderio-content", styles: t });
}
const getRootStateInitialValue = ({
  content: e,
  data: t,
  locale: n
}) => {
  var a, r, s;
  const o = {}, i = ((a = e == null ? void 0 : e.data) == null ? void 0 : a.state) || {};
  return (s = (r = e == null ? void 0 : e.data) == null ? void 0 : r.inputs) == null || s.forEach((l) => {
    l.name && l.defaultValue !== void 0 && (o[l.name] = l.defaultValue);
  }), {
    ...o,
    ...i,
    ...t,
    ...n ? {
      locale: n
    } : {}
  };
}, getContentInitialValue = ({
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
function ContentComponent(e) {
  var l, c, m, g, h, S, u;
  const [t, n] = useState(
    () => {
      var d, f;
      return getUpdateVariantVisibilityScript({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        variationId: (d = e.content) == null ? void 0 : d.testVariationId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        contentId: (f = e.content) == null ? void 0 : f.id
      });
    }
  );
  function o(d) {
    s((f) => ({
      ...f,
      rootState: d
    }));
  }
  const [i, a] = useState(
    () => [
      ...getDefaultRegisteredComponents(),
      ...e.customComponents || []
    ].reduce(
      (d, { component: f, ...b }) => ({
        ...d,
        [b.name]: {
          component: f,
          ...serializeComponentInfo(b)
        }
      }),
      {}
    )
  ), [r, s] = useState(() => ({
    content: getContentInitialValue({
      content: e.content,
      data: e.data
    }),
    localState: void 0,
    rootState: getRootStateInitialValue({
      content: e.content,
      data: e.data,
      locale: e.locale
    }),
    rootSetState: o,
    context: e.context || {},
    apiKey: e.apiKey,
    apiVersion: e.apiVersion,
    componentInfos: [
      ...getDefaultRegisteredComponents(),
      ...e.customComponents || []
    ].reduce(
      (d, { component: f, ...b }) => ({
        ...d,
        [b.name]: serializeComponentInfo(b)
      }),
      {}
    ),
    inheritedStyles: {},
    BlocksWrapper: e.blocksWrapper || "div",
    BlocksWrapperProps: e.blocksWrapperProps || {}
  }));
  return /* @__PURE__ */ jsx(
    ComponentsContext.Provider,
    {
      value: {
        registeredComponents: i
      },
      children: /* @__PURE__ */ jsxs(
        EnableEditor,
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
          setBuilderContextSignal: s,
          children: [
            e.isSsrAbTest ? /* @__PURE__ */ jsx(
              InlinedScript,
              {
                id: "builderio-variant-visibility",
                scriptStr: t
              }
            ) : null,
            /* @__PURE__ */ jsx(
              ContentStyles,
              {
                isNestedRender: e.isNestedRender,
                contentId: (l = r.content) == null ? void 0 : l.id,
                cssCode: (m = (c = r.content) == null ? void 0 : c.data) == null ? void 0 : m.cssCode,
                customFonts: (h = (g = r.content) == null ? void 0 : g.data) == null ? void 0 : h.customFonts
              }
            ),
            /* @__PURE__ */ jsx(
              Blocks,
              {
                blocks: (u = (S = r.content) == null ? void 0 : S.data) == null ? void 0 : u.blocks,
                context: r,
                registeredComponents: i,
                linkComponent: e.linkComponent
              }
            )
          ]
        }
      )
    }
  );
}
function ContentVariants(e) {
  var r;
  const [t, n] = useState(
    () => checkShouldRenderVariants({
      canTrack: getDefaultCanTrack(e.canTrack),
      content: e.content
    })
  );
  function o() {
    var s;
    return getUpdateCookieAndStylesScript(
      getVariants(e.content).map((l) => ({
        id: l.testVariationId,
        testRatio: l.testRatio
      })),
      ((s = e.content) == null ? void 0 : s.id) || ""
    );
  }
  function i() {
    return getVariants(e.content).map((s) => `.variant-${s.testVariationId} { display: none; } `).join("");
  }
  function a() {
    var s;
    return t ? {
      ...e.content,
      testVariationId: (s = e.content) == null ? void 0 : s.id
    } : handleABTestingSync({
      item: e.content,
      canTrack: getDefaultCanTrack(e.canTrack)
    });
  }
  return useEffect(() => {
  }, []), /* @__PURE__ */ jsxs(Fragment, { children: [
    !e.isNestedRender && TARGET !== "reactNative" ? /* @__PURE__ */ jsx(
      InlinedScript,
      {
        id: "builderio-init-variants-fns",
        scriptStr: getInitVariantsFnsScriptString()
      }
    ) : null,
    t ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        InlinedStyles,
        {
          id: "builderio-variants",
          styles: i()
        }
      ),
      /* @__PURE__ */ jsx(
        InlinedScript,
        {
          id: "builderio-variants-visibility",
          scriptStr: o()
        }
      ),
      (r = getVariants(e.content)) == null ? void 0 : r.map((s) => /* @__PURE__ */ jsx(
        ContentComponent,
        {
          isNestedRender: e.isNestedRender,
          content: s,
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
        s.testVariationId
      ))
    ] }) : null,
    /* @__PURE__ */ jsx(
      ContentComponent,
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
const fetchSymbolContent = async ({
  builderContextValue: e,
  symbol: t
}) => {
  if (t != null && t.model && // This is a hack, we should not need to check for this, but it is needed for Svelte.
  (e != null && e.apiKey))
    return fetchOneEntry({
      model: t.model,
      apiKey: e.apiKey,
      apiVersion: e.apiVersion,
      ...(t == null ? void 0 : t.entry) && {
        query: {
          id: t.entry
        }
      }
    }).catch((n) => {
      logger.error("Could not fetch symbol content: ", n);
    });
};
function Symbol$1(e) {
  var a, r, s, l;
  function t() {
    var c, m;
    return [
      e.attributes[getClassPropName()],
      "builder-symbol",
      (c = e.symbol) != null && c.inline ? "builder-inline-symbol" : void 0,
      (m = e.symbol) != null && m.dynamic || e.dynamic ? "builder-dynamic-symbol" : void 0
    ].filter(Boolean).join(" ");
  }
  const [n, o] = useState(() => {
    var c;
    return (c = e.symbol) == null ? void 0 : c.content;
  });
  function i() {
    n || fetchSymbolContent({
      symbol: e.symbol,
      builderContextValue: e.builderContext
    }).then((c) => {
      c && o(c);
    });
  }
  return useEffect(() => {
  }, []), useEffect(() => {
    i();
  }, [e.symbol]), /* @__PURE__ */ jsx("div", { ...e.attributes, className: t(), children: /* @__PURE__ */ jsx(
    ContentVariants,
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
        ...(s = n == null ? void 0 : n.data) == null ? void 0 : s.state
      },
      model: (l = e.symbol) == null ? void 0 : l.model,
      content: n,
      linkComponent: e.builderLinkComponent,
      blocksWrapper: "div",
      contentWrapper: "div"
    }
  ) });
}
export {
  Blocks,
  Columns,
  ContentVariants as Content,
  Symbol$1 as Symbol,
  Text
};
