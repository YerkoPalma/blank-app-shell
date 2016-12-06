import yo from 'yo-yo'
import { fadeOut, slideLeft } from '../utils'

export default yo`
<div>
  <aside onload=${function (e) { e.style.left = '-25%' }} id='sidenav' class='absolute h-100 w-25 bg-white shadow-3 left-0 top-0 z-2'>
    <div style='background-image: url(src/images/green-bg.png)' class='absolute cover w-100 h4'>
      <h2 class='white'>App Shell</h2>
    </div>
  </aside>
  <div id='sidenav-panel' onclick=${(ev) => {
    fadeOut(ev.target)
    document.getElementById('header').style.opacity = '1'
    slideLeft(document.getElementById('sidenav'))
  }} class='absolute w-100 h-100 cover bg-black-60 o-0 z-1 dn'>
  </div>
</div>`
