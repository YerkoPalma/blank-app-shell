var Router = require('singleton-router')
var createStore = require('redux').createStore
var reducer = require('./store/reducers')
var css = require('sheetify')
var nanomorph = require('nanomorph')

css('tachyons')

var router = Router()
var store = createStore(reducer)
store.subscribe(render)

router.setStore(store)
router.addRoute('/', require('./views/home'))
router.addRoute('/profile/:user', require('./views/profile'), timer)
router.setRoot('/')
router.start('main')

var timeInterval = null

function timer () {
  if (timeInterval) clearInterval(timeInterval)
  var timeSpan = document.getElementById('time')
  setInterval(updateTime, 1000)
  function updateTime () {
    timeSpan.innerHTML = new Date()
  }
}

function render (prev, curr) {
  var _prev = router.rootEl.lasttElementChild || router.rootEl.lastChild
  var _curr = router.currentRoute.onStart(store)
  nanomorph(_prev, _curr)
}
