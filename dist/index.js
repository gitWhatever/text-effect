!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.TextEffect=e()}(this,function(){"use strict";var f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")};function l(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},e=t.nodeType;return t&&(1===e||9===e||11===e)}var t={hasClass:function(t,e){return t.className.match(RegExp("(\\s|^)"+e+"(\\s|$)"))},addClass:function(t,e){this.hasClass(t,e)||(t.className+=" "+e)},removeClass:function(t,e){if(this.hasClass(t,e)){var n=RegExp("(\\s|^)"+e+"(\\s|$)");t.className=t.className.replace(n," ")}}};var s={uid:0,dataCache:{},internalKey:"ben_"+Math.random(),set:function(t,e,n){if(l(t)){var i=this||s,r=i.internalKey,a=i.dataCache,o=t[r]=t[r]||++i.uid;(a[o]=a[o]||{})[e]=n}else console.warn("wrong first parameter")},get:function(t,e){if(l(t)){var n=this||s,i=n.dataCache,r=t[n.internalKey];return r?(i[r]=i[r]||{})[e]:null}console.warn("wrong first parameter")}};function o(t){return"true"!==t&&"false"!==t?t:"true"===t}var u={css:function(t,e,n){switch(arguments.length){case 2:if("object"!=f(e))return t.currentStyle?t.currentStyle[e]:getComputedStyle(t,null)[e];for(var i in e)t.style[i]=e[i];break;case 3:t.style[e]=n;break;default:return""}},one:function(t,e,n){e.split(/\s+/).forEach(function(e){t.addEventListener(e,function t(){n.call(this),this.removeEventListener(e,t)})})},text:function(t){return"string"==typeof t.textContent?t.textContent:t.innerText},attr:function(t,e,n){if(void 0===n)return t.getAttribute(e);t.setAttribute(e,n)},html:function(t,e){if(l(e))t.innerHTML="",t.appendChild(e);else if("string"==typeof e)t.innerHTML=e;else if(null==e)return t.innerHTML},textToDom:function(t){var e=document.createElement("div");return e.innerHTML=t,e.childNodes[0]},elementChildren:function(t){if(t.children)return t.children;for(var e=[],n=t.childNodes.length;n--;)8!=t.childNodes[n].nodeType&&e.unshift(t.childNodes[n]);return e},isValidNodeList:function(t){return!!t&&(t instanceof HTMLCollection||t instanceof NodeList||t instanceof Array)&&0<t.length},isHtmlElement:l,toggleShow:function(t,e){t.style.display=e?"":"none"},classApi:t,dataApi:s,getDataOpt:function(){var t=(0<arguments.length&&void 0!==arguments[0]?arguments[0]:{}).attributes||[],e={},n=t.length;if(!n)return e;for(var i=0;i<n;i++){var r=t[i],a=r.nodeName.replace(/delayscale/,"delayScale");/^data-in-(.*)/.test(a)?(e.in=e.in||{},e.in[RegExp.$1]=o(r.nodeValue)):/^data-out-(.*)/.test(a)?(e.out=e.out||{},e.out[RegExp.$1]=o(r.nodeValue)):/^data-*/.test(a)&&(e[RegExp.$1]=o(r.nodeValue))}return e}};function d(t,e){if(console.log(t),!u.isValidNodeList(t))return console.warn("lettering has no effective dom element"),this;"letters"!==e&&e&&a[e]||(e="init");for(var n=arguments.length,i=Array(2<n?n-2:0),r=2;r<n;r++)i[r-2]=arguments[r];a[e].apply(a,[t].concat(i))}window.arrayEach=Array.prototype.forEach;var a={init:function(t){arrayEach.call(t,function(t){e(t,"","char","")})},word:function(t){arrayEach.call(t,function(t){e(t,/\s+/,"word","")})},lines:function(t){arrayEach.call(t,function(t){e(t,/(\r\n)+/,"line","")})}},e=function(t,e,n,i){var r=u.text(t),a=r.split(e),o="";a.length&&(o=a.map(function(t,e){return'<span class="'+n+(e+1)+'" aria-hidden="true">'+t+"</span>"}).join(i),u.attr(t,"aria-label",r),t.innerHTML=o)},c=function(t){return!(!(i=t)||"object"!=typeof i||("[object RegExp]"===(n=Object.prototype.toString.call(e=t))||"[object Date]"===n||e.$$typeof===r));var e,n,i};var r="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function y(t,e){return!1!==e.clone&&e.isMergeableObject(t)?p(Array.isArray(t)?[]:{},t,e):t}function h(t,e,n){return t.concat(e).map(function(t){return y(t,n)})}function p(t,e,n){(n=n||{}).arrayMerge=n.arrayMerge||h,n.isMergeableObject=n.isMergeableObject||c;var i,r,a,o,l=Array.isArray(e);return l===Array.isArray(t)?l?n.arrayMerge(t,e,n):(r=e,o={},(a=n).isMergeableObject(i=t)&&Object.keys(i).forEach(function(t){o[t]=y(i[t],a)}),Object.keys(r).forEach(function(t){o[t]=a.isMergeableObject(r[t])&&i[t]?p(i[t],r[t],a):y(r[t],a)}),o):y(e,n)}p.all=function(t,n){if(!Array.isArray(t))throw Error("first argument should be an array");return t.reduce(function(t,e){return p(t,e,n)},{})};var m=p,g=function(){function n(t,e){i(this,n),this.baseEle=t,this.options=e,this.timeoutRunTask=null,this.init()}return n.prototype.setOptions=function(t){this.options=t},n.prototype.init=function(){var t=this.baseEle,e=this.options,n=this.textEle=t.querySelector(e.selector),i=this.currentEle=document.createElement("span");if(!n){var r='<ul class="texts"><li>'+u.html(t)+"</li></ul>";n=this.textEle=u.textToDom(r),u.html(t,this.textEle)}u.toggleShow(n,0),t.insertBefore(i,n),e.autoStart&&this.start()},n.prototype.start=function(){var n=this,i=n.options,r=u.elementChildren(n.textEle).length;setTimeout(function(){n.triggerEvent("start"),function t(e){n.in(e,function(){e++,i.loop||e<r?(e%=r,n.timeoutRunTask=setTimeout(function(){n.out(function(){t(e)})},i.minDisplayTime)):(i.callback&&i.callback(),n.triggerEvent("end"))})}(0)},i.initialDelay)},n.prototype.stop=function(){var t=this.timeoutRunTask;t&&(clearInterval(t),t=null)},n.prototype.in=function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,e=arguments[1],n=this,i=u.elementChildren(n.textEle)[t],r=n.currentEle,a=n.baseEle,o=m({},n.options,u.getDataOpt(i)),l=v(o.in.effect),s=b(o.out.effect);u.dataApi.set(i,"bindOptions",o),u.attr(a,"data-active",t),u.html(r,u.text(i)),"char"===o.type?d([r]):"word"===o.type&&d([r],"word"),n.currentIndex=t,n.triggerEvent("inAnimationBegin");var c=u.elementChildren(r);arrayEach.call(c,function(t,e){u.css(t,{display:"inline-block","-webkit-transform":"translate3d(0,0,0)","-moz-transform":"translate3d(0,0,0)","-o-transform":"translate3d(0,0,0)",transform:"translate3d(0,0,0)","white-space":"pre"}),l?u.css(t,"visibility","hidden"):s&&u.css(t,"visibility","visible")}),l?E(c,o.in,function(){n.triggerEvent("inAnimationEnd"),o.in.callback&&o.in.callback(),e&&e()}):(n.triggerEvent("inAnimationEnd"),e&&e())},n.prototype.out=function(t){var e=this,n=u.elementChildren(e.currentEle),i=u.elementChildren(e.textEle),r=u.dataApi.set(i[e.currentIndex],"bindOptions"),a=b(r.out.effect);e.triggerEvent("outAnimationBegin"),a?E(n,r.out,function(){e.triggerEvent("outAnimationEnd"),r.out.callback&&r.out.callback(),t&&t()}):(e.triggerEvent("outAnimationEnd"),t&&t())},n.prototype.triggerEvent=function(){},n}();function v(t){return/In/.test(t)||0<=g.defaultConfig.inEffects.indexOf(t)}function b(t){return/Out/.test(t)||0<=g.defaultConfig.outEffects.indexOf(t)}function E(t,s,e){var n=t.length;n<1?e&&e():(s.shuffle&&(t=function(t){for(var e,n,i=t.length;i;e=parseInt(Math.random()*i),n=t[--i],t[i]=t[e],t[e]=n);return t}(t)),s.reverse&&(t=function(t){var e=t.length;for(var n=e-1;~~(e/2)<=n;n--){var i=null;i=t[n],t[n]=t[e-1-n],t[e-1-n]=i}}(t)),arrayEach.call(t,function(o,t){var l=function(t){v(s.effect)?u.css(t,"visibility","visible"):b(s.effect)&&u.css(t,"visibility","hidden"),!--n&&e&&e()};setTimeout(function(){var t,e,n,i,r,a;e=l,i=u.css,r=u.one,(n=u.classApi).addClass(t=o,a=s.effect+" animated"),i(t,"visibility","visible"),r(t,"webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function(){n.removeClass(this,a),e&&e(this)})},s.sync?s.delay:s.delay*t*s.delayScale)}))}g.defaultConfig={selector:".texts",loop:!1,minDisplayTime:2e3,initialDelay:0,in:{effect:"fadeInLeftBig",delayScale:1.5,delay:50,sync:!1,reverse:!1,shuffle:!1,callback:function(){}},out:{effect:"hinge",delayScale:1.5,delay:50,sync:!1,reverse:!1,shuffle:!1,callback:function(){}},autoStart:!0,inEffects:[],outEffects:["hinge"],callback:function(){},type:"char"};var n={entry:function(a){for(var t=arguments.length,o=Array(1<t?t-1:0),e=1;e<t;e++)o[e-1]=arguments[e];var l=u.dataApi,s=u.getDataOpt,c=["start","stop","setOptions","init"];arrayEach.call(this.els,function(t,e){var n=m({},g.defaultConfig,s(t),"object"===(void 0===a?"undefined":f(a))&&a),i=l.get(t,"mTextillate");if(i)if("string"==typeof a){var r;if(-1<c.indexOf(a))(r=i)[a].apply(r,o)}else i.setOptions(n);else l.get(t,"mTextillate",i=new g(t,n))})},name:"textillate"},x=function(){function e(t){i(this,e),this.els=A(t)}return e.lettering=function(t,e){for(var n=arguments.length,i=Array(2<n?n-2:0),r=2;r<n;r++)i[r-2]=arguments[r];d.apply(void 0,[A(t),e].concat(i))},e.prototype.textillate=function(){n.entry.apply(this,arguments)},e}(),A=function(t){return u.isHtmlElement(t)?[t]:t};return x});
