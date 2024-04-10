import { jsx as h, jsxs as P, Fragment as U } from "react/jsx-runtime";
import { lazy as te, useRef as ne, useState as y, useEffect as x } from "react";
import { isBrowser as N, TARGET as J, isEditing as W, setupBrowserForEditing as ie, createRegisterComponentMessage as ae, getDefaultCanTrack as R, _track as L, isPreviewing as oe, fetchOneEntry as re, logger as le, createEditorListener as ce, fetch as se, fastClone as de, serializeComponentInfo as O, handleABTestingSync as ue } from "./server-entry-df819e6c.js";
import { Columns as me, Symbol as fe, Text as ge } from "./blocks-exports.mjs";
import { builderContext as he, triggerAnimation as be, evaluate as B, InlinedStyles as Q, ComponentsContext as Se, Blocks as ve } from "./blocks-087843bf.js";
import "./get-class-prop-name-775bd8d0.js";
const xe = {
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
      Array.isArray(n) && n.find((d) => d.get("width")) && (n.find((f) => !f.get("width")) || n.reduce((a, m) => a + m.get("width"), 0) !== 100) && t();
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
}, ye = {
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
}, Ce = te(() => import("./slot-54dad60e.js")), ke = {
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
}, M = () => [{
  component: me,
  ...xe
}, {
  component: Ce,
  ...ye
}, {
  component: fe,
  ...ke
}, {
  component: ge,
  ...Ie
}], pe = `function updateCookiesAndStyles(contentId, variants, isHydrationTarget) {
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
}`, Te = `function updateVariantVisibility(variantContentId, defaultContentId, isHydrationTarget) {
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
}`, X = "builderIoAbTest", G = "builderIoRenderContent", V = (e) => Object.values((e == null ? void 0 : e.variations) || {}).map((t) => ({
  ...t,
  testVariationId: t.id,
  id: e == null ? void 0 : e.id
})), we = ({
  canTrack: e,
  content: t
}) => !(!(V(t).length > 0) || !e || N()), Ee = (e) => e === "react" || e === "reactNative", Z = Ee(J), Ve = () => `
  window.${X} = ${pe}
  window.${G} = ${Te}
  `, Re = (e, t) => `
  window.${X}(
    "${t}",${JSON.stringify(e)}, ${Z}
  )`, Ae = ({
  contentId: e,
  variationId: t
}) => `window.${G}(
    "${t}", "${e}", ${Z}
  )`;
function H(e) {
  return /* @__PURE__ */ h(
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
const We = (e, t, n = !0) => {
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
}, Pe = (e) => We(e, (t) => {
  const n = t.getAttribute("builder-id") || t.id;
  return (n == null ? void 0 : n.indexOf("builder-")) === 0;
}), Y = ({
  event: e,
  target: t
}) => {
  const n = t.getBoundingClientRect(), i = e.clientX - n.left, d = e.clientY - n.top, f = q(i / n.width), s = q(d / n.height);
  return {
    x: f,
    y: s
  };
}, Ne = (e) => {
  const t = e.target, n = t && Pe(t), i = (n == null ? void 0 : n.getAttribute("builder-id")) || (n == null ? void 0 : n.id);
  return {
    targetBuilderElement: i || void 0,
    metadata: {
      targetOffset: t ? Y({
        event: e,
        target: t
      }) : void 0,
      builderTargetOffset: n ? Y({
        event: e,
        target: n
      }) : void 0,
      builderElementIndex: n && i ? [].slice.call(document.getElementsByClassName(i)).indexOf(n) : void 0
    }
  };
};
function He(e) {
  var C, D, $, F, _, j, K;
  const t = ne(null);
  function n(o) {
    var u, l;
    const c = {
      ...e.builderContextSignal.rootState,
      ...o
    };
    e.builderContextSignal.rootSetState ? (l = (u = e.builderContextSignal).rootSetState) == null || l.call(u, c) : e.setBuilderContextSignal((r) => ({
      ...r,
      rootState: c
    }));
  }
  function i(o) {
    var u, l, r, g, p;
    const c = {
      ...e.builderContextSignal.content,
      ...o,
      data: {
        ...(u = e.builderContextSignal.content) == null ? void 0 : u.data,
        ...o == null ? void 0 : o.data
      },
      meta: {
        ...(l = e.builderContextSignal.content) == null ? void 0 : l.meta,
        ...o == null ? void 0 : o.meta,
        breakpoints: ((r = o == null ? void 0 : o.meta) == null ? void 0 : r.breakpoints) || ((p = (g = e.builderContextSignal.content) == null ? void 0 : g.meta) == null ? void 0 : p.breakpoints)
      }
    };
    e.setBuilderContextSignal((v) => ({
      ...v,
      content: c
    }));
  }
  const [d, f] = y(
    () => e.contentWrapper || "div"
  );
  function s(o) {
    return ce({
      model: e.model,
      trustedHosts: e.trustedHosts,
      callbacks: {
        configureSdk: (c) => {
          var r;
          const { breakpoints: u, contentId: l } = c;
          !l || l !== ((r = e.builderContextSignal.content) == null ? void 0 : r.id) || u && i({
            meta: {
              breakpoints: u
            }
          });
        },
        animation: (c) => {
          be(c);
        },
        contentUpdate: (c) => {
          i(c);
        }
      }
    })(o);
  }
  function a() {
    var c, u;
    const o = (u = (c = e.builderContextSignal.content) == null ? void 0 : c.data) == null ? void 0 : u.jsCode;
    o && B({
      code: o,
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
  const [m, k] = y(() => ({})), [I, A] = y(() => ({})), [T, w] = y(() => !1);
  function E(o) {
    var c, u;
    if (e.builderContextSignal.content) {
      const l = (c = e.builderContextSignal.content) == null ? void 0 : c.testVariationId, r = (u = e.builderContextSignal.content) == null ? void 0 : u.id;
      L({
        type: "click",
        canTrack: R(e.canTrack),
        contentId: r,
        apiKey: e.apiKey,
        variationId: l !== r ? l : void 0,
        ...Ne(o),
        unique: !T
      });
    }
    T || w(!0);
  }
  function S() {
    var c, u, l;
    const o = (l = (u = (c = e.builderContextSignal.content) == null ? void 0 : c.data) == null ? void 0 : u.httpRequests) != null ? l : {};
    Object.entries(o).forEach(([r, g]) => {
      if (!g || I[r] || m[r] && !W())
        return;
      I[r] = !0;
      const p = g.replace(
        /{{([^}]+)}}/g,
        (v, ee) => String(
          B({
            code: ee,
            context: e.context || {},
            localState: void 0,
            rootState: e.builderContextSignal.rootState,
            rootSetState: e.builderContextSignal.rootSetState,
            enableCache: !0
          })
        )
      );
      se(p).then((v) => v.json()).then((v) => {
        n({
          [r]: v
        }), m[r] = !0;
      }).catch((v) => {
        console.error("error fetching dynamic data", g, v);
      }).finally(() => {
        I[r] = !1;
      });
    });
  }
  function b() {
    W() && window.dispatchEvent(
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
  return x(() => {
    var o, c;
    if (N()) {
      if (W() && (window.addEventListener("message", s), ie({
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
      ).forEach((l) => {
        var g;
        const r = ae(l);
        (g = window.parent) == null || g.postMessage(r, "*");
      }), window.addEventListener(
        "builder:component:stateChangeListenerActivated",
        b
      )), e.builderContextSignal.content && R(e.canTrack)) {
        const l = (o = e.builderContextSignal.content) == null ? void 0 : o.testVariationId, r = (c = e.builderContextSignal.content) == null ? void 0 : c.id, g = e.apiKey;
        L({
          type: "impression",
          canTrack: !0,
          contentId: r,
          apiKey: g,
          variationId: l !== r ? l : void 0
        });
      }
      if (oe()) {
        const l = new URL(location.href).searchParams, r = l.get("builder.preview"), g = l.get(
          `builder.preview.${r}`
        ), p = l.get("apiKey") || l.get("builder.space");
        r === e.model && p === e.apiKey && (!e.content || g === e.content.id) && re({
          model: e.model,
          apiKey: e.apiKey,
          apiVersion: e.builderContextSignal.apiVersion
        }).then((v) => {
          v && i(v);
        });
      }
    }
  }, []), x(() => {
    e.apiKey || le.error(
      "No API key provided to `RenderContent` component. This can cause issues. Please provide an API key using the `apiKey` prop."
    ), a(), S(), b();
  }, []), x(() => {
    e.content && i(e.content);
  }, [e.content]), x(() => {
    a();
  }, [(D = (C = e.builderContextSignal.content) == null ? void 0 : C.data) == null ? void 0 : D.jsCode]), x(() => {
    S();
  }, [(F = ($ = e.builderContextSignal.content) == null ? void 0 : $.data) == null ? void 0 : F.httpRequests]), x(() => {
    b();
  }, [e.builderContextSignal.rootState]), x(() => {
    e.data && n(e.data);
  }, [e.data]), x(() => {
    e.locale && n({
      locale: e.locale
    });
  }, [e.locale]), x(() => () => {
    N() && (window.removeEventListener("message", s), window.removeEventListener(
      "builder:component:stateChangeListenerActivated",
      b
    ));
  }, []), /* @__PURE__ */ h(he.Provider, { value: e.builderContextSignal, children: e.builderContextSignal.content ? /* @__PURE__ */ h(
    d,
    {
      ref: t,
      onClick: (o) => E(o),
      "builder-content-id": (_ = e.builderContextSignal.content) == null ? void 0 : _.id,
      "builder-model": e.model,
      ...e.showContent ? {} : {
        hidden: !0,
        "aria-hidden": !0
      },
      ...e.contentWrapperProps,
      className: `variant-${((j = e.content) == null ? void 0 : j.testVariationId) || ((K = e.content) == null ? void 0 : K.id)}`,
      children: e.children
    }
  ) : null });
}
const De = (e) => {
  var f, s;
  const t = e.family + (e.kind && !e.kind.includes("#") ? ", " + e.kind : ""), n = t.split(",")[0], i = (s = e.fileUrl) != null ? s : (f = e == null ? void 0 : e.files) == null ? void 0 : f.regular;
  let d = "";
  if (i && t && n && (d += `
@font-face {
font-family: "${t}";
src: local("${n}"), url('${i}') format('woff2');
font-display: fallback;
font-weight: 400;
}
      `.trim()), e.files)
    for (const a in e.files) {
      if (!(String(Number(a)) === a))
        continue;
      const k = e.files[a];
      k && k !== i && (d += `
@font-face {
font-family: "${t}";
src: url('${k}') format('woff2');
font-display: fallback;
font-weight: ${a};
}
        `.trim());
    }
  return d;
}, $e = ({
  customFonts: e
}) => {
  var t;
  return ((t = e == null ? void 0 : e.map((n) => De(n))) == null ? void 0 : t.join(" ")) || "";
}, Fe = ({
  cssCode: e,
  contentId: t
}) => e ? t ? (e == null ? void 0 : e.replace(/&/g, `div[builder-content-id="${t}"]`)) || "" : e : "", _e = `
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
`, je = (e) => e ? "" : _e;
function Ke(e) {
  const [t, n] = y(
    () => `
${Fe({
      cssCode: e.cssCode,
      contentId: e.contentId
    })}
${$e({
      customFonts: e.customFonts
    })}
${je(e.isNestedRender)}
`.trim()
  );
  return /* @__PURE__ */ h(Q, { id: "builderio-content", styles: t });
}
const Ue = ({
  content: e,
  data: t,
  locale: n
}) => {
  var f, s, a;
  const i = {}, d = ((f = e == null ? void 0 : e.data) == null ? void 0 : f.state) || {};
  return (a = (s = e == null ? void 0 : e.data) == null ? void 0 : s.inputs) == null || a.forEach((m) => {
    m.name && m.defaultValue !== void 0 && (i[m.name] = m.defaultValue);
  }), {
    ...i,
    ...d,
    ...t,
    ...n ? {
      locale: n
    } : {}
  };
}, Le = ({
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
  var m, k, I, A, T, w, E;
  const [t, n] = y(
    () => {
      var S, b;
      return Ae({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        variationId: (S = e.content) == null ? void 0 : S.testVariationId,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        contentId: (b = e.content) == null ? void 0 : b.id
      });
    }
  );
  function i(S) {
    a((b) => ({
      ...b,
      rootState: S
    }));
  }
  const [d, f] = y(
    () => [
      ...M(),
      ...e.customComponents || []
    ].reduce(
      (S, { component: b, ...C }) => ({
        ...S,
        [C.name]: {
          component: b,
          ...O(C)
        }
      }),
      {}
    )
  ), [s, a] = y(() => ({
    content: Le({
      content: e.content,
      data: e.data
    }),
    localState: void 0,
    rootState: Ue({
      content: e.content,
      data: e.data,
      locale: e.locale
    }),
    rootSetState: i,
    context: e.context || {},
    apiKey: e.apiKey,
    apiVersion: e.apiVersion,
    componentInfos: [
      ...M(),
      ...e.customComponents || []
    ].reduce(
      (S, { component: b, ...C }) => ({
        ...S,
        [C.name]: O(C)
      }),
      {}
    ),
    inheritedStyles: {},
    BlocksWrapper: e.blocksWrapper || "div",
    BlocksWrapperProps: e.blocksWrapperProps || {}
  }));
  return /* @__PURE__ */ h(
    Se.Provider,
    {
      value: {
        registeredComponents: d
      },
      children: /* @__PURE__ */ P(
        He,
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
          builderContextSignal: s,
          contentWrapper: e.contentWrapper,
          contentWrapperProps: e.contentWrapperProps,
          linkComponent: e.linkComponent,
          trustedHosts: e.trustedHosts,
          setBuilderContextSignal: a,
          children: [
            e.isSsrAbTest ? /* @__PURE__ */ h(
              H,
              {
                id: "builderio-variant-visibility",
                scriptStr: t
              }
            ) : null,
            /* @__PURE__ */ h(
              Ke,
              {
                isNestedRender: e.isNestedRender,
                contentId: (m = s.content) == null ? void 0 : m.id,
                cssCode: (I = (k = s.content) == null ? void 0 : k.data) == null ? void 0 : I.cssCode,
                customFonts: (T = (A = s.content) == null ? void 0 : A.data) == null ? void 0 : T.customFonts
              }
            ),
            /* @__PURE__ */ h(
              ve,
              {
                blocks: (E = (w = s.content) == null ? void 0 : w.data) == null ? void 0 : E.blocks,
                context: s,
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
function Je(e) {
  var s;
  const [t, n] = y(
    () => we({
      canTrack: R(e.canTrack),
      content: e.content
    })
  );
  function i() {
    var a;
    return Re(
      V(e.content).map((m) => ({
        id: m.testVariationId,
        testRatio: m.testRatio
      })),
      ((a = e.content) == null ? void 0 : a.id) || ""
    );
  }
  function d() {
    return V(e.content).map((a) => `.variant-${a.testVariationId} { display: none; } `).join("");
  }
  function f() {
    var a;
    return t ? {
      ...e.content,
      testVariationId: (a = e.content) == null ? void 0 : a.id
    } : ue({
      item: e.content,
      canTrack: R(e.canTrack)
    });
  }
  return x(() => {
  }, []), /* @__PURE__ */ P(U, { children: [
    !e.isNestedRender && J !== "reactNative" ? /* @__PURE__ */ h(
      H,
      {
        id: "builderio-init-variants-fns",
        scriptStr: Ve()
      }
    ) : null,
    t ? /* @__PURE__ */ P(U, { children: [
      /* @__PURE__ */ h(
        Q,
        {
          id: "builderio-variants",
          styles: d()
        }
      ),
      /* @__PURE__ */ h(
        H,
        {
          id: "builderio-variants-visibility",
          scriptStr: i()
        }
      ),
      (s = V(e.content)) == null ? void 0 : s.map((a) => /* @__PURE__ */ h(
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
    /* @__PURE__ */ h(
      z,
      {
        isNestedRender: e.isNestedRender,
        content: f(),
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
  Je as default
};
