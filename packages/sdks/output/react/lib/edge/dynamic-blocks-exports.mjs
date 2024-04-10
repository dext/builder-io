"use client";
import React from "react";
function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}
import * as BrowserSdk from "../browser/index.mjs";
import {
  Columns as EdgeSdkColumns,
  Symbol as EdgeSdkSymbol,
  Text as EdgeSdkText,
  Blocks as EdgeSdkBlocks,
  Content as EdgeSdkContent
} from "./blocks-exports.mjs";
const Columns = EdgeSdkColumns;
const Symbol = EdgeSdkSymbol;
const Text = EdgeSdkText;
const Blocks = (props) => isBrowser() ? /* @__PURE__ */ React.createElement(BrowserSdk.Blocks, { ...props }) : /* @__PURE__ */ React.createElement(EdgeSdkBlocks, { ...props });
const Content = (props) => isBrowser() ? /* @__PURE__ */ React.createElement(BrowserSdk.Content, { ...props }) : /* @__PURE__ */ React.createElement(EdgeSdkContent, { ...props });
export {
  Blocks,
  Columns,
  Content,
  Symbol,
  Text
};
