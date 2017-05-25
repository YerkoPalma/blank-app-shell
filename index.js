var Router = require('singleton-router')
var createStore = require('redux').createStore
var reducer = require('./store/reducers')
var css = require('sheetify')
var nanomorph = require('nanomorph')

css('tachyons')
var log

if (process.env.NODE_ENV !== 'production') {
  var Log = require('nanologger')
  log = Log('pwa')
} else {
  registerServiceWorker('service-worker.js')
}

var router = Router({ onRender: renderRoute })
var store = createStore(reducer)
store.subscribe(render)

router.setStore(store)
router.addRoute('/', require('./views/home'))
router.addRoute('/profile/:user', require('./views/profile'), timer)
router.setRoot('/')
router.start('main')

var timeInterval = null

// direct update, without using the store observer
function timer () {
  if (timeInterval) clearInterval(timeInterval)
  var timeSpan = document.getElementById('time')
  setInterval(updateTime, 1000)
  function updateTime () {
    if (timeSpan) timeSpan.innerHTML = new Date()
    else timeSpan = document.getElementById('time')
  }
}

// update through the store state (recommended)
function render (prev, curr) {
  var _prev = router.rootEl.lasttElementChild || router.rootEl.lastChild
  var _curr = router.currentRoute.onStart(store)
  nanomorph(_prev, _curr)
  log && log.info('re-rendered with state: ' + store.getState())
}

function renderRoute (prev, curr, cb) {
  if (router.firstRender) {
    router.firstRender = false
    router.rootEl.appendChild(curr)
    log && log.info('first render')
  } else {
    nanomorph(curr, prev)
    log && log.info('render route for ' + window.location.pathname)
  }
  if (cb && typeof cb === 'function') {
    cb()
    log && log.info('callback for route ' + window.location.pathname)
  }
}

function registerServiceWorker (file) {
  if ('serviceWorker' in window.navigator && process.env.NODE_ENV === 'production') {
    window.navigator.serviceWorker.register(file).then(function (reg) {
      reg.onupdatefound = function () {
        var installingWorker = reg.installing
  
        installingWorker.onstatechange = function () {
          switch (installingWorker.state) {
            case 'installed':
              if (window.navigator.serviceWorker.controller) {
                console.log('New or updated content is available.')
              } else {
                console.log('Content is now available offline!')
              }
              break
            case 'redundant':
              console.error('The installing service worker became redundant.')
              break
          }
        }
      }
    }).catch(function (e) {
      console.error('Error during service worker registration:', e)
    })
  }
}
