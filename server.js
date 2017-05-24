var bankai = require('bankai')
var http = require('http')
var path = require('path')
var fs = require('fs')
var fromString = require('from2-string')
var nav = require('./components/nav')
var hyperstream = require('hyperstream')

var defaults = {
  html: false
}
var assets = bankai('./index.js', defaults)
var ip = process.env.IP || 'localhost'
var port = process.env.PORT || 8080
var staticAsset = new RegExp('/assets')

var server = http.createServer(handler)
server.listen(port, ip, onlisten)

function handler (req, res) {
  var url = req.url
  if (url === '/') {
    var htmlStream = fs.createReadStream(__dirname + '/index.html')
    var navStream = hyperstream({
      'main': fromString(nav.toString())
    })
    htmlStream.pipe(navStream).pipe(res)
  } else if (url === '/bundle.js') {
    assets.js(req, res).pipe(res)
  } else if (url === '/bundle.css') {
    assets.css(req, res).pipe(res)
  } else if (req.headers['accept'].indexOf('html') > 0) {
    assets.html(req, res).pipe(res)
  } else if (staticAsset.test(url)) {
    assets.static(req).pipe(res)
  } else {
    res.writeHead(404, 'Not Found')
    res.end()
  }
}

function onlisten () {
  var relative = path.relative(process.cwd(), './index.js')
  var addr = 'http://' + ip + ':' + port
  console.log('Started for ' + relative + ' on ' + addr)
}
