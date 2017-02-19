import * as redux from 'redux';
import chai from 'chai';
import chaiAsPromised from "chai-as-promised";
import { describe, it, before, beforeEach, afterEach} from 'mocha';
import captain from "../source";

chai.use(chaiAsPromised);
chai.should();

let initState = {
    data: 1,
    bool: false,
    name: "leo",
    counters:{
        alpha: 2,
        beta: 3
    }
};

describe("Asynchronous", () => {
    let store, createAction, createAsyncAction;
    beforeEach(() => {
        let { createStore } = captain(redux);
        createAction = captain.createAction;
        createAsyncAction = captain.createAsyncAction;
        store = createStore(initState);
    });
    it("should change state", done => {
        let changeState = createAction( (state, data) => ({ data }));
        let startChangeState = createAsyncAction(
            ({ dispatch, getState }, num) => {
                dispatch(changeState(num));
                if(getState().data == num) done();
                else done(getState().data);
            }
        );
        store.dispatch(startChangeState(2));
    });
    it("should return promise", done => {
        let changeState = createAction( (state, data) => ({ data }));
        let startChangeState = createAsyncAction(
            ({ dispatch, getState }, num) =>
                Promise.resolve(dispatch(changeState(num)))
        );
        const num = 2;
        store.dispatch(startChangeState(num))
            .then(() => {
                if(store.getState().data == num) done();
                else done(store.getState().data);
            });
    });
    describe("setTimeout", function(){
        this.timeout(2000);
        it("should change data ", done => {
            let changeState = createAction((state, data) => ({data}));
            let testComplated = createAction((state, res) => done(res));
            let startChangeState = createAsyncAction(
                ({dispatch, getState}, num) => {
                    setTimeout(() => dispatch(changeState(num)), 500);
                    setTimeout(() => getState().data == num ? done() : done(getState().data), 1000);
                }
            );
            let num = 3;
            store.dispatch(startChangeState(num));
        });
        it("should change with promise when dispatched action", done => {
            let changeState = createAction((state, data) => ({data}));
            let testComplated = createAction((state, res) => done(res));
            let startChangeState = createAsyncAction(
                ({dispatch, getState}, num) => {
                    setTimeout(() => dispatch(changeState(num)), 500);
                    return Promise.resolve(dispatch);
                }
            );
            let num = 3;
            store.dispatch(startChangeState(num))
                .then(dispatch => dispatch(testComplated()));
        });
        it("should change with returned promise", done => {
            let changeState = createAction((state, data) => ({data}));
            let increaseData = createAction((state) => ({data : state.data + 1}));
            let startChangeState = createAsyncAction(
                ({dispatch, getState}, num) => {
                    return Promise.resolve(dispatch);
                }
            );
            let num = store.getState().data;
            store.dispatch(startChangeState(num))
                .then(dispatch => dispatch(increaseData()))
                .then(() => setTimeout(() => {
                    if(store.getState().data == num + 1) done();
                    else done(store.getState().data);
                }, 1000));
        });
    });
});