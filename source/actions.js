import constans from "./constans";

const createActionWrapper =
    (type) => (action) => {
        function reducer(...args){
            return {
                type,
                do: action,
                args,
                path: reducer.path
            };
        }
        reducer.path = "/";
        return reducer;
    };

export const createAction = createActionWrapper(constans.REDUXLEO_ACTION);

export const createAsyncAction = createActionWrapper(constans.REDUXLEO_ASYNC_ACTION);