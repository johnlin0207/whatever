/**
 * 将初始化时创建的reducersObj存放于闭包中，每次调用dispatch时调用返回的(state,action)=>{}来重新创建新的state
 * @param reducersObj
 * @returns {function(*=, *=): {}}
 */
const combineReducers = (reducersObj) => {
    return (state = {}, action) => {
        return Object.keys(reducersObj).reduce((accumulator, reducerName) => {
            accumulator[reducerName] = reducersObj[reducerName](state[reducerName], action);
            return accumulator
        }, state);
    }
};
module.exports =  combineReducers;