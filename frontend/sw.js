// La version du cache
const VERSION = "v1.16";

// Le nom du cache
const CACHE_NAME = `bonus-malus-${VERSION}`;

// Les ressources statiques nécessaires au fonctionnement de l'application
// find . -type f -printf '"%p",\n'
const APP_STATIC_RESOURCES = [
  "./manifest.json",
  "./lib/utils.js",
  "./lib/createState.js",
  "./config.js",
  "./assets/trophy.svg",
  "./assets/pico.min.css",
  "./assets/styles.css",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./components/bm-router.js",
  "./components/bm-toast.js",
  "./components/bm-nav.js",
  "./pages/home/",
  "./pages/home/index.html",
  "./pages/home/components/bm-app.js",
  "./pages/home/components/bm-select.js",
  "./pages/home/components/bm-table.js",
  "./pages/home/state.js",
  "./pages/users/",
  "./pages/users/index.html",
  "./pages/users/components/bm-users.js",
  "./pages/users/components/bm-user-edit.js",
  "./pages/users/components/bm-user-add.js",
  "./pages/users/state.js",
  "./pages/user/components/bm-user.js",
  "./pages/user/components/bm-depenses.js",
  "./pages/user/components/bm-depense.js",
  "./pages/user/components/bm-depense-add.js",
  "./pages/user/components/bm-actions.js",
  "./pages/user/components/bm-action.js",
  "./pages/user/",
  "./pages/user/index.html",
  "./pages/user/state.js",
  "./pages/doc/",
  "./pages/doc/index.html",
  "./pages/bareme/",
  "./pages/bareme/index.html",
  "./pages/bareme/state.js",
  "./pages/bareme/components/bm-bareme-action.js",
  "./pages/bareme/components/bm-bareme-add.js",
  "./pages/bareme/components/bm-bareme.js"
];

// Lors de l'installation, on met en cache les ressources statiques
self.addEventListener("install", (event) => {

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })()
  );
  skipWaiting();
});

// Lors de l'activation, on supprime les anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        }),
      );
      await clients.claim();
    })(),
  );
});

// Lors de la récupération des ressources, on intercepte les
// requêtes au serveur et on répond avec les réponses en cache
// plutôt que de passer par le réseau
self.addEventListener("fetch", (event) => {

  if (event.request.method !== 'GET') return

  if (/(yanb\.pythonanywhere\.com|127\.0\.0\.1:5000)/.test(event.request.url)) {
    event.respondWith(
      (async () => {
        try {
          const networkResp = await fetch(event.request)
          const copy = networkResp.clone()
          const cache = await caches.open(CACHE_NAME)
          cache.put(event.request, copy)
          return networkResp;
        } catch (e) {
          const cached = await caches.match(event.request)
          return cached || new Response(JSON.stringify({ details : "Vous êtes hors ligne" }), {
            status: 503,
            headers: {'Content-Type':'application/json'}
          });
        }
      })()
    );
    return
  }

  // Pour toutes les autres requêtes, on passera par le cache
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request, { ignoreSearch : true });
      if (cachedResponse) return cachedResponse
      
      return new Response(
        JSON.stringify({ details : "Vous êtes hors ligne et la ressource n'est pas en cache" }),
        {
          status: 503,
          headers: {'Content-Type':'application/json'}
        });
    })(),
  );
});