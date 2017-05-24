var html = require('bel')
var increment = require('../store/actions').increment
var decrement = require('../store/actions').decrement

module.exports = function (params, store) {
  return html`<div>
  <h1>Profile: ${params.user}</h1>
  <p>current time <span id="time">${new Date()}</span></p>
  <button onclick=${function (e) { store.dispatch(increment()) }}>+</button>
  <button onclick=${function (e) { store.dispatch(decrement()) }}>-</button>
  <p>current count ${store.getState()}</p>
</div>`
}
