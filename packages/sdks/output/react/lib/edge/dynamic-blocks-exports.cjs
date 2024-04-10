"use client";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  Blocks: () => Blocks,
  Columns: () => Columns,
  Content: () => Content,
  Symbol: () => Symbol2,
  Text: () => Text
});
module.exports = __toCommonJS(stdin_exports);
var import_react = __toESM(require("react"));
var BrowserSdk = __toESM(require("../browser/index.cjs"));
var import_blocks_exports = require("./blocks-exports.cjs");
function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}
const Columns = import_blocks_exports.Columns;
const Symbol2 = import_blocks_exports.Symbol;
const Text = import_blocks_exports.Text;
const Blocks = (props) => isBrowser() ? /* @__PURE__ */ import_react.default.createElement(BrowserSdk.Blocks, { ...props }) : /* @__PURE__ */ import_react.default.createElement(import_blocks_exports.Blocks, { ...props });
const Content = (props) => isBrowser() ? /* @__PURE__ */ import_react.default.createElement(BrowserSdk.Content, { ...props }) : /* @__PURE__ */ import_react.default.createElement(import_blocks_exports.Content, { ...props });
