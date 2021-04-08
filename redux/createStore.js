const createStore = (reducer, initialState, enhancer) => {
  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
    enhancer = initialState
    initialState = undefined
  }
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }
    return enhancer(createStore)(reducer, initialState)
  }

  const currentReducer = reducer
  let currentState = initialState
  const listeners = []
  let isDispatching = false

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application. */
  function getState() {
    return currentState
  }

  function subscribe(listener) {
    listeners.push(listener)
    let isSubscribed = true
    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }
      isSubscribed = false
      let index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  function dispatch(action) {
    // if (!isPlainObject(action)) {
    //   throw new Error(
    //       'Actions must be plain objects. ' +
    //       'Use custom middleware for async actions.'
    //   )
    // }
    if (typeof action.type === 'undefined') {
      throw new Error(
          'Actions may not have an undefined "type" property. ' +
          'Have you misspelled a constant?')
    }
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }
    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }
    listeners.slice().forEach(listener => listener())
    return action
  }

  // function replaceReducer(nextReducer) {
  //   currentReducer = nextReducer
  //   dispatch({type: ActionTypes.INIT})
  // }
  return {getState, dispatch, subscribe}
};

module.exports = createStore