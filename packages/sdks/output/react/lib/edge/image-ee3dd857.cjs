"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const c=require("react/jsx-runtime");function f(e){return e.replace(/http(s)?:/,"")}function g(e="",i,t){const n=new RegExp("([?&])"+i+"=.*?(&|$)","i"),a=e.indexOf("?")!==-1?"&":"?";return e.match(n)?e.replace(n,"$1"+i+"="+encodeURIComponent(t)+"$2"):e+a+i+"="+encodeURIComponent(t)}function h(e,i){if(!e||!(e!=null&&e.match(/cdn\.shopify\.com/))||!i)return e;if(i==="master")return f(e);const t=e.match(/(_\d+x(\d+)?)?(\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?)/i);if(t){const n=e.split(t[0]),a=t[3],r=i.match("x")?i:`${i}x`;return f(`${n[0]}_${r}${a}`)}return null}function s(e){if(!e)return e;const i=[100,200,400,800,1200,1600,2e3];if(e.match(/builder\.io/)){let t=e;const n=Number(e.split("?width=")[1]);return isNaN(n)||(t=`${t} ${n}w`),i.filter(a=>a!==n).map(a=>`${g(e,"width",a)} ${a}w`).concat([t]).join(", ")}return e.match(/cdn\.shopify\.com/)?i.map(t=>[h(e,`${t}x${t}`),t]).filter(([t])=>!!t).map(([t,n])=>`${t} ${n}w`).concat([e]).join(", "):e}function b(e){var a,r,d,m;function i(){var u;const o=e.image||e.src;if(!o||!(o.match(/builder\.io/)||o.match(/cdn\.shopify\.com/)))return e.srcset;if(e.srcset&&((u=e.image)!=null&&u.includes("builder.io/api/v1/image"))){if(!e.srcset.includes(e.image.split("?")[0]))return console.debug("Removed given srcset"),s(o)}else if(e.image&&!e.srcset)return s(o);return s(o)}function t(){var l;return(l=i==null?void 0:i())!=null&&l.match(/builder\.io/)&&!e.noWebp?i().replace(/\?/g,"?format=webp&"):""}function n(){const l={position:"absolute",height:"100%",width:"100%",left:"0px",top:"0px"};return e.aspectRatio?l:void 0}return c.jsxs(c.Fragment,{children:[c.jsxs(c.Fragment,{children:[c.jsxs("picture",{children:[t()?c.jsx("source",{type:"image/webp",srcSet:t()}):null,c.jsx("img",{loading:"lazy",alt:e.altText,role:e.altText?void 0:"presentation",style:{objectPosition:e.backgroundPosition||"center",objectFit:e.backgroundSize||"cover",...n()},className:"builder-image"+(e.className?" "+e.className:"")+" img-a0c95e8c",src:e.image,srcSet:i(),sizes:e.sizes})]}),e.aspectRatio&&!((r=(a=e.builderBlock)==null?void 0:a.children)!=null&&r.length&&e.fitContent)?c.jsx("div",{className:"builder-image-sizer div-a0c95e8c",style:{paddingTop:e.aspectRatio*100+"%"}}):null,(m=(d=e.builderBlock)==null?void 0:d.children)!=null&&m.length&&e.fitContent?c.jsx(c.Fragment,{children:e.children}):null,!e.fitContent&&e.children?c.jsx("div",{className:"div-a0c95e8c-2",children:e.children}):null]}),c.jsx("style",{children:`.img-a0c95e8c {
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}.div-a0c95e8c {
  width: 100%;
  pointer-events: none;
  font-size: 0;
}.div-a0c95e8c-2 {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}`})]})}exports.default=b;
