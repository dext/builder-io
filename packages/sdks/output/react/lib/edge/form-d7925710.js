import { jsxs as N, Fragment as w, jsx as u } from "react/jsx-runtime";
import { useRef as J, useState as y } from "react";
import { Block as O, Blocks as S, set as U } from "./blocks-83caba33.js";
import { isEditing as j } from "./server-entry-df819e6c.js";
import "./get-class-prop-name-775bd8d0.js";
const R = ["production", "qa", "test", "development", "dev", "cdn-qa", "cloud", "fast", "cdn2", "cdn-prod"], $ = () => {
  const e = process.env.NODE_ENV || "production";
  return R.includes(e) ? e : "production";
}, L = (e, i, v) => {
  const s = String.prototype.split.call(i, /[,[\].]+?/).filter(Boolean).reduce((a, f) => a != null ? a[f] : a, e);
  return s === void 0 || s === e ? v : s;
};
function V(e) {
  var E, x;
  const i = J(null), [v, s] = y(() => "unsubmitted"), [a, f] = y(() => null), [q, F] = y(() => "");
  function D(o) {
    var m, h;
    const c = {
      ...e.builderContext.rootState,
      ...o
    };
    e.builderContext.rootSetState ? (h = (m = e.builderContext).rootSetState) == null || h.call(m, c) : e.builderContext.rootState = c;
  }
  function b() {
    return j() && e.previewState || v;
  }
  function P(o) {
    var m;
    const c = e.sendWithJs || e.sendSubmissionsTo === "email";
    if (e.sendSubmissionsTo === "zapier")
      o.preventDefault();
    else if (c) {
      if (!(e.action || e.sendSubmissionsTo === "email")) {
        o.preventDefault();
        return;
      }
      o.preventDefault();
      const h = o.currentTarget, C = e.customHeaders || {};
      let g;
      const A = new FormData(h), k = Array.from(
        o.currentTarget.querySelectorAll("input,select,textarea")
      ).filter((t) => !!t.name).map((t) => {
        let n;
        const l = t.name;
        if (t instanceof HTMLInputElement)
          if (t.type === "radio") {
            if (t.checked)
              return n = t.name, {
                key: l,
                value: n
              };
          } else if (t.type === "checkbox")
            n = t.checked;
          else if (t.type === "number" || t.type === "range") {
            const r = t.valueAsNumber;
            isNaN(r) || (n = r);
          } else
            t.type === "file" ? n = t.files : n = t.value;
        else
          n = t.value;
        return {
          key: l,
          value: n
        };
      });
      let d = e.contentType;
      if (e.sendSubmissionsTo === "email" && (d = "multipart/form-data"), Array.from(k).forEach(({ value: t }) => {
        (t instanceof File || Array.isArray(t) && t[0] instanceof File || t instanceof FileList) && (d = "multipart/form-data");
      }), d !== "application/json")
        g = A;
      else {
        const t = {};
        Array.from(k).forEach(({ value: n, key: l }) => {
          U(t, l, n);
        }), g = JSON.stringify(t);
      }
      d && d !== "multipart/form-data" && (c && ((m = e.action) != null && m.includes("zapier.com")) || (C["content-type"] = d));
      const M = new CustomEvent("presubmit", { detail: { body: g } });
      if (i.current && (i.current.dispatchEvent(M), M.defaultPrevented))
        return;
      s("sending");
      const B = `${$() === "dev" ? "http://localhost:5000" : "https://builder.io"}/api/v1/form-submit?apiKey=${e.builderContext.apiKey}&to=${btoa(
        e.sendSubmissionsToEmail || ""
      )}&name=${encodeURIComponent(e.name || "")}`;
      fetch(
        e.sendSubmissionsTo === "email" ? B : e.action,
        { body: g, headers: C, method: e.method || "post" }
      ).then(
        async (t) => {
          let n;
          const l = t.headers.get("content-type");
          if (l && l.indexOf("application/json") !== -1 ? n = await t.json() : n = await t.text(), !t.ok && e.errorMessagePath) {
            let r = L(n, e.errorMessagePath);
            r && (typeof r != "string" && (r = JSON.stringify(r)), F(r), D({ formErrorMessage: r }));
          }
          if (f(n), s(t.ok ? "success" : "error"), t.ok) {
            const r = new CustomEvent("submit:success", {
              detail: { res: t, body: n }
            });
            if (i.current) {
              if (i.current.dispatchEvent(r), r.defaultPrevented)
                return;
              e.resetFormOnSubmit !== !1 && i.current.reset();
            }
            if (e.successUrl)
              if (i.current) {
                const T = new CustomEvent("route", {
                  detail: { url: e.successUrl }
                });
                i.current.dispatchEvent(T), T.defaultPrevented || (location.href = e.successUrl);
              } else
                location.href = e.successUrl;
          }
        },
        (t) => {
          const n = new CustomEvent("submit:error", {
            detail: { error: t }
          });
          i.current && (i.current.dispatchEvent(n), n.defaultPrevented) || (f(t), s("error"));
        }
      );
    }
  }
  return /* @__PURE__ */ N(w, { children: [
    " ",
    /* @__PURE__ */ N(
      "form",
      {
        validate: e.validate,
        ref: i,
        action: !e.sendWithJs && e.action,
        method: e.method,
        name: e.name,
        onSubmit: (o) => P(o),
        ...e.attributes,
        children: [
          e.builderBlock && e.builderBlock.children ? /* @__PURE__ */ u(w, { children: (x = (E = e.builderBlock) == null ? void 0 : E.children) == null ? void 0 : x.map((o, c) => /* @__PURE__ */ u(
            O,
            {
              block: o,
              context: e.builderContext,
              registeredComponents: e.builderComponents,
              linkComponent: e.builderLinkComponent
            },
            `form-block-${c}`
          )) }) : null,
          b() === "error" ? /* @__PURE__ */ u(
            S,
            {
              path: "errorMessage",
              blocks: e.errorMessage,
              context: e.builderContext
            }
          ) : null,
          b() === "sending" ? /* @__PURE__ */ u(
            S,
            {
              path: "sendingMessage",
              blocks: e.sendingMessage,
              context: e.builderContext
            }
          ) : null,
          b() === "error" && a ? /* @__PURE__ */ u("pre", { className: "builder-form-error-text pre-31bf8a14", children: JSON.stringify(a, null, 2) }) : null,
          b() === "success" ? /* @__PURE__ */ u(
            S,
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
    /* @__PURE__ */ u("style", { children: ".pre-31bf8a14 {   padding: 10px;   color: red;   text-align: center; }" }),
    " "
  ] });
}
export {
  V as default
};
