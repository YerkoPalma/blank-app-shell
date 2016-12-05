import yo from 'yo-yo'
import { fadeIn } from '../utils'
import sideNav from './sidenav'

export default yo`
<div id='header'>
  <header class='bg-dark-green ph5 pt5 pb3 relative shadow-3'>
    <button onclick=${() => {
      fadeIn(sideNav)
      document.getElementById('header').style.opacity = '0.4'
    }} role='tab' class='link dim pointer absolute top-1 left-1 input-reset button-reset bg-transparent bn w3 h2'>
      <span class='absolute bg-white w-80 h-25 mt0 left-0 top-0 mh1'></span>
      <span class='absolute bg-white w-80 h-25 mt3 left-0 top-0 mh1'></span>
      <span class='absolute bg-white w-80 h-25 mt4 left-0 top-0 mh1'></span>
    </button>
    <h1 class='tc washed-blue'>App Shell</h1>
  </header>
</div>
`
