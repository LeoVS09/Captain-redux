import reducerLeo from "./reducer"
import * as actions from "./actions"
import { async } from "./middleware"
import define from "./define"

const typer = (fields,types) => (...args) => {
    let result = {};
    args.forEach((argument) => {
        while(types.length && typeof argument != types.shift()) fields.shift();
        result[fields.shift()] = argument;
    });
    return result;
};

const copy = (target, source) => {
    for (let key in source)
        target[key] = source[key];
};

function captain(redux){
    copy(captain, redux);

    captain.applyMiddleware = (...args) =>
        redux.applyMiddleware(async,...args);

    const filter = typer(["reducer",  "state",  "enhancer"],
                         ["function", "object", "function"]);
    captain.createStore = (reducer, initState, enhancer) => {
        let { state } = filter(reducer,initState,enhancer);
        if(!state) state = {};
        return redux.createStore(
            reducerLeo, //! not support another reducers
            state,
            redux.applyMiddleware(async) //! not support another middleware
        );
    };

    copy(captain, actions);
    captain.define = define;
    return captain;
}

export default captain;

