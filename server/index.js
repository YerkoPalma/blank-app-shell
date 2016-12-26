import http from 'http'
import send from 'send'
import parseUrl from 'parseurl'
import { GCM_API_KEY } from './env'
import webPush from 'web-push'

const ip = process.env.IP || '0.0.0.0'
const port = process.env.PORT || 8080
const allowedRequests = [
  '/dist/bundle.js',
  '/src/images/green-bg.png',
  '/favicon.ico',
  '/service-worker.js',
  '/manifest.json',
  '/src/images/icon-128.png',
  '/src/images/icon-144.png',
  '/src/images/icon-152.png',
  '/src/images/icon-192.png',
  '/src/images/icon-240.png',
  '/src/images/icon-256.png',
  '/src/images/icon.png'
]

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url} ${req.statusCode}`)
  if (req.method === 'GET') {
    if (allowedRequests.indexOf(req.url) > -1) {
      send(req, parseUrl(req).pathname, { root: __dirname }).pipe(res)
    } else {
      send(req, 'index.html').pipe(res)
    }
  } else if (req.method === 'POST' && req.url === '/register') {
    console.log(`registering ${GCM_API_KEY}`)
    webPush.setGCMAPIKey(GCM_API_KEY)
    res.statusCode = 201
    res.end()
  } else if (req.method === 'POST' && req.url === '/send') {
    webPush.sendNotification(req.body.endpoint, {
      TTL: req.body.ttl,
      payload: req.body.payload,
      userPublicKey: req.body.key,
      userAuth: req.body.authSecret
    })
    .then(function() {
      res.statusCode = 201
      res.end()
    })
  }
})

server.listen(port, ip, () => {
  console.log(`Server running on ${ip}:${port}`)
})
