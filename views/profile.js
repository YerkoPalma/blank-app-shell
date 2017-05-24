var html = require('bel')

module.exports = function (params, store) {
  return html`<div>
  <h1>Profile: ${params.user}</h1>
  <p>current time <span id="time">${ new Date() }</span></p>
</div>`
}
