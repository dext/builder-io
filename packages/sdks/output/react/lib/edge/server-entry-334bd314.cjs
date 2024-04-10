"use strict";const b="react",ae=e=>{const t={};return e.forEach((n,r)=>{t[r]=n}),t},F=e=>e instanceof URLSearchParams?ae(e):e,N=e=>typeof e=="string"?e:e instanceof URLSearchParams?e.toString():new URLSearchParams(e).toString();function c(){return typeof window!="undefined"&&typeof document!="undefined"}function ce(){return c()&&window.self!==window.top}function k(e){return ce()&&N(e||window.location.search).indexOf("builder.frameEditing=")!==-1}function ue(e){if(!c())return!1;const t=N(e||window.location.search);return k(t)?!1:t.indexOf("builder.preview=")!==-1}const P=e=>JSON.parse(JSON.stringify(e)),de=e=>({type:"builder.registerComponent",data:M(e)}),le=e=>{const t=e.toString().trim();return`return (${!t.startsWith("function")&&!t.startsWith("(")?"function ":""}${t}).apply(this, arguments)`},fe=e=>typeof e=="function"?le(e):P(e),M=({inputs:e,...t})=>({...P(t),inputs:e==null?void 0:e.map(n=>Object.entries(n).reduce((r,[o,s])=>({...r,[o]:fe(s)}),{}))}),R={};function ge(e,t){let n=R[e];if(n||(n=R[e]=[]),n.push(t),c()){const r={type:"builder.register",data:{type:e,info:t}};try{parent.postMessage(r,"*"),parent!==window&&window.postMessage(r,"*")}catch(o){console.debug("Could not postmessage",o)}}}const B={};function he(e){if(c()){Object.assign(B,e);const t={type:"builder.settingsChange",data:B};parent.postMessage(t,"*")}}const L="builder.",pe="options.",O=e=>{if(!e)return{};const t=F(e),n={};return Object.keys(t).forEach(r=>{if(r.startsWith(L)){const o=r.replace(L,"").replace(pe,"");n[o]=t[r]}}),n},me=()=>{if(!c())return{};const e=new URLSearchParams(window.location.search);return O(e)},v="[Builder.io]: ",d={log:(...e)=>console.log(v,...e),error:(...e)=>console.error(v,...e),warn:(...e)=>console.warn(v,...e),debug:(...e)=>console.debug(v,...e)},p=e=>e!=null,ye=e=>{if(e==="localhost"||e==="127.0.0.1")return e;const t=e.split(".");return t.length>2?t.slice(1).join("."):e},D=({name:e,canTrack:t})=>{var n;try{return t?(n=document.cookie.split("; ").find(r=>r.startsWith(`${e}=`)))==null?void 0:n.split("=")[1]:void 0}catch(r){d.warn("[COOKIE] GET error: ",(r==null?void 0:r.message)||r);return}},j=async e=>D(e),we=e=>e.map(([t,n])=>n?`${t}=${n}`:t).filter(p).join("; "),Se=[["secure",""],["SameSite","None"]],be=({name:e,value:t,expires:n})=>{const o=(c()?location.protocol==="https:":!0)?Se:[[]],s=n?[["expires",n.toUTCString()]]:[[]],a=[[e,t],...s,["path","/"],["domain",ye(window.location.hostname)],...o];return we(a)},K=async({name:e,value:t,expires:n,canTrack:r})=>{try{if(!r)return;const o=be({name:e,value:t,expires:n});document.cookie=o}catch(o){d.warn("[COOKIE] SET error: ",(o==null?void 0:o.message)||o)}};function ve(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){const t=Math.random()*16|0;return(e=="x"?t:t&3|8).toString(16)})}function _(){return ve().replace(/-/g,"")}const W="builderSessionId",Ie=async({canTrack:e})=>{if(!e)return;const t=await j({name:W,canTrack:e});if(p(t))return t;{const n=Ee();return ke({id:n,canTrack:e}),n}},Ee=()=>_(),ke=({id:e,canTrack:t})=>K({name:W,value:e,canTrack:t}),$=()=>c()&&typeof localStorage!="undefined"?localStorage:void 0,Pe=({key:e,canTrack:t})=>{var n;try{return t?(n=$())==null?void 0:n.getItem(e):void 0}catch(r){console.debug("[LocalStorage] GET error: ",r);return}},Oe=({key:e,canTrack:t,value:n})=>{var r;try{t&&((r=$())==null||r.setItem(e,n))}catch(o){console.debug("[LocalStorage] SET error: ",o)}},G="builderVisitorId",Ce=({canTrack:e})=>{if(!e)return;const t=Pe({key:G,canTrack:e});if(p(t))return t;{const n=Te();return Ae({id:n,canTrack:e}),n}},Te=()=>_(),Ae=({id:e,canTrack:t})=>Oe({key:G,value:e,canTrack:t}),xe=()=>{if(c()){const e=new URL(location.href);return e.pathname===""&&(e.pathname="/"),e}else return console.warn("Cannot get location for tracking in non-browser environment"),null},Re=()=>typeof navigator=="object"&&navigator.userAgent||"",z=()=>{const e=Re(),t={Android(){return e.match(/Android/i)},BlackBerry(){return e.match(/BlackBerry/i)},iOS(){return e.match(/iPhone|iPod/i)},Opera(){return e.match(/Opera Mini/i)},Windows(){return e.match(/IEMobile/i)||e.match(/WPDesktop/i)},any(){return t.Android()||t.BlackBerry()||t.iOS()||t.Opera()||t.Windows()||b==="reactNative"}},n=e.match(/Tablet|iPad/i),r=xe();return{urlPath:r==null?void 0:r.pathname,host:(r==null?void 0:r.host)||(r==null?void 0:r.hostname),device:n?"tablet":t.any()?"mobile":"desktop"}},Be=async({canTrack:e})=>{if(!e)return{visitorId:void 0,sessionId:void 0};const t=await Ie({canTrack:e}),n=Ce({canTrack:e});return{sessionId:t,visitorId:n}},Le=async({type:e,canTrack:t,apiKey:n,metadata:r,...o})=>({type:e,data:{...o,metadata:{url:location.href,...r},...await Be({canTrack:t}),userAttributes:z(),ownerId:n}});async function J(e){if(!e.apiKey){d.error("Missing API key for track call. Please provide your API key.");return}if(e.canTrack&&!k()&&(c()||b==="reactNative"))return fetch("https://cdn.builder.io/api/v1/track",{method:"POST",body:JSON.stringify({events:[await Le(e)]}),headers:{"content-type":"application/json"},mode:"cors"}).catch(t=>{console.error("Failed to track: ",t)})}const Ve=e=>J({...e,canTrack:!0}),Ue=["*.beta.builder.io","beta.builder.io","builder.io","localhost","qa.builder.io"];function H(e,t){const n=new URL(t.origin),r=n.hostname;return(e||Ue).findIndex(o=>o.startsWith("*.")?r.endsWith(o.slice(1)):o===r)>-1}const Fe="1.0.17";let V=!1;const X=(e={})=>{var t,n;V||(V=!0,c()&&((t=window.parent)==null||t.postMessage({type:"builder.sdkInfo",data:{target:b,version:Fe,supportsPatchUpdates:!1,supportsAddBlockScoping:!0,supportsCustomBreakpoints:!0}},"*"),(n=window.parent)==null||n.postMessage({type:"builder.updateContent",data:{options:e}},"*"),window.addEventListener("message",r=>{var s,a;if(!H(e.trustedHosts,r))return;const{data:o}=r;if(o!=null&&o.type)switch(o.type){case"builder.evaluate":{const l=o.data.text,y=o.data.arguments||[],m=o.data.id,E=new Function(l);let u,g=null;try{u=E.apply(null,y)}catch(h){g=h}g?(s=window.parent)==null||s.postMessage({type:"builder.evaluateError",data:{id:m,error:g.message}},"*"):u&&typeof u.then=="function"?u.then(h=>{var w;(w=window.parent)==null||w.postMessage({type:"builder.evaluateResult",data:{id:m,result:h}},"*")}).catch(console.error):(a=window.parent)==null||a.postMessage({type:"builder.evaluateResult",data:{result:u,id:m}},"*");break}}})))},q=({model:e,trustedHosts:t,callbacks:n})=>r=>{if(!H(t,r))return;const{data:o}=r;if(o)switch(o.type){case"builder.configureSdk":{n.configureSdk(o.data);break}case"builder.triggerAnimation":{n.animation(o.data);break}case"builder.contentUpdate":{const s=o.data,a=s.key||s.alias||s.entry||s.modelName,l=s.data;a===e&&n.contentUpdate(l);break}}},Ne=(e,t,n)=>{if(!c)return d.warn("`subscribeToEditor` only works in the browser. It currently seems to be running on the server."),()=>{};X();const r=q({callbacks:{contentUpdate:t,animation:()=>{},configureSdk:()=>{}},model:e,trustedHosts:n==null?void 0:n.trustedHosts});return window.addEventListener("message",r),()=>{window.removeEventListener("message",r)}},Me="builder.tests",C=e=>`${Me}.${e}`,De=({contentId:e})=>j({name:C(e),canTrack:!0}),je=({contentId:e})=>D({name:C(e),canTrack:!0}),Ke=({contentId:e,value:t})=>K({name:C(e),value:t,canTrack:!0}),Y=e=>p(e.id)&&p(e.variations)&&Object.keys(e.variations).length>0,_e=({id:e,variations:t})=>{var o;let n=0;const r=Math.random();for(const s in t){const a=(o=t[s])==null?void 0:o.testRatio;if(n+=a,r<n)return s}return e},Q=e=>{const t=_e(e);return Ke({contentId:e.id,value:t}).catch(n=>{d.error("could not store A/B test variation: ",n)}),t},Z=({item:e,testGroupId:t})=>{const n=e.variations[t];return t===e.id||!n?{testVariationId:e.id,testVariationName:"Default"}:{data:n.data,testVariationId:n.id,testVariationName:n.name||(n.id===e.id?"Default":"")}},We=({item:e,canTrack:t})=>{if(!t)return e;if(!e)return;if(!Y(e))return e;const n=je({contentId:e.id})||Q({variations:e.variations,id:e.id}),r=Z({item:e,testGroupId:n});return{...e,...r}},$e=async({item:e,canTrack:t})=>{if(!t||!Y(e))return e;const r=await De({contentId:e.id})||Q({variations:e.variations,id:e.id}),o=Z({item:e,testGroupId:r});return{...e,...o}},ee=e=>p(e)?e:!0;function Ge(){return typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:globalThis}function ze(){const e=Ge().fetch;if(typeof e=="undefined")throw console.warn(`Builder SDK could not find a global fetch function. Make sure you have a polyfill for fetch in your project. 
      For more information, read https://github.com/BuilderIO/this-package-uses-fetch`),new Error("Builder SDK could not find a global `fetch` function");return e}const te=ze();function I(e,t=null,n="."){return Object.keys(e).reduce((r,o)=>{const s=e[o],a=[t,o].filter(Boolean).join(n);return[typeof s=="object",s!==null,!(Array.isArray(s)&&s.length===0)].every(Boolean)?{...r,...I(s,a,n)}:{...r,[a]:s}},{})}const Je="v3",U=e=>typeof e=="number"&&!isNaN(e)&&e>=0,T=e=>{const{limit:t=30,userAttributes:n,query:r,model:o,apiKey:s,enrich:a,locale:l,apiVersion:y=Je,fields:m,omit:E,offset:u,cacheSeconds:g,staleCacheSeconds:h,sort:w,includeUnpublished:A}=e;if(!s)throw new Error("Missing API key");if(!["v3"].includes(y))throw new Error(`Invalid apiVersion: expected 'v3', received '${y}'`);const se=t!==1,i=new URL(`https://cdn.builder.io/api/${y}/content/${o}`);if(i.searchParams.set("apiKey",s),i.searchParams.set("limit",String(t)),i.searchParams.set("noTraverse",String(se)),i.searchParams.set("includeRefs",String(!0)),l&&i.searchParams.set("locale",l),a&&i.searchParams.set("enrich",String(a)),i.searchParams.set("omit",E||"meta.componentsUsed"),m&&i.searchParams.set("fields",m),Number.isFinite(u)&&u>-1&&i.searchParams.set("offset",String(Math.floor(u))),typeof A=="boolean"&&i.searchParams.set("includeUnpublished",String(A)),g&&U(g)&&i.searchParams.set("cacheSeconds",String(g)),h&&U(h)&&i.searchParams.set("staleCacheSeconds",String(h)),w){const f=I({sort:w});for(const S in f)i.searchParams.set(S,JSON.stringify(f[S]))}const ie={...me(),...F(e.options||{})},x=I(ie);for(const f in x)i.searchParams.set(f,String(x[f]));if(n&&i.searchParams.set("userAttributes",JSON.stringify(n)),r){const f=I({query:r});for(const S in f)i.searchParams.set(S,JSON.stringify(f[S]))}return i},He=e=>"results"in e;async function ne(e){const t=await oe({...e,limit:1});return t&&t[0]||null}const Xe=async e=>{var s;const t=T(e);return await(await((s=e.fetch)!=null?s:te)(t.href,e.fetchOptions)).json()},re=async(e,t,n=T(e))=>{const r=ee(e.canTrack);if(n.search.includes("preview="),!r||!(c()||b==="reactNative"))return t.results;try{const o=[];for(const s of t.results)o.push(await $e({item:s,canTrack:r}));t.results=o}catch(o){d.error("Could not process A/B tests. ",o)}return t.results};async function oe(e){try{const t=T(e),n=await Xe(e);return He(n)?re(e,n):(d.error("Error fetching data. ",{url:t,content:n,options:e}),null)}catch(t){return d.error("Error fetching data. ",t),null}}const qe=async e=>{var r,o,s;const t=e.path||((r=e.url)==null?void 0:r.pathname)||((o=e.userAttributes)==null?void 0:o.urlPath),n={...e,apiKey:e.apiKey,model:e.model||"page",userAttributes:{...e.userAttributes,...t?{urlPath:t}:{}},options:O(e.searchParams||((s=e.url)==null?void 0:s.searchParams)||e.options)};return{apiKey:n.apiKey,model:n.model,content:await ne(n)}};exports.TARGET=b;exports._processContentResult=re;exports._track=J;exports.checkIsDefined=p;exports.createEditorListener=q;exports.createRegisterComponentMessage=de;exports.fastClone=P;exports.fetch=te;exports.fetchBuilderProps=qe;exports.fetchEntries=oe;exports.fetchOneEntry=ne;exports.getBuilderSearchParams=O;exports.getDefaultCanTrack=ee;exports.getUserAttributes=z;exports.handleABTestingSync=We;exports.isBrowser=c;exports.isEditing=k;exports.isPreviewing=ue;exports.logger=d;exports.register=ge;exports.serializeComponentInfo=M;exports.setEditorSettings=he;exports.setupBrowserForEditing=X;exports.subscribeToEditor=Ne;exports.track=Ve;