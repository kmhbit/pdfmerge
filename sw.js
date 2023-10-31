var APP_PREFIX = 'PDFMerge_'     // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = 'version_02'              // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [                            // Add URL you want to cache in this list.
    '/',
    '/index.html',
    '/help.html',
    '/app.css',
    '/markdown.css',
    '/app.js',
    '/mithril.min.js',
    '/pdf-lib.min.js',
    '/Montserrat-Bold.woff2',
    '/Montserrat-Italic.woff2',
    '/Montserrat-Light.woff2',
    '/Montserrat-Regular.woff2',
    '/favicon.ico',
    '/site.webmanifest',
    '/icon.png',
    '/title.png',
    '/logo.png'
]

// Respond with cached resources
self.addEventListener('fetch', function (e) {
    console.log('Fetch request : ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) { // if cache is available, respond with cache
                console.log('Responding with cache : ' + e.request.url)
                return request
            } else {       // if there are no cache, try fetching request
                console.log('File is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }

            // You can omit if/else for console.log & put one line below like this too.
            // return request || fetch(e.request)
        })
    )
})

// Cache resources
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('Installing cache : ' + CACHE_NAME)
            return cache.addAll(URLS)
        })
    )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            // `keyList` contains all cache names under your username.github.io
            // filter out ones that has this app prefix to create white list
            var cacheWhitelist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX)
            })
            // add current cache name to white list
            cacheWhitelist.push(CACHE_NAME)

            return Promise.all(keyList.map(function (key, i) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    console.log('Deleting cache : ' + keyList[i])
                    return caches.delete(keyList[i])
                }
            }))
        })
    )
})