import header from './components/header'
import sidenav from './components/sidenav'
import yo from 'yo-yo'
import RouterSingleton from './libs/Router'
import HomeView from './views/home'
import AboutView from './views/about'
import UserView from './views/user'

document.addEventListener('DOMContentLoaded', e => {
  const oldHeader = document.querySelector('header')
  const newHeader = yo.update(oldHeader, header)
  document.body.insertBefore(sidenav, newHeader)

  const router = RouterSingleton.getRouter()
  router.addRoute('/', HomeView)
  router.addRoute('/about', AboutView)
  router.addRoute('/user/:id', UserView)
  router.setRoot('/')
  router.start('#app')
})
