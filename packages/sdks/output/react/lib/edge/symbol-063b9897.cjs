"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const u=require("react/jsx-runtime"),o=require("react"),b=require("./blocks-exports.cjs"),f=require("./get-class-prop-name-09ef31b8.cjs"),s=require("./server-entry-334bd314.cjs"),v=async({builderContextValue:e,symbol:t})=>{if(t!=null&&t.model&&(e!=null&&e.apiKey))return s.fetchOneEntry({model:t.model,apiKey:e.apiKey,apiVersion:e.apiVersion,...(t==null?void 0:t.entry)&&{query:{id:t.entry}}}).catch(i=>{s.logger.error("Could not fetch symbol content: ",i)})};function C(e){var r,c,a,d;function t(){var n,l;return[e.attributes[f.getClassPropName()],"builder-symbol",(n=e.symbol)!=null&&n.inline?"builder-inline-symbol":void 0,(l=e.symbol)!=null&&l.dynamic||e.dynamic?"builder-dynamic-symbol":void 0].filter(Boolean).join(" ")}const[i,m]=o.useState(()=>{var n;return(n=e.symbol)==null?void 0:n.content});function y(){i||v({symbol:e.symbol,builderContextValue:e.builderContext}).then(n=>{n&&m(n)})}return o.useEffect(()=>{},[]),o.useEffect(()=>{y()},[e.symbol]),u.jsx("div",{...e.attributes,className:t(),children:u.jsx(b.Content,{isNestedRender:!0,apiVersion:e.builderContext.apiVersion,apiKey:e.builderContext.apiKey,context:{...e.builderContext.context,symbolId:(r=e.builderBlock)==null?void 0:r.id},customComponents:Object.values(e.builderComponents),data:{...(c=e.symbol)==null?void 0:c.data,...e.builderContext.localState,...(a=i==null?void 0:i.data)==null?void 0:a.state},model:(d=e.symbol)==null?void 0:d.model,content:i,linkComponent:e.builderLinkComponent,blocksWrapper:"div",contentWrapper:"div"})})}exports.default=C;
