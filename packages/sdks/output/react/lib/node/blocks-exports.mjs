"use client";
var W = Object.defineProperty;
var D = (e, t, n) => t in e ? W(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var N = (e, t, n) => (D(e, typeof t != "symbol" ? t + "" : t, n), n);
import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { createContext, useState, useEffect, useContext, useRef } from "react";
import { isEditing, isBrowser, getUserAttributes, fastClone, checkIsDefined, logger, TARGET, setupBrowserForEditing, createRegisterComponentMessage, getDefaultCanTrack, _track, isPreviewing, fetchOneEntry, createEditorListener, fetch, serializeComponentInfo, handleABTestingSync } from "./server-entry-c4ca3dd9.js";
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
  state: i
}) => Object.entries({
  state: i,
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
  event: i,
  localState: o,
  rootSetState: a,
  rootState: r
}) => {
  const s = getFunctionArguments({
    builder: t,
    context: n,
    event: i,
    state: flattenState({
      rootState: r,
      localState: o,
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
    get: (i, o) => {
      if (t && o in t)
        return t[o];
      const a = i[o];
      return typeof a == "object" && a !== null ? flattenState({
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
const set = (e, t, n) => {
  if (Object(e) !== e)
    return e;
  const i = Array.isArray(t) ? t : t.toString().match(/[^.[\]]+/g);
  return i.slice(0, -1).reduce((o, a, r) => Object(o[a]) === o[a] ? o[a] : o[a] = Math.abs(Number(i[r + 1])) >> 0 === +i[r + 1] ? [] : {}, e)[i[i.length - 1]] = n, e;
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
  const n = t.map(([i]) => `var ${i} = refToProxy(${getSyncValName(i)}); `).join("");
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
  event: i,
  localState: o,
  rootSetState: a,
  rootState: r
}) => {
  const s = safeDynamicRequire("isolated-vm"), l = fastClone({
    ...r,
    ...o
  }), c = getFunctionArguments({
    builder: t,
    context: n,
    event: i,
    state: l
  }), f = getIsolateContext(), u = f.global;
  u.setSync("global", u.derefInto()), u.setSync("log", function(...h) {
    console.log(...h);
  }), u.setSync(BUILDER_SET_STATE_NAME, function(h, d) {
    set(r, h, d), a == null || a(r);
  }), c.forEach(([h, d]) => {
    const m = typeof d == "object" ? new s.Reference(
      // workaround: methods with default values for arguments is not being cloned over
      h === "builder" ? {
        ...d,
        getUserAttributes: () => d.getUserAttributes()
      } : d
    ) : null;
    u.setSync(getSyncValName(h), m);
  }), u.setSync(INJECTED_IVM_GLOBAL, s);
  const g = processCode({
    code: e,
    args: c
  }), b = f.evalSync(g);
  try {
    return JSON.parse(b);
  } catch {
    return b;
  }
};
function isNodeRuntime() {
  var e;
  return typeof process != "undefined" && checkIsDefined((e = process == null ? void 0 : process.versions) == null ? void 0 : e.node);
}
const shouldForceBrowserRuntimeInNode = () => {
  var i;
  if (!isNodeRuntime())
    return !1;
  const e = process.arch === "arm64", t = process.version.startsWith("v20"), n = (i = process.env.NODE_OPTIONS) == null ? void 0 : i.includes("--no-node-snapshot");
  return e && t && !n ? (logger.log("Skipping usage of `isolated-vm` to avoid crashes in Node v20 on an arm64 machine.\n    If you would like to use the `isolated-vm` package on this machine, please provide the `NODE_OPTIONS=--no-node-snapshot` config to your Node process.\n    See https://github.com/BuilderIO/builder/blob/main/packages/sdks/README.md#node-v20--m1-macs-apple-silicon-support for more information.\n    "), !0) : !1;
}, chooseBrowserOrServerEval = (e) => isBrowser() || shouldForceBrowserRuntimeInNode() ? runInBrowser(e) : runInNode(e), T = class T {
  static getCacheKey(t) {
    return JSON.stringify({
      ...t,
      // replace the event with a random number to break cache
      // thats because we can't serialize the event object due to circular refs in DOM node refs.
      event: t.event ? Math.random() : void 0
    });
  }
  static getCachedValue(t) {
    return T.cache.get(t);
  }
  static setCachedValue(t, n) {
    T.cache.size > 20 && T.cache.delete(T.cache.keys().next().value), T.cache.set(t, {
      value: n
    });
  }
};
N(T, "cacheLimit", 20), N(T, "cache", /* @__PURE__ */ new Map());
let EvalCache = T;
function evaluate({
  code: e,
  context: t,
  localState: n,
  rootState: i,
  rootSetState: o,
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
    rootSetState: o,
    rootState: i,
    localState: n
  };
  if (s) {
    const c = EvalCache.getCacheKey(l), f = EvalCache.getCachedValue(c);
    if (f)
      return f.value;
  }
  try {
    const c = chooseBrowserOrServerEval(l);
    if (s) {
      const f = EvalCache.getCacheKey(l);
      EvalCache.setCachedValue(f, c);
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
  rootState: i,
  rootSetState: o
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
      rootState: i,
      rootSetState: o,
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
  localState: i,
  rootState: o,
  rootSetState: a
}) {
  const r = e;
  return n ? evaluateBindings({
    block: r,
    localState: i,
    rootState: o,
    rootSetState: a,
    context: t
  }) : r;
}
function throttle(e, t, n = {}) {
  let i, o, a, r = null, s = 0;
  const l = function() {
    s = n.leading === !1 ? 0 : Date.now(), r = null, a = e.apply(i, o), r || (i = o = null);
  };
  return function() {
    const c = Date.now();
    !s && n.leading === !1 && (s = c);
    const f = t - (c - s);
    return i = this, o = arguments, f <= 0 || f > t ? (r && (clearTimeout(r), r = null), s = c, a = e.apply(i, o), r || (i = o = null)) : !r && n.trailing !== !1 && (r = setTimeout(l, f)), a;
  };
}
function assign(e, ...t) {
  const n = Object(e);
  for (let i = 1; i < arguments.length; i++) {
    const o = arguments[i];
    if (o != null)
      for (const a in o)
        Object.prototype.hasOwnProperty.call(o, a) && (n[a] = o[a]);
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
  const n = getAllStylesUsed(e), i = getComputedStyle(t), o = e.steps[0].styles, a = e.steps[e.steps.length - 1].styles, r = [o, a];
  for (const s of r)
    for (const l of n)
      l in s || (s[l] = i[l]);
}
function getAllStylesUsed(e) {
  const t = [];
  for (const n of e.steps)
    for (const i in n.styles)
      t.indexOf(i) === -1 && t.push(i);
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
    const i = e.steps[0].styles, o = e.steps[1].styles;
    function a() {
      assign(n.style, i);
    }
    function r() {
      assign(n.style, o);
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
    let i = !1, o = !1;
    function a() {
      !i && s(n) ? (i = !0, o = !0, setTimeout(() => {
        assign(n.style, e.steps[1].styles), e.repeat || document.removeEventListener("scroll", r), setTimeout(() => {
          o = !1, e.repeat || (n.style.transition = "", n.style.transitionDelay = "");
        }, (e.duration + (e.delay || 0)) * 1e3 + 100);
      })) : e.repeat && i && !o && !s(n) && (i = !1, assign(n.style, e.steps[0].styles));
    }
    const r = throttle(a, 200, {
      leading: !1
    });
    function s(f) {
      const u = f.getBoundingClientRect(), g = window.innerHeight, h = (e.thresholdPercent || 0) / 100 * g;
      return u.bottom > h && u.top < g - h;
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
const camelToKebabCase = (e) => e.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase(), convertStyleMapToCSSArray = (e) => Object.entries(e).map(([n, i]) => {
  if (typeof i == "string")
    return `${camelToKebabCase(n)}: ${i};`;
}).filter(checkIsDefined), convertStyleMapToCSS = (e) => convertStyleMapToCSSArray(e).join(`
`), createCssClass = ({
  mediaQuery: e,
  className: t,
  styles: n
}) => {
  const i = `.${t} {
    ${convertStyleMapToCSS(n)}
  }`;
  return e ? `${e} {
      ${i}
    }` : i;
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
  const i = (a = getProcessedBlock({
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
}, getRepeatItemData = ({
  block: e,
  context: t
}) => {
  const {
    repeat: n,
    ...i
  } = e;
  if (!(n != null && n.collection))
    return;
  const o = evaluate({
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
  return o.map((l, c) => ({
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
    block: i
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
    const i = getProcessedBlock({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    });
    return checkIsDefined(i.hide) ? !i.hide : checkIsDefined(i.show) ? i.show : !0;
  }
  function n() {
    var h;
    const i = getProcessedBlock({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    }), o = i.responsiveStyles, a = e.context.content, r = getSizesForBreakpoints(
      ((h = a == null ? void 0 : a.meta) == null ? void 0 : h.breakpoints) || {}
    ), s = o == null ? void 0 : o.large, l = o == null ? void 0 : o.medium, c = o == null ? void 0 : o.small, f = i.id;
    if (!f)
      return "";
    const u = s ? createCssClass({
      className: f,
      styles: s
    }) : "", g = l ? createCssClass({
      className: f,
      styles: l,
      mediaQuery: getMaxWidthQueryForSize(
        "medium",
        r
      )
    }) : "", b = c ? createCssClass({
      className: f,
      styles: c,
      mediaQuery: getMaxWidthQueryForSize(
        "small",
        r
      )
    }) : "";
    return [u, g, b].join(" ");
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
  var i;
  const t = {}, n = (i = e.block.actions) != null ? i : {};
  for (const o in n) {
    if (!n.hasOwnProperty(o))
      continue;
    const a = n[o];
    let r = getEventHandlerName(o);
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
  var i;
  const n = {
    ...extractRelevantRootBlockProperties(e),
    ...e.properties,
    "builder-id": e.id,
    style: getStyle({
      block: e,
      context: t
    }),
    [getClassPropName()]: [e.id, "builder-block", e.class, (i = e.properties) == null ? void 0 : i.class].filter(Boolean).join(" ")
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
  componentRef: i,
  includeBlockProps: o,
  isInteractive: a,
  contextValue: r
}) => {
  const s = {
    ...e,
    /**
     * If `noWrap` is set to `true`, then the block's props/attributes are provided to the
     * component itself directly. Otherwise, they are provided to the wrapper element.
     */
    ...o ? {
      attributes: getBlockProperties({
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
  } : s;
};
function ComponentRef(e) {
  var i;
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
      children: (i = e.blockChildren) == null ? void 0 : i.map((o) => /* @__PURE__ */ jsx(
        Block,
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
  var l, c, f;
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
  function i() {
    var u;
    return (u = e.block.repeat) != null && u.collection ? e.block : getProcessedBlock({
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
    var b, h;
    if ((b = e.block.repeat) != null && b.collection)
      return !!((h = n == null ? void 0 : n()) != null && h.length);
    const u = "hide" in i() ? i().hide : !1;
    return ("show" in i() ? i().show : !0) && !u;
  }
  function r() {
    var g, b;
    return !((g = t == null ? void 0 : t()) != null && g.component) && !n() ? (b = i().children) != null ? b : [] : [];
  }
  function s() {
    var u, g, b, h, d, m, k, E, w, A, B;
    return {
      blockChildren: (u = i().children) != null ? u : [],
      componentRef: (g = t == null ? void 0 : t()) == null ? void 0 : g.component,
      componentOptions: {
        ...getBlockComponentOptions(i()),
        builderContext: e.context,
        ...((b = t == null ? void 0 : t()) == null ? void 0 : b.name) === "Core:Button" || ((h = t == null ? void 0 : t()) == null ? void 0 : h.name) === "Symbol" || ((d = t == null ? void 0 : t()) == null ? void 0 : d.name) === "Columns" || ((m = t == null ? void 0 : t()) == null ? void 0 : m.name) === "Form:Form" ? {
          builderLinkComponent: e.linkComponent
        } : {},
        ...((k = t == null ? void 0 : t()) == null ? void 0 : k.name) === "Symbol" || ((E = t == null ? void 0 : t()) == null ? void 0 : E.name) === "Columns" || ((w = t == null ? void 0 : t()) == null ? void 0 : w.name) === "Form:Form" ? {
          builderComponents: e.registeredComponents
        } : {}
      },
      context: e.context,
      linkComponent: e.linkComponent,
      registeredComponents: e.registeredComponents,
      builderBlock: i(),
      includeBlockProps: ((A = t == null ? void 0 : t()) == null ? void 0 : A.noWrap) === !0,
      isInteractive: !((B = t == null ? void 0 : t()) != null && B.isRSC)
    };
  }
  return useEffect(() => {
    const u = i().id, g = i().animations;
    g && u && bindAnimations(
      g.filter((b) => b.trigger !== "hover").map((b) => ({
        ...b,
        elementId: u
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
    ) }) : /* @__PURE__ */ jsx(Fragment, { children: n() ? /* @__PURE__ */ jsx(Fragment, { children: (f = n()) == null ? void 0 : f.map((u, g) => /* @__PURE__ */ jsx(
      RepeatedBlock,
      {
        repeatContext: u.context,
        block: u.block,
        registeredComponents: e.registeredComponents,
        linkComponent: e.linkComponent
      },
      g
    )) }) : /* @__PURE__ */ jsxs(
      BlockWrapper,
      {
        Wrapper: o(),
        block: i(),
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
          (c = r()) == null ? void 0 : c.map((u) => /* @__PURE__ */ jsx(
            Block,
            {
              block: u,
              registeredComponents: e.registeredComponents,
              linkComponent: e.linkComponent,
              context: e.context
            },
            u.id
          ))
        ]
      }
    ) })
  ] }) : null });
}
function BlocksWrapper(e) {
  function t() {
    var o;
    return "builder-blocks" + ((o = e.blocks) != null && o.length ? "" : " no-blocks");
  }
  function n() {
    var o, a;
    isEditing() && !((o = e.blocks) != null && o.length) && ((a = window.parent) == null || a.postMessage(
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
    isEditing() && !((o = e.blocks) != null && o.length) && ((a = window.parent) == null || a.postMessage(
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
        onClick: (o) => n(),
        onMouseEnter: (o) => i(),
        onKeyPress: (o) => n(),
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
  var i, o, a;
  const t = useContext(builderContext), n = useContext(ComponentsContext);
  return /* @__PURE__ */ jsx(
    BlocksWrapper,
    {
      blocks: e.blocks,
      parent: e.parent,
      path: e.path,
      styleProp: e.styleProp,
      BlocksWrapper: ((i = e.context) == null ? void 0 : i.BlocksWrapper) || t.BlocksWrapper,
      BlocksWrapperProps: ((o = e.context) == null ? void 0 : o.BlocksWrapperProps) || t.BlocksWrapperProps,
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
  function o(d) {
    var k;
    const m = n();
    return ((k = m[d]) == null ? void 0 : k.width) || 100 / m.length;
  }
  function a(d) {
    const m = n(), k = t() * (m.length - 1) / m.length;
    return `calc(${o(d)}% - ${k}px)`;
  }
  function r({
    stackedStyle: d,
    desktopStyle: m
  }) {
    return i() === "tablet" ? d : m;
  }
  function s({
    stackedStyle: d,
    desktopStyle: m
  }) {
    return i() === "never" ? m : d;
  }
  const [l, c] = useState(
    () => e.stackColumnsAt === "never" ? "row" : e.reverseColumnsWhenStacked ? "column-reverse" : "column"
  );
  function f() {
    return {
      "--flex-dir": l,
      "--flex-dir-tablet": r({
        stackedStyle: l,
        desktopStyle: "row"
      })
    };
  }
  function u(d) {
    const m = d === 0 ? 0 : t(), k = a(d), E = `${m}px`, w = "100%", A = 0;
    return {
      ...{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
      },
      width: k,
      ["marginLeft"]: E,
      "--column-width-mobile": s({
        stackedStyle: w,
        desktopStyle: k
      }),
      "--column-margin-left-mobile": s({
        stackedStyle: A,
        desktopStyle: E
      }),
      "--column-width-tablet": r({
        stackedStyle: w,
        desktopStyle: k
      }),
      "--column-margin-left-tablet": r({
        stackedStyle: A,
        desktopStyle: E
      })
    };
  }
  function g(d) {
    var k, E;
    return getSizesForBreakpoints(
      ((E = (k = e.builderContext.content) == null ? void 0 : k.meta) == null ? void 0 : E.breakpoints) || {}
    )[d].max;
  }
  function b() {
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `builder-columns ${e.builderBlock.id}-breakpoints div-a6ce8b7c`,
        style: f(),
        children: [
          /* @__PURE__ */ jsx(InlinedStyles, { id: "builderio-columns", styles: b() }),
          (h = e.columns) == null ? void 0 : h.map((d, m) => /* @__PURE__ */ jsx(
            DynamicRenderer,
            {
              TagName: d.link ? e.builderLinkComponent || "a" : "div",
              actionAttributes: {},
              attributes: {
                ...d.link ? {
                  href: d.link
                } : {},
                [getClassPropName()]: "builder-column",
                style: mapStyleObjToStrIfNeeded(u(m))
              },
              children: /* @__PURE__ */ jsx(
                Blocks,
                {
                  path: `component.options.columns.${m}.blocks`,
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
            m
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
        n.forEach((i) => {
          i.delete("width");
        });
      }
      const n = e.get("columns");
      Array.isArray(n) && n.find((o) => o.get("width")) && (n.find((a) => !a.get("width")) || n.reduce((s, l) => s + l.get("width"), 0) !== 100) && t();
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
  var t, n, i;
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
          blocks: (i = e.builderContext.rootState) == null ? void 0 : i[e.name]
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
}], UPDATE_COOKIES_AND_STYLES_SCRIPT = `function updateCookiesAndStyles(contentId, variants, isHydrationTarget) {
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
}`, UPDATE_VARIANT_VISIBILITY_SCRIPT = `function updateVariantVisibility(variantContentId, defaultContentId, isHydrationTarget) {
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
}`, UPDATE_COOKIES_AND_STYLES_SCRIPT_NAME = "builderIoAbTest", UPDATE_VARIANT_VISIBILITY_SCRIPT_FN_NAME = "builderIoRenderContent", getVariants = (e) => Object.values((e == null ? void 0 : e.variations) || {}).map((t) => ({
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
  let i = n ? e : e.parentElement;
  do {
    if (!i)
      return null;
    if (t(i))
      return i;
  } while (i = i.parentElement);
  return null;
}, findBuilderParent = (e) => findParentElement(e, (t) => {
  const n = t.getAttribute("builder-id") || t.id;
  return (n == null ? void 0 : n.indexOf("builder-")) === 0;
}), computeOffset = ({
  event: e,
  target: t
}) => {
  const n = t.getBoundingClientRect(), i = e.clientX - n.left, o = e.clientY - n.top, a = round(i / n.width), r = round(o / n.height);
  return {
    x: a,
    y: r
  };
}, getInteractionPropertiesForEvent = (e) => {
  const t = e.target, n = t && findBuilderParent(t), i = (n == null ? void 0 : n.getAttribute("builder-id")) || (n == null ? void 0 : n.id);
  return {
    targetBuilderElement: i || void 0,
    metadata: {
      targetOffset: t ? computeOffset({
        event: e,
        target: t
      }) : void 0,
      builderTargetOffset: n ? computeOffset({
        event: e,
        target: n
      }) : void 0,
      builderElementIndex: n && i ? [].slice.call(document.getElementsByClassName(i)).indexOf(n) : void 0
    }
  };
};
function EnableEditor(e) {
  var k, E, w, A, B, P, j;
  const t = useRef(null);
  function n(S) {
    var v, x;
    const C = {
      ...e.builderContextSignal.rootState,
      ...S
    };
    e.builderContextSignal.rootSetState ? (x = (v = e.builderContextSignal).rootSetState) == null || x.call(v, C) : e.setBuilderContextSignal((y) => ({
      ...y,
      rootState: C
    }));
  }
  function i(S) {
    var v, x, y, I, R;
    const C = {
      ...e.builderContextSignal.content,
      ...S,
      data: {
        ...(v = e.builderContextSignal.content) == null ? void 0 : v.data,
        ...S == null ? void 0 : S.data
      },
      meta: {
        ...(x = e.builderContextSignal.content) == null ? void 0 : x.meta,
        ...S == null ? void 0 : S.meta,
        breakpoints: ((y = S == null ? void 0 : S.meta) == null ? void 0 : y.breakpoints) || ((R = (I = e.builderContextSignal.content) == null ? void 0 : I.meta) == null ? void 0 : R.breakpoints)
      }
    };
    e.setBuilderContextSignal((p) => ({
      ...p,
      content: C
    }));
  }
  const [o, a] = useState(
    () => e.contentWrapper || "div"
  );
  function r(S) {
    return createEditorListener({
      model: e.model,
      trustedHosts: e.trustedHosts,
      callbacks: {
        configureSdk: (C) => {
          var y;
          const { breakpoints: v, contentId: x } = C;
          !x || x !== ((y = e.builderContextSignal.content) == null ? void 0 : y.id) || v && i({
            meta: {
              breakpoints: v
            }
          });
        },
        animation: (C) => {
          triggerAnimation(C);
        },
        contentUpdate: (C) => {
          i(C);
        }
      }
    })(S);
  }
  function s() {
    var C, v;
    const S = (v = (C = e.builderContextSignal.content) == null ? void 0 : C.data) == null ? void 0 : v.jsCode;
    S && evaluate({
      code: S,
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
  const [l, c] = useState(() => ({})), [f, u] = useState(() => ({})), [g, b] = useState(() => !1);
  function h(S) {
    var C, v;
    if (e.builderContextSignal.content) {
      const x = (C = e.builderContextSignal.content) == null ? void 0 : C.testVariationId, y = (v = e.builderContextSignal.content) == null ? void 0 : v.id;
      _track({
        type: "click",
        canTrack: getDefaultCanTrack(e.canTrack),
        contentId: y,
        apiKey: e.apiKey,
        variationId: x !== y ? x : void 0,
        ...getInteractionPropertiesForEvent(S),
        unique: !g
      });
    }
    g || b(!0);
  }
  function d() {
    var C, v, x;
    const S = (x = (v = (C = e.builderContextSignal.content) == null ? void 0 : C.data) == null ? void 0 : v.httpRequests) != null ? x : {};
    Object.entries(S).forEach(([y, I]) => {
      if (!I || f[y] || l[y] && !isEditing())
        return;
      f[y] = !0;
      const R = I.replace(
        /{{([^}]+)}}/g,
        (p, V) => String(
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
      fetch(R).then((p) => p.json()).then((p) => {
        n({
          [y]: p
        }), l[y] = !0;
      }).catch((p) => {
        console.error("error fetching dynamic data", I, p);
      }).finally(() => {
        f[y] = !1;
      });
    });
  }
  function m() {
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
    var S, C;
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
      ).forEach((x) => {
        var I;
        const y = createRegisterComponentMessage(x);
        (I = window.parent) == null || I.postMessage(y, "*");
      }), window.addEventListener(
        "builder:component:stateChangeListenerActivated",
        m
      )), e.builderContextSignal.content && getDefaultCanTrack(e.canTrack)) {
        const x = (S = e.builderContextSignal.content) == null ? void 0 : S.testVariationId, y = (C = e.builderContextSignal.content) == null ? void 0 : C.id, I = e.apiKey;
        _track({
          type: "impression",
          canTrack: !0,
          contentId: y,
          apiKey: I,
          variationId: x !== y ? x : void 0
        });
      }
      if (isPreviewing()) {
        const x = new URL(location.href).searchParams, y = x.get("builder.preview"), I = x.get(
          `builder.preview.${y}`
        ), R = x.get("apiKey") || x.get("builder.space");
        y === e.model && R === e.apiKey && (!e.content || I === e.content.id) && fetchOneEntry({
          model: e.model,
          apiKey: e.apiKey,
          apiVersion: e.builderContextSignal.apiVersion
        }).then((p) => {
          p && i(p);
        });
      }
    }
  }, []), useEffect(() => {
    e.apiKey || logger.error(
      "No API key provided to `RenderContent` component. This can cause issues. Please provide an API key using the `apiKey` prop."
    ), s(), d(), m();
  }, []), useEffect(() => {
    e.content && i(e.content);
  }, [e.content]), useEffect(() => {
    s();
  }, [(E = (k = e.builderContextSignal.content) == null ? void 0 : k.data) == null ? void 0 : E.jsCode]), useEffect(() => {
    d();
  }, [(A = (w = e.builderContextSignal.content) == null ? void 0 : w.data) == null ? void 0 : A.httpRequests]), useEffect(() => {
    m();
  }, [e.builderContextSignal.rootState]), useEffect(() => {
    e.data && n(e.data);
  }, [e.data]), useEffect(() => {
    e.locale && n({
      locale: e.locale
    });
  }, [e.locale]), useEffect(() => () => {
    isBrowser() && (window.removeEventListener("message", r), window.removeEventListener(
      "builder:component:stateChangeListenerActivated",
      m
    ));
  }, []), /* @__PURE__ */ jsx(builderContext.Provider, { value: e.builderContextSignal, children: e.builderContextSignal.content ? /* @__PURE__ */ jsx(
    o,
    {
      ref: t,
      onClick: (S) => h(S),
      "builder-content-id": (B = e.builderContextSignal.content) == null ? void 0 : B.id,
      "builder-model": e.model,
      ...e.showContent ? {} : {
        hidden: !0,
        "aria-hidden": !0
      },
      ...e.contentWrapperProps,
      className: `variant-${((P = e.content) == null ? void 0 : P.testVariationId) || ((j = e.content) == null ? void 0 : j.id)}`,
      children: e.children
    }
  ) : null });
}
const getCssFromFont = (e) => {
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
    for (const s in e.files) {
      if (!(String(Number(s)) === s))
        continue;
      const c = e.files[s];
      c && c !== i && (o += `
@font-face {
font-family: "${t}";
src: url('${c}') format('woff2');
font-display: fallback;
font-weight: ${s};
}
        `.trim());
    }
  return o;
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
  const i = {}, o = ((a = e == null ? void 0 : e.data) == null ? void 0 : a.state) || {};
  return (s = (r = e == null ? void 0 : e.data) == null ? void 0 : r.inputs) == null || s.forEach((l) => {
    l.name && l.defaultValue !== void 0 && (i[l.name] = l.defaultValue);
  }), {
    ...i,
    ...o,
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
  var l, c, f, u, g, b, h;
  const [t, n] = useState(
    () => {
      var d, m;
      return getUpdateVariantVisibilityScript({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        variationId: (d = e.content) == null ? void 0 : d.testVariationId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        contentId: (m = e.content) == null ? void 0 : m.id
      });
    }
  );
  function i(d) {
    s((m) => ({
      ...m,
      rootState: d
    }));
  }
  const [o, a] = useState(
    () => [
      ...getDefaultRegisteredComponents(),
      ...e.customComponents || []
    ].reduce(
      (d, { component: m, ...k }) => ({
        ...d,
        [k.name]: {
          component: m,
          ...serializeComponentInfo(k)
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
    rootSetState: i,
    context: e.context || {},
    apiKey: e.apiKey,
    apiVersion: e.apiVersion,
    componentInfos: [
      ...getDefaultRegisteredComponents(),
      ...e.customComponents || []
    ].reduce(
      (d, { component: m, ...k }) => ({
        ...d,
        [k.name]: serializeComponentInfo(k)
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
        registeredComponents: o
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
                cssCode: (f = (c = r.content) == null ? void 0 : c.data) == null ? void 0 : f.cssCode,
                customFonts: (g = (u = r.content) == null ? void 0 : u.data) == null ? void 0 : g.customFonts
              }
            ),
            /* @__PURE__ */ jsx(
              Blocks,
              {
                blocks: (h = (b = r.content) == null ? void 0 : b.data) == null ? void 0 : h.blocks,
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
function ContentVariants(e) {
  var r;
  const [t, n] = useState(
    () => checkShouldRenderVariants({
      canTrack: getDefaultCanTrack(e.canTrack),
      content: e.content
    })
  );
  function i() {
    var s;
    return getUpdateCookieAndStylesScript(
      getVariants(e.content).map((l) => ({
        id: l.testVariationId,
        testRatio: l.testRatio
      })),
      ((s = e.content) == null ? void 0 : s.id) || ""
    );
  }
  function o() {
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
          styles: o()
        }
      ),
      /* @__PURE__ */ jsx(
        InlinedScript,
        {
          id: "builderio-variants-visibility",
          scriptStr: i()
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
    var c, f;
    return [
      e.attributes[getClassPropName()],
      "builder-symbol",
      (c = e.symbol) != null && c.inline ? "builder-inline-symbol" : void 0,
      (f = e.symbol) != null && f.dynamic || e.dynamic ? "builder-dynamic-symbol" : void 0
    ].filter(Boolean).join(" ");
  }
  const [n, i] = useState(() => {
    var c;
    return (c = e.symbol) == null ? void 0 : c.content;
  });
  function o() {
    n || fetchSymbolContent({
      symbol: e.symbol,
      builderContextValue: e.builderContext
    }).then((c) => {
      c && i(c);
    });
  }
  return useEffect(() => {
  }, []), useEffect(() => {
    o();
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
