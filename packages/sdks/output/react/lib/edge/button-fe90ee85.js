import { jsx as i } from "react/jsx-runtime";
import { DynamicRenderer as n } from "./blocks-83caba33.js";
import { getClassPropName as e } from "./get-class-prop-name-775bd8d0.js";
import "react";
import "./server-entry-df819e6c.js";
function m(t) {
  return /* @__PURE__ */ i(
    n,
    {
      attributes: {
        ...t.attributes,
        [e()]: `${t.link ? "" : "builder-button"} ${t.attributes[e()] || ""}`,
        ...t.link ? {
          href: t.link,
          target: t.openLinkInNewTab ? "_blank" : void 0,
          role: "link"
        } : {
          role: "button"
        }
      },
      TagName: t.link ? t.builderLinkComponent || "a" : "button",
      actionAttributes: {},
      children: t.text
    }
  );
}
export {
  m as default
};
