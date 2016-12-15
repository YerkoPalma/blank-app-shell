'use strict'

/*
  import createStore from './'

  const reducers = {
    increment (state, data) => data ? state + data : state++,
    decrement (state, data) => data ? state - data : state--
  }

  var state = 0
  const store = createStore(state, reducers)
  store.subscribe(() => console.log(store.getState()))

  store.dispatch('increment') // 1
  store dispatch('increment') // 2
  store.dispatch('decrement', 12) // -10
*/
export default function (state, reducers) {
  var actions = Object.keys(reducers)
  var currentAction = actions[0]
  var currentState = state
  var prevState = null
  var currentListener

  function dispatch (action, data) {
    if (actions.indexOf(action) < 0) {
      throw new Error(`Action '${action}' not registered in reducer.`)
    }
    currentAction = action
    prevState = currentState
    currentState = reducers[currentAction](currentState, data)
    if (typeof currentListener === 'function') currentListener(prevState, currentState)
  }

  function subscribe (listener) {
    currentListener = listener
  }

  function getState () {
    return currentState
  }

  return {
    dispatch,
    subscribe,
    getState
  }
}
