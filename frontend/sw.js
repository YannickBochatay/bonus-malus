// La version du cache
const VERSION = "v1";

// Le nom du cache
const CACHE_NAME = `bonus-malus-${VERSION}`;

// Les ressources statiques nécessaires au fonctionnement de l'application
const APP_STATIC_RESOURCES = [
  "/",
  "/index.html",
  "/app.js",
  "/styles.css",
  "/icons/wheel.svg",
];

// Lors de l'installation, on met en cache les ressources statiques
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })(),
  );
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
  // Notre application n'a qu'une seule page,
  // on n'utilisera que celle-ci.
  if (event.request.mode === "navigate") {
    event.respondWith(caches.match("/"));
    return;
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