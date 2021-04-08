const logger = (store) => next => action => {
    console.log('will dispatch', action)
    next(action)
    console.log('state after dispatch', store.getState())
}

module.exports = logger