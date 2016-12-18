import header from './components/header'
import sidenav from './components/sidenav'
import yo from 'yo-yo'
import RouterSingleton from './libs/Router'
import createStore from './libs/Store'
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
const reducers = {
  increment (state, data) {
    return ++state
  },
  decrement (state, data) {
    return --state
  }
}

var state = 0
const store = createStore(state, reducers)
store.subscribe((prev, curr) => {
  document.getElementById('count').textContent = store.getState()
  if (store.getState() < 0) {
    document.getElementById('count').classList.add('red')
    document.getElementById('count').classList.remove('green')
  } else {
    document.getElementById('count').classList.add('green')
    document.getElementById('count').classList.remove('red')
  }
})

// start router
const router = RouterSingleton.getRouter()
router.setStore(store)
router.addRoute('/', HomeView)
router.addRoute('/about', AboutView)
router.addRoute('/user/:id', UserView)
router.addRoute('/counter', CounterView, () => {
  document.getElementById('increment').addEventListener('click', e => store.dispatch('increment'))
  document.getElementById('decrement').addEventListener('click', e => store.dispatch('decrement'))
})
router.setRoot('/')
router.start('#app')
