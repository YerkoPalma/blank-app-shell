import http from 'http'
import send from 'send'
import parseUrl from 'parseurl'
import webPush from 'web-push'
import memdb from 'memdb'
const db = memdb()
const GCM_API_KEY = process.env.GCM_API_KEY || require('./env').GCM_API_KEY
// register for push notifications
webPush.setGCMAPIKey(GCM_API_KEY)
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
    let body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', () => {
      body = JSON.parse(Buffer.concat(body).toString())
      const key = body.key
      db.put(key, body)
      res.statusCode = 201
      res.end()
    })
  } else if (req.method === 'POST' && req.url === '/send') {
    let body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', () => {
      body = JSON.parse(Buffer.concat(body).toString())
      console.log('Request details')
      const subscription = {
        endpoint: body.endpoint,
        keys: {
          p256dh: body.key,
          auth: body.authSecret
        }
      }
      const payload = JSON.stringify({
        payload: body.payload,
        userPublicKey: body.key,
        userAuth: body.authSecret
      })
      webPush.sendNotification(subscription, payload)
      .then(() => {
        console.log('cool')
        res.statusCode = 201
        res.end()
      })
      .catch((data) => {
        console.log(JSON.stringify(data, null, 2))
        res.statusCode = 500
        res.end(data.body)
      })
    })
  }
})

server.listen(port, ip, () => {
  console.log(`Server running on ${ip}:${port}`)
})
