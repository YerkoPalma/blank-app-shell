import header from './components/header'
import yo from 'yo-yo'

document.addEventListener('DOMContentLoaded', e => {
  const oldHeader = document.querySelector('header')
  yo.update(oldHeader, header)
})
