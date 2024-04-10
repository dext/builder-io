import { jsx as d } from "react/jsx-runtime";
import { useRef as m, useState as c, useEffect as f } from "react";
const E = ["text/javascript", "application/javascript", "application/ecmascript"], S = (r) => E.includes(r.type);
function x(r) {
  const t = m(null), [i, T] = c(() => []), [u, g] = c(() => []), [a, p] = c(() => !1);
  function l() {
    if (!t.current || !t.current.getElementsByTagName)
      return;
    const o = t.current.getElementsByTagName("script");
    for (let s = 0; s < o.length; s++) {
      const e = o[s];
      if (e.src && !i.includes(e.src)) {
        i.push(e.src);
        const n = document.createElement("script");
        n.async = !0, n.src = e.src, document.head.appendChild(n);
      } else if (S(e) && !u.includes(e.innerText))
        try {
          u.push(e.innerText), new Function(e.innerText)();
        } catch (n) {
          console.warn("`Embed`: Error running script:", n);
        }
    }
  }
  return f(() => {
    t.current && !a && (p(!0), l());
  }, [t.current, a]), /* @__PURE__ */ d(
    "div",
    {
      className: "builder-embed",
      ref: t,
      dangerouslySetInnerHTML: { __html: r.content }
    }
  );
}
export {
  x as default
};
