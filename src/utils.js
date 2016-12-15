/* global navigator Notification */
export function fadeIn (el) {
  el.style.opacity = 0
  el.style.display = 'block'
  var last = +new Date()
  var tick = function () {
    el.style.opacity = +el.style.opacity + (new Date() - last) / 400
    last = +new Date()

    if (+el.style.opacity < 1) {
      (window.requestAnimationFrame && window.requestAnimationFrame(tick)) || setTimeout(tick, 16)
    }
  }

  tick()
}

export function fadeOut (el) {
  el.style.opacity = 1

  var last = +new Date()
  var tick = function () {
    el.style.opacity = +el.style.opacity - (new Date() - last) / 400
    last = +new Date()

    if (+el.style.opacity > 0) {
      (window.requestAnimationFrame && window.requestAnimationFrame(tick)) || setTimeout(tick, 16)
      // after changing opacity, actually hide the element
    } else {
      el.style.display = 'none'
    }
  }

  tick()
}

export function slideLeft (el) {
  var start = null
  // initial left value
  var initLeft = +el.style.left.match(/-?\d*/)[0]
  var initWidth = +window.getComputedStyle(el, null).width.match(/(-?\d*?\.?\d*)(\w*)/)[1]

  var tick = function (timestamp) {
    if (!start) start = timestamp
    var progress = timestamp - start
    el.style.left = +(initLeft - Math.min(progress, initWidth)) + 'px'
    if (+el.style.left.match(/-?\d*/)[0] >= (initWidth * -1)) {
      (window.requestAnimationFrame && window.requestAnimationFrame(tick)) || setTimeout(tick, 16)
      // after changing opacity, actually hide the element
    }
  }

  window.requestAnimationFrame(tick)
}

export function slideRight (el) {
  var start = null
  // initial left value
  var initLeft = +el.style.left.match(/-?\d*/)[0]
  var initWidth = +window.getComputedStyle(el, null).width.match(/(-?\d*?\.?\d*)(\w*)/)[1]

  var tick = function (timestamp) {
    if (!start) start = timestamp
    var progress = timestamp - start
    el.style.left = +(initLeft + Math.min(progress, initWidth)) + 'px'
    if (+el.style.left.match(/-?\d*/)[0] <= 0) {
      (window.requestAnimationFrame && window.requestAnimationFrame(tick)) || setTimeout(tick, 16)
      // after changing opacity, actually hide the element
    }
  }

  window.requestAnimationFrame(tick)
}

export function registerServiceWorker (swPath) {
  var isPushEnabled = false
  var useNotifications = false

  if ('serviceWorker' in navigator) {
    if (process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register(window.location.origin + swPath).then(function (reg) {
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
}
