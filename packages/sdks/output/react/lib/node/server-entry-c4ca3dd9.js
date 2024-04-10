const b = "[Builder.io]: ", f = {
  log: (...t) => console.log(b, ...t),
  error: (...t) => console.error(b, ...t),
  warn: (...t) => console.warn(b, ...t),
  debug: (...t) => console.debug(b, ...t)
};
function c() {
  return typeof window != "undefined" && typeof document != "undefined";
}
const I = "react", Y = (t) => {
  const e = {};
  return t.forEach((n, r) => {
    e[r] = n;
  }), e;
}, B = (t) => t instanceof URLSearchParams ? Y(t) : t, V = (t) => typeof t == "string" ? t : t instanceof URLSearchParams ? t.toString() : new URLSearchParams(t).toString();
function Q() {
  return c() && window.self !== window.top;
}
function U(t) {
  return Q() && V(t || window.location.search).indexOf("builder.frameEditing=") !== -1;
}
const Z = () => {
  if (c()) {
    const t = new URL(location.href);
    return t.pathname === "" && (t.pathname = "/"), t;
  } else
    return console.warn("Cannot get location for tracking in non-browser environment"), null;
}, tt = () => typeof navigator == "object" && navigator.userAgent || "", et = () => {
  const t = tt(), e = {
    Android() {
      return t.match(/Android/i);
    },
    BlackBerry() {
      return t.match(/BlackBerry/i);
    },
    iOS() {
      return t.match(/iPhone|iPod/i);
    },
    Opera() {
      return t.match(/Opera Mini/i);
    },
    Windows() {
      return t.match(/IEMobile/i) || t.match(/WPDesktop/i);
    },
    any() {
      return e.Android() || e.BlackBerry() || e.iOS() || e.Opera() || e.Windows() || I === "reactNative";
    }
  }, n = t.match(/Tablet|iPad/i), r = Z();
  return {
    urlPath: r == null ? void 0 : r.pathname,
    host: (r == null ? void 0 : r.host) || (r == null ? void 0 : r.hostname),
    device: n ? "tablet" : e.any() ? "mobile" : "desktop"
  };
}, N = (t) => JSON.parse(JSON.stringify(t)), m = (t) => t != null, nt = (t) => {
  if (t === "localhost" || t === "127.0.0.1")
    return t;
  const e = t.split(".");
  return e.length > 2 ? e.slice(1).join(".") : t;
}, F = ({
  name: t,
  canTrack: e
}) => {
  var n;
  try {
    return e ? (n = document.cookie.split("; ").find((r) => r.startsWith(`${t}=`))) == null ? void 0 : n.split("=")[1] : void 0;
  } catch (r) {
    f.warn("[COOKIE] GET error: ", (r == null ? void 0 : r.message) || r);
    return;
  }
}, M = async (t) => F(t), rt = (t) => t.map(([e, n]) => n ? `${e}=${n}` : e).filter(m).join("; "), ot = [["secure", ""], ["SameSite", "None"]], st = ({
  name: t,
  value: e,
  expires: n
}) => {
  const o = (c() ? location.protocol === "https:" : !0) ? ot : [[]], s = n ? [["expires", n.toUTCString()]] : [[]], a = [[t, e], ...s, ["path", "/"], ["domain", nt(window.location.hostname)], ...o];
  return rt(a);
}, j = async ({
  name: t,
  value: e,
  expires: n,
  canTrack: r
}) => {
  try {
    if (!r)
      return;
    const o = st({
      name: t,
      value: e,
      expires: n
    });
    document.cookie = o;
  } catch (o) {
    f.warn("[COOKIE] SET error: ", (o == null ? void 0 : o.message) || o);
  }
}, it = "builder.tests", E = (t) => `${it}.${t}`, at = ({
  contentId: t
}) => M({
  name: E(t),
  canTrack: !0
}), ct = ({
  contentId: t
}) => F({
  name: E(t),
  canTrack: !0
}), ut = ({
  contentId: t,
  value: e
}) => j({
  name: E(t),
  value: e,
  canTrack: !0
}), D = (t) => m(t.id) && m(t.variations) && Object.keys(t.variations).length > 0, dt = ({
  id: t,
  variations: e
}) => {
  var o;
  let n = 0;
  const r = Math.random();
  for (const s in e) {
    const a = (o = e[s]) == null ? void 0 : o.testRatio;
    if (n += a, r < n)
      return s;
  }
  return t;
}, K = (t) => {
  const e = dt(t);
  return ut({
    contentId: t.id,
    value: e
  }).catch((n) => {
    f.error("could not store A/B test variation: ", n);
  }), e;
}, _ = ({
  item: t,
  testGroupId: e
}) => {
  const n = t.variations[e];
  return e === t.id || // handle edge-case where `testGroupId` points to non-existing variation
  !n ? {
    testVariationId: t.id,
    testVariationName: "Default"
  } : {
    data: n.data,
    testVariationId: n.id,
    testVariationName: n.name || (n.id === t.id ? "Default" : "")
  };
}, Wt = ({
  item: t,
  canTrack: e
}) => {
  if (!e)
    return t;
  if (!t)
    return;
  if (!D(t))
    return t;
  const n = ct({
    contentId: t.id
  }) || K({
    variations: t.variations,
    id: t.id
  }), r = _({
    item: t,
    testGroupId: n
  });
  return {
    ...t,
    ...r
  };
}, lt = async ({
  item: t,
  canTrack: e
}) => {
  if (!e || !D(t))
    return t;
  const r = await at({
    contentId: t.id
  }) || K({
    variations: t.variations,
    id: t.id
  }), o = _({
    item: t,
    testGroupId: r
  });
  return {
    ...t,
    ...o
  };
}, ft = (t) => m(t) ? t : !0, $t = (t) => ({
  type: "builder.registerComponent",
  data: pt(t)
}), ht = (t) => {
  const e = t.toString().trim();
  return `return (${!e.startsWith("function") && !e.startsWith("(") ? "function " : ""}${e}).apply(this, arguments)`;
}, gt = (t) => typeof t == "function" ? ht(t) : N(t), pt = ({
  inputs: t,
  ...e
}) => ({
  ...N(e),
  inputs: t == null ? void 0 : t.map((n) => Object.entries(n).reduce((r, [o, s]) => ({
    ...r,
    [o]: gt(s)
  }), {}))
});
function mt() {
  return typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : globalThis;
}
function yt() {
  const t = mt().fetch;
  if (typeof t == "undefined")
    throw console.warn(`Builder SDK could not find a global fetch function. Make sure you have a polyfill for fetch in your project. 
      For more information, read https://github.com/BuilderIO/this-package-uses-fetch`), new Error("Builder SDK could not find a global `fetch` function");
  return t;
}
const wt = yt();
function v(t, e = null, n = ".") {
  return Object.keys(t).reduce((r, o) => {
    const s = t[o], a = [e, o].filter(Boolean).join(n);
    return [typeof s == "object", s !== null, !(Array.isArray(s) && s.length === 0)].every(Boolean) ? {
      ...r,
      ...v(s, a, n)
    } : {
      ...r,
      [a]: s
    };
  }, {});
}
const St = "v3", x = "builder.", bt = "options.", W = (t) => {
  if (!t)
    return {};
  const e = B(t), n = {};
  return Object.keys(e).forEach((r) => {
    if (r.startsWith(x)) {
      const o = r.replace(x, "").replace(bt, "");
      n[o] = e[r];
    }
  }), n;
}, vt = () => {
  if (!c())
    return {};
  const t = new URLSearchParams(window.location.search);
  return W(t);
}, A = (t) => typeof t == "number" && !isNaN(t) && t >= 0, P = (t) => {
  const {
    limit: e = 30,
    userAttributes: n,
    query: r,
    model: o,
    apiKey: s,
    enrich: a,
    locale: d,
    apiVersion: y = St,
    fields: p,
    omit: k,
    offset: u,
    cacheSeconds: h,
    staleCacheSeconds: g,
    sort: w,
    includeUnpublished: O
  } = t;
  if (!s)
    throw new Error("Missing API key");
  if (!["v3"].includes(y))
    throw new Error(`Invalid apiVersion: expected 'v3', received '${y}'`);
  const X = e !== 1, i = new URL(`https://cdn.builder.io/api/${y}/content/${o}`);
  if (i.searchParams.set("apiKey", s), i.searchParams.set("limit", String(e)), i.searchParams.set("noTraverse", String(X)), i.searchParams.set("includeRefs", String(!0)), d && i.searchParams.set("locale", d), a && i.searchParams.set("enrich", String(a)), i.searchParams.set("omit", k || "meta.componentsUsed"), p && i.searchParams.set("fields", p), Number.isFinite(u) && u > -1 && i.searchParams.set("offset", String(Math.floor(u))), typeof O == "boolean" && i.searchParams.set("includeUnpublished", String(O)), h && A(h) && i.searchParams.set("cacheSeconds", String(h)), g && A(g) && i.searchParams.set("staleCacheSeconds", String(g)), w) {
    const l = v({
      sort: w
    });
    for (const S in l)
      i.searchParams.set(S, JSON.stringify(l[S]));
  }
  const q = {
    ...vt(),
    ...B(t.options || {})
  }, C = v(q);
  for (const l in C)
    i.searchParams.set(l, String(C[l]));
  if (n && i.searchParams.set("userAttributes", JSON.stringify(n)), r) {
    const l = v({
      query: r
    });
    for (const S in l)
      i.searchParams.set(S, JSON.stringify(l[S]));
  }
  return i;
}, It = (t) => "results" in t;
async function kt(t) {
  const e = await Ot({
    ...t,
    limit: 1
  });
  return e && e[0] || null;
}
const Et = async (t) => {
  var s;
  const e = P(t);
  return await (await ((s = t.fetch) != null ? s : wt)(e.href, t.fetchOptions)).json();
}, Pt = async (t, e, n = P(t)) => {
  const r = ft(t.canTrack);
  if (n.search.includes("preview="), !r || !(c() || I === "reactNative"))
    return e.results;
  try {
    const o = [];
    for (const s of e.results)
      o.push(await lt({
        item: s,
        canTrack: r
      }));
    e.results = o;
  } catch (o) {
    f.error("Could not process A/B tests. ", o);
  }
  return e.results;
};
async function Ot(t) {
  try {
    const e = P(t), n = await Et(t);
    return It(n) ? Pt(t, n) : (f.error("Error fetching data. ", {
      url: e,
      content: n,
      options: t
    }), null);
  } catch (e) {
    return f.error("Error fetching data. ", e), null;
  }
}
function Gt(t) {
  if (!c())
    return !1;
  const e = V(t || window.location.search);
  return U(e) ? !1 : e.indexOf("builder.preview=") !== -1;
}
function Ct() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
    const e = Math.random() * 16 | 0;
    return (t == "x" ? e : e & 3 | 8).toString(16);
  });
}
function $() {
  return Ct().replace(/-/g, "");
}
const G = "builderSessionId", xt = async ({
  canTrack: t
}) => {
  if (!t)
    return;
  const e = await M({
    name: G,
    canTrack: t
  });
  if (m(e))
    return e;
  {
    const n = At();
    return Tt({
      id: n,
      canTrack: t
    }), n;
  }
}, At = () => $(), Tt = ({
  id: t,
  canTrack: e
}) => j({
  name: G,
  value: t,
  canTrack: e
}), J = () => c() && typeof localStorage != "undefined" ? localStorage : void 0, Rt = ({
  key: t,
  canTrack: e
}) => {
  var n;
  try {
    return e ? (n = J()) == null ? void 0 : n.getItem(t) : void 0;
  } catch (r) {
    console.debug("[LocalStorage] GET error: ", r);
    return;
  }
}, Lt = ({
  key: t,
  canTrack: e,
  value: n
}) => {
  var r;
  try {
    e && ((r = J()) == null || r.setItem(t, n));
  } catch (o) {
    console.debug("[LocalStorage] SET error: ", o);
  }
}, z = "builderVisitorId", Bt = ({
  canTrack: t
}) => {
  if (!t)
    return;
  const e = Rt({
    key: z,
    canTrack: t
  });
  if (m(e))
    return e;
  {
    const n = Vt();
    return Ut({
      id: n,
      canTrack: t
    }), n;
  }
}, Vt = () => $(), Ut = ({
  id: t,
  canTrack: e
}) => Lt({
  key: z,
  value: t,
  canTrack: e
}), Nt = async ({
  canTrack: t
}) => {
  if (!t)
    return {
      visitorId: void 0,
      sessionId: void 0
    };
  const e = await xt({
    canTrack: t
  }), n = Bt({
    canTrack: t
  });
  return {
    sessionId: e,
    visitorId: n
  };
}, Ft = async ({
  type: t,
  canTrack: e,
  apiKey: n,
  metadata: r,
  ...o
}) => ({
  type: t,
  data: {
    ...o,
    metadata: {
      url: location.href,
      ...r
    },
    ...await Nt({
      canTrack: e
    }),
    userAttributes: et(),
    ownerId: n
  }
});
async function Mt(t) {
  if (!t.apiKey) {
    f.error("Missing API key for track call. Please provide your API key.");
    return;
  }
  if (t.canTrack && !U() && (c() || I === "reactNative"))
    return fetch("https://cdn.builder.io/api/v1/track", {
      method: "POST",
      body: JSON.stringify({
        events: [await Ft(t)]
      }),
      headers: {
        "content-type": "application/json"
      },
      mode: "cors"
    }).catch((e) => {
      console.error("Failed to track: ", e);
    });
}
const Jt = (t) => Mt({
  ...t,
  canTrack: !0
}), jt = ["*.beta.builder.io", "beta.builder.io", "builder.io", "localhost", "qa.builder.io"];
function H(t, e) {
  const n = new URL(e.origin), r = n.hostname;
  return (t || jt).findIndex((o) => o.startsWith("*.") ? r.endsWith(o.slice(1)) : o === r) > -1;
}
const Dt = "1.0.17", T = {};
function zt(t, e) {
  let n = T[t];
  if (n || (n = T[t] = []), n.push(e), c()) {
    const r = {
      type: "builder.register",
      data: {
        type: t,
        info: e
      }
    };
    try {
      parent.postMessage(r, "*"), parent !== window && window.postMessage(r, "*");
    } catch (o) {
      console.debug("Could not postmessage", o);
    }
  }
}
let R = !1;
const Kt = (t = {}) => {
  var e, n;
  R || (R = !0, c() && ((e = window.parent) == null || e.postMessage({
    type: "builder.sdkInfo",
    data: {
      target: I,
      version: Dt,
      supportsPatchUpdates: !1,
      // Supports builder-model="..." attribute which is needed to
      // scope our '+ add block' button styling
      supportsAddBlockScoping: !0,
      supportsCustomBreakpoints: !0
    }
  }, "*"), (n = window.parent) == null || n.postMessage({
    type: "builder.updateContent",
    data: {
      options: t
    }
  }, "*"), window.addEventListener("message", (r) => {
    var s, a;
    if (!H(t.trustedHosts, r))
      return;
    const {
      data: o
    } = r;
    if (o != null && o.type)
      switch (o.type) {
        case "builder.evaluate": {
          const d = o.data.text, y = o.data.arguments || [], p = o.data.id, k = new Function(d);
          let u, h = null;
          try {
            u = k.apply(null, y);
          } catch (g) {
            h = g;
          }
          h ? (s = window.parent) == null || s.postMessage({
            type: "builder.evaluateError",
            data: {
              id: p,
              error: h.message
            }
          }, "*") : u && typeof u.then == "function" ? u.then((g) => {
            var w;
            (w = window.parent) == null || w.postMessage({
              type: "builder.evaluateResult",
              data: {
                id: p,
                result: g
              }
            }, "*");
          }).catch(console.error) : (a = window.parent) == null || a.postMessage({
            type: "builder.evaluateResult",
            data: {
              result: u,
              id: p
            }
          }, "*");
          break;
        }
      }
  })));
}, _t = ({
  model: t,
  trustedHosts: e,
  callbacks: n
}) => (r) => {
  if (!H(e, r))
    return;
  const {
    data: o
  } = r;
  if (o)
    switch (o.type) {
      case "builder.configureSdk": {
        n.configureSdk(o.data);
        break;
      }
      case "builder.triggerAnimation": {
        n.animation(o.data);
        break;
      }
      case "builder.contentUpdate": {
        const s = o.data, a = s.key || s.alias || s.entry || s.modelName, d = s.data;
        a === t && n.contentUpdate(d);
        break;
      }
    }
}, Ht = (t, e, n) => {
  if (!c)
    return f.warn("`subscribeToEditor` only works in the browser. It currently seems to be running on the server."), () => {
    };
  Kt();
  const r = _t({
    callbacks: {
      contentUpdate: e,
      animation: () => {
      },
      configureSdk: () => {
      }
    },
    model: t,
    trustedHosts: n == null ? void 0 : n.trustedHosts
  });
  return window.addEventListener("message", r), () => {
    window.removeEventListener("message", r);
  };
}, L = {};
function Xt(t) {
  if (c()) {
    Object.assign(L, t);
    const e = {
      type: "builder.settingsChange",
      data: L
    };
    parent.postMessage(e, "*");
  }
}
const qt = async (t) => {
  var r, o, s;
  const e = t.path || ((r = t.url) == null ? void 0 : r.pathname) || ((o = t.userAttributes) == null ? void 0 : o.urlPath), n = {
    ...t,
    apiKey: t.apiKey,
    model: t.model || "page",
    userAttributes: {
      ...t.userAttributes,
      ...e ? {
        urlPath: e
      } : {}
    },
    options: W(t.searchParams || ((s = t.url) == null ? void 0 : s.searchParams) || t.options)
  };
  return {
    apiKey: n.apiKey,
    model: n.model,
    content: await kt(n)
  };
};
export {
  I as TARGET,
  Pt as _processContentResult,
  Mt as _track,
  m as checkIsDefined,
  _t as createEditorListener,
  $t as createRegisterComponentMessage,
  N as fastClone,
  wt as fetch,
  qt as fetchBuilderProps,
  Ot as fetchEntries,
  kt as fetchOneEntry,
  W as getBuilderSearchParams,
  ft as getDefaultCanTrack,
  et as getUserAttributes,
  Wt as handleABTestingSync,
  c as isBrowser,
  U as isEditing,
  Gt as isPreviewing,
  f as logger,
  zt as register,
  pt as serializeComponentInfo,
  Xt as setEditorSettings,
  Kt as setupBrowserForEditing,
  Ht as subscribeToEditor,
  Jt as track
};
