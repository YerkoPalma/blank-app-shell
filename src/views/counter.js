import yo from 'yo-yo'

export default (params, store) => {
  return yo`
  <div class="bg-washed-blue baskerville tc">
    <h2 id="count" class="f1 f-headline-l code mb3 fw9 dib tracked-tight light-purple">${store.getState()}</h1>
    <div class="flex items-center justify-center pa4">
      <a href="#" id='increment' class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box mr4">
        <i class="material-icons">add</i>
      </a>
      <input class="input-reset ba w3 b--black-20 pa3 db mr4" type="number">
      <a href="#" id='decrement' class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box">
        <i class="material-icons">remove</i>
      </a>
    </div>
  </div>`
}