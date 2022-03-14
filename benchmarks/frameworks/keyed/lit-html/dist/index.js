!function(){"use strict";
/**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */const t=new WeakMap,e=e=>"function"==typeof e&&t.has(e),s=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,n=(t,e,s=null)=>{for(;e!==s;){const s=e.nextSibling;t.removeChild(e),e=s}},i={},o={},l=`{{lit-${String(Math.random()).slice(2)}}}`,a=`\x3c!--${l}--\x3e`,r=new RegExp(`${l}|${a}`),d="$lit$";class c{constructor(t,e){this.parts=[],this.element=e;const s=[],n=[],i=document.createTreeWalker(e.content,133,null,!1);let o=0,a=-1,c=0;const{strings:u,values:{length:g}}=t;for(;c<g;){const t=i.nextNode();if(null!==t){if(a++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:s}=e;let n=0;for(let t=0;t<s;t++)h(e[t].name,d)&&n++;for(;n-- >0;){const e=u[c],s=m.exec(e)[2],n=s.toLowerCase()+d,i=t.getAttribute(n);t.removeAttribute(n);const o=i.split(r);this.parts.push({type:"attribute",index:a,name:s,strings:o}),c+=o.length-1}}"TEMPLATE"===t.tagName&&(n.push(t),i.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(l)>=0){const n=t.parentNode,i=e.split(r),o=i.length-1;for(let e=0;e<o;e++){let s,o=i[e];if(""===o)s=p();else{const t=m.exec(o);null!==t&&h(t[2],d)&&(o=o.slice(0,t.index)+t[1]+t[2].slice(0,-d.length)+t[3]),s=document.createTextNode(o)}n.insertBefore(s,t),this.parts.push({type:"node",index:++a})}""===i[o]?(n.insertBefore(p(),t),s.push(t)):t.data=i[o],c+=o}}else if(8===t.nodeType)if(t.data===l){const e=t.parentNode;null!==t.previousSibling&&a!==o||(a++,e.insertBefore(p(),t)),o=a,this.parts.push({type:"node",index:a}),null===t.nextSibling?t.data="":(s.push(t),a--),c++}else{let e=-1;for(;-1!==(e=t.data.indexOf(l,e+1));)this.parts.push({type:"node",index:-1}),c++}}else i.currentNode=n.pop()}for(const t of s)t.parentNode.removeChild(t)}}const h=(t,e)=>{const s=t.length-e.length;return s>=0&&t.slice(s)===e},u=t=>-1!==t.index,p=()=>document.createComment(""),m=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
/**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
class g{constructor(t,e,s){this.__parts=[],this.template=t,this.processor=e,this.options=s}update(t){let e=0;for(const s of this.__parts)void 0!==s&&s.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit()}_clone(){const t=s?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],n=this.template.parts,i=document.createTreeWalker(t,133,null,!1);let o,l=0,a=0,r=i.nextNode();for(;l<n.length;)if(o=n[l],u(o)){for(;a<o.index;)a++,"TEMPLATE"===r.nodeName&&(e.push(r),i.currentNode=r.content),null===(r=i.nextNode())&&(i.currentNode=e.pop(),r=i.nextNode());if("node"===o.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(r.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(r,o.name,o.strings,this.options));l++}else this.__parts.push(void 0),l++;return s&&(document.adoptNode(t),customElements.upgrade(t)),t}}
/**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */class v{constructor(t,e,s,n){this.strings=t,this.values=e,this.type=s,this.processor=n}getHTML(){const t=this.strings.length-1;let e="",s=!1;for(let n=0;n<t;n++){const t=this.strings[n],i=t.lastIndexOf("\x3c!--");s=(i>-1||s)&&-1===t.indexOf("--\x3e",i+1);const o=m.exec(t);e+=null===o?t+(s?l:a):t.substr(0,o.index)+o[1]+o[2]+d+o[3]+l}return e+=this.strings[t],e}getTemplateElement(){const t=document.createElement("template");return t.innerHTML=this.getHTML(),t}}
/**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */const _=t=>null===t||!("object"==typeof t||"function"==typeof t),f=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class b{constructor(t,e,s){this.dirty=!0,this.element=t,this.name=e,this.strings=s,this.parts=[];for(let t=0;t<s.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new x(this)}_getValue(){const t=this.strings,e=t.length-1;let s="";for(let n=0;n<e;n++){s+=t[n];const e=this.parts[n];if(void 0!==e){const t=e.value;if(_(t)||!f(t))s+="string"==typeof t?t:String(t);else for(const e of t)s+="string"==typeof e?e:String(e)}}return s+=t[e],s}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class x{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===i||_(t)&&t===this.value||(this.value=t,e(t)||(this.committer.dirty=!0))}commit(){for(;e(this.value);){const t=this.value;this.value=i,t(this)}this.value!==i&&this.committer.commit()}}class y{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(p()),this.endNode=t.appendChild(p())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=p()),t.__insert(this.endNode=p())}insertAfterPart(t){t.__insert(this.startNode=p()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){for(;e(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=i,t(this)}const t=this.__pendingValue;t!==i&&(_(t)?t!==this.value&&this.__commitText(t):t instanceof v?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):f(t)?this.__commitIterable(t):t===o?(this.value=o,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling;t=null==t?"":t,e===this.endNode.previousSibling&&3===e.nodeType?e.data=t:this.__commitNode(document.createTextNode("string"==typeof t?t:String(t))),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof g&&this.value.template===e)this.value.update(t.values);else{const s=new g(e,t.processor,this.options),n=s._clone();s.update(t.values),this.__commitNode(n),this.value=s}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let s,n=0;for(const i of t)s=e[n],void 0===s&&(s=new y(this.options),e.push(s),0===n?s.appendIntoPart(this):s.insertAfterPart(e[n-1])),s.setValue(i),s.commit(),n++;n<e.length&&(e.length=n,this.clear(s&&s.endNode))}clear(t=this.startNode){n(this.startNode.parentNode,t.nextSibling,this.endNode)}}class N{constructor(t,e,s){if(this.value=void 0,this.__pendingValue=void 0,2!==s.length||""!==s[0]||""!==s[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=s}setValue(t){this.__pendingValue=t}commit(){for(;e(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=i,t(this)}if(this.__pendingValue===i)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=i}}class w extends b{constructor(t,e,s){super(t,e,s),this.single=2===s.length&&""===s[0]&&""===s[1]}_createPart(){return new V(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class V extends x{}let k=!1;try{const t={get capture(){return k=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}class E{constructor(t,e,s){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=s,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;e(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=i,t(this)}if(this.__pendingValue===i)return;const t=this.__pendingValue,s=this.value,n=null==t||null!=s&&(t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive),o=null!=t&&(null==s||n);n&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),o&&(this.__options=T(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=i}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const T=t=>t&&(k?{capture:t.capture,passive:t.passive,once:t.once}:t.capture)
/**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */;const A=new class{handleAttributeExpressions(t,e,s,n){const i=e[0];if("."===i){return new w(t,e.slice(1),s).parts}if("@"===i)return[new E(t,e.slice(1),n.eventContext)];if("?"===i)return[new N(t,e.slice(1),s)];return new b(t,e,s).parts}handleTextExpression(t){return new y(t)}};
/**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */function $(t){let e=S.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},S.set(t.type,e));let s=e.stringsArray.get(t.strings);if(void 0!==s)return s;const n=t.strings.join(l);return s=e.keyString.get(n),void 0===s&&(s=new c(t,t.getTemplateElement()),e.keyString.set(n,s)),e.stringsArray.set(t.strings,s),s}const S=new Map,M=new WeakMap;
/**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
/**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.0.0");const C=(t,...e)=>new v(t,e,"html",A)
/**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */,L=(t,e)=>{const s=t.startNode.parentNode,n=void 0===e?t.endNode:e.startNode,i=s.insertBefore(p(),n);s.insertBefore(p(),n);const o=new y(t.options);return o.insertAfterNode(i),o},I=(t,e)=>(t.setValue(e),t.commit(),t),B=(t,e,s)=>{const n=t.startNode.parentNode,i=s?s.startNode:t.endNode,o=e.endNode.nextSibling;o!==i&&((t,e,s=null,n=null)=>{for(;e!==s;){const s=e.nextSibling;t.insertBefore(e,n),e=s}})(n,e.startNode,o,i)},H=t=>{n(t.startNode.parentNode,t.startNode,t.endNode.nextSibling)},P=(t,e,s)=>{const n=new Map;for(let i=e;i<=s;i++)n.set(t[i],i);return n},W=new WeakMap,F=new WeakMap,O=(j=(t,e,s)=>{let n;return void 0===s?s=e:void 0!==e&&(n=e),e=>{if(!(e instanceof y))throw new Error("repeat can only be used in text bindings");const i=W.get(e)||[],o=F.get(e)||[],l=[],a=[],r=[];let d,c,h=0;for(const e of t)r[h]=n?n(e,h):h,a[h]=s(e,h),h++;let u=0,p=i.length-1,m=0,g=a.length-1;for(;u<=p&&m<=g;)if(null===i[u])u++;else if(null===i[p])p--;else if(o[u]===r[m])l[m]=I(i[u],a[m]),u++,m++;else if(o[p]===r[g])l[g]=I(i[p],a[g]),p--,g--;else if(o[u]===r[g])l[g]=I(i[u],a[g]),B(e,i[u],l[g+1]),u++,g--;else if(o[p]===r[m])l[m]=I(i[p],a[m]),B(e,i[p],i[u]),p--,m++;else if(void 0===d&&(d=P(r,m,g),c=P(o,u,p)),d.has(o[u]))if(d.has(o[p])){const t=c.get(r[m]),s=void 0!==t?i[t]:null;if(null===s){const t=L(e,i[u]);I(t,a[m]),l[m]=t}else l[m]=I(s,a[m]),B(e,s,i[u]),i[t]=null;m++}else H(i[p]),p--;else H(i[u]),u++;for(;m<=g;){const t=L(e,l[g+1]);I(t,a[m]),l[m++]=t}for(;u<=p;){const t=i[u++];null!==t&&H(t)}W.set(e,l),F.set(e,r)}},(...e)=>{const s=j(...e);return t.set(s,!0),s});var j;const R=["pretty","large","big","small","tall","short","long","handsome","plain","quaint","clean","elegant","easy","angry","crazy","helpful","mushy","odd","unsightly","adorable","important","inexpensive","cheap","expensive","fancy"],z=["red","yellow","blue","green","pink","brown","purple","brown","white","black","orange"],q=["table","chair","house","bbq","desk","car","pony","cookie","sandwich","burger","pizza","mouse","keyboard"];let U=[],D=1,G=-1;const J=()=>{U=U.concat(nt(1e3)),lt()},K=()=>{U=nt(1e3),lt()},Q=()=>{U=nt(1e4),lt()},X=()=>{U=[],lt()},Y=t=>{const e=t.target.closest("td"),s=e.getAttribute("data-interaction"),n=parseInt(e.parentNode.id);"delete"===s?Z(n):tt(n)},Z=t=>{const e=U.findIndex((e=>e.id===t));U.splice(e,1),lt()},tt=t=>{G>-1&&(U[G].selected=!1),G=U.findIndex((e=>e.id===t)),U[G].selected=!0,lt()},et=()=>{if(U.length>998){const t=U[1];U[1]=U[998],U[998]=t}lt()},st=()=>{for(let t=0;t<U.length;t+=10)U[t],U[t].label+=" !!!";lt()},nt=t=>{const e=[];for(let s=0;s<t;s++)e.push({id:D++,label:`${R[it(R.length)]} ${z[it(z.length)]} ${q[it(q.length)]}`,selected:!1});return e},it=t=>Math.round(1e3*Math.random())%t,ot=document.getElementById("container"),lt=()=>{((t,e,s)=>{let i=M.get(e);void 0===i&&(n(e,e.firstChild),M.set(e,i=new y(Object.assign({templateFactory:$},s))),i.appendInto(e)),i.setValue(t),i.commit()})(at(),ot)},at=()=>C`<div class="container"><div class="jumbotron"><div class="row"><div class="col-md-6"><h1>Lit-HTML</h1></div><div class="col-md-6"><div class="row"><div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="run" @click="${K}">Create 1,000 rows</button></div><div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="runlots" @click="${Q}">Create 10,000 rows</button></div><div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="add" @click="${J}">Append 1,000 rows</button></div><div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="update" @click="${st}">Update every 10th row</button></div><div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="clear" @click="${X}">Clear</button></div><div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="swaprows" @click="${et}">Swap Rows</button></div></div></div></div></div><table @click="${Y}" class="table table-hover table-striped test-data"><tbody>${O(U,(t=>t.id),(t=>C`<tr id="${t.id}" class="${t.selected?"danger":""}"><td class="col-md-1">${t.id}</td><td class="col-md-4"><a>${t.label}</a></td><td data-interaction="delete" class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>`))}</tbody></table><span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span></div>`;lt()}();
