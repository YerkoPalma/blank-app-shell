import yo from 'yo-yo'
import { fadeOut } from '../utils'

export default yo`
<div onclick=${(ev) => {
      fadeOut(ev.target)
      document.getElementById('header').style.opacity = '1'
    }} class='absolute w-100 h-100 cover bg-black-60 o-0'>
</div>`
