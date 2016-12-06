import yo from 'yo-yo'
import { fadeOut, slideLeft } from '../utils'

export default yo`
<div>
  <aside onload=${function (e) { e.style.left = '-16rem' }} id='sidenav' class='absolute h-100 w5 bg-white shadow-3 left-0 top-0 z-2'></aside>
  <div id='sidenav-panel' onclick=${(ev) => {
    fadeOut(ev.target)
    document.getElementById('header').style.opacity = '1'
    slideLeft(document.getElementById('sidenav'))
  }} class='absolute w-100 h-100 cover bg-black-60 o-0 z-1 dn'>
  </div>
</div>`
