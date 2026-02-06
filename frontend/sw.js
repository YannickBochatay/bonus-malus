// La version du cache
const VERSION = "v1.5";

// Le nom du cache
const CACHE_NAME = `bonus-malus-${VERSION}`;

// Les ressources statiques nécessaires au fonctionnement de l'application
const APP_STATIC_RESOURCES = [
  "./",
  "./index.html",
  "./bareme.html",
  "./user.html",
  "./manifest.json",
  "./state/main-state.js",
  "./state/user-state.js",
  "./state/utils.js",
  "./assets/pico.min.css",
  "./assets/styles.css",
  "./assets/trophy.svg",
  "./components/bm-action.js",
  "./components/bm-bareme-add.js",
  "./components/bm-depenses.js",
  "./components/bm-table.js",
  "./components/bm-actions.js",
  "./components/bm-bareme.js",
  "./components/bm-nav.js",
  "./components/bm-toast.js",
  "./components/bm-app.js",
  "./components/bm-depense-add.js",
  "./components/bm-router.js",
  "./components/bm-user.js",
  "./components/bm-bareme-action.js",
  "./components/bm-depense.js",
  "./components/bm-select.js",
  "https://yanb.pythonanywhere.com/",
  "https://yanb.pythonanywhere.com/bareme",
  "https://yanb.pythonanywhere.com/Aur%C3%A9lien/actions",
  "https://yanb.pythonanywhere.com/Aur%C3%A9lien/depenses",
  "https://yanb.pythonanywhere.com/Johan/actions",
  "https://yanb.pythonanywhere.com/Johan/depenses"
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
  // Ne pas intercepter les requêtes non‑GET (POST, PUT, …)
  if (event.request.method !== 'GET') return

  if (event.request.mode === "navigate") {
    event.respondWith(caches.match(event.request.url))
    return
  }

  if (/yanb\.pythonanywhere\.com/.test(event.request.url)) {
    event.respondWith(
      (async () => {
        try {
          const networkResp = await fetch(event.request)
          // On met à jour le cache avec la réponse fraîche
          const copy = networkResp.clone()
          const cache = await caches.open(CACHE_NAME)
          cache.put(event.request, copy)
          return networkResp;
        } catch (e) {
          // Si le réseau échoue, on cherche dans le cache
          const cached = await caches.match(event.request)
          // Si rien en cache, on peut retourner une réponse d’erreur générique
          return cached || new Response(JSON.stringify({ details : "Vous êtes hors ligne" }), {
            status: 503,
            headers: {'Content-Type':'application/json'}
          });
        }
      })()
    );
    return // on a déjà traité la requête
  }

  // Pour toutes les autres requêtes, on passera par le cache
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request.url);
      if (cachedResponse) {
        // On renvoie la réponse mise en cache si elle y est disponible
        return cachedResponse;
      }
      // Si la ressource n'est pas dans le cache, on renvoie une 404.
      return new Response(null, { status: 404 });
    })(),
  );
});