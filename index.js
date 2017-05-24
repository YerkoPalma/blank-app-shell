var Router = require('singleton-router')
var css = require('sheetify')

css('tachyons')

var router = Router()

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
