import { jsxs as s, jsx as t } from "react/jsx-runtime";
function f(e) {
  var i, l, n, o, d, u, a;
  function c() {
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
  function r() {
    return {
      ...c()
    };
  }
  return /* @__PURE__ */ s(
    "div",
    {
      style: {
        position: "relative"
      },
      children: [
        /* @__PURE__ */ t(
          "video",
          {
            className: "builder-video",
            ...r(),
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
            children: e.lazyLoad ? null : /* @__PURE__ */ t("source", { type: "video/mp4", src: e.video })
          }
        ),
        e.aspectRatio && !(e.fitContent && ((n = (l = e.builderBlock) == null ? void 0 : l.children) != null && n.length)) ? /* @__PURE__ */ t(
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
        (d = (o = e.builderBlock) == null ? void 0 : o.children) != null && d.length && e.fitContent ? /* @__PURE__ */ t(
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
        (a = (u = e.builderBlock) == null ? void 0 : u.children) != null && a.length && !e.fitContent ? /* @__PURE__ */ t(
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
export {
  f as default
};
