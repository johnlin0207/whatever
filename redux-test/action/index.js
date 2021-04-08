const p = new Promise((rs, rj) => {
  setTimeout(() => {
    rs();
  }, 1000)
})

const ADD = () => {
  return {
    type: 'INCREMENT'
  }
}

const syncADD = () => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(ADD())
    }, 1000)
  }
}


module.exports = {
  ADD,
  syncADD
}