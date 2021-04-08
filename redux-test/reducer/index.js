const combineReducers = require('../../redux/combineReducer')

function count(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

module.exports =  combineReducers({
  count
})