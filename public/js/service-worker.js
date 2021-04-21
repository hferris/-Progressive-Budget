const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

// All that are in the public directory
const FILES_TO_CACHE = [
  "./",
  "./css/styles.css",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png",
  "./imgs/Screen-Shot.png",
  "./js/db.js",
  "./js/index.js",
  "./index.html",
  "./manifest.json",
];

// installation needed
self.addEventListener("install", function (Event) {
  Event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("the files were pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

//activation needed
self.addEventListener("activate", function (Event) {
  Event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Got rid of old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

//fetching needed and cache requests to api completed
self.addEventListener("fetch", function (Event) {
  if (Event.request.url.includes("/api")) {
    Event.respondWith(
      caches
        .open(DATA_CACHE_NAME)

        //When reciving postive response, copy and save to the cache
        .then((cache) => {
          return (
            fetch(Event.request)
              .then((response) => {
                if (response.status === 200) {
                  cache.put(Event.request.url, response.clone());
                }
                return response;
              })
              // if network request fails, then try grabbing it from cache
              .catch(async (error) => {
                return cache.match(Event.request);
              })
          );
        })
        .catch((error) => console.log(error))
    );

    return;
  }

  // if the request is not for the API, use "offline-first" approach
  Event.respondWith(
    caches.match(Event.request).then(function (response) {
      return response || fetch(Event.request);
    })
  );
});
