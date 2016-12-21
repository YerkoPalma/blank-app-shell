import http from 'http'
import send from 'send'
import parseUrl from 'parseurl'

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
  if (req.method === 'GET') {
    if (allowedRequests.indexOf(req.url) > -1) {
      console.log(`Serving ${parseUrl(req).pathname}`)
      send(req, parseUrl(req).pathname, { root: __dirname }).pipe(res)
    } else {
      send(req, 'index.html').pipe(res)
    }
  }
})

server.listen(port, ip, () => {
  console.log(`Server running on ${ip}:${port}`)
})
