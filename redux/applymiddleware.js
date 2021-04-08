/**
 * 生成中间件的洋葱模型，用于依次包装dispatch，例如输入compose(f1,f2)(dispatch)
 * 输出f1(f2(dispatch))
 * @param fns
 * @returns {function(*=): *}
 */
const compose = (...fns) => {
    return (dispatch) => {
        return fns.reduceRight((acc, fn) => fn(acc), dispatch)
    }
};

const applyMiddleware = (...middlewares) => {
    return (next) => (reducer, initialState) => {
        let store = next(reducer, initialState);
        let dispatch = store.dispatch;
        let middlewareAPI = { //定义初始store对象
            getState: store.getState,
            dispatch: (action) => dispatch(action)
        };
        let chain = middlewares.map((middleware) => middleware(middlewareAPI));
        dispatch = compose(...chain)(store.dispatch); //本例中compose执行结果(action)=>{...; next(action); ...}
        return {
            ...store,
            dispatch
        }
    }
};

module.exports =  applyMiddleware;