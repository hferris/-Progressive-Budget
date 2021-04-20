const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

// All that are in the public directory
const FILES_TO_CACHE = [
  "./",
  "./css/styles.css",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png",
  // "../imgs/",
  "./js/db.js",
  "./js/index.js",
  "./index.html",
];

// installation
self.addEventListener("install", function (Event) {
  Event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("the files were pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

//activation
self.addEventListener("activate", function (Event) {
    Event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
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
