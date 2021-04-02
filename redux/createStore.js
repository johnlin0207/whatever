export const createStore = (reducer, preloadedState, enhancer) => {
    let state, listeners = [];
    const getState = () => state;
    const dispatch = (action) => {
        if (typeof preloadedState === 'function') {
            enhancer = preloadedState
        }
        if (typeof enhancer === 'function') {
            enhancer(createStore)(reducer, preloadedState, enhancer);
        }
        state = reducer(state, action);
        listeners.forEach((listener) => {
            listener(state)
        })
    };

    const subscribe = (listener) => {
        if (typeof listener !== 'function') {
            TypeError('subscribe listener must be a function');
            return () => {
            }
        }
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener); //listener是个闭包变量，用于移除监听
        }
    };

    dispatch({});

    return {getState, dispatch, subscribe};
};
