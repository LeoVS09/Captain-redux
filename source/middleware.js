import constans from "./constans.json"

// Async middleware
export const async = store => next => action => //TODO: more variants middleware async
    action.type === constans.REDUXLEO_ASYNC_ACTION ?
        action.do(next, store.getState,...action.args) : next(action);