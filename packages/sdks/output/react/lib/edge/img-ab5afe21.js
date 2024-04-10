import { jsx as i } from "react/jsx-runtime";
import { isEditing as e } from "./server-entry-df819e6c.js";
function c(t) {
  return /* @__PURE__ */ i(
    "img",
    {
      style: {
        objectFit: t.backgroundSize || "cover",
        objectPosition: t.backgroundPosition || "center"
      },
      alt: t.altText,
      src: t.imgSrc || t.image,
      ...t.attributes
    },
    e() && t.imgSrc || "default-key"
  );
}
export {
  c as default
};
