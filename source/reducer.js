import constans from "./constans.json";

const reducerWrapper = (reducer,initState) =>
    (state = initState, args) => ({
        ...state,
        ...reducer(state,...args)
    });

//!  not support for simple redux
const reducerLeo = (state,action) => {
    if(action.type != constans.REDUXLEO_ACTION)  return state;
    if(action.path == "/") return reducerWrapper(action.do, {})(state, action.args);
    let path = action.path.substr(1);
    let index = path.indexOf("/");
    let key = path.substr(0,index);
    path = path.substr(index);
    let result = {...state};
    result[key] = reducerLeo(state[key], {...action, path});
    return result;
};

export default reducerLeo;