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
  var initWidth = +window.getComputedStyle(el, null).width.match(/(\-?\d*?\.?\d*)(\w*)/)[1]

  var tick = function (timestamp) {
    if (!start) start = timestamp
    var progress = timestamp - start
    el.style.left = +(initLeft - Math.min(progress / 2, initWidth)) + 'px'
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
  var initWidth = +window.getComputedStyle(el, null).width.match(/(\-?\d*?\.?\d*)(\w*)/)[1]

  var tick = function (timestamp) {
    if (!start) start = timestamp
    var progress = timestamp - start
    el.style.left = +(initLeft + Math.min(progress / 2, initWidth)) + 'px'
    if (+el.style.left.match(/-?\d*/)[0] < 0) {
      (window.requestAnimationFrame && window.requestAnimationFrame(tick)) || setTimeout(tick, 16)
      // after changing opacity, actually hide the element
    }
  }

  window.requestAnimationFrame(tick)
}
