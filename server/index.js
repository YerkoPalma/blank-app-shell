import http from 'http'
import fs from 'fs'

const ip = process.env.IP || '0.0.0.0'
const port = process.env.PORT || 8080

const server = http.createServer((req, res) => {
  // read html content
  console.log(req.method)
  let body = []
  if (req.method === 'GET') {
    req.on('error', err => {
      // This prints the error message and stack trace to `stderr`.
      console.error(err.stack)
    })
    req.on('data', chunk => {
      body.push(chunk)
    })
    // read from index.html
    req.on('end', () => {
      console.log('req.end')
      body = Buffer.concat(body).toString()

      // respond with readed content
      res.on('error', err => {
        console.error(err)
      })
      res.statusCode = 200
      res.end('<html><body><h1>Hello, World!</h1></body></html>')
    })
  }
})

server.listen(port, ip, () => {
  console.log(`Server running on ${ip}:${port}`)
})
