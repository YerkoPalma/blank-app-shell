/* eslint-env serviceworker */
/* global fetch URL Request */

var version = '0.1.3'
var cacheName = 'appshell-sw-v' + version

var filesToCache = [
  '/',
  '/index.html',
  '/dist/bundle.js',
  '/src/images/green-bg.png',
  'manifest.json'
]

var urlsToCache = [
  'https://unpkg.com/tachyons/css/tachyons.min.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v19/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2'
]

// Returns an object with one property per file to cache, where the key is the
// filename with the version added, and the value is the absolute url
// (arr) -> obj
var expectedUrls = function (files) {
  var urlSet = {}
  files.forEach(function (file) {
    urlSet[file + version] = new URL(file, self.location)
  })
  urlsToCache.forEach(function (url) {
    var urlKey = url.split('/')[url.split('/').length - 1]
    urlSet[urlKey + version] = url
  })
  return urlSet
}

// Get only the values of the set of expected cahe urls
// arr
var absoluteUrlsExpected = (function () {
  var urls = []
  var expecteds = expectedUrls(filesToCache)
  for (var urlKey in expecteds) {
    urls.push(expecteds[urlKey])
  }
  return urls
})()

// Return the urls already cached
// (cache) -> Promise
var cachedUrls = function (cache) {
  return cache.keys().then(function (requests) {
    return requests.map(function (request) {
      return request.url
    })
  }).then(function (urls) {
    return new Set(urls)
  })
}

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install')
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell')
      return cachedUrls(cache).then(function (urls) {
        return Promise.all(
          absoluteUrlsExpected.map(function (expectedUrl) {
            if (!urls.has(expectedUrl)) {
              return cache.add(new Request(expectedUrl, { credentials: 'same-origin' }))
            }
          })
        )
      })
    }).then(function () {
      // Force the SW to transition from installing -> active state
      return self.skipWaiting()
    })
  )
})

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate')
  var setOfExpectedUrls = new Set(absoluteUrlsExpected)
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return caches.keys().then(function (existingRequests) {
        return Promise.all(
          existingRequests.map(function (existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              console.log('[ServiceWorker] Removing old cache', existingRequest.url)
              return cache.delete(existingRequest)
            }
          })
        )
      })
    }).then(function () {
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', function (e) {
  if (e.request.method === 'GET') {
    console.log('[ServiceWorker] Fetch', e.request.url)
    // var dataUrl = 'https://sw-test-43ffd.firebaseio.com/'
    // if (e.request.url.indexOf(dataUrl) === 0) {
    e.respondWith(
      caches.open(cacheName).then(function (cache) {
        return cache.match(e.request.url).then(function (response) {
          if (response) {
            return response
          }
          throw Error('The cached response that was expected is missing.')
        })
      }).catch(function (err) {
        // Fall back to just fetch()ing the request if some unexpected error
        // prevented the cached response from being valid.
        console.warn('Couldn\'t serve response for "%s" from cache: %O', e.request.url, err)
        return fetch(e.request)
      })
    )
  }
})

// PUSH NOTIFICATIONS

self.addEventListener('push', function (event) {
  const obj = event.data.json()

  fireNotification(obj, event)
})

function fireNotification (obj, event) {
  var title = 'Subscription change'
  var body = obj.name + ' has ' + obj.action + 'd.'
  var icon = 'push-icon.png'
  var tag = 'push'

  event.waitUntil(self.registration.showNotification(title, {
    body: body,
    icon: icon,
    tag: tag
  }))
}
