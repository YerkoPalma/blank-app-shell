import header from './components/header'
import sidenav from './components/sidenav'
import yo from 'yo-yo'
import RouterSingleton from './libs/Router'
import createStore from './libs/Store'
import idbKeyval from 'idb-keyval'
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
    state.counter++
    return state
  },
  decrement (state, data) {
    state.counter--
    return state
  },
  enablePush (state, data) {
    state.isPushEnabled = true
    return state
  },
  disblePush (state, data) {
    state.isPushEnabled = false
    return state
  }
}

var state = {
  isPushEnabled: false,
  counter: 0
}
idbKeyval.get('state').then(val => {
  state = val || state
  const store = createStore(state, reducers)
  store.subscribe((prev, curr) => {
    if (document.getElementById('count')) {
      document.getElementById('count').textContent = store.getState().counter
      if (store.getState().counter < 0) {
        document.getElementById('count').classList.add('red')
        document.getElementById('count').classList.remove('green')
      } else {
        document.getElementById('count').classList.add('green')
        document.getElementById('count').classList.remove('red')
      }
    }
    idbKeyval.set('state', store.getState()).then(() => {
      console.log(`saved ${JSON.stringify(store.getState(), null, 2)}`)
    }).catch(err => console.error(err))
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
})
