import { jsx as v, jsxs as N, Fragment as L } from "react/jsx-runtime";
import { lazy as te, useRef as ne, useState as p, useEffect as R } from "react";
import { isBrowser as $, TARGET as J, isEditing as P, setupBrowserForEditing as ie, createRegisterComponentMessage as ae, getDefaultCanTrack as E, _track as O, isPreviewing as oe, fetchOneEntry as re, logger as le, createEditorListener as ce, fetch as se, fastClone as de, serializeComponentInfo as B, handleABTestingSync as ue } from "./server-entry-895605b0.js";
import { Columns as me, Symbol as fe, Text as ge } from "./blocks-exports.mjs";
import { builderContext as he, triggerAnimation as be, evaluate as M, InlinedStyles as X, ComponentsContext as Se, Blocks as xe } from "./blocks-8cece0b1.js";
import "./get-class-prop-name-3d9f65e0.js";
const ye = {
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
      Array.isArray(n) && n.find((d) => d.get("width")) && (n.find((h) => !h.get("width")) || n.reduce((a, r) => a + r.get("width"), 0) !== 100) && t();
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
}, Ce = {
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
}, ke = te(() => import("./slot-3ce63f76.js")), ve = {
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
}, Ie = {
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
}, D = () => [{
  component: me,
  ...ye
}, {
  component: ke,
  ...Ce
}, {
  component: fe,
  ...ve
}, {
  component: ge,
  ...Ie
}];
function Te(e, t, n) {
  var i;
  function o() {
    function a(u, f, g) {
      let x = "";
      if (g) {
        const C = /* @__PURE__ */ new Date();
        C.setTime(C.getTime() + g * 24 * 60 * 60 * 1e3), x = "; expires=" + C.toUTCString();
      }
      document.cookie = u + "=" + (f || "") + x + "; path=/; Secure; SameSite=None";
    }
    function r(u) {
      const f = u + "=", g = document.cookie.split(";");
      for (let x = 0; x < g.length; x++) {
        let C = g[x];
        for (; C.charAt(0) === " "; )
          C = C.substring(1, C.length);
        if (C.indexOf(f) === 0)
          return C.substring(f.length, C.length);
      }
      return null;
    }
    const y = `builder.tests.${e}`, S = r(y), V = t.map((u) => u.id).concat(e);
    if (S && V.includes(S))
      return S;
    let I = 0;
    const w = Math.random();
    for (let u = 0; u < t.length; u++) {
      const f = t[u], g = f.testRatio;
      if (I += g, w < I)
        return a(y, f.id), f.id;
    }
    return a(y, e), e;
  }
  const d = o(), h = (i = document.currentScript) == null ? void 0 : i.previousElementSibling;
  if (n) {
    h.remove();
    const a = document.currentScript;
    a == null || a.remove();
  } else {
    const a = t.concat({
      id: e
    }).filter((r) => r.id !== d).map((r) => `.variant-${r.id} {  display: none; }
        `).join("");
    h.innerHTML = a;
  }
}
function we(e, t, n) {
  var y;
  if (!navigator.cookieEnabled)
    return;
  function o(S) {
    const V = S + "=", I = document.cookie.split(";");
    for (let w = 0; w < I.length; w++) {
      let u = I[w];
      for (; u.charAt(0) === " "; )
        u = u.substring(1, u.length);
      if (u.indexOf(V) === 0)
        return u.substring(V.length, u.length);
    }
    return null;
  }
  const d = `builder.tests.${t}`, h = o(d), i = (y = document.currentScript) == null ? void 0 : y.parentElement, a = e === t, r = h === e;
  if (r && !a ? (i == null || i.removeAttribute("hidden"), i == null || i.removeAttribute("aria-hidden")) : !r && a && (i == null || i.setAttribute("hidden", "true"), i == null || i.setAttribute("aria-hidden", "true")), n) {
    r || i == null || i.remove();
    const S = document.currentScript;
    S == null || S.remove();
  }
}
const Re = Te.toString().replace(/\s+/g, " "), pe = we.toString().replace(/\s+/g, " "), G = "builderIoAbTest", Q = "builderIoRenderContent", W = (e) => Object.values((e == null ? void 0 : e.variations) || {}).map((t) => ({
  ...t,
  testVariationId: t.id,
  id: e == null ? void 0 : e.id
})), Ve = ({
  canTrack: e,
  content: t
}) => !(!(W(t).length > 0) || !e || $()), Ae = (e) => e === "react" || e === "reactNative", Z = Ae(J), We = () => `
  window.${G} = ${Re}
  window.${Q} = ${pe}
  `, Ee = (e, t) => `
  window.${G}(
    "${t}",${JSON.stringify(e)}, ${Z}
  )`, Pe = ({
  contentId: e,
  variationId: t
}) => `window.${Q}(
    "${t}", "${e}", ${Z}
  )`;
function H(e) {
  return /* @__PURE__ */ v(
    "script",
    {
      dangerouslySetInnerHTML: { __html: e.scriptStr },
      "data-id": e.id
    }
  );
}
function q(e) {
  return Math.round(e * 1e3) / 1e3;
}
const Ne = (e, t, n = !0) => {
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
}, $e = (e) => Ne(e, (t) => {
  const n = t.getAttribute("builder-id") || t.id;
  return (n == null ? void 0 : n.indexOf("builder-")) === 0;
}), Y = ({
  event: e,
  target: t
}) => {
  const n = t.getBoundingClientRect(), o = e.clientX - n.left, d = e.clientY - n.top, h = q(o / n.width), i = q(d / n.height);
  return {
    x: h,
    y: i
  };
}, He = (e) => {
  const t = e.target, n = t && $e(t), o = (n == null ? void 0 : n.getAttribute("builder-id")) || (n == null ? void 0 : n.id);
  return {
    targetBuilderElement: o || void 0,
    metadata: {
      targetOffset: t ? Y({
        event: e,
        target: t
      }) : void 0,
      builderTargetOffset: n ? Y({
        event: e,
        target: n
      }) : void 0,
      builderElementIndex: n && o ? [].slice.call(document.getElementsByClassName(o)).indexOf(n) : void 0
    }
  };
};
function Fe(e) {
  var x, C, F, _, j, K, U;
  const t = ne(null);
  function n(l) {
    var b, s;
    const m = {
      ...e.builderContextSignal.rootState,
      ...l
    };
    e.builderContextSignal.rootSetState ? (s = (b = e.builderContextSignal).rootSetState) == null || s.call(b, m) : e.setBuilderContextSignal((c) => ({
      ...c,
      rootState: m
    }));
  }
  function o(l) {
    var b, s, c, k, A;
    const m = {
      ...e.builderContextSignal.content,
      ...l,
      data: {
        ...(b = e.builderContextSignal.content) == null ? void 0 : b.data,
        ...l == null ? void 0 : l.data
      },
      meta: {
        ...(s = e.builderContextSignal.content) == null ? void 0 : s.meta,
        ...l == null ? void 0 : l.meta,
        breakpoints: ((c = l == null ? void 0 : l.meta) == null ? void 0 : c.breakpoints) || ((A = (k = e.builderContextSignal.content) == null ? void 0 : k.meta) == null ? void 0 : A.breakpoints)
      }
    };
    e.setBuilderContextSignal((T) => ({
      ...T,
      content: m
    }));
  }
  const [d, h] = p(
    () => e.contentWrapper || "div"
  );
  function i(l) {
    return ce({
      model: e.model,
      trustedHosts: e.trustedHosts,
      callbacks: {
        configureSdk: (m) => {
          var c;
          const { breakpoints: b, contentId: s } = m;
          !s || s !== ((c = e.builderContextSignal.content) == null ? void 0 : c.id) || b && o({
            meta: {
              breakpoints: b
            }
          });
        },
        animation: (m) => {
          be(m);
        },
        contentUpdate: (m) => {
          o(m);
        }
      }
    })(l);
  }
  function a() {
    var m, b;
    const l = (b = (m = e.builderContextSignal.content) == null ? void 0 : m.data) == null ? void 0 : b.jsCode;
    l && M({
      code: l,
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
  const [r, y] = p(() => ({})), [S, V] = p(() => ({})), [I, w] = p(() => !1);
  function u(l) {
    var m, b;
    if (e.builderContextSignal.content) {
      const s = (m = e.builderContextSignal.content) == null ? void 0 : m.testVariationId, c = (b = e.builderContextSignal.content) == null ? void 0 : b.id;
      O({
        type: "click",
        canTrack: E(e.canTrack),
        contentId: c,
        apiKey: e.apiKey,
        variationId: s !== c ? s : void 0,
        ...He(l),
        unique: !I
      });
    }
    I || w(!0);
  }
  function f() {
    var m, b, s;
    const l = (s = (b = (m = e.builderContextSignal.content) == null ? void 0 : m.data) == null ? void 0 : b.httpRequests) != null ? s : {};
    Object.entries(l).forEach(([c, k]) => {
      if (!k || S[c] || r[c] && !P())
        return;
      S[c] = !0;
      const A = k.replace(
        /{{([^}]+)}}/g,
        (T, ee) => String(
          M({
            code: ee,
            context: e.context || {},
            localState: void 0,
            rootState: e.builderContextSignal.rootState,
            rootSetState: e.builderContextSignal.rootSetState,
            enableCache: !0
          })
        )
      );
      se(A).then((T) => T.json()).then((T) => {
        n({
          [c]: T
        }), r[c] = !0;
      }).catch((T) => {
        console.error("error fetching dynamic data", k, T);
      }).finally(() => {
        S[c] = !1;
      });
    });
  }
  function g() {
    P() && window.dispatchEvent(
      new CustomEvent(
        "builder:component:stateChange",
        {
          detail: {
            state: de(e.builderContextSignal.rootState),
            ref: {
              name: e.model
            }
          }
        }
      )
    );
  }
  return R(() => {
    var l, m;
    if ($()) {
      if (P() && (window.addEventListener("message", i), ie({
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
      ).forEach((s) => {
        var k;
        const c = ae(s);
        (k = window.parent) == null || k.postMessage(c, "*");
      }), window.addEventListener(
        "builder:component:stateChangeListenerActivated",
        g
      )), e.builderContextSignal.content && E(e.canTrack)) {
        const s = (l = e.builderContextSignal.content) == null ? void 0 : l.testVariationId, c = (m = e.builderContextSignal.content) == null ? void 0 : m.id, k = e.apiKey;
        O({
          type: "impression",
          canTrack: !0,
          contentId: c,
          apiKey: k,
          variationId: s !== c ? s : void 0
        });
      }
      if (oe()) {
        const s = new URL(location.href).searchParams, c = s.get("builder.preview"), k = s.get(
          `builder.preview.${c}`
        ), A = s.get("apiKey") || s.get("builder.space");
        c === e.model && A === e.apiKey && (!e.content || k === e.content.id) && re({
          model: e.model,
          apiKey: e.apiKey,
          apiVersion: e.builderContextSignal.apiVersion
        }).then((T) => {
          T && o(T);
        });
      }
    }
  }, []), R(() => {
    e.apiKey || le.error(
      "No API key provided to `RenderContent` component. This can cause issues. Please provide an API key using the `apiKey` prop."
    ), a(), f(), g();
  }, []), R(() => {
    e.content && o(e.content);
  }, [e.content]), R(() => {
    a();
  }, [(C = (x = e.builderContextSignal.content) == null ? void 0 : x.data) == null ? void 0 : C.jsCode]), R(() => {
    f();
  }, [(_ = (F = e.builderContextSignal.content) == null ? void 0 : F.data) == null ? void 0 : _.httpRequests]), R(() => {
    g();
  }, [e.builderContextSignal.rootState]), R(() => {
    e.data && n(e.data);
  }, [e.data]), R(() => {
    e.locale && n({
      locale: e.locale
    });
  }, [e.locale]), R(() => () => {
    $() && (window.removeEventListener("message", i), window.removeEventListener(
      "builder:component:stateChangeListenerActivated",
      g
    ));
  }, []), /* @__PURE__ */ v(he.Provider, { value: e.builderContextSignal, children: e.builderContextSignal.content ? /* @__PURE__ */ v(
    d,
    {
      ref: t,
      onClick: (l) => u(l),
      "builder-content-id": (j = e.builderContextSignal.content) == null ? void 0 : j.id,
      "builder-model": e.model,
      ...e.showContent ? {} : {
        hidden: !0,
        "aria-hidden": !0
      },
      ...e.contentWrapperProps,
      className: `variant-${((K = e.content) == null ? void 0 : K.testVariationId) || ((U = e.content) == null ? void 0 : U.id)}`,
      children: e.children
    }
  ) : null });
}
const _e = (e) => {
  var h, i;
  const t = e.family + (e.kind && !e.kind.includes("#") ? ", " + e.kind : ""), n = t.split(",")[0], o = (i = e.fileUrl) != null ? i : (h = e == null ? void 0 : e.files) == null ? void 0 : h.regular;
  let d = "";
  if (o && t && n && (d += `
@font-face {
font-family: "${t}";
src: local("${n}"), url('${o}') format('woff2');
font-display: fallback;
font-weight: 400;
}
      `.trim()), e.files)
    for (const a in e.files) {
      if (!(String(Number(a)) === a))
        continue;
      const y = e.files[a];
      y && y !== o && (d += `
@font-face {
font-family: "${t}";
src: url('${y}') format('woff2');
font-display: fallback;
font-weight: ${a};
}
        `.trim());
    }
  return d;
}, je = ({
  customFonts: e
}) => {
  var t;
  return ((t = e == null ? void 0 : e.map((n) => _e(n))) == null ? void 0 : t.join(" ")) || "";
}, Ke = ({
  cssCode: e,
  contentId: t
}) => e ? t ? (e == null ? void 0 : e.replace(/&/g, `div[builder-content-id="${t}"]`)) || "" : e : "", Ue = `
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
`, Le = (e) => e ? "" : Ue;
function Oe(e) {
  const [t, n] = p(
    () => `
${Ke({
      cssCode: e.cssCode,
      contentId: e.contentId
    })}
${je({
      customFonts: e.customFonts
    })}
${Le(e.isNestedRender)}
`.trim()
  );
  return /* @__PURE__ */ v(X, { id: "builderio-content", styles: t });
}
const Be = ({
  content: e,
  data: t,
  locale: n
}) => {
  var h, i, a;
  const o = {}, d = ((h = e == null ? void 0 : e.data) == null ? void 0 : h.state) || {};
  return (a = (i = e == null ? void 0 : e.data) == null ? void 0 : i.inputs) == null || a.forEach((r) => {
    r.name && r.defaultValue !== void 0 && (o[r.name] = r.defaultValue);
  }), {
    ...o,
    ...d,
    ...t,
    ...n ? {
      locale: n
    } : {}
  };
}, Me = ({
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
function z(e) {
  var r, y, S, V, I, w, u;
  const [t, n] = p(
    () => {
      var f, g;
      return Pe({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        variationId: (f = e.content) == null ? void 0 : f.testVariationId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        contentId: (g = e.content) == null ? void 0 : g.id
      });
    }
  );
  function o(f) {
    a((g) => ({
      ...g,
      rootState: f
    }));
  }
  const [d, h] = p(
    () => [
      ...D(),
      ...e.customComponents || []
    ].reduce(
      (f, { component: g, ...x }) => ({
        ...f,
        [x.name]: {
          component: g,
          ...B(x)
        }
      }),
      {}
    )
  ), [i, a] = p(() => ({
    content: Me({
      content: e.content,
      data: e.data
    }),
    localState: void 0,
    rootState: Be({
      content: e.content,
      data: e.data,
      locale: e.locale
    }),
    rootSetState: o,
    context: e.context || {},
    apiKey: e.apiKey,
    apiVersion: e.apiVersion,
    componentInfos: [
      ...D(),
      ...e.customComponents || []
    ].reduce(
      (f, { component: g, ...x }) => ({
        ...f,
        [x.name]: B(x)
      }),
      {}
    ),
    inheritedStyles: {},
    BlocksWrapper: e.blocksWrapper || "div",
    BlocksWrapperProps: e.blocksWrapperProps || {}
  }));
  return /* @__PURE__ */ v(
    Se.Provider,
    {
      value: {
        registeredComponents: d
      },
      children: /* @__PURE__ */ N(
        Fe,
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
          builderContextSignal: i,
          contentWrapper: e.contentWrapper,
          contentWrapperProps: e.contentWrapperProps,
          linkComponent: e.linkComponent,
          trustedHosts: e.trustedHosts,
          setBuilderContextSignal: a,
          children: [
            e.isSsrAbTest ? /* @__PURE__ */ v(
              H,
              {
                id: "builderio-variant-visibility",
                scriptStr: t
              }
            ) : null,
            /* @__PURE__ */ v(
              Oe,
              {
                isNestedRender: e.isNestedRender,
                contentId: (r = i.content) == null ? void 0 : r.id,
                cssCode: (S = (y = i.content) == null ? void 0 : y.data) == null ? void 0 : S.cssCode,
                customFonts: (I = (V = i.content) == null ? void 0 : V.data) == null ? void 0 : I.customFonts
              }
            ),
            /* @__PURE__ */ v(
              xe,
              {
                blocks: (u = (w = i.content) == null ? void 0 : w.data) == null ? void 0 : u.blocks,
                context: i,
                registeredComponents: d,
                linkComponent: e.linkComponent
              }
            )
          ]
        }
      )
    }
  );
}
function Ge(e) {
  var i;
  const [t, n] = p(
    () => Ve({
      canTrack: E(e.canTrack),
      content: e.content
    })
  );
  function o() {
    var a;
    return Ee(
      W(e.content).map((r) => ({
        id: r.testVariationId,
        testRatio: r.testRatio
      })),
      ((a = e.content) == null ? void 0 : a.id) || ""
    );
  }
  function d() {
    return W(e.content).map((a) => `.variant-${a.testVariationId} { display: none; } `).join("");
  }
  function h() {
    var a;
    return t ? {
      ...e.content,
      testVariationId: (a = e.content) == null ? void 0 : a.id
    } : ue({
      item: e.content,
      canTrack: E(e.canTrack)
    });
  }
  return R(() => {
  }, []), /* @__PURE__ */ N(L, { children: [
    !e.isNestedRender && J !== "reactNative" ? /* @__PURE__ */ v(
      H,
      {
        id: "builderio-init-variants-fns",
        scriptStr: We()
      }
    ) : null,
    t ? /* @__PURE__ */ N(L, { children: [
      /* @__PURE__ */ v(
        X,
        {
          id: "builderio-variants",
          styles: d()
        }
      ),
      /* @__PURE__ */ v(
        H,
        {
          id: "builderio-variants-visibility",
          scriptStr: o()
        }
      ),
      (i = W(e.content)) == null ? void 0 : i.map((a) => /* @__PURE__ */ v(
        z,
        {
          isNestedRender: e.isNestedRender,
          content: a,
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
        a.testVariationId
      ))
    ] }) : null,
    /* @__PURE__ */ v(
      z,
      {
        isNestedRender: e.isNestedRender,
        content: h(),
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
export {
  Ge as default
};
