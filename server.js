var bankai = require('bankai')
var http = require('http')
var path = require('path')
var fs = require('fs')
var fromString = require('from2-string')
var nav = require('./components/nav')
var hyperstream = require('hyperstream')

var assets = bankai('./index.js')
var ip = process.env.IP || 'localhost'
var port = process.env.PORT || 8080
var staticAsset = new RegExp('/assets')
var htmlStream = null
var navStream = null

var server = http.createServer(handler)
server.listen(port, ip, onlisten)

function handler (req, res) {
  var url = req.url
  if (url === '/') {
    console.log('js:', url)
    htmlStream = fs.createReadStream(path.resolve(__dirname, 'index.html'))
    navStream = hyperstream({
      'header': fromString(nav.toString())
    })
    htmlStream.pipe(navStream).pipe(res)
  } else if (url === '/bundle.js') {
    console.log('js:', url)
    assets.js(req, res).pipe(res)
  } else if (url === '/bundle.css') {
    console.log('css:', url)
    assets.css(req, res).pipe(res)
  } else if (req.headers['accept'].indexOf('html') > 0) {
    console.log('html:', url)
    htmlStream = fs.createReadStream(path.resolve(__dirname, 'index.html'))
    navStream = hyperstream({
      'header': fromString(nav.toString())
    })
    htmlStream.pipe(navStream).pipe(res)
  } else if (staticAsset.test(url)) {
    console.log('static:', url)
    assets.static(req).pipe(res)
  } else {
    console.log('other:', url)
    htmlStream = fs.createReadStream(path.resolve(__dirname, 'index.html'))
    navStream = hyperstream({
      'header': fromString(nav.toString())
    })
    htmlStream.pipe(navStream).pipe(res)
  }
}

function onlisten () {
  var relative = path.relative(process.cwd(), './index.js')
  var addr = 'http://' + ip + ':' + port
  console.log('Started for ' + relative + ' on ' + addr)
}
