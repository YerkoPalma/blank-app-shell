import yo from 'yo-yo'
import { fadeOut, slideLeft } from '../utils'

export default yo`
<div>
  <aside onload=${function (e) { e.style.left = `-${window.getComputedStyle(e, null).width}` }} id='sidenav' class='absolute h-100 w-75 w-25-l w-50-m bg-white shadow-3 left-0 top-0 z-2'>
    <div style='background-image: url(${window.location.origin}/src/images/green-bg.png)' class='absolute cover w-100 h4'>
      <h2 class='white w-80 tl pl3 mt5'>App Shell</h2>
    </div>
    <ul class='absolute top-2 mt6 list light-silver f2'>
      <li class='flex flex-row flex-wrap justify-start content-center items-center mv3'>
        <i class="material-icons">info_outline</i> 
        <a href="#" data-route="/" class="link f4 silver hover-dark-green self-center ml2">Home</a>
      </li>
      <li class='flex flex-row flex-wrap justify-start content-center items-center mv3'>
        <i class="material-icons">info_outline</i> 
        <a href="#" data-route="/about" class="link f4 silver hover-dark-green self-center ml2">About</a>
      </li>
      <li class='flex flex-row flex-wrap justify-start content-center items-center mv3'>
        <i class="material-icons">info_outline</i> 
        <a href="#" data-route="/user/123" class="link f4 silver hover-dark-green self-center ml2">Profile</a>
      </li>
      <li class='flex flex-row flex-wrap justify-start content-center items-center mv3'>
        <i class="material-icons">info_outline</i> 
        <a href="#" data-route="/counter" class="link f4 silver hover-dark-green self-center ml2">Counter</a>
      </li>
    </ul>
  </aside>
  <div id='sidenav-panel' onclick=${(ev) => {
    fadeOut(ev.target)
    document.getElementById('header').style.opacity = '1'
    slideLeft(document.getElementById('sidenav'))
    document.getElementById('sidenav').classList.remove('open')
  }} class='absolute w-100 h-100 cover bg-black-60 o-0 z-1 dn'>
  </div>
</div>`
