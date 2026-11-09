/* AI for Manufacturers — site script. No dependencies. */
(function(){
"use strict";
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}

var toastT;
function toast(m){var t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove("on")},2600)}
function copyText(text,btn,label){
  function ok(){if(btn){btn.textContent="Copied";btn.classList.add("ok");setTimeout(function(){btn.textContent=label;btn.classList.remove("ok")},1600)}}
  function fb(){var ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");ok()}catch(e){toast("Select the text and copy it")}document.body.removeChild(ta)}
  if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text).then(ok,fb);
  fb();return Promise.resolve();
}

/* prompt panels: data-mode="new" (open in ChatGPT) | "same" (copy only) | "show" (display only, for the demo) */
var CHAT="https://chatgpt.com/";
var TOUCH=window.matchMedia&&matchMedia("(pointer:coarse)").matches, MAC=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent);
var PASTE=TOUCH?"Press and hold, then tap Paste":(MAC?"Press ⌘V":"Press Ctrl+V");
var WHERE={new:"Opens in ChatGPT with the prompt filled in. Works in Copilot too: copy and paste.",same:"A follow-up: copy it, then paste it into the chat you already have open",show:"What was typed"};
$$(".prompt").forEach(function(el){
  var mode=el.getAttribute("data-mode")||"new",text=el.textContent.replace(/^\s*\n/,"").replace(/\s+$/,"");
  el.textContent="";el.classList.add(mode==="new"?"new":"same");
  var t=document.createElement("div");t.className="txt";t.textContent=text;el.appendChild(t);
  var bar=document.createElement("div");bar.className="pbar";bar.innerHTML='<span class="where">'+WHERE[mode]+'</span>';
  if(mode==="new"){var a=document.createElement("a");a.className="pbtn go";a.target="_blank";a.rel="noopener";a.textContent="Open in ChatGPT";a.href=CHAT+"?q="+encodeURIComponent(text);bar.appendChild(a)}
  var c=document.createElement("button");c.type="button";c.className="pbtn";c.textContent="Copy";
  c.addEventListener("click",function(){var r=copyText(text,c,"Copy");if(r&&r.then)r.then(function(){toast("Copied. "+PASTE+" in ChatGPT or Copilot.")})});bar.appendChild(c);
  el.appendChild(bar);
});

/* demo stepper */
var demo=$("#demo");
if(demo){
  var steps=$$(".step",demo),top=$(".demoTop",demo),i=0;
  steps.forEach(function(s,n){var b=document.createElement("button");b.type="button";b.innerHTML="<span>"+(n+1)+"</span>"+s.getAttribute("data-short");b.addEventListener("click",function(){go(n)});top.appendChild(b)});
  var tabs=$$("button",top);
  function go(n){i=n;steps.forEach(function(s,k){s.hidden=k!==i});tabs.forEach(function(b,k){b.setAttribute("aria-current",String(k===i))});
    $("#dPrev").disabled=i===0;$("#dNext").disabled=i===steps.length-1;$("#dCount").textContent="Step "+(i+1)+" of "+steps.length;
    var t=tabs[i];top.scrollLeft=t.offsetLeft-top.clientWidth/2+t.clientWidth/2}
  $("#dPrev").addEventListener("click",function(){if(i>0)go(i-1)});
  $("#dNext").addEventListener("click",function(){if(i<steps.length-1)go(i+1)});
  document.addEventListener("keydown",function(e){var r=demo.getBoundingClientRect();if(r.top>window.innerHeight||r.bottom<0)return;if(e.target.closest("input,textarea"))return;
    if(e.key==="ArrowRight"&&i<steps.length-1)go(i+1);if(e.key==="ArrowLeft"&&i>0)go(i-1)});
  go(0);
}

/* nav scrollspy */
var links=$$(".navlist a"),secs=links.map(function(a){return $(a.getAttribute("href"))});
function spy(){var y=window.scrollY+window.innerHeight*.3,cur=0;secs.forEach(function(s,k){if(s&&s.getBoundingClientRect().top+window.scrollY<=y)cur=k});
  links.forEach(function(a,k){a.classList.toggle("active",k===cur)});
  var r=$(".navlist"),act=links[cur];if(r&&act){var l=act.offsetLeft-r.clientWidth/2+act.clientWidth/2;if(Math.abs(r.scrollLeft-l)>40)r.scrollLeft=l}}
window.addEventListener("scroll",spy,{passive:true});spy();
/* reading progress */
(function(){var b=document.createElement("div");b.className="progress";b.setAttribute("aria-hidden","true");document.body.appendChild(b);
  var raf;function upd(){raf=0;var h=document.documentElement,m=h.scrollHeight-h.clientHeight;b.style.transform="scaleX("+(m>0?h.scrollTop/m:0)+")"}
  window.addEventListener("scroll",function(){if(!raf)raf=requestAnimationFrame(upd)},{passive:true});upd()})();
})();
