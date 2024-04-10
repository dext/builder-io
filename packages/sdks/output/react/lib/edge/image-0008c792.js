import { jsxs as d, Fragment as m, jsx as o } from "react/jsx-runtime";
function g(e) {
  return e.replace(/http(s)?:/, "");
}
function b(e = "", i, t) {
  const n = new RegExp("([?&])" + i + "=.*?(&|$)", "i"), c = e.indexOf("?") !== -1 ? "&" : "?";
  return e.match(n) ? e.replace(n, "$1" + i + "=" + encodeURIComponent(t) + "$2") : e + c + i + "=" + encodeURIComponent(t);
}
function x(e, i) {
  if (!e || !(e != null && e.match(/cdn\.shopify\.com/)) || !i)
    return e;
  if (i === "master")
    return g(e);
  const t = e.match(/(_\d+x(\d+)?)?(\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?)/i);
  if (t) {
    const n = e.split(t[0]), c = t[3], r = i.match("x") ? i : `${i}x`;
    return g(`${n[0]}_${r}${c}`);
  }
  return null;
}
function s(e) {
  if (!e)
    return e;
  const i = [100, 200, 400, 800, 1200, 1600, 2e3];
  if (e.match(/builder\.io/)) {
    let t = e;
    const n = Number(e.split("?width=")[1]);
    return isNaN(n) || (t = `${t} ${n}w`), i.filter((c) => c !== n).map((c) => `${b(e, "width", c)} ${c}w`).concat([t]).join(", ");
  }
  return e.match(/cdn\.shopify\.com/) ? i.map((t) => [x(e, `${t}x${t}`), t]).filter(([t]) => !!t).map(([t, n]) => `${t} ${n}w`).concat([e]).join(", ") : e;
}
function v(e) {
  var c, r, u, f;
  function i() {
    var h;
    const a = e.image || e.src;
    if (!a || // We can auto add srcset for cdn.builder.io and shopify
    // images, otherwise you can supply this prop manually
    !(a.match(/builder\.io/) || a.match(/cdn\.shopify\.com/)))
      return e.srcset;
    if (e.srcset && ((h = e.image) != null && h.includes("builder.io/api/v1/image"))) {
      if (!e.srcset.includes(e.image.split("?")[0]))
        return console.debug("Removed given srcset"), s(a);
    } else if (e.image && !e.srcset)
      return s(a);
    return s(a);
  }
  function t() {
    var l;
    return (l = i == null ? void 0 : i()) != null && l.match(/builder\.io/) && !e.noWebp ? i().replace(/\?/g, "?format=webp&") : "";
  }
  function n() {
    const l = {
      position: "absolute",
      height: "100%",
      width: "100%",
      left: "0px",
      top: "0px"
    };
    return e.aspectRatio ? l : void 0;
  }
  return /* @__PURE__ */ d(m, { children: [
    /* @__PURE__ */ d(m, { children: [
      /* @__PURE__ */ d("picture", { children: [
        t() ? /* @__PURE__ */ o("source", { type: "image/webp", srcSet: t() }) : null,
        /* @__PURE__ */ o(
          "img",
          {
            loading: "lazy",
            alt: e.altText,
            role: e.altText ? void 0 : "presentation",
            style: {
              objectPosition: e.backgroundPosition || "center",
              objectFit: e.backgroundSize || "cover",
              ...n()
            },
            className: "builder-image" + (e.className ? " " + e.className : "") + " img-a0c95e8c",
            src: e.image,
            srcSet: i(),
            sizes: e.sizes
          }
        )
      ] }),
      e.aspectRatio && !((r = (c = e.builderBlock) == null ? void 0 : c.children) != null && r.length && e.fitContent) ? /* @__PURE__ */ o(
        "div",
        {
          className: "builder-image-sizer div-a0c95e8c",
          style: {
            paddingTop: e.aspectRatio * 100 + "%"
          }
        }
      ) : null,
      (f = (u = e.builderBlock) == null ? void 0 : u.children) != null && f.length && e.fitContent ? /* @__PURE__ */ o(m, { children: e.children }) : null,
      !e.fitContent && e.children ? /* @__PURE__ */ o("div", { className: "div-a0c95e8c-2", children: e.children }) : null
    ] }),
    /* @__PURE__ */ o("style", { children: `.img-a0c95e8c {
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
export {
  v as default
};
