import header from './components/header'
import sidenav from './components/sidenav'
import yo from 'yo-yo'

document.addEventListener('DOMContentLoaded', e => {
  const oldHeader = document.querySelector('header')
  const newHeader = yo.update(oldHeader, header)
  document.body.insertBefore(sidenav, newHeader)
})
