// Lightbox: any <img data-lb> opens fullscreen. Group = same data-lb-group. Esc/←/→ supported.
(function(){
let list=[],idx=0;
const lb=document.createElement("div");lb.id="lb";
lb.innerHTML='<button class="x" aria-label="Закрыть">✕</button><button class="n prev" aria-label="Назад">‹</button><img alt=""><button class="n next" aria-label="Вперёд">›</button><div class="cap"></div>';
document.body.appendChild(lb);
const im=lb.querySelector("img"),cap=lb.querySelector(".cap");
function show(){
  const t=list[idx];
  im.src=t.src;im.alt=t.alt||"";
  cap.textContent=t.cap||t.alt||"";
  lb.querySelector(".prev").style.display=list.length>1?"":"none";
  lb.querySelector(".next").style.display=list.length>1?"":"none";
}
function open(el){
  const g=el.getAttribute("data-lb-group");
  list=[...document.querySelectorAll("img[data-lb]")].filter(x=>!g||x.getAttribute("data-lb-group")===g)
    .map(x=>({src:x.currentSrc||x.src,alt:x.alt,cap:x.getAttribute("data-lb-cap")||""}));
  idx=Math.max(0,list.indexOf(list.find(x=>x.src===(el.currentSrc||el.src))));
  show();lb.classList.add("open");document.body.style.overflow="hidden";
}
function close(){lb.classList.remove("open");document.body.style.overflow="";im.src="";}
document.addEventListener("click",e=>{
  const t=e.target.closest("img[data-lb]");
  if(t){open(t);return;}
  if(e.target.closest("#lb .x")||e.target===lb)close();
  if(e.target.closest("#lb .prev")){idx=(idx-1+list.length)%list.length;show();}
  if(e.target.closest("#lb .next")){idx=(idx+1)%list.length;show();}
});
document.addEventListener("keydown",e=>{
  if(!lb.classList.contains("open"))return;
  if(e.key==="Escape")close();
  if(e.key==="ArrowLeft"){idx=(idx-1+list.length)%list.length;show();}
  if(e.key==="ArrowRight"){idx=(idx+1)%list.length;show();}
});
})();
