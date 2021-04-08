const createStore =  require('../redux/createStore')
const reducer = require('./reducer/index')
const applyMiddleware = require('../redux/applymiddleware')
const logger = require('../redux/logger')
const thunk = require('../redux/thunk')
const {ADD, syncADD} = require('./action')

const store = createStore(reducer, {}, applyMiddleware(logger, thunk))
// console.log(store)

const dispath = store.dispatch;
dispath(syncADD());
const state = store.getState();
console.log(state)

setTimeout(() => {
  const state = store.getState();
  console.log(state)
}, 1500)