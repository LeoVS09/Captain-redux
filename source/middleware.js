import constans from "./constans"

// Async middleware
export const async = store => next => action => //TODO: more variants middleware async
    action.type === constans.REDUXLEO_ASYNC_ACTION ?
        action.do(store, ...action.args) :
        next(action);