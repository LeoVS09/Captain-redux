import constans from "./constans";

const reducerWrapper = (reducer,initState) =>
    (state = initState, args) => ({
        ...state,
        ...reducer(state,...args)
    });


const reducerLeo = (reducer = (state => state)) =>
    function leo(state,action){
        if(action.type != constans.REDUXLEO_ACTION)  return reducer(state,action);
        if(action.path == "/") return reducerWrapper(action.do, {})(state, action.args);
        let path = action.path.substr(1);
        let index = path.indexOf("/");
        let key = path.substr(0,index);
        path = path.substr(index);
        let result = {...state};
        result[key] = leo(state[key], {...action, path});
        return result;
    };

export default reducerLeo;