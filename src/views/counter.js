import yo from 'yo-yo'

export default (params, store) => {
  return yo`
  <div class="bg-washed-blue baskerville tc">
    <h2 id="count" class="f1 f-headline-l code mb3 fw9 dib tracked-tight ${store.getState() < 0 ? 'red' : 'green'}">${store.getState()}</h1>
    <div class="flex items-center justify-center pa4">
      <a id='increment' class="pointer shadow-hover f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box mr4">
        <i class="material-icons">add</i>
      </a>
      <a id='decrement' class="pointer shadow-hover f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box">
        <i class="material-icons">remove</i>
      </a>
    </div>
  </div>`
}
