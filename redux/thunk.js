export const thunk = (store) => (next) => (action) => {
    if (typeof action === 'function') {
        action(next)
    } else {
        next(action)
    }
};