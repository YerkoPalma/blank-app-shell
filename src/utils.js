/* global navigator Notification fetch */
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
    if (+el.style.left.match(/-?\d*/)[0] > (initWidth * -1)) {
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
    if (+el.style.left.match(/-?\d*/)[0] < 0) {
      (window.requestAnimationFrame && window.requestAnimationFrame(tick)) || setTimeout(tick, 16)
      // after changing opacity, actually hide the element
    }
  }

  window.requestAnimationFrame(tick)
}

export function registerServiceWorker (swPath) {
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
        // check notification support
        if (!(reg.showNotification)) {
          console.log('Notifications aren\'t supported on service workers.')
          // mark as unsuported
        }
        reg.pushManager.getSubscription()
          .then(subscription => {
            if (!subscription) {
              console.log('Not yet subscribed to Push')
              // We aren't subscribed to push, so set UI
              // to allow the user to enable push
              return
            }
          })
      })
      .catch(function (e) {
        console.error('Error during service worker registration:', e)
      })
    }
  }
}

export function subscribeForPushNotifications (store) {
  // check if push messages are supported
  if (!('PushManager' in window)) {
    console.log('Push messaging isn\'t supported.')
    return
  }
  // check user permission
  if (Notification.permission === 'denied') {
    console.log('The user has blocked notifications.')
    return
  } else if (Notification.permission !== 'granted') {
    Notification.requestPermission()
    console.log('Notification permission not granted yet, asking')
    return
  }
  // when the service worker is installed and active
  navigator.serviceWorker.ready.then(reg => {
    // subscribe!
    reg.pushManager.subscribe({ userVisibleOnly: true })
      .then(subscription => {
        store.dispatch('enablePush')
        const rawKey = subscription.getKey ? subscription.getKey('p256dh') : ''
        const key = rawKey
                    ? window.btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey)))
                    : ''
        const rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : ''
        const authSecret = rawAuthSecret
                      ? window.btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret)))
                      : ''

        const endpoint = subscription.endpoint
        console.log(JSON.stringify({
          endpoint,
          key: key,
          authSecret: authSecret
        }))
        // send subscription
        fetch('/register', {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            endpoint,
            key,
            authSecret
          })
        })
        .catch(function (e) {
          console.error('Error fetching register route:', e)
        })
      })
      .catch(e => {
        if (Notification.permission === 'denied') {
          // The user denied the notification permission which
          // means we failed to subscribe and the user will need
          // to manually change the notification permission to
          // subscribe to push messages
          console.log('Permission for Notifications was denied')
        } else {
          // A problem occurred with the subscription, this can
          // often be down to an issue or lack of the gcm_sender_id
          // and / or gcm_user_visible_only
          console.log('Unable to subscribe to push.', e)
        }
      })
  })
}
