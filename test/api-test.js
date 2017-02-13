import * as redux from 'redux';
import { should } from 'chai';
import { describe, it, before, beforeEach, afterEach} from 'mocha';
import captain from "../source";

should();

let initState = {
    data: {
        first: 1,
        second: 2
    },
    bool: false,
    name: "leo",
    counters:{
        alpha: 2,
        beta: 3
    }
};


describe("Captain", () => {
    describe("createStore", () => {
        let store;
        before(() => {
            let { createStore} = captain(redux);
            store = createStore(initState);
        });
        it("should create store with initState and get state from store", () => {
            store.getState().should.be.a("object");
        });
        it("should create store with initState and get state equal initState", () => {
            store.getState().should.equal(initState);
        });
    });
    describe("createAction", () => {
        let store,createAction;
        beforeEach(() => {
            let { createStore } = captain(redux);
            createAction = captain.createAction;
            store = createStore(initState);
        });
        it("should shift store", () => {
            let action = createAction((state, a) => ({
               data:{
                   ...state.data,
                   first: a
               }
            }));

            for(let i = 0; i < 10; i++) {
                store.dispatch(action(i));
                store.getState().data.first.should.equal(i);
            }

        });
    });
    describe("define action state field", () => {
        let store, setFirst, setBoolAndName, setAlpha, setBeta;
        beforeEach(() => {
            let {createStore, createAction, define} = captain(redux);
            setFirst = createAction((state, first) => ({ first }));
            setBoolAndName = createAction((state, bool, name) => ({bool, name}));
            setAlpha = createAction((state, alpha) => ({ alpha }));
            setBeta = createAction((state, beta) => ({ beta }));
            store = createStore(initState);
            define(initState,{
                setBoolAndName,
                data: setFirst,
                counters: [setAlpha, setBeta]
            });
        });
        it("should shift state only in definite field", () => {
            for(let i = 0; i < 10; i++) {
                store.dispatch(setFirst(i));
                store.getState().data.first.should.equal(i);
            }
        });
        it("should shift state when action defined all state", () => {
            for(let i = 0; i < 10; i++) {
                store.dispatch(setBoolAndName(!i,"" + i));
                store.getState().bool.should.equal(!i);
                store.getState().name.should.equal("" + i);
            }
        });
        it("should shift state from several reducers in one field", () => {
            for(let i = 0; i < 5; i++)
                for(let k = 0; k < 5; k++) {
                    store.dispatch(setAlpha(i));
                    store.dispatch(setBeta(k));
                    store.getState().counters.alpha.should.equal(i);
                    store.getState().counters.beta.should.equal(k);
                }
        });
        // afterEach(() => console.log("state:",store.getState()));
    });
});


