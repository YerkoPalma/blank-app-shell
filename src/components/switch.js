import yo from 'yo-yo'

export default (fn) => {
  return yo`
  <div onclick=${(ev) => {
    const first = ev.target.parentElement.querySelector('span.js-first')
    const last = ev.target.parentElement.querySelector('span.js-last')
    first.classList.toggle('bg-near-white')
    first.classList.toggle('bg-dark-blue')
    first.classList.toggle('left-1')
    first.classList.toggle('left--1')
    last.classList.toggle('bg-moon-gray')
    last.classList.toggle('bg-light-blue')
    if (typeof fn === 'function') fn(ev)
  }} class="relative pointer">
    <span class="js-first bg-near-white w1 br-100 h1 shadow-1 z-1 pa1 left--1 absolute" style="transition: all 400ms ease-in-out"></span>
    <input class="dn" type="checkbox" />
    <span class="js-last bg-moon-gray br-pill w2 h1 absolute" style="top:.25rem; transition: all 400ms ease-in-out"></span>
  </div>
  `
}
