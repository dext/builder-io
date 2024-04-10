import { jsx as p } from "react/jsx-runtime";
import { useRef as d, useState as a, useEffect as l } from "react";
function h(s) {
  const n = d(null), [c, m] = a(() => []), [i, f] = a(() => []);
  return l(() => {
    var u;
    if (!((u = n.current) != null && u.getElementsByTagName) || typeof window == "undefined")
      return;
    const o = n.current.getElementsByTagName("script");
    for (let r = 0; r < o.length; r++) {
      const e = o[r];
      if (e.src) {
        if (c.includes(e.src))
          continue;
        c.push(e.src);
        const t = document.createElement("script");
        t.async = !0, t.src = e.src, document.head.appendChild(t);
      } else if (!e.type || [
        "text/javascript",
        "application/javascript",
        "application/ecmascript"
      ].includes(e.type)) {
        if (i.includes(e.innerText))
          continue;
        try {
          i.push(e.innerText), new Function(e.innerText)();
        } catch (t) {
          console.warn("`CustomCode`: Error running script:", t);
        }
      }
    }
  }, []), /* @__PURE__ */ p(
    "div",
    {
      ref: n,
      className: "builder-custom-code" + (s.replaceNodes ? " replace-nodes" : ""),
      dangerouslySetInnerHTML: { __html: s.code }
    }
  );
}
export {
  h as default
};
