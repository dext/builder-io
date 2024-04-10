"use client";
var N = Object.defineProperty;
var $ = (e, t, n) => t in e ? N(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var V = (e, t, n) => ($(e, typeof t != "symbol" ? t + "" : t, n), n);
import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { createContext, useState, useEffect, useContext, useRef, createElement } from "react";
import { isEditing, isBrowser, getUserAttributes, fastClone, checkIsDefined, logger, TARGET, setupBrowserForEditing, createRegisterComponentMessage, getDefaultCanTrack, _track, isPreviewing, fetchOneEntry, createEditorListener, fetch as fetch$1, serializeComponentInfo, handleABTestingSync } from "./server-entry-c4ca3dd9.js";
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
  rootSetState: r,
  rootState: a
}) => {
  const s = getFunctionArguments({
    builder: t,
    context: n,
    event: i,
    state: flattenState({
      rootState: a,
      localState: o,
      rootSetState: r
    })
  });
  return new Function(...s.map(([c]) => c), e)(...s.map(([, c]) => c));
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
      const r = i[o];
      return typeof r == "object" && r !== null ? flattenState({
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
const set = (e, t, n) => {
  if (Object(e) !== e)
    return e;
  const i = Array.isArray(t) ? t : t.toString().match(/[^.[\]]+/g);
  return i.slice(0, -1).reduce((o, r, a) => Object(o[r]) === o[r] ? o[r] : o[r] = Math.abs(Number(i[a + 1])) >> 0 === +i[a + 1] ? [] : {}, e)[i[i.length - 1]] = n, e;
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
  rootSetState: r,
  rootState: a
}) => {
  const s = safeDynamicRequire("isolated-vm"), c = fastClone({
    ...a,
    ...o
  }), l = getFunctionArguments({
    builder: t,
    context: n,
    event: i,
    state: c
  }), d = getIsolateContext(), m = d.global;
  m.setSync("global", m.derefInto()), m.setSync("log", function(...y) {
    console.log(...y);
  }), m.setSync(BUILDER_SET_STATE_NAME, function(y, S) {
    set(a, y, S), r == null || r(a);
  }), l.forEach(([y, S]) => {
    const C = typeof S == "object" ? new s.Reference(
      // workaround: methods with default values for arguments is not being cloned over
      y === "builder" ? {
        ...S,
        getUserAttributes: () => S.getUserAttributes()
      } : S
    ) : null;
    m.setSync(getSyncValName(y), C);
  }), m.setSync(INJECTED_IVM_GLOBAL, s);
  const g = processCode({
    code: e,
    args: l
  }), h = d.evalSync(g);
  try {
    return JSON.parse(h);
  } catch {
    return h;
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
}, chooseBrowserOrServerEval = (e) => isBrowser() || shouldForceBrowserRuntimeInNode() ? runInBrowser(e) : runInNode(e), P = class P {
  static getCacheKey(t) {
    return JSON.stringify({
      ...t,
      // replace the event with a random number to break cache
      // thats because we can't serialize the event object due to circular refs in DOM node refs.
      event: t.event ? Math.random() : void 0
    });
  }
  static getCachedValue(t) {
    return P.cache.get(t);
  }
  static setCachedValue(t, n) {
    P.cache.size > 20 && P.cache.delete(P.cache.keys().next().value), P.cache.set(t, {
      value: n
    });
  }
};
V(P, "cacheLimit", 20), V(P, "cache", /* @__PURE__ */ new Map());
let EvalCache = P;
function evaluate({
  code: e,
  context: t,
  localState: n,
  rootState: i,
  rootSetState: o,
  event: r,
  isExpression: a = !0,
  enableCache: s
}) {
  if (e === "") {
    logger.warn("Skipping evaluation of empty code block.");
    return;
  }
  const c = {
    code: parseCode(e, {
      isExpression: a
    }),
    builder: getBuilderGlobals(),
    context: t,
    event: r,
    rootSetState: o,
    rootState: i,
    localState: n
  };
  if (s) {
    const l = EvalCache.getCacheKey(c), d = EvalCache.getCachedValue(l);
    if (d)
      return d.value;
  }
  try {
    const l = chooseBrowserOrServerEval(c);
    if (s) {
      const d = EvalCache.getCacheKey(c);
      EvalCache.setCachedValue(d, l);
    }
    return l;
  } catch (l) {
    logger.error("Failed code evaluation: " + l.message, {
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
  const r = fastClone(e), a = {
    ...r,
    properties: {
      ...r.properties
    },
    actions: {
      ...r.actions
    }
  };
  for (const s in e.bindings) {
    const c = e.bindings[s], l = evaluate({
      code: c,
      localState: n,
      rootState: i,
      rootSetState: o,
      context: t,
      enableCache: !0
    });
    set(a, s, l);
  }
  return a;
};
function getProcessedBlock({
  block: e,
  context: t,
  shouldEvaluateBindings: n,
  localState: i,
  rootState: o,
  rootSetState: r
}) {
  const a = e;
  return n ? evaluateBindings({
    block: a,
    localState: i,
    rootState: o,
    rootSetState: r,
    context: t
  }) : a;
}
function throttle(e, t, n = {}) {
  let i, o, r, a = null, s = 0;
  const c = function() {
    s = n.leading === !1 ? 0 : Date.now(), a = null, r = e.apply(i, o), a || (i = o = null);
  };
  return function() {
    const l = Date.now();
    !s && n.leading === !1 && (s = l);
    const d = t - (l - s);
    return i = this, o = arguments, d <= 0 || d > t ? (a && (clearTimeout(a), a = null), s = l, r = e.apply(i, o), a || (i = o = null)) : !a && n.trailing !== !1 && (a = setTimeout(c, d)), r;
  };
}
function assign(e, ...t) {
  const n = Object(e);
  for (let i = 1; i < arguments.length; i++) {
    const o = arguments[i];
    if (o != null)
      for (const r in o)
        Object.prototype.hasOwnProperty.call(o, r) && (n[r] = o[r]);
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
  const n = getAllStylesUsed(e), i = getComputedStyle(t), o = e.steps[0].styles, r = e.steps[e.steps.length - 1].styles, a = [o, r];
  for (const s of a)
    for (const c of n)
      c in s || (s[c] = i[c]);
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
    function r() {
      assign(n.style, i);
    }
    function a() {
      assign(n.style, o);
    }
    r(), n.addEventListener("mouseenter", a), n.addEventListener("mouseleave", r), setTimeout(() => {
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
    function r() {
      !i && s(n) ? (i = !0, o = !0, setTimeout(() => {
        assign(n.style, e.steps[1].styles), e.repeat || document.removeEventListener("scroll", a), setTimeout(() => {
          o = !1, e.repeat || (n.style.transition = "", n.style.transitionDelay = "");
        }, (e.duration + (e.delay || 0)) * 1e3 + 100);
      })) : e.repeat && i && !o && !s(n) && (i = !1, assign(n.style, e.steps[0].styles));
    }
    const a = throttle(r, 200, {
      leading: !1
    });
    function s(d) {
      const m = d.getBoundingClientRect(), g = window.innerHeight, y = (e.thresholdPercent || 0) / 100 * g;
      return m.bottom > y && m.top < g - y;
    }
    const c = e.steps[0].styles;
    function l() {
      assign(n.style, c);
    }
    l(), setTimeout(() => {
      n.style.transition = `all ${e.duration}s ${camelCaseToKebabCase(e.easing)}`, e.delay && (n.style.transitionDelay = e.delay + "s");
    }), document.addEventListener("scroll", a, {
      capture: !0,
      passive: !0
    }), r();
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
  var r;
  const i = (r = getProcessedBlock({
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
  const r = n.collection.split(".").pop(), a = n.itemName || (r ? r + "Item" : "item");
  return o.map((c, l) => ({
    context: {
      ...t,
      localState: {
        ...t.localState,
        $index: l,
        $item: c,
        [a]: c,
        [`$${a}Index`]: l
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
  const r = n.medium.max + 1;
  return n.large = {
    max: 2e3,
    // TODO: decide upper limit
    min: r,
    default: r + 1
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
    var y;
    const i = getProcessedBlock({
      block: e.block,
      localState: e.context.localState,
      rootState: e.context.rootState,
      rootSetState: e.context.rootSetState,
      context: e.context.context,
      shouldEvaluateBindings: !0
    }), o = i.responsiveStyles, r = e.context.content, a = getSizesForBreakpoints(
      ((y = r == null ? void 0 : r.meta) == null ? void 0 : y.breakpoints) || {}
    ), s = o == null ? void 0 : o.large, c = o == null ? void 0 : o.medium, l = o == null ? void 0 : o.small, d = i.id;
    if (!d)
      return "";
    const m = s ? createCssClass({
      className: d,
      styles: s
    }) : "", g = c ? createCssClass({
      className: d,
      styles: c,
      mediaQuery: getMaxWidthQueryForSize(
        "medium",
        a
      )
    }) : "", h = l ? createCssClass({
      className: d,
      styles: l,
      mediaQuery: getMaxWidthQueryForSize(
        "small",
        a
      )
    }) : "";
    return [m, g, h].join(" ");
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
    const r = n[o];
    let a = getEventHandlerName(o);
    if (e.stripPrefix)
      switch (TARGET) {
        case "vue":
          a = a.replace("v-on:", "");
          break;
        case "svelte":
          a = a.replace("on:", "");
          break;
      }
    t[a] = createEventHandler(r, e);
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
  isInteractive: r,
  contextValue: a
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
  var c, l, d;
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
    var m;
    return (m = e.block.repeat) != null && m.collection ? e.block : getProcessedBlock({
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
    var h, y;
    if ((h = e.block.repeat) != null && h.collection)
      return !!((y = n == null ? void 0 : n()) != null && y.length);
    const m = "hide" in i() ? i().hide : !1;
    return ("show" in i() ? i().show : !0) && !m;
  }
  function a() {
    var g, h;
    return !((g = t == null ? void 0 : t()) != null && g.component) && !n() ? (h = i().children) != null ? h : [] : [];
  }
  function s() {
    var m, g, h, y, S, C, p, v, I, T, E;
    return {
      blockChildren: (m = i().children) != null ? m : [],
      componentRef: (g = t == null ? void 0 : t()) == null ? void 0 : g.component,
      componentOptions: {
        ...getBlockComponentOptions(i()),
        builderContext: e.context,
        ...((h = t == null ? void 0 : t()) == null ? void 0 : h.name) === "Core:Button" || ((y = t == null ? void 0 : t()) == null ? void 0 : y.name) === "Symbol" || ((S = t == null ? void 0 : t()) == null ? void 0 : S.name) === "Columns" || ((C = t == null ? void 0 : t()) == null ? void 0 : C.name) === "Form:Form" ? {
          builderLinkComponent: e.linkComponent
        } : {},
        ...((p = t == null ? void 0 : t()) == null ? void 0 : p.name) === "Symbol" || ((v = t == null ? void 0 : t()) == null ? void 0 : v.name) === "Columns" || ((I = t == null ? void 0 : t()) == null ? void 0 : I.name) === "Form:Form" ? {
          builderComponents: e.registeredComponents
        } : {}
      },
      context: e.context,
      linkComponent: e.linkComponent,
      registeredComponents: e.registeredComponents,
      builderBlock: i(),
      includeBlockProps: ((T = t == null ? void 0 : t()) == null ? void 0 : T.noWrap) === !0,
      isInteractive: !((E = t == null ? void 0 : t()) != null && E.isRSC)
    };
  }
  return useEffect(() => {
    const m = i().id, g = i().animations;
    g && m && bindAnimations(
      g.filter((h) => h.trigger !== "hover").map((h) => ({
        ...h,
        elementId: m
      }))
    );
  }, []), /* @__PURE__ */ jsx(Fragment, { children: r() ? /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(BlockStyles, { block: e.block, context: e.context }),
    (c = t == null ? void 0 : t()) != null && c.noWrap ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
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
    ) }) : /* @__PURE__ */ jsx(Fragment, { children: n() ? /* @__PURE__ */ jsx(Fragment, { children: (d = n()) == null ? void 0 : d.map((m, g) => /* @__PURE__ */ jsx(
      RepeatedBlock,
      {
        repeatContext: m.context,
        block: m.block,
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
          (l = a()) == null ? void 0 : l.map((m) => /* @__PURE__ */ jsx(
            Block,
            {
              block: m,
              registeredComponents: e.registeredComponents,
              linkComponent: e.linkComponent,
              context: e.context
            },
            m.id
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
    var o, r;
    isEditing() && !((o = e.blocks) != null && o.length) && ((r = window.parent) == null || r.postMessage(
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
    isEditing() && !((o = e.blocks) != null && o.length) && ((r = window.parent) == null || r.postMessage(
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
  var i, o, r;
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
      children: e.blocks ? /* @__PURE__ */ jsx(Fragment, { children: (r = e.blocks) == null ? void 0 : r.map((a) => /* @__PURE__ */ jsx(
        Block,
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
function Columns(e) {
  var C;
  const [t, n] = useState(
    () => typeof e.space == "number" ? e.space || 0 : 20
  );
  function i() {
    return e.columns || [];
  }
  const [o, r] = useState(
    () => e.stackColumnsAt || "tablet"
  );
  function a(p) {
    var I;
    const v = i();
    return ((I = v[p]) == null ? void 0 : I.width) || 100 / v.length;
  }
  function s(p) {
    const v = i(), I = t * (v.length - 1) / v.length;
    return `calc(${a(p)}% - ${I}px)`;
  }
  function c({
    stackedStyle: p,
    desktopStyle: v
  }) {
    return o === "tablet" ? p : v;
  }
  function l({
    stackedStyle: p,
    desktopStyle: v
  }) {
    return o === "never" ? v : p;
  }
  const [d, m] = useState(
    () => e.stackColumnsAt === "never" ? "row" : e.reverseColumnsWhenStacked ? "column-reverse" : "column"
  );
  function g() {
    return {
      "--flex-dir": d,
      "--flex-dir-tablet": c({
        stackedStyle: d,
        desktopStyle: "row"
      })
    };
  }
  function h(p) {
    const v = p === 0 ? 0 : t, I = s(p), T = `${v}px`, E = "100%", j = 0;
    return {
      ...{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch"
      },
      width: I,
      ["marginLeft"]: T,
      "--column-width-mobile": l({
        stackedStyle: E,
        desktopStyle: I
      }),
      "--column-margin-left-mobile": l({
        stackedStyle: j,
        desktopStyle: T
      }),
      "--column-width-tablet": c({
        stackedStyle: E,
        desktopStyle: I
      }),
      "--column-margin-left-tablet": c({
        stackedStyle: j,
        desktopStyle: T
      })
    };
  }
  function y(p) {
    var I, T;
    return getSizesForBreakpoints(
      ((T = (I = e.builderContext.content) == null ? void 0 : I.meta) == null ? void 0 : T.breakpoints) || {}
    )[p].max;
  }
  function S() {
    return `
        @media (max-width: ${y("medium")}px) {
          .${e.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir-tablet);
            align-items: stretch;
          }

          .${e.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-tablet) !important;
            margin-left: var(--column-margin-left-tablet) !important;
          }
        }

        @media (max-width: ${y("small")}px) {
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
        className: `builder-columns ${e.builderBlock.id}-breakpoints div-452958ba`,
        style: g(),
        children: [
          /* @__PURE__ */ jsx(InlinedStyles, { id: "builderio-columns", styles: S() }),
          (C = e.columns) == null ? void 0 : C.map((p, v) => /* @__PURE__ */ jsx(
            DynamicRenderer,
            {
              TagName: p.link ? e.builderLinkComponent || "a" : "div",
              actionAttributes: {},
              attributes: {
                ...p.link ? {
                  href: p.link
                } : {},
                [getClassPropName()]: "builder-column",
                style: mapStyleObjToStrIfNeeded(h(v))
              },
              children: /* @__PURE__ */ jsx(
                Blocks,
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
    /* @__PURE__ */ jsx("style", { children: `.div-452958ba {
  display: flex;
  line-height: normal;
}` })
  ] });
}
const componentInfo$f = {
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
function Button(e) {
  return /* @__PURE__ */ jsx(
    DynamicRenderer,
    {
      attributes: {
        ...e.attributes,
        [getClassPropName()]: `${e.link ? "" : "builder-button"} ${e.attributes[getClassPropName()] || ""}`,
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
const componentInfo$e = {
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
      Array.isArray(n) && n.find((o) => o.get("width")) && (n.find((r) => !r.get("width")) || n.reduce((s, c) => s + c.get("width"), 0) !== 100) && t();
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
}, componentInfo$d = {
  name: "Fragment",
  static: !0,
  hidden: !0,
  canHaveChildren: !0,
  noWrap: !0
};
function FragmentComponent(e) {
  return /* @__PURE__ */ jsx("span", { children: e.children });
}
const componentInfo$c = {
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
      function n(a, s = 6e4) {
        return new Promise((c, l) => {
          const d = document.createElement("img");
          let m = !1;
          d.onload = () => {
            m = !0, c(d);
          }, d.addEventListener("error", (g) => {
            console.warn("Image load failed", g.error), l(g.error);
          }), d.src = a, setTimeout(() => {
            m || l(new Error("Image load timed out"));
          }, s);
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
          const s = e.get("aspectRatio");
          e.get("image") === o && (!s || s === 0.7041) && a.width && a.height && (e.set("aspectRatio", i(a.height / a.width)), e.set("height", a.height), e.set("width", a.width));
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
function removeProtocol(e) {
  return e.replace(/http(s)?:/, "");
}
function updateQueryParam(e = "", t, n) {
  const i = new RegExp("([?&])" + t + "=.*?(&|$)", "i"), o = e.indexOf("?") !== -1 ? "&" : "?";
  return e.match(i) ? e.replace(i, "$1" + t + "=" + encodeURIComponent(n) + "$2") : e + o + t + "=" + encodeURIComponent(n);
}
function getShopifyImageUrl(e, t) {
  if (!e || !(e != null && e.match(/cdn\.shopify\.com/)) || !t)
    return e;
  if (t === "master")
    return removeProtocol(e);
  const n = e.match(/(_\d+x(\d+)?)?(\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?)/i);
  if (n) {
    const i = e.split(n[0]), o = n[3], r = t.match("x") ? t : `${t}x`;
    return removeProtocol(`${i[0]}_${r}${o}`);
  }
  return null;
}
function getSrcSet(e) {
  if (!e)
    return e;
  const t = [100, 200, 400, 800, 1200, 1600, 2e3];
  if (e.match(/builder\.io/)) {
    let n = e;
    const i = Number(e.split("?width=")[1]);
    return isNaN(i) || (n = `${n} ${i}w`), t.filter((o) => o !== i).map((o) => `${updateQueryParam(e, "width", o)} ${o}w`).concat([n]).join(", ");
  }
  return e.match(/cdn\.shopify\.com/) ? t.map((n) => [getShopifyImageUrl(e, `${n}x${n}`), n]).filter(([n]) => !!n).map(([n, i]) => `${n} ${i}w`).concat([e]).join(", ") : e;
}
function Image(e) {
  var o, r, a, s;
  function t() {
    var d;
    const l = e.image || e.src;
    if (!l || // We can auto add srcset for cdn.builder.io and shopify
    // images, otherwise you can supply this prop manually
    !(l.match(/builder\.io/) || l.match(/cdn\.shopify\.com/)))
      return e.srcset;
    if (e.srcset && ((d = e.image) != null && d.includes("builder.io/api/v1/image"))) {
      if (!e.srcset.includes(e.image.split("?")[0]))
        return console.debug("Removed given srcset"), getSrcSet(l);
    } else if (e.image && !e.srcset)
      return getSrcSet(l);
    return getSrcSet(l);
  }
  function n() {
    var c;
    return (c = t == null ? void 0 : t()) != null && c.match(/builder\.io/) && !e.noWebp ? t().replace(/\?/g, "?format=webp&") : "";
  }
  function i() {
    const c = {
      position: "absolute",
      height: "100%",
      width: "100%",
      left: "0px",
      top: "0px"
    };
    return e.aspectRatio ? c : void 0;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("picture", { children: [
        n() ? /* @__PURE__ */ jsx("source", { type: "image/webp", srcSet: n() }) : null,
        /* @__PURE__ */ jsx(
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
      e.aspectRatio && !((r = (o = e.builderBlock) == null ? void 0 : o.children) != null && r.length && e.fitContent) ? /* @__PURE__ */ jsx(
        "div",
        {
          className: "builder-image-sizer div-a0c95e8c",
          style: {
            paddingTop: e.aspectRatio * 100 + "%"
          }
        }
      ) : null,
      (s = (a = e.builderBlock) == null ? void 0 : a.children) != null && s.length && e.fitContent ? /* @__PURE__ */ jsx(Fragment, { children: e.children }) : null,
      !e.fitContent && e.children ? /* @__PURE__ */ jsx("div", { className: "div-a0c95e8c-2", children: e.children }) : null
    ] }),
    /* @__PURE__ */ jsx("style", { children: `.img-a0c95e8c {
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
const componentInfo$b = {
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
function SectionComponent(e) {
  return /* @__PURE__ */ jsx(
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
const componentInfo$a = {
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
const componentInfo$9 = {
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
}, componentInfo$8 = {
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
const componentInfo$7 = {
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
function CustomCode(e) {
  const t = useRef(null), [n, i] = useState(() => []), [o, r] = useState(() => []);
  return useEffect(() => {
    var s;
    if (!((s = t.current) != null && s.getElementsByTagName) || typeof window == "undefined")
      return;
    const a = t.current.getElementsByTagName("script");
    for (let c = 0; c < a.length; c++) {
      const l = a[c];
      if (l.src) {
        if (n.includes(l.src))
          continue;
        n.push(l.src);
        const d = document.createElement("script");
        d.async = !0, d.src = l.src, document.head.appendChild(d);
      } else if (!l.type || [
        "text/javascript",
        "application/javascript",
        "application/ecmascript"
      ].includes(l.type)) {
        if (o.includes(l.innerText))
          continue;
        try {
          o.push(l.innerText), new Function(l.innerText)();
        } catch (d) {
          console.warn("`CustomCode`: Error running script:", d);
        }
      }
    }
  }, []), /* @__PURE__ */ jsx(
    "div",
    {
      ref: t,
      className: "builder-custom-code" + (e.replaceNodes ? " replace-nodes" : ""),
      dangerouslySetInnerHTML: { __html: e.code }
    }
  );
}
const componentInfo$6 = {
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
}, SCRIPT_MIME_TYPES = ["text/javascript", "application/javascript", "application/ecmascript"], isJsScript = (e) => SCRIPT_MIME_TYPES.includes(e.type);
function Embed(e) {
  const t = useRef(null), [n, i] = useState(() => []), [o, r] = useState(() => []), [a, s] = useState(() => !1);
  function c() {
    if (!t.current || !t.current.getElementsByTagName)
      return;
    const l = t.current.getElementsByTagName("script");
    for (let d = 0; d < l.length; d++) {
      const m = l[d];
      if (m.src && !n.includes(m.src)) {
        n.push(m.src);
        const g = document.createElement("script");
        g.async = !0, g.src = m.src, document.head.appendChild(g);
      } else if (isJsScript(m) && !o.includes(m.innerText))
        try {
          o.push(m.innerText), new Function(m.innerText)();
        } catch (g) {
          console.warn("`Embed`: Error running script:", g);
        }
    }
  }
  return useEffect(() => {
    t.current && !a && (s(!0), c());
  }, [t.current, a]), /* @__PURE__ */ jsx(
    "div",
    {
      className: "builder-embed",
      ref: t,
      dangerouslySetInnerHTML: { __html: e.content }
    }
  );
}
const componentInfo$5 = {
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
}, validEnvList = ["production", "qa", "test", "development", "dev", "cdn-qa", "cloud", "fast", "cdn2", "cdn-prod"], getEnv = () => {
  const e = process.env.NODE_ENV || "production";
  return validEnvList.includes(e) ? e : "production";
}, get = (e, t, n) => {
  const i = String.prototype.split.call(t, /[,[\].]+?/).filter(Boolean).reduce((o, r) => o != null ? o[r] : o, e);
  return i === void 0 || i === e ? n : i;
};
function FormComponent(e) {
  var m, g;
  const t = useRef(null), [n, i] = useState(() => "unsubmitted"), [o, r] = useState(() => null), [a, s] = useState(() => "");
  function c(h) {
    var S, C;
    const y = {
      ...e.builderContext.rootState,
      ...h
    };
    e.builderContext.rootSetState ? (C = (S = e.builderContext).rootSetState) == null || C.call(S, y) : e.builderContext.rootState = y;
  }
  function l() {
    return isEditing() && e.previewState || n;
  }
  function d(h) {
    var S;
    const y = e.sendWithJs || e.sendSubmissionsTo === "email";
    if (e.sendSubmissionsTo === "zapier")
      h.preventDefault();
    else if (y) {
      if (!(e.action || e.sendSubmissionsTo === "email")) {
        h.preventDefault();
        return;
      }
      h.preventDefault();
      const C = h.currentTarget, p = e.customHeaders || {};
      let v;
      const I = new FormData(C), T = Array.from(
        h.currentTarget.querySelectorAll("input,select,textarea")
      ).filter((u) => !!u.name).map((u) => {
        let f;
        const k = u.name;
        if (u instanceof HTMLInputElement)
          if (u.type === "radio") {
            if (u.checked)
              return f = u.name, {
                key: k,
                value: f
              };
          } else if (u.type === "checkbox")
            f = u.checked;
          else if (u.type === "number" || u.type === "range") {
            const b = u.valueAsNumber;
            isNaN(b) || (f = b);
          } else
            u.type === "file" ? f = u.files : f = u.value;
        else
          f = u.value;
        return {
          key: k,
          value: f
        };
      });
      let E = e.contentType;
      if (e.sendSubmissionsTo === "email" && (E = "multipart/form-data"), Array.from(T).forEach(({ value: u }) => {
        (u instanceof File || Array.isArray(u) && u[0] instanceof File || u instanceof FileList) && (E = "multipart/form-data");
      }), E !== "application/json")
        v = I;
      else {
        const u = {};
        Array.from(T).forEach(({ value: f, key: k }) => {
          set(u, k, f);
        }), v = JSON.stringify(u);
      }
      E && E !== "multipart/form-data" && (y && ((S = e.action) != null && S.includes("zapier.com")) || (p["content-type"] = E));
      const j = new CustomEvent("presubmit", { detail: { body: v } });
      if (t.current && (t.current.dispatchEvent(j), j.defaultPrevented))
        return;
      i("sending");
      const A = `${getEnv() === "dev" ? "http://localhost:5000" : "https://builder.io"}/api/v1/form-submit?apiKey=${e.builderContext.apiKey}&to=${btoa(
        e.sendSubmissionsToEmail || ""
      )}&name=${encodeURIComponent(e.name || "")}`;
      fetch(
        e.sendSubmissionsTo === "email" ? A : e.action,
        { body: v, headers: p, method: e.method || "post" }
      ).then(
        async (u) => {
          let f;
          const k = u.headers.get("content-type");
          if (k && k.indexOf("application/json") !== -1 ? f = await u.json() : f = await u.text(), !u.ok && e.errorMessagePath) {
            let b = get(f, e.errorMessagePath);
            b && (typeof b != "string" && (b = JSON.stringify(b)), s(b), c({ formErrorMessage: b }));
          }
          if (r(f), i(u.ok ? "success" : "error"), u.ok) {
            const b = new CustomEvent("submit:success", {
              detail: { res: u, body: f }
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
          const f = new CustomEvent("submit:error", {
            detail: { error: u }
          });
          t.current && (t.current.dispatchEvent(f), f.defaultPrevented) || (r(u), i("error"));
        }
      );
    }
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    " ",
    /* @__PURE__ */ jsxs(
      "form",
      {
        validate: e.validate,
        ref: t,
        action: !e.sendWithJs && e.action,
        method: e.method,
        name: e.name,
        onSubmit: (h) => d(h),
        ...e.attributes,
        children: [
          e.builderBlock && e.builderBlock.children ? /* @__PURE__ */ jsx(Fragment, { children: (g = (m = e.builderBlock) == null ? void 0 : m.children) == null ? void 0 : g.map((h, y) => /* @__PURE__ */ jsx(
            Block,
            {
              block: h,
              context: e.builderContext,
              registeredComponents: e.builderComponents,
              linkComponent: e.builderLinkComponent
            },
            `form-block-${y}`
          )) }) : null,
          l() === "error" ? /* @__PURE__ */ jsx(
            Blocks,
            {
              path: "errorMessage",
              blocks: e.errorMessage,
              context: e.builderContext
            }
          ) : null,
          l() === "sending" ? /* @__PURE__ */ jsx(
            Blocks,
            {
              path: "sendingMessage",
              blocks: e.sendingMessage,
              context: e.builderContext
            }
          ) : null,
          l() === "error" && o ? /* @__PURE__ */ jsx("pre", { className: "builder-form-error-text pre-31bf8a14", children: JSON.stringify(o, null, 2) }) : null,
          l() === "success" ? /* @__PURE__ */ jsx(
            Blocks,
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
    /* @__PURE__ */ jsx("style", { children: ".pre-31bf8a14 {   padding: 10px;   color: red;   text-align: center; }" }),
    " "
  ] });
}
const componentInfo$4 = {
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
function FormInputComponent(e) {
  return /* @__PURE__ */ createElement(
    "input",
    {
      ...e.attributes,
      key: isEditing() && e.defaultValue ? e.defaultValue : "default-key",
      placeholder: e.placeholder,
      type: e.type,
      name: e.name,
      value: e.value,
      defaultValue: e.defaultValue,
      required: e.required
    }
  );
}
const componentInfo$3 = {
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
function SelectComponent(e) {
  var t;
  return /* @__PURE__ */ createElement(
    "select",
    {
      ...e.attributes,
      value: e.value,
      key: isEditing() && e.defaultValue ? e.defaultValue : "default-key",
      defaultValue: e.defaultValue,
      name: e.name
    },
    (t = e.options) == null ? void 0 : t.map((n) => /* @__PURE__ */ jsx("option", { value: n.value, children: n.name || n.value }))
  );
}
const componentInfo$2 = {
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
function SubmitButton(e) {
  return /* @__PURE__ */ jsx("button", { type: "submit", ...e.attributes, children: e.text });
}
const componentInfo$1 = {
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
function ImgComponent(e) {
  return /* @__PURE__ */ jsx(
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
    isEditing() && e.imgSrc || "default-key"
  );
}
const componentInfo = {
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
function Video(e) {
  var i, o, r, a, s, c, l;
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
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        position: "relative"
      },
      children: [
        /* @__PURE__ */ jsx(
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
            children: e.lazyLoad ? null : /* @__PURE__ */ jsx("source", { type: "video/mp4", src: e.video })
          }
        ),
        e.aspectRatio && !(e.fitContent && ((r = (o = e.builderBlock) == null ? void 0 : o.children) != null && r.length)) ? /* @__PURE__ */ jsx(
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
        (s = (a = e.builderBlock) == null ? void 0 : a.children) != null && s.length && e.fitContent ? /* @__PURE__ */ jsx(
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
        (l = (c = e.builderBlock) == null ? void 0 : c.children) != null && l.length && !e.fitContent ? /* @__PURE__ */ jsx(
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
const getExtraComponents = () => [{
  component: CustomCode,
  ...componentInfo$7
}, {
  component: Embed,
  ...componentInfo$6
}, {
  component: FormComponent,
  ...componentInfo$5
}, {
  component: FormInputComponent,
  ...componentInfo$4
}, {
  component: SubmitButton,
  ...componentInfo$2
}, {
  component: SelectComponent,
  ...componentInfo$3
}, {
  component: ImgComponent,
  ...componentInfo$1
}, {
  component: Video,
  ...componentInfo
}], getDefaultRegisteredComponents = () => [{
  component: Button,
  ...componentInfo$f
}, {
  component: Columns,
  ...componentInfo$e
}, {
  component: FragmentComponent,
  ...componentInfo$d
}, {
  component: Image,
  ...componentInfo$c
}, {
  component: SectionComponent,
  ...componentInfo$b
}, {
  component: Slot,
  ...componentInfo$a
}, {
  component: Symbol$1,
  ...componentInfo$9
}, {
  component: Text,
  ...componentInfo$8
}, ...getExtraComponents()], UPDATE_COOKIES_AND_STYLES_SCRIPT = `function updateCookiesAndStyles(contentId, variants, isHydrationTarget) {
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
  const n = t.getBoundingClientRect(), i = e.clientX - n.left, o = e.clientY - n.top, r = round(i / n.width), a = round(o / n.height);
  return {
    x: r,
    y: a
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
  var p, v, I, T, E, j, A;
  const t = useRef(null);
  function n(u) {
    var k, b;
    const f = {
      ...e.builderContextSignal.rootState,
      ...u
    };
    e.builderContextSignal.rootSetState ? (b = (k = e.builderContextSignal).rootSetState) == null || b.call(k, f) : e.setBuilderContextSignal((x) => ({
      ...x,
      rootState: f
    }));
  }
  function i(u) {
    var k, b, x, w, B;
    const f = {
      ...e.builderContextSignal.content,
      ...u,
      data: {
        ...(k = e.builderContextSignal.content) == null ? void 0 : k.data,
        ...u == null ? void 0 : u.data
      },
      meta: {
        ...(b = e.builderContextSignal.content) == null ? void 0 : b.meta,
        ...u == null ? void 0 : u.meta,
        breakpoints: ((x = u == null ? void 0 : u.meta) == null ? void 0 : x.breakpoints) || ((B = (w = e.builderContextSignal.content) == null ? void 0 : w.meta) == null ? void 0 : B.breakpoints)
      }
    };
    e.setBuilderContextSignal((R) => ({
      ...R,
      content: f
    }));
  }
  const [o, r] = useState(
    () => e.contentWrapper || "div"
  );
  function a(u) {
    return createEditorListener({
      model: e.model,
      trustedHosts: e.trustedHosts,
      callbacks: {
        configureSdk: (f) => {
          var x;
          const { breakpoints: k, contentId: b } = f;
          !b || b !== ((x = e.builderContextSignal.content) == null ? void 0 : x.id) || k && i({
            meta: {
              breakpoints: k
            }
          });
        },
        animation: (f) => {
          triggerAnimation(f);
        },
        contentUpdate: (f) => {
          i(f);
        }
      }
    })(u);
  }
  function s() {
    var f, k;
    const u = (k = (f = e.builderContextSignal.content) == null ? void 0 : f.data) == null ? void 0 : k.jsCode;
    u && evaluate({
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
  const [c, l] = useState(() => ({})), [d, m] = useState(() => ({})), [g, h] = useState(() => !1);
  function y(u) {
    var f, k;
    if (e.builderContextSignal.content) {
      const b = (f = e.builderContextSignal.content) == null ? void 0 : f.testVariationId, x = (k = e.builderContextSignal.content) == null ? void 0 : k.id;
      _track({
        type: "click",
        canTrack: getDefaultCanTrack(e.canTrack),
        contentId: x,
        apiKey: e.apiKey,
        variationId: b !== x ? b : void 0,
        ...getInteractionPropertiesForEvent(u),
        unique: !g
      });
    }
    g || h(!0);
  }
  function S() {
    var f, k, b;
    const u = (b = (k = (f = e.builderContextSignal.content) == null ? void 0 : f.data) == null ? void 0 : k.httpRequests) != null ? b : {};
    Object.entries(u).forEach(([x, w]) => {
      if (!w || d[x] || c[x] && !isEditing())
        return;
      d[x] = !0;
      const B = w.replace(
        /{{([^}]+)}}/g,
        (R, F) => String(
          evaluate({
            code: F,
            context: e.context || {},
            localState: void 0,
            rootState: e.builderContextSignal.rootState,
            rootSetState: e.builderContextSignal.rootSetState,
            enableCache: !0
          })
        )
      );
      fetch$1(B).then((R) => R.json()).then((R) => {
        n({
          [x]: R
        }), c[x] = !0;
      }).catch((R) => {
        console.error("error fetching dynamic data", w, R);
      }).finally(() => {
        d[x] = !1;
      });
    });
  }
  function C() {
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
    var u, f;
    if (isBrowser()) {
      if (isEditing() && (window.addEventListener("message", a), setupBrowserForEditing({
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
        var w;
        const x = createRegisterComponentMessage(b);
        (w = window.parent) == null || w.postMessage(x, "*");
      }), window.addEventListener(
        "builder:component:stateChangeListenerActivated",
        C
      )), e.builderContextSignal.content && getDefaultCanTrack(e.canTrack)) {
        const b = (u = e.builderContextSignal.content) == null ? void 0 : u.testVariationId, x = (f = e.builderContextSignal.content) == null ? void 0 : f.id, w = e.apiKey;
        _track({
          type: "impression",
          canTrack: !0,
          contentId: x,
          apiKey: w,
          variationId: b !== x ? b : void 0
        });
      }
      if (isPreviewing()) {
        const b = new URL(location.href).searchParams, x = b.get("builder.preview"), w = b.get(
          `builder.preview.${x}`
        ), B = b.get("apiKey") || b.get("builder.space");
        x === e.model && B === e.apiKey && (!e.content || w === e.content.id) && fetchOneEntry({
          model: e.model,
          apiKey: e.apiKey,
          apiVersion: e.builderContextSignal.apiVersion
        }).then((R) => {
          R && i(R);
        });
      }
    }
  }, []), useEffect(() => {
    e.apiKey || logger.error(
      "No API key provided to `RenderContent` component. This can cause issues. Please provide an API key using the `apiKey` prop."
    ), s(), S(), C();
  }, []), useEffect(() => {
    e.content && i(e.content);
  }, [e.content]), useEffect(() => {
    s();
  }, [(v = (p = e.builderContextSignal.content) == null ? void 0 : p.data) == null ? void 0 : v.jsCode]), useEffect(() => {
    S();
  }, [(T = (I = e.builderContextSignal.content) == null ? void 0 : I.data) == null ? void 0 : T.httpRequests]), useEffect(() => {
    C();
  }, [e.builderContextSignal.rootState]), useEffect(() => {
    e.data && n(e.data);
  }, [e.data]), useEffect(() => {
    e.locale && n({
      locale: e.locale
    });
  }, [e.locale]), useEffect(() => () => {
    isBrowser() && (window.removeEventListener("message", a), window.removeEventListener(
      "builder:component:stateChangeListenerActivated",
      C
    ));
  }, []), /* @__PURE__ */ jsx(builderContext.Provider, { value: e.builderContextSignal, children: e.builderContextSignal.content ? /* @__PURE__ */ jsx(
    o,
    {
      ref: t,
      onClick: (u) => y(u),
      "builder-content-id": (E = e.builderContextSignal.content) == null ? void 0 : E.id,
      "builder-model": e.model,
      ...e.showContent ? {} : {
        hidden: !0,
        "aria-hidden": !0
      },
      ...e.contentWrapperProps,
      className: `variant-${((j = e.content) == null ? void 0 : j.testVariationId) || ((A = e.content) == null ? void 0 : A.id)}`,
      children: e.children
    }
  ) : null });
}
const getCssFromFont = (e) => {
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
    for (const s in e.files) {
      if (!(String(Number(s)) === s))
        continue;
      const l = e.files[s];
      l && l !== i && (o += `
@font-face {
font-family: "${t}";
src: url('${l}') format('woff2');
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
  var r, a, s;
  const i = {}, o = ((r = e == null ? void 0 : e.data) == null ? void 0 : r.state) || {};
  return (s = (a = e == null ? void 0 : e.data) == null ? void 0 : a.inputs) == null || s.forEach((c) => {
    c.name && c.defaultValue !== void 0 && (i[c.name] = c.defaultValue);
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
  var c, l, d, m, g, h, y;
  const [t, n] = useState(
    () => {
      var S, C;
      return getUpdateVariantVisibilityScript({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        variationId: (S = e.content) == null ? void 0 : S.testVariationId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        contentId: (C = e.content) == null ? void 0 : C.id
      });
    }
  );
  function i(S) {
    s((C) => ({
      ...C,
      rootState: S
    }));
  }
  const [o, r] = useState(
    () => [
      ...getDefaultRegisteredComponents(),
      ...e.customComponents || []
    ].reduce(
      (S, { component: C, ...p }) => ({
        ...S,
        [p.name]: {
          component: C,
          ...serializeComponentInfo(p)
        }
      }),
      {}
    )
  ), [a, s] = useState(() => ({
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
      (S, { component: C, ...p }) => ({
        ...S,
        [p.name]: serializeComponentInfo(p)
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
          builderContextSignal: a,
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
                contentId: (c = a.content) == null ? void 0 : c.id,
                cssCode: (d = (l = a.content) == null ? void 0 : l.data) == null ? void 0 : d.cssCode,
                customFonts: (g = (m = a.content) == null ? void 0 : m.data) == null ? void 0 : g.customFonts
              }
            ),
            /* @__PURE__ */ jsx(
              Blocks,
              {
                blocks: (y = (h = a.content) == null ? void 0 : h.data) == null ? void 0 : y.blocks,
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
function ContentVariants(e) {
  var a;
  const [t, n] = useState(
    () => checkShouldRenderVariants({
      canTrack: getDefaultCanTrack(e.canTrack),
      content: e.content
    })
  );
  function i() {
    var s;
    return getUpdateCookieAndStylesScript(
      getVariants(e.content).map((c) => ({
        id: c.testVariationId,
        testRatio: c.testRatio
      })),
      ((s = e.content) == null ? void 0 : s.id) || ""
    );
  }
  function o() {
    return getVariants(e.content).map((s) => `.variant-${s.testVariationId} { display: none; } `).join("");
  }
  function r() {
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
      (a = getVariants(e.content)) == null ? void 0 : a.map((s) => /* @__PURE__ */ jsx(
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
  var r, a, s, c;
  function t() {
    var l, d;
    return [
      e.attributes[getClassPropName()],
      "builder-symbol",
      (l = e.symbol) != null && l.inline ? "builder-inline-symbol" : void 0,
      (d = e.symbol) != null && d.dynamic || e.dynamic ? "builder-dynamic-symbol" : void 0
    ].filter(Boolean).join(" ");
  }
  const [n, i] = useState(() => {
    var l;
    return (l = e.symbol) == null ? void 0 : l.content;
  });
  function o() {
    n || fetchSymbolContent({
      symbol: e.symbol,
      builderContextValue: e.builderContext
    }).then((l) => {
      l && i(l);
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
        symbolId: (r = e.builderBlock) == null ? void 0 : r.id
      },
      customComponents: Object.values(e.builderComponents),
      data: {
        ...(a = e.symbol) == null ? void 0 : a.data,
        ...e.builderContext.localState,
        ...(s = n == null ? void 0 : n.data) == null ? void 0 : s.state
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
  Blocks,
  Columns,
  ContentVariants as Content,
  Symbol$1 as Symbol,
  Text
};
