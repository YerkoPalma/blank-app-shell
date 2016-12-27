import yo from 'yo-yo'

export default (fn) => {
  return yo`
  <div id="switch" onclick=${(el) => { alert('hey!') }} class="relative pointer">
    <span class="bg-near-white w1 br-100 h1 shadow-1 z-1 absolute"></span>
    <input class="dn" type="checkbox" />
    <span class="bg-moon-gray br-pill w2 h1 absolute"></span>
  </div>
  `
}
