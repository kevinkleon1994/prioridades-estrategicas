const CACHE="prioridades-v8-5";
const ASSETS=["./","./index.html","./styles.css","./app.js","./config.js","./manifest.webmanifest","./assets/logomarca_geometrica.png","./assets/icone_identidade.png","./assets/icone_lideranca.png","./assets/icone_novasgeracoes.png","./assets/icone_discipulado.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;}).catch(()=>caches.match(e.request)));
});
