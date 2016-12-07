import UrlPattern from 'url-pattern'
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
 *  router.setRoute('/')
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
    this.routes = {}
    this.currentPath = null
    this.currentRoute = null
    this.previousRoute = null
    this.root = null

    window.addEventListener('popstate', e => {
      this.onPopState(e)
    })
  }

  addRoute (pattern, view) {
    this.routes[pattern] = new Route(pattern, view)
  }

  setRoot (path) {
    this.root = this.getRoute(path) || new Route('/', () => yo`<div></div>`)
  }

  onPopState (e) {
    e.preventDefault()
    this.requestStateUpdate()
  }

  getRoute (path) {
    for (var pattern in this.routes) {
      if (this.routes.hasOwnProperty(pattern)) {
        if (this.routes[pattern]._urlPattern.match(path) !== null) return this.routes[pattern]
      }
    }
  }

  goToPath (path, title = null) {
    console.log('goToPath() path = ' + path)
    // Only process real changes.
    if (path === window.location.pathname) {
      return
    }
    this.previousRoute = this.currentRoute || this.root
    this.currentRoute = this.getRoute(this.currentPath)
    this.currentPath = path

    window.history.pushState(undefined, title, path)
    window.requestAnimationFrame(() => {
      this.manageState()
    })
  }

  manageState () {
    // TODO
    yo.update(this.previousRoute(), this.currentRoute())
    // not mounting yet
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
    this._urlPattern = new UrlPattern(pattern)
    this.view = view
    this.params = null
    this.path = null
  }

  getParams () {
    if (!this.path) return false
    return this.params
  }

  onStart () {
    this.path = window.location.pathname
    this.params = this._urlPattern.match(this.path)
    this.view(this.params)
  }
}
