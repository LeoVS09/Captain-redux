const isAction = a => typeof a == 'function' && "path" in a;

const define = (initState, defineState, path = "/") => {
    for(let key in defineState){
        if(isAction(defineState[key])){
            let action = defineState[key];
            if(key in initState)
                action.path = path + key + "/";
            else
                action.path = path;
        }
        else if(typeof defineState[key] == "object")
            define(initState[key],defineState[key],path + key + "/");
        else if(typeof defineState[key] == "array")
            for(let element of defineState[key])
                if(isAction(element))
                    element.path = path + key + "/";
                else if(typeof element == "object") {
                    let index = defineState[key].index(element);
                    define(initState[key][index],element,path + key + "/" + index + "/");
                }
    }
};

export default define;