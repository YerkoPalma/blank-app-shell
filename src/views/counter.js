import yo from 'yo-yo'
import createStore from '../libs/Store'

const reducers = {
  increment (state, data) {
    return data ? state + data : state++
  },
  decrement (state, data) {
    return data ? state - data : state--
  }
}

var state = 0
const store = createStore(state, reducers)
store.subscribe(() => {
  debugger
  window.requestAnimationFrame(() => {
    document.getElementById('count').textContent = store.getState()
  })
})

export default params => yo`
<div class="bg-washed-blue baskerville tc">
  <h2 id="count" class="f1 f-headline-l code mb3 fw9 dib tracked-tight light-purple">0</h1>
  <div class="flex items-center justify-center pa4">
    <a href="#" onclick=${store.dispatch('increment')} class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box mr4">
      <i class="material-icons">add</i>
    </a>
    <input class="input-reset ba w3 b--black-20 pa3 db mr4" type="number">
    <a href="#" onclick=${store.dispatch('decrement')} class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box">
      <i class="material-icons">remove</i>
    </a>
  </div>
</div>`
