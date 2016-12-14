/* global navigator Notification */
import header from './components/header'
import sidenav from './components/sidenav'
import yo from 'yo-yo'
import RouterSingleton from './libs/Router'
import HomeView from './views/home'
import AboutView from './views/about'
import UserView from './views/user'

var isPushEnabled = false
var useNotifications = false

// render main content
const oldHeader = document.querySelector('header')
const newHeader = yo.update(oldHeader, header)
document.body.insertBefore(sidenav, newHeader)

// register service-worker
if ('serviceWorker' in navigator) {
  console.log(`env: ${process.env.NODE_ENV}`)
  if (process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.register(window.location.origin + 'service-worker.js').then(function (reg) {
      reg.onupdatefound = function () {
        var installingWorker = reg.installing

        installingWorker.onstatechange = function () {
          switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
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
      // push notifications
      if (!(reg.showNotification)) {
        console.log('Notifications aren\'t supported on service workers.')
        useNotifications = false
      } else {
        useNotifications = true
      }

      if (Notification.permission === 'denied') {
        console.log('The user has blocked notifications.')
      }

      if (!('PushManager' in window)) {
        console.log('Push messaging isn\'t supported.')
      }

      navigator.serviceWorker.ready.then(function (reg) {
        reg.pushManager.getSubscription()
          .then(function (subscription) {
            if (isPushEnabled && useNotifications) {}
          })
      })
    }).catch(function (e) {
      console.error('Error during service worker registration:', e)
    })
  }
}

// start router
const router = RouterSingleton.getRouter()
router.addRoute('/', HomeView)
router.addRoute('/about', AboutView)
router.addRoute('/user/:id', UserView)
router.setRoot('/')
router.start('#app')
