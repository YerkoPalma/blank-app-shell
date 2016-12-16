import UrlPattern from 'url-pattern'
import yo from 'yo-yo'
import { fadeOut, slideLeft } from '../utils'

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
 *  router.start('#app')
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
    this.rootEl = null
    this.store = null

    window.addEventListener('popstate', e => {
      this.onPopState(e)
    })

    let links = document.querySelectorAll('[data-route]')
    Array.prototype.forEach.call(links, link => {
      link.addEventListener('click', event => {
        event.preventDefault()
        this.goToPath(link.getAttribute('data-route'))
        // close sidenav if open
        if (document.getElementById('sidenav').classList.contains('open')) {
          const sideNavPanel = document.getElementById('sidenav-panel')
          fadeOut(sideNavPanel)
          document.getElementById('header').style.opacity = '1'
          slideLeft(document.getElementById('sidenav'))
          document.getElementById('sidenav').classList.remove('open')
        }
      })
    })
  }

  setStore (store) {
    this.store = store
  }

  addRoute (pattern, view, cb) {
    this.routes[pattern] = new Route(pattern, view, cb)
  }

  setRoot (path) {
    console.log(`Setting root ${path}`)
    this.root = this.getRoute(path) || new Route('/', () => yo`<div></div>`)
  }

  start (selector) {
    console.log(`Starting router on ${selector}`)
    this.rootEl = document.querySelector(selector) || document.body
    this.requestStateUpdate()
  }

  onPopState (e) {
    e.preventDefault()
    this.requestStateUpdate(e)
  }

  getRoute (path) {
    for (var pattern in this.routes) {
      if (this.routes.hasOwnProperty(pattern)) {
        if (this.routes[pattern]._urlPattern.match(path) !== null) return this.routes[pattern]
      }
    }
  }

  goToPath (path, title = null) {
    // Only process real changes.
    if (path === window.location.pathname) {
      return
    }

    this.currentPath = path
    this.previousRoute = this.currentRoute || this.root
    this.currentRoute = this.getRoute(this.currentPath)

    window.history.pushState(undefined, title, path)
    window.requestAnimationFrame(() => {
      this.manageState()
    })
  }

  manageState () {
    document.querySelector('main').innerHTML = this.currentRoute.onStart(this.store).outerHTML
    debugger
    if (typeof this.currentRoute.cb === 'function') {
      try {
        this.currentRoute.cb()
      } catch (ex) {
        console.error(ex)
      }
    }
  }

  requestStateUpdate (e) {
    this.currentRoute = this.getRoute(e && e.target !== window
                                      ? e.target.getAttribute('data-route')
                                      : window.location.pathname)

    window.requestAnimationFrame(() => {
      this.manageState()
    })
  }
}

class Route {
  constructor (pattern, view, cb) {
    this.pattern = pattern
    this.cb = cb
    this._urlPattern = new UrlPattern(pattern)
    this.view = view
    this.params = null
    this.path = null
  }

  getParams () {
    if (!this.path) return false
    return this.params
  }

  setParams () {
    if (!this.path) return false
    this.params = this._urlPattern.match(this.path)
  }

  onStart (store) {
    this.path = window.location.pathname
    this.params = this._urlPattern.match(this.path)
    return this.view(this.params, store)
  }
}
