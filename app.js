// NAUALU App — membaca artikel publik dari feed Blogger.
const BLOG_URL = "https://www.naualu.my.id";
const FEED_URL = BLOG_URL + "/feeds/posts/default?alt=json-in-script&max-results=20&orderby=published&callback=na uluFeedCallback".replace("na uluFeedCallback","nauluFeedCallback");
let allPosts = [], visiblePosts = [], currentPost = null, currentCategory = "", page = 1;
const $ = (id) => document.getElementById(id);
const esc = (s="") => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function getText(entry){const c=entry.content?.$t || entry.summary?.$t || ""; const d=document.createElement("div"); d.innerHTML=c; return (d.textContent||"").replace(/\s+/g," ").trim();}
function getImage(entry){const media=entry.media$thumbnail?.url; if(media)return media.replace(/\/s72-c\//,"/s600/"); const html=entry.content?.$t||entry.summary?.$t||""; const m=html.match(/<img[^>]+src=["']([^"']+)/i); return m?m[1]:"";}
function getLink(entry){return entry.link?.find(x=>x.rel==="alternate")?.href || BLOG_URL;}
function getDate(entry){const d=new Date(entry.published?.$t || entry.updated?.$t || Date.now());return d.toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});}
function getCategories(entry){return (entry.category||[]).map(c=>c.term||"").filter(Boolean);}
function nauluFeedCallback(data){
  const entries=data?.feed?.entry||[];
  allPosts=entries.map((e,i)=>({id:e.id?.$t||String(i),title:e.title?.$t||"Tanpa judul",image:getImage(e),summary:getText(e),content:e.content?.$t||e.summary?.$t||"",link:getLink(e),date:getDate(e),rawDate:e.published?.$t||"",categories:getCategories(e)}));
  $("status").textContent=allPosts.length?"Artikel dari NAUALU":"Belum ada artikel yang dapat ditampilkan.";
  renderPosts();
}
function loadFeed(){
  $("status").textContent="Memuat berita dari NAUALU…";
  const old=document.getElementById("blogger-feed-script"); if(old)old.remove();
  const s=document.createElement("script");s.id="blogger-feed-script";s.src=FEED_URL+"&_="+Date.now();
  s.onerror=()=>{$("status").textContent="Berita belum berhasil dimuat. Periksa koneksi internet atau buka website NAUALU.";};
  document.body.appendChild(s);
}
function matches(p){
 const q=$("searchInput").value.trim().toLowerCase();
 const hay=(p.title+" "+p.summary+" "+p.categories.join(" ")).toLowerCase();
 const cat=currentCategory.toLowerCase();
 return (!q||hay.includes(q))&&(!cat||p.categories.some(c=>c.toLowerCase().includes(cat))||hay.includes(cat));
}
function renderPosts(){
 let source=allPosts.filter(matches);
 if(document.body.dataset.saved==="true"){const saved=getSaved();source=source.filter(p=>saved.includes(p.id));}
 visiblePosts=source;
 const shown=source.slice(0,page*10);
 $("newsList").innerHTML=shown.map(p=>`<article class="news-card" data-id="${esc(p.id)}" tabindex="0"><img class="news-image" src="${esc(p.image||"icons/placeholder.svg")}" alt="" loading="lazy" onerror="this.src='icons/placeholder.svg'"><div class="news-copy"><div class="news-category">${esc(p.categories[0]||"NAUALU")}</div><h3 class="news-title">${esc(p.title)}</h3><div class="news-date">${esc(p.date)}</div></div></article>`).join("");
 if(!shown.length)$("newsList").innerHTML=`<p class="status">Tidak ada berita yang cocok. Coba kategori atau kata kunci lain.</p>`;
 $("loadMore").classList.toggle("hidden",shown.length>=source.length);
 if(!allPosts.length)$("status").textContent="Feed belum tersedia atau belum selesai dimuat.";
}
function getSaved(){try{return JSON.parse(localStorage.getItem("nauluSaved")||"[]")}catch{return []}}
function toggleSaved(id){let s=getSaved();s=s.includes(id)?s.filter(x=>x!==id):[...s,id];localStorage.setItem("nauluSaved",JSON.stringify(s));}
function openArticle(id){
 const p=allPosts.find(x=>x.id===id);if(!p)return;currentPost=p;
 $("articleContent").innerHTML=`<div class="article-category">${esc(p.categories[0]||"NAUALU")}</div><h1 class="article-title">${esc(p.title)}</h1><div class="article-date">${esc(p.date)}</div>${p.image?`<img class="article-image" src="${esc(p.image)}" alt="">`:""}<div class="article-actions"><button class="action-btn" id="saveCurrent">${getSaved().includes(p.id)?"♥ Tersimpan":"♡ Simpan berita"}</button><a class="action-btn" href="${esc(p.link)}" target="_blank" rel="noopener">Baca versi website ↗</a></div><div class="article-body">${p.content}</div>`;
 $("articleModal").classList.remove("hidden");
 $("saveCurrent").onclick=()=>{toggleSaved(p.id);$("saveCurrent").textContent=getSaved().includes(p.id)?"♥ Tersimpan":"♡ Simpan berita";};
}
$("newsList").addEventListener("click",e=>{const card=e.target.closest(".news-card");if(card)openArticle(card.dataset.id)});
$("newsList").addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.classList.contains("news-card"))openArticle(e.target.dataset.id)});
$("backToList").onclick=()=>$("articleModal").classList.add("hidden");
$("shareArticle").onclick=async()=>{if(!currentPost)return;const data={title:currentPost.title,text:currentPost.title,url:currentPost.link};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(currentPost.link);alert("Tautan berita disalin.");}}catch{}};
$("searchBtn").onclick=()=>$("searchPanel").classList.toggle("hidden");
$("searchInput").addEventListener("input",()=>{page=1;renderPosts()});
$("refreshBtn").onclick=loadFeed;
$("loadMore").onclick=()=>{page++;renderPosts()};
document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentCategory=b.dataset.category;document.body.dataset.saved="false";page=1;renderPosts()});
function showDrawer(){$("drawer").classList.remove("hidden")}function hideDrawer(){$("drawer").classList.add("hidden")}
$("menuBtn").onclick=showDrawer;$("closeDrawer").onclick=hideDrawer;$("drawer").onclick=e=>{if(e.target===$("drawer"))hideDrawer()};
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>{
 document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));b.classList.add("active");
 const tab=b.dataset.tab;
 if(tab==="menu"){showDrawer();return;}
 if(tab==="tv"){window.open(BLOG_URL+"/","_blank","noopener");return;}
 document.body.dataset.saved=tab==="saved"?"true":"false";currentCategory="";document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("active",x.dataset.category===""));page=1;
 $("status").textContent=tab==="saved"?"Berita yang kamu simpan":"Berita dari NAUALU";renderPosts();window.scrollTo({top:0,behavior:"smooth"});
});
$("drawer").querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>{hideDrawer();document.body.dataset.saved=b.dataset.action==="saved"?"true":"false";page=1;renderPosts()});
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
loadFeed();
