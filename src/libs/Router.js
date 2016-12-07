import { parseRoute } from '../utils'
import yo from 'yo-yo'

/*
 *  Router usage:
 *
 *  import RouterSingleton from './RouterSingleton'
 *
 *  const router = RouterSingleton.getRouter()
 *  router.addRoute('/', HomeView)
 *  router.addRoute('/about', AboutView)
 *  router.addRoute('/user/:id', UserView)
 *
 *  Views are supposed to be yo-yo functions
 *
 *  Anchor tags with a data-route property also trigger views, e.g.
 *  <a data-route="/">Home</a>
 *  <a data-route="/user/123">John Profile</a>
 */

export default class RouterSingleton {

  static getRouter () {
    if (typeof window.RouterInstance_ !== 'undefined') {
      return window.RouterInstance_
    }

    window.RouterInstance_ = new Router()

    return window.RouterInstance_
  }

}

class Router {
  constructor () {
    this.routes = []
    this.currentPath = null
    this.defaultActivity = null

    window.addEventListener('popstate', e => {
      this.onPopState(e)
    })
  }

  addRoute (pattern, view) {
    this.routes.push(new Route(pattern, view))
  }

  onPopState (e) {
    e.preventDefault()
    this.requestStateUpdate()
  }

  goToPath (path, title = null) {
    console.log('goToPath() path = ' + path)
    // Only process real changes.
    if (path === window.location.pathname) {
      return
    }

    window.history.pushState(undefined, title, path)
    window.requestAnimationFrame(() => {
      this.manageState()
    })
  }

  manageState () {
    // TODO
    yo.update()
  }

  requestStateUpdate () {
    window.requestAnimationFrame(() => {
      this.manageState()
    })
  }
}

class Route {
  constructor (pattern, view) {
    this.pattern = pattern
    this.view = view
    this.params = parseRoute(pattern, null)
    this.path = null
  }

  getParams () {
    if (!this.path) return false
    return this.params
  }

  onStart () {
    this.path = '' // should be the href?
    this.params = parseRoute(this.pattern, this.path)
    this.view(this.params)()
  }
}
