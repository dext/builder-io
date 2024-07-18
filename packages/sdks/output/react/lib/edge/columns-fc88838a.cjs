"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const i=require("react/jsx-runtime"),v=require("react"),o=require("./blocks-e88095bc.cjs"),w=require("./get-class-prop-name-e451848c.cjs");require("./server-entry-98f92c10.cjs");function $(e){var k;function c(){return typeof e.space=="number"?e.space||0:20}function a(){return e.columns||[]}function u(){return e.stackColumnsAt||"tablet"}function h(t){var l;const n=a();return((l=n[t])==null?void 0:l.width)||100/n.length}function y(t){const n=a(),l=c()*(n.length-1)/n.length;return`calc(${h(t)}% - ${l}px)`}function s({stackedStyle:t,desktopStyle:n}){return u()==="tablet"?t:n}function m({stackedStyle:t,desktopStyle:n}){return u()==="never"?n:t}const[d,j]=v.useState(()=>e.stackColumnsAt==="never"?"row":e.reverseColumnsWhenStacked?"column-reverse":"column");function S(){return{"--flex-dir":d,"--flex-dir-tablet":s({stackedStyle:d,desktopStyle:"row"})}}function x(t){const n=t===0?0:c(),l=y(t),r=`${n}px`,f="100%",g=0;return{...{display:"flex",flexDirection:"column",alignItems:"stretch"},width:l,["marginLeft"]:r,"--column-width-mobile":m({stackedStyle:f,desktopStyle:l}),"--column-margin-left-mobile":m({stackedStyle:g,desktopStyle:r}),"--column-width-tablet":s({stackedStyle:f,desktopStyle:l}),"--column-margin-left-tablet":s({stackedStyle:g,desktopStyle:r})}}function b(t){var l,r;return o.getSizesForBreakpoints(((r=(l=e.builderContext.content)==null?void 0:l.meta)==null?void 0:r.breakpoints)||{})[t].max}function C(){return`
        @media (max-width: ${b("medium")}px) {
          .${e.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir-tablet);
            align-items: stretch;
          }

          .${e.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-tablet) !important;
            margin-left: var(--column-margin-left-tablet) !important;
          }
        }

        @media (max-width: ${b("small")}px) {
          .${e.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir);
            align-items: stretch;
          }

          .${e.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-mobile) !important;
            margin-left: var(--column-margin-left-mobile) !important;
          }
        },
      `}return i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:`builder-columns ${e.builderBlock.id}-breakpoints div-a6ce8b7c`,style:S(),children:[i.jsx(o.InlinedStyles,{id:"builderio-columns",styles:C()}),(k=e.columns)==null?void 0:k.map((t,n)=>i.jsx(o.DynamicRenderer,{TagName:t.link?e.builderLinkComponent||"a":"div",actionAttributes:{},attributes:{...t.link?{href:t.link}:{},[w.getClassPropName()]:"builder-column",style:o.mapStyleObjToStrIfNeeded(x(n))},children:i.jsx(o.Blocks,{path:`component.options.columns.${n}.blocks`,parent:e.builderBlock.id,styleProp:{flexGrow:"1"},context:e.builderContext,registeredComponents:e.builderComponents,linkComponent:e.builderLinkComponent,blocks:t.blocks})},n))]}),i.jsx("style",{children:`.div-a6ce8b7c {
  display: flex;
  line-height: normal;
}`})]})}exports.default=$;
