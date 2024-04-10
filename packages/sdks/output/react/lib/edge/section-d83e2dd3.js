import { jsx as e } from "react/jsx-runtime";
function n(t) {
  return /* @__PURE__ */ e(
    "section",
    {
      ...t.attributes,
      style: {
        width: "100%",
        alignSelf: "stretch",
        flexGrow: 1,
        boxSizing: "border-box",
        maxWidth: t.maxWidth || 1200,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        marginLeft: "auto",
        marginRight: "auto"
      },
      children: t.children
    }
  );
}
export {
  n as default
};
