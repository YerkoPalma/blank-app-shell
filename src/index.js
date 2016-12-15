import header from './components/header'
import sidenav from './components/sidenav'
import yo from 'yo-yo'
import RouterSingleton from './libs/Router'
import HomeView from './views/home'
import AboutView from './views/about'
import UserView from './views/user'
import CounterView from './views/counter'
import { registerServiceWorker } from './utils'

// render main content
const oldHeader = document.querySelector('header')
const newHeader = yo.update(oldHeader, header)
document.body.insertBefore(sidenav, newHeader)

// register service-worker
registerServiceWorker('/service-worker.js')

// Initial state

// start router
const router = RouterSingleton.getRouter()
router.addRoute('/', HomeView)
router.addRoute('/about', AboutView)
router.addRoute('/user/:id', UserView)
router.addRoute('/counter', CounterView)
router.setRoot('/')
router.start('#app')
