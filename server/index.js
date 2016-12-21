import http from 'http'
import fs from 'fs'
import path from 'path'
import StaticServer from './libs/StaticServer'

const app = StaticServer()
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

app.get({
  allowedRequests,
  default: 'index.js',
  expectFiles: true
})

const server = http.createServer(app)
/*
const server = http.createServer((req, res) => {
  // read html content
  console.log(req.method)
  console.log(req.url)
  let body = []

  if (req.method === 'GET') {
    if (allowedRequests.indexOf(req.url) > -1) {
      req.on('error', err => {
        // This prints the error message and stack trace to `stderr`.
        console.error(err.stack)
      })
      req.on('data', chunk => {
        body.push(chunk)
      })
      req.on('end', () => {
        res.on('error', err => {
          console.error(err)
        })
        body = Buffer.concat(body).toString()
        console.log('ready to read file')
        // read from index.html
        fs.readFile(path.resolve(__dirname, req.url.slice(1)), 'utf8', (err, data) => {
          if (err) console.error(err)
          res.statusCode = 200
          const extension = path.extname(req.url)
          switch (extension) {
            case '.js':
              res.setHeader('Content-Type', 'application/javascript')
              break
            case '.png':
              res.setHeader('Content-Type', 'image/png')
              res.setHeader('cache-control', 'public, max-age=31536000, no-cache')
              res.setHeader('accept-ranges', 'bytes')
              break
            case '.jpg':
              res.setHeader('Content-Type', 'image/jpg')
              break
            case '.css':
              res.setHeader('Content-Type', 'text/css')
              break
            default:
              res.setHeader('Content-Type', 'text/html')
          }
          console.log('data readed')
          // respond with readed content
          res.end(data, 'utf8')
        })
      })
    } else {
      req.on('error', err => {
        // This prints the error message and stack trace to `stderr`.
        console.error(err.stack)
      })
      req.on('data', chunk => {
        body.push(chunk)
      })
      req.on('end', () => {
        res.on('error', err => {
          console.error(err)
        })
        body = Buffer.concat(body).toString()
        console.log('ready to read file')
        // read from index.html
        fs.readFile(path.resolve(__dirname, 'index.html'), 'utf8', (err, data) => {
          if (err) console.error(err)
          res.statusCode = 200
          console.log('data readed')
          // respond with readed content
          res.end(data)
        })
      })
    }
  }
})
*/
server.listen(port, ip, () => {
  console.log(`Server running on ${ip}:${port}`)
})
