/* eslint-env serviceworker */
/* global fetch */

var cacheName = 'sw-test-0.0.4'
var dataCacheName = 'sw-test-data-0.0.4'

/* var filesToCache = [
  '/',
  '/index.html',
  '/app.js'
] */

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install')
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell')
      // return cache.addAll(filesToCache)
    }).then(function () {
      // Force the SW to transition from installing -> active state
      return self.skipWaiting()
    })
  )
})

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate')
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        console.log('[ServiceWorker] Removing old cache', key)
        // if (key !== cacheName) {
        //   return caches.delete(key)
        // }
      }))
    }).then(function () {
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', function (e) {
  console.log('[ServiceWorker] Fetch', e.request.url)
  // var dataUrl = 'https://sw-test-43ffd.firebaseio.com/'
  // if (e.request.url.indexOf(dataUrl) === 0) {
  e.respondWith(
    fetch(e.request)
      .then(function (response) {
        return caches.open(dataCacheName).then(function (cache) {
          // cache.put(e.request.url, response.clone())
          console.log('[ServiceWorker] Fetched&Cached Data')
          return response
        })
      })
  )
  // } else {
  //   e.respondWith(
  //     caches.match(e.request).then(function (response) {
  //       return response || fetch(e.request)
  //     })
  //   )
  // }
})

// PUSH NOTIFICATIONS
var port

self.addEventListener('push', function (event) {
  var obj = event.data.json()

  if (obj.action === 'subscribe' || obj.action === 'unsubscribe') {
    fireNotification(obj, event)
    port.postMessage(obj)
  } else if (obj.action === 'init' || obj.action === 'chatMsg') {
    port.postMessage(obj)
  }
})

self.onmessage = function (e) {
  console.log(e)
  port = e.ports[0]
}

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
