import http from 'http'
import fs from 'fs'
import path from 'path'

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
        res.end(data || body)
      })
    })
  }
})

server.listen(port, ip, () => {
  console.log(`Server running on ${ip}:${port}`)
})
