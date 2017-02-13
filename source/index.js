import reducerLeo from "./reducer"
import * as actions from "./actions"
import { async } from "./middleware"
import define from "./define"

const typer = (f,t) => (...args) => {
    let result = {}, fields = f.slice(), types = t.slice();
    args.forEach((argument) => {
        while(types.length && typeof argument != types.shift()) fields.shift();
        result[fields.shift()] = argument;
    });
    return result;
};

const filter = typer(["reducer",  "state",  "enhancer"],
                     ["function", "object", "function"]);

const copy = (target, source) => {
    for (let key in source)
        target[key] = source[key];
};

function captain(redux){
    copy(captain, redux);

    captain.createStore = (...args) => {
        let { reducer, state, enhancer } = filter(...args);
        if(!state) state = {};
        return redux.createStore(
            reducerLeo(reducer),
            state,
            enhancer ?
                redux.compose(redux.applyMiddleware(async),enhancer):
                redux.applyMiddleware(async)
        );
    };
    
    return captain;
}
copy(captain, actions);
captain.define = define;

export default captain;

