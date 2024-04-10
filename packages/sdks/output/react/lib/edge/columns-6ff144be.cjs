"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const i=require("react/jsx-runtime"),a=require("react"),o=require("./blocks-cd47869c.cjs"),w=require("./get-class-prop-name-09ef31b8.cjs");require("./server-entry-334bd314.cjs");function $(e){var f;const[c,j]=a.useState(()=>typeof e.space=="number"?e.space||0:20);function u(){return e.columns||[]}const[m,p]=a.useState(()=>e.stackColumnsAt||"tablet");function S(t){var l;const n=u();return((l=n[t])==null?void 0:l.width)||100/n.length}function y(t){const n=u(),l=c*(n.length-1)/n.length;return`calc(${S(t)}% - ${l}px)`}function s({stackedStyle:t,desktopStyle:n}){return m==="tablet"?t:n}function d({stackedStyle:t,desktopStyle:n}){return m==="never"?n:t}const[b,B]=a.useState(()=>e.stackColumnsAt==="never"?"row":e.reverseColumnsWhenStacked?"column-reverse":"column");function x(){return{"--flex-dir":b,"--flex-dir-tablet":s({stackedStyle:b,desktopStyle:"row"})}}function C(t){const n=t===0?0:c,l=y(t),r=`${n}px`,g="100%",h=0;return{...{display:"flex",flexDirection:"column",alignItems:"stretch"},width:l,["marginLeft"]:r,"--column-width-mobile":d({stackedStyle:g,desktopStyle:l}),"--column-margin-left-mobile":d({stackedStyle:h,desktopStyle:r}),"--column-width-tablet":s({stackedStyle:g,desktopStyle:l}),"--column-margin-left-tablet":s({stackedStyle:h,desktopStyle:r})}}function k(t){var l,r;return o.getSizesForBreakpoints(((r=(l=e.builderContext.content)==null?void 0:l.meta)==null?void 0:r.breakpoints)||{})[t].max}function v(){return`
        @media (max-width: ${k("medium")}px) {
          .${e.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir-tablet);
            align-items: stretch;
          }

          .${e.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-tablet) !important;
            margin-left: var(--column-margin-left-tablet) !important;
          }
        }

        @media (max-width: ${k("small")}px) {
          .${e.builderBlock.id}-breakpoints {
            flex-direction: var(--flex-dir);
            align-items: stretch;
          }

          .${e.builderBlock.id}-breakpoints > .builder-column {
            width: var(--column-width-mobile) !important;
            margin-left: var(--column-margin-left-mobile) !important;
          }
        },
      `}return i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:`builder-columns ${e.builderBlock.id}-breakpoints div-452958ba`,style:x(),children:[i.jsx(o.InlinedStyles,{id:"builderio-columns",styles:v()}),(f=e.columns)==null?void 0:f.map((t,n)=>i.jsx(o.DynamicRenderer,{TagName:t.link?e.builderLinkComponent||"a":"div",actionAttributes:{},attributes:{...t.link?{href:t.link}:{},[w.getClassPropName()]:"builder-column",style:o.mapStyleObjToStrIfNeeded(C(n))},children:i.jsx(o.Blocks,{path:`component.options.columns.${n}.blocks`,parent:e.builderBlock.id,styleProp:{flexGrow:"1"},context:e.builderContext,registeredComponents:e.builderComponents,linkComponent:e.builderLinkComponent,blocks:t.blocks})},n))]}),i.jsx("style",{children:`.div-452958ba {
  display: flex;
  line-height: normal;
}`})]})}exports.default=$;
