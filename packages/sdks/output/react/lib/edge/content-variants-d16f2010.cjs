"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const g=require("react/jsx-runtime"),u=require("react"),l=require("./server-entry-334bd314.cjs"),W=require("./blocks-exports.cjs"),k=require("./blocks-cd47869c.cjs");require("./get-class-prop-name-09ef31b8.cjs");const z={name:"Columns",isRSC:!0,inputs:[{name:"columns",type:"array",broadcast:!0,subFields:[{name:"blocks",type:"array",hideFromUI:!0,defaultValue:[{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{display:"flex",flexDirection:"column",alignItems:"stretch",flexShrink:"0",position:"relative",marginTop:"30px",textAlign:"center",lineHeight:"normal",height:"auto",minHeight:"20px",minWidth:"20px",overflow:"hidden"}},component:{name:"Image",options:{image:"https://builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",backgroundPosition:"center",backgroundSize:"cover",aspectRatio:.7004048582995948}}},{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{display:"flex",flexDirection:"column",alignItems:"stretch",flexShrink:"0",position:"relative",marginTop:"30px",textAlign:"center",lineHeight:"normal",height:"auto"}},component:{name:"Text",options:{text:"<p>Enter some text...</p>"}}}]},{name:"width",type:"number",hideFromUI:!0,helperText:"Width %, e.g. set to 50 to fill half of the space"},{name:"link",type:"url",helperText:"Optionally set a url that clicking this column will link to"}],defaultValue:[{blocks:[{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{display:"flex",flexDirection:"column",alignItems:"stretch",flexShrink:"0",position:"relative",marginTop:"30px",textAlign:"center",lineHeight:"normal",height:"auto",minHeight:"20px",minWidth:"20px",overflow:"hidden"}},component:{name:"Image",options:{image:"https://builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",backgroundPosition:"center",backgroundSize:"cover",aspectRatio:.7004048582995948}}},{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{display:"flex",flexDirection:"column",alignItems:"stretch",flexShrink:"0",position:"relative",marginTop:"30px",textAlign:"center",lineHeight:"normal",height:"auto"}},component:{name:"Text",options:{text:"<p>Enter some text...</p>"}}}]},{blocks:[{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{display:"flex",flexDirection:"column",alignItems:"stretch",flexShrink:"0",position:"relative",marginTop:"30px",textAlign:"center",lineHeight:"normal",height:"auto",minHeight:"20px",minWidth:"20px",overflow:"hidden"}},component:{name:"Image",options:{image:"https://builder.io/api/v1/image/assets%2Fpwgjf0RoYWbdnJSbpBAjXNRMe9F2%2Ffb27a7c790324294af8be1c35fe30f4d",backgroundPosition:"center",backgroundSize:"cover",aspectRatio:.7004048582995948}}},{"@type":"@builder.io/sdk:Element",responsiveStyles:{large:{display:"flex",flexDirection:"column",alignItems:"stretch",flexShrink:"0",position:"relative",marginTop:"30px",textAlign:"center",lineHeight:"normal",height:"auto"}},component:{name:"Text",options:{text:"<p>Enter some text...</p>"}}}]}],onChange:e=>{function t(){n.forEach(i=>{i.delete("width")})}const n=e.get("columns");Array.isArray(n)&&n.find(m=>m.get("width"))&&(n.find(b=>!b.get("width"))||n.reduce((a,h)=>a+h.get("width"),0)!==100)&&t()}},{name:"space",type:"number",defaultValue:20,helperText:"Size of gap between columns",advanced:!0},{name:"stackColumnsAt",type:"string",defaultValue:"tablet",helperText:"Convert horizontal columns to vertical at what device size",enum:["tablet","mobile","never"],advanced:!0},{name:"reverseColumnsWhenStacked",type:"boolean",defaultValue:!1,helperText:"When stacking columns for mobile devices, reverse the ordering",advanced:!0}]},Y={name:"Slot",isRSC:!0,description:"Allow child blocks to be inserted into this content when used as a Symbol",docsLink:"https://www.builder.io/c/docs/symbols-with-blocks",image:"https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F3aad6de36eae43b59b52c85190fdef56",inputs:[{name:"name",type:"string",required:!0,defaultValue:"children"}]},J=u.lazy(()=>Promise.resolve().then(()=>require("./slot-a63e8686.cjs"))),Q={name:"Symbol",noWrap:!0,static:!0,isRSC:!0,inputs:[{name:"symbol",type:"uiSymbol"},{name:"dataOnly",helperText:"Make this a data symbol that doesn't display any UI",type:"boolean",defaultValue:!1,advanced:!0,hideFromUI:!0},{name:"inheritState",helperText:"Inherit the parent component state and data",type:"boolean",defaultValue:!1,advanced:!0},{name:"renderToLiquid",helperText:"Render this symbols contents to liquid. Turn off to fetch with javascript and use custom targeting",type:"boolean",defaultValue:!1,advanced:!0,hideFromUI:!0},{name:"useChildren",hideFromUI:!0,type:"boolean"}]},X={name:"Text",static:!0,isRSC:!0,image:"https://firebasestorage.googleapis.com/v0/b/builder-3b0a2.appspot.com/o/images%2Fbaseline-text_fields-24px%20(1).svg?alt=media&token=12177b73-0ee3-42ca-98c6-0dd003de1929",inputs:[{name:"text",type:"html",required:!0,autoFocus:!0,bubble:!0,defaultValue:"Enter some text..."}],defaultStyles:{lineHeight:"normal",height:"auto",textAlign:"center"}},_=()=>[{component:W.Columns,...z},{component:J,...Y},{component:W.Symbol,...Q},{component:W.Text,...X}],G=`function updateCookiesAndStyles(contentId, variants, isHydrationTarget) {
  function getAndSetVariantId() {
    function setCookie(name, value, days) {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + (value || '') + expires + '; path=/' + '; Secure; SameSite=None';
    }
    function getCookie(name) {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
    const cookieName = \`builder.tests.\${contentId}\`;
    const variantInCookie = getCookie(cookieName);
    const availableIDs = variants.map(vr => vr.id).concat(contentId);
    if (variantInCookie && availableIDs.includes(variantInCookie)) {
      return variantInCookie;
    }
    let n = 0;
    const random = Math.random();
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      const testRatio = variant.testRatio;
      n += testRatio;
      if (random < n) {
        setCookie(cookieName, variant.id);
        return variant.id;
      }
    }
    setCookie(cookieName, contentId);
    return contentId;
  }
  const winningVariantId = getAndSetVariantId();
  const styleEl = document.currentScript?.previousElementSibling;
  if (isHydrationTarget) {
    styleEl.remove();
    const thisScriptEl = document.currentScript;
    thisScriptEl?.remove();
  } else {
    const newStyleStr = variants.concat({
      id: contentId
    }).filter(variant => variant.id !== winningVariantId).map(value => {
      return \`.variant-\${value.id} {  display: none; }
        \`;
    }).join('');
    styleEl.innerHTML = newStyleStr;
  }
}`,Z=`function updateVariantVisibility(variantContentId, defaultContentId, isHydrationTarget) {
  if (!navigator.cookieEnabled) {
    return;
  }
  function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  const cookieName = \`builder.tests.\${defaultContentId}\`;
  const winningVariant = getCookie(cookieName);
  const parentDiv = document.currentScript?.parentElement;
  const isDefaultContent = variantContentId === defaultContentId;
  const isWinningVariant = winningVariant === variantContentId;
  if (isWinningVariant && !isDefaultContent) {
    parentDiv?.removeAttribute('hidden');
    parentDiv?.removeAttribute('aria-hidden');
  } else if (!isWinningVariant && isDefaultContent) {
    parentDiv?.setAttribute('hidden', 'true');
    parentDiv?.setAttribute('aria-hidden', 'true');
  }
  if (isHydrationTarget) {
    if (!isWinningVariant) {
      parentDiv?.remove();
    }
    const thisScriptEl = document.currentScript;
    thisScriptEl?.remove();
  }
  return;
}`,q="builderIoAbTest",L="builderIoRenderContent",V=e=>Object.values((e==null?void 0:e.variations)||{}).map(t=>({...t,testVariationId:t.id,id:e==null?void 0:e.id})),ee=({canTrack:e,content:t})=>!(!(V(t).length>0)||!e||l.isBrowser()),te=e=>e==="react"||e==="reactNative",B=te(l.TARGET),ne=()=>`
  window.${q} = ${G}
  window.${L} = ${Z}
  `,ie=(e,t)=>`
  window.${q}(
    "${t}",${JSON.stringify(e)}, ${B}
  )`,ae=({contentId:e,variationId:t})=>`window.${L}(
    "${t}", "${e}", ${B}
  )`;function P(e){return g.jsx("script",{dangerouslySetInnerHTML:{__html:e.scriptStr},"data-id":e.id})}function K(e){return Math.round(e*1e3)/1e3}const oe=(e,t,n=!0)=>{if(!(e instanceof HTMLElement))return null;let i=n?e:e.parentElement;do{if(!i)return null;if(t(i))return i}while(i=i.parentElement);return null},re=e=>oe(e,t=>{const n=t.getAttribute("builder-id")||t.id;return(n==null?void 0:n.indexOf("builder-"))===0}),U=({event:e,target:t})=>{const n=t.getBoundingClientRect(),i=e.clientX-n.left,m=e.clientY-n.top,b=K(i/n.width),d=K(m/n.height);return{x:b,y:d}},le=e=>{const t=e.target,n=t&&re(t),i=(n==null?void 0:n.getAttribute("builder-id"))||(n==null?void 0:n.id);return{targetBuilderElement:i||void 0,metadata:{targetOffset:t?U({event:e,target:t}):void 0,builderTargetOffset:n?U({event:e,target:n}):void 0,builderElementIndex:n&&i?[].slice.call(document.getElementsByClassName(i)).indexOf(n):void 0}}};function se(e){var C,j,N,D,H,$,F;const t=u.useRef(null);function n(o){var f,s;const c={...e.builderContextSignal.rootState,...o};e.builderContextSignal.rootSetState?(s=(f=e.builderContextSignal).rootSetState)==null||s.call(f,c):e.setBuilderContextSignal(r=>({...r,rootState:c}))}function i(o){var f,s,r,S,E;const c={...e.builderContextSignal.content,...o,data:{...(f=e.builderContextSignal.content)==null?void 0:f.data,...o==null?void 0:o.data},meta:{...(s=e.builderContextSignal.content)==null?void 0:s.meta,...o==null?void 0:o.meta,breakpoints:((r=o==null?void 0:o.meta)==null?void 0:r.breakpoints)||((E=(S=e.builderContextSignal.content)==null?void 0:S.meta)==null?void 0:E.breakpoints)}};e.setBuilderContextSignal(y=>({...y,content:c}))}const[m,b]=u.useState(()=>e.contentWrapper||"div");function d(o){return l.createEditorListener({model:e.model,trustedHosts:e.trustedHosts,callbacks:{configureSdk:c=>{var r;const{breakpoints:f,contentId:s}=c;!s||s!==((r=e.builderContextSignal.content)==null?void 0:r.id)||f&&i({meta:{breakpoints:f}})},animation:c=>{k.triggerAnimation(c)},contentUpdate:c=>{i(c)}}})(o)}function a(){var c,f;const o=(f=(c=e.builderContextSignal.content)==null?void 0:c.data)==null?void 0:f.jsCode;o&&k.evaluate({code:o,context:e.context||{},localState:void 0,rootState:e.builderContextSignal.rootState,rootSetState:e.builderContextSignal.rootSetState,enableCache:!1})}const[h,I]=u.useState(()=>({})),[T,A]=u.useState(()=>({})),[p,w]=u.useState(()=>!1);function R(o){var c,f;if(e.builderContextSignal.content){const s=(c=e.builderContextSignal.content)==null?void 0:c.testVariationId,r=(f=e.builderContextSignal.content)==null?void 0:f.id;l._track({type:"click",canTrack:l.getDefaultCanTrack(e.canTrack),contentId:r,apiKey:e.apiKey,variationId:s!==r?s:void 0,...le(o),unique:!p})}p||w(!0)}function v(){var c,f,s;const o=(s=(f=(c=e.builderContextSignal.content)==null?void 0:c.data)==null?void 0:f.httpRequests)!=null?s:{};Object.entries(o).forEach(([r,S])=>{if(!S||T[r]||h[r]&&!l.isEditing())return;T[r]=!0;const E=S.replace(/{{([^}]+)}}/g,(y,M)=>String(k.evaluate({code:M,context:e.context||{},localState:void 0,rootState:e.builderContextSignal.rootState,rootSetState:e.builderContextSignal.rootSetState,enableCache:!0})));l.fetch(E).then(y=>y.json()).then(y=>{n({[r]:y}),h[r]=!0}).catch(y=>{console.error("error fetching dynamic data",S,y)}).finally(()=>{T[r]=!1})})}function x(){l.isEditing()&&window.dispatchEvent(new CustomEvent("builder:component:stateChange",{detail:{state:l.fastClone(e.builderContextSignal.rootState),ref:{name:e.model}}}))}return u.useEffect(()=>{var o,c;if(l.isBrowser()){if(l.isEditing()&&(window.addEventListener("message",d),l.setupBrowserForEditing({...e.locale?{locale:e.locale}:{},...e.enrich?{enrich:e.enrich}:{},...e.trustedHosts?{trustedHosts:e.trustedHosts}:{}}),Object.values(e.builderContextSignal.componentInfos).forEach(s=>{var S;const r=l.createRegisterComponentMessage(s);(S=window.parent)==null||S.postMessage(r,"*")}),window.addEventListener("builder:component:stateChangeListenerActivated",x)),e.builderContextSignal.content&&l.getDefaultCanTrack(e.canTrack)){const s=(o=e.builderContextSignal.content)==null?void 0:o.testVariationId,r=(c=e.builderContextSignal.content)==null?void 0:c.id,S=e.apiKey;l._track({type:"impression",canTrack:!0,contentId:r,apiKey:S,variationId:s!==r?s:void 0})}if(l.isPreviewing()){const s=new URL(location.href).searchParams,r=s.get("builder.preview"),S=s.get(`builder.preview.${r}`),E=s.get("apiKey")||s.get("builder.space");r===e.model&&E===e.apiKey&&(!e.content||S===e.content.id)&&l.fetchOneEntry({model:e.model,apiKey:e.apiKey,apiVersion:e.builderContextSignal.apiVersion}).then(y=>{y&&i(y)})}}},[]),u.useEffect(()=>{e.apiKey||l.logger.error("No API key provided to `RenderContent` component. This can cause issues. Please provide an API key using the `apiKey` prop."),a(),v(),x()},[]),u.useEffect(()=>{e.content&&i(e.content)},[e.content]),u.useEffect(()=>{a()},[(j=(C=e.builderContextSignal.content)==null?void 0:C.data)==null?void 0:j.jsCode]),u.useEffect(()=>{v()},[(D=(N=e.builderContextSignal.content)==null?void 0:N.data)==null?void 0:D.httpRequests]),u.useEffect(()=>{x()},[e.builderContextSignal.rootState]),u.useEffect(()=>{e.data&&n(e.data)},[e.data]),u.useEffect(()=>{e.locale&&n({locale:e.locale})},[e.locale]),u.useEffect(()=>()=>{l.isBrowser()&&(window.removeEventListener("message",d),window.removeEventListener("builder:component:stateChangeListenerActivated",x))},[]),g.jsx(k.builderContext.Provider,{value:e.builderContextSignal,children:e.builderContextSignal.content?g.jsx(m,{ref:t,onClick:o=>R(o),"builder-content-id":(H=e.builderContextSignal.content)==null?void 0:H.id,"builder-model":e.model,...e.showContent?{}:{hidden:!0,"aria-hidden":!0},...e.contentWrapperProps,className:`variant-${(($=e.content)==null?void 0:$.testVariationId)||((F=e.content)==null?void 0:F.id)}`,children:e.children}):null})}const ce=e=>{var b,d;const t=e.family+(e.kind&&!e.kind.includes("#")?", "+e.kind:""),n=t.split(",")[0],i=(d=e.fileUrl)!=null?d:(b=e==null?void 0:e.files)==null?void 0:b.regular;let m="";if(i&&t&&n&&(m+=`
@font-face {
font-family: "${t}";
src: local("${n}"), url('${i}') format('woff2');
font-display: fallback;
font-weight: 400;
}
      `.trim()),e.files)for(const a in e.files){if(!(String(Number(a))===a))continue;const I=e.files[a];I&&I!==i&&(m+=`
@font-face {
font-family: "${t}";
src: url('${I}') format('woff2');
font-display: fallback;
font-weight: ${a};
}
        `.trim())}return m},de=({customFonts:e})=>{var t;return((t=e==null?void 0:e.map(n=>ce(n)))==null?void 0:t.join(" "))||""},ue=({cssCode:e,contentId:t})=>e?t?(e==null?void 0:e.replace(/&/g,`div[builder-content-id="${t}"]`))||"":e:"",me=`
.builder-button {
  all: unset;
}

.builder-text > p:first-of-type, .builder-text > .builder-paragraph:first-of-type {
  margin: 0;
}
.builder-text > p, .builder-text > .builder-paragraph {
  color: inherit;
  line-height: inherit;
  letter-spacing: inherit;
  font-weight: inherit;
  font-size: inherit;
  text-align: inherit;
  font-family: inherit;
}
`,fe=e=>e?"":me;function ge(e){const[t,n]=u.useState(()=>`
${ue({cssCode:e.cssCode,contentId:e.contentId})}
${de({customFonts:e.customFonts})}
${fe(e.isNestedRender)}
`.trim());return g.jsx(k.InlinedStyles,{id:"builderio-content",styles:t})}const he=({content:e,data:t,locale:n})=>{var b,d,a;const i={},m=((b=e==null?void 0:e.data)==null?void 0:b.state)||{};return(a=(d=e==null?void 0:e.data)==null?void 0:d.inputs)==null||a.forEach(h=>{h.name&&h.defaultValue!==void 0&&(i[h.name]=h.defaultValue)}),{...i,...m,...t,...n?{locale:n}:{}}},be=({content:e,data:t})=>e?{...e,data:{...e==null?void 0:e.data,...t},meta:e==null?void 0:e.meta}:void 0;function O(e){var h,I,T,A,p,w,R;const[t,n]=u.useState(()=>{var v,x;return ae({variationId:(v=e.content)==null?void 0:v.testVariationId,contentId:(x=e.content)==null?void 0:x.id})});function i(v){a(x=>({...x,rootState:v}))}const[m,b]=u.useState(()=>[..._(),...e.customComponents||[]].reduce((v,{component:x,...C})=>({...v,[C.name]:{component:x,...l.serializeComponentInfo(C)}}),{})),[d,a]=u.useState(()=>({content:be({content:e.content,data:e.data}),localState:void 0,rootState:he({content:e.content,data:e.data,locale:e.locale}),rootSetState:i,context:e.context||{},apiKey:e.apiKey,apiVersion:e.apiVersion,componentInfos:[..._(),...e.customComponents||[]].reduce((v,{component:x,...C})=>({...v,[C.name]:l.serializeComponentInfo(C)}),{}),inheritedStyles:{},BlocksWrapper:e.blocksWrapper||"div",BlocksWrapperProps:e.blocksWrapperProps||{}}));return g.jsx(k.ComponentsContext.Provider,{value:{registeredComponents:m},children:g.jsxs(se,{content:e.content,data:e.data,model:e.model,context:e.context,apiKey:e.apiKey,canTrack:e.canTrack,locale:e.locale,enrich:e.enrich,showContent:e.showContent,builderContextSignal:d,contentWrapper:e.contentWrapper,contentWrapperProps:e.contentWrapperProps,linkComponent:e.linkComponent,trustedHosts:e.trustedHosts,setBuilderContextSignal:a,children:[e.isSsrAbTest?g.jsx(P,{id:"builderio-variant-visibility",scriptStr:t}):null,g.jsx(ge,{isNestedRender:e.isNestedRender,contentId:(h=d.content)==null?void 0:h.id,cssCode:(T=(I=d.content)==null?void 0:I.data)==null?void 0:T.cssCode,customFonts:(p=(A=d.content)==null?void 0:A.data)==null?void 0:p.customFonts}),g.jsx(k.Blocks,{blocks:(R=(w=d.content)==null?void 0:w.data)==null?void 0:R.blocks,context:d,registeredComponents:m,linkComponent:e.linkComponent})]})})}function Se(e){var d;const[t,n]=u.useState(()=>ee({canTrack:l.getDefaultCanTrack(e.canTrack),content:e.content}));function i(){var a;return ie(V(e.content).map(h=>({id:h.testVariationId,testRatio:h.testRatio})),((a=e.content)==null?void 0:a.id)||"")}function m(){return V(e.content).map(a=>`.variant-${a.testVariationId} { display: none; } `).join("")}function b(){var a;return t?{...e.content,testVariationId:(a=e.content)==null?void 0:a.id}:l.handleABTestingSync({item:e.content,canTrack:l.getDefaultCanTrack(e.canTrack)})}return u.useEffect(()=>{},[]),g.jsxs(g.Fragment,{children:[!e.isNestedRender&&l.TARGET!=="reactNative"?g.jsx(P,{id:"builderio-init-variants-fns",scriptStr:ne()}):null,t?g.jsxs(g.Fragment,{children:[g.jsx(k.InlinedStyles,{id:"builderio-variants",styles:m()}),g.jsx(P,{id:"builderio-variants-visibility",scriptStr:i()}),(d=V(e.content))==null?void 0:d.map(a=>g.jsx(O,{isNestedRender:e.isNestedRender,content:a,showContent:!1,model:e.model,data:e.data,context:e.context,apiKey:e.apiKey,apiVersion:e.apiVersion,customComponents:e.customComponents,linkComponent:e.linkComponent,canTrack:e.canTrack,locale:e.locale,enrich:e.enrich,isSsrAbTest:t,blocksWrapper:e.blocksWrapper,blocksWrapperProps:e.blocksWrapperProps,contentWrapper:e.contentWrapper,contentWrapperProps:e.contentWrapperProps,trustedHosts:e.trustedHosts},a.testVariationId))]}):null,g.jsx(O,{isNestedRender:e.isNestedRender,content:b(),showContent:!0,model:e.model,data:e.data,context:e.context,apiKey:e.apiKey,apiVersion:e.apiVersion,customComponents:e.customComponents,linkComponent:e.linkComponent,canTrack:e.canTrack,locale:e.locale,enrich:e.enrich,isSsrAbTest:t,blocksWrapper:e.blocksWrapper,blocksWrapperProps:e.blocksWrapperProps,contentWrapper:e.contentWrapper,contentWrapperProps:e.contentWrapperProps,trustedHosts:e.trustedHosts})]})}exports.default=Se;
