"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const d=require("react/jsx-runtime"),r=require("react"),m=["text/javascript","application/javascript","application/ecmascript"],f=s=>m.includes(s.type);function S(s){const t=r.useRef(null),[i,g]=r.useState(()=>[]),[u,E]=r.useState(()=>[]),[a,l]=r.useState(()=>!1);function p(){if(!t.current||!t.current.getElementsByTagName)return;const o=t.current.getElementsByTagName("script");for(let c=0;c<o.length;c++){const e=o[c];if(e.src&&!i.includes(e.src)){i.push(e.src);const n=document.createElement("script");n.async=!0,n.src=e.src,document.head.appendChild(n)}else if(f(e)&&!u.includes(e.innerText))try{u.push(e.innerText),new Function(e.innerText)()}catch(n){console.warn("`Embed`: Error running script:",n)}}}return r.useEffect(()=>{t.current&&!a&&(l(!0),p())},[t.current,a]),d.jsx("div",{className:"builder-embed",ref:t,dangerouslySetInnerHTML:{__html:s.content}})}exports.default=S;
