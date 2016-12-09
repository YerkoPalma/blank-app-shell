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

    window.addEventListener('popstate', e => {
      console.log('Popstate trigered')
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

  addRoute (pattern, view) {
    console.log(`Adding route for ${pattern}`)
    this.routes[pattern] = new Route(pattern, view)
  }

  setRoot (path) {
    console.log(`Setting route ${path}`)
    this.root = this.getRoute(path) || new Route('/', () => yo`<div></div>`)
  }

  start (selector) {
    console.log(`Starting router on ${selector}`)
    this.rootEl = document.querySelector(selector) || document.body
    if (this.root) yo.update(this.rootEl, this.root.onStart())
  }

  onPopState (e) {
    console.log('OnPopState')
    e.preventDefault()
    this.requestStateUpdate(e)
  }

  getRoute (path) {
    console.log(`Getting to path ${path}`)
    for (var pattern in this.routes) {
      if (this.routes.hasOwnProperty(pattern)) {
        console.log(`pattern = ${pattern}`)
        console.log(`this.routes[pattern] = ${this.routes[pattern]}`)
        console.log(`this.routes[pattern]._urlPattern.match(path) = ${this.routes[pattern]._urlPattern.match(path)}`)
        if (this.routes[pattern]._urlPattern.match(path) !== null) return this.routes[pattern]
      }
    }
  }

  goToPath (path, title = null) {
    console.log(`${window.location.pathname} -> ${path}`)
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
    // TODO
    console.log(`Managing state for ${this.currentRoute.view()}`)
    document.querySelector('main').innerHTML = this.currentRoute.onStart().outerHTML
    // not mounting yet
  }

  requestStateUpdate (e) {
    console.log('Requesting status update')
    this.currentRoute = this.getRoute(e.target !== window
                                      ? e.target.getAttribute('data-route')
                                      : window.location.pathname)

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

  setParams () {
    if (!this.path) return false
    this.params = this._urlPattern.match(this.path)
  }

  onStart () {
    this.path = window.location.pathname
    this.params = this._urlPattern.match(this.path)
    return this.view(this.params)
  }
}
