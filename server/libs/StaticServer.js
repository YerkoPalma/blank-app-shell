'use strict'

import fs from 'fs'

/*
  import StaticServer from './'
  import http from 'http'

  const app = StaticServer()
  app.get({
    allowedRequests: [],
    default: 'index.js',
    expectFiles: true
  })
  app.post('/api/push', (req, res) => {})
  http.createServer(app).listen(port, ip, fn)
 */

export default function () {
  var request = null
  var response = null
  var fn = function (req, res) {
    this.req = req
    response = res
    this.getOptions = {}
    this.getPaths = []
    this.getHandlers = []
    if (req.method === 'GET') {
      fn._get.apply(this, arguments)
    }
  }

  fn.get = () => {
    fn._get = function (path, options, callback) {

    // (path, callback)
    if (!callback && options && typeof options === 'function') {
      callback = options
      options = undefined
    }
    // options
    if (!options && typeof path === 'object') {
      options = path
      path = undefined
    }
    if (options && !path && !callback) {
      this.getOptions = options
      let body = []
      let currentRequest = options.allowedRequests.indexOf(request.url) > -1
                            ? request.url.slice(1)
                            : options.default

      if (options.expectFiles) {
        request.on('error', err => {
          // This prints the error message and stack trace to `stderr`.
          console.error(err.stack)
        })
        request.on('data', chunk => {
          body.push(chunk)
        })
        request.on('end', () => {
          response.on('error', err => {
            console.error(err)
          })
          body = Buffer.concat(body).toString()
          console.log('ready to read file')
          // read from index.html
          fs.readFile(path.resolve(__dirname, currentRequest), 'utf8', (err, data) => {
            if (err) console.error(err)
            response.statusCode = 200
            const extension = path.extname(currentRequest)
            switch (extension) {
              case '.js':
                response.setHeader('Content-Type', 'application/javascript')
                break
              case '.png':
                response.setHeader('Content-Type', 'image/png')
                response.setHeader('cache-control', 'public, max-age=31536000, no-cache')
                response.setHeader('accept-ranges', 'bytes')
                break
              case '.jpg':
                response.setHeader('Content-Type', 'image/jpg')
                break
              case '.css':
                response.setHeader('Content-Type', 'text/css')
                break
              default:
                response.setHeader('Content-Type', 'text/html')
            }
            console.log('data readed')
            // respond with readed content
            response.end(data, 'utf8')
          })
        })
      }
    }
  }
  }

  return fn
}
