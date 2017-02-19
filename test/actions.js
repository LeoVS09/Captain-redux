import { should } from 'chai';
import { describe, it, before, beforeEach, afterEach} from 'mocha';
import * as actions from "../source/actions.js"

should();
function think(a) {
    return a;
}
describe("Action", () => {
    describe("createAction", () => {
        it("should create object of action with function in field", () => {
            actions.createAction(think)().do.should.equal(think);
        });
        it("should create object of action and pass arguments when action called", () => {
            let word = {a:1,b:"c"};
            let args = [word,word.a,word.b];
            actions.createAction(think)(...args)
                .args.forEach((el,i) => el.should.equal(args[i]));
        });
    });
    describe("createAsyncAction", () => {
        it("should create object of action with function in field", () => {
            actions.createAsyncAction(think)().do.should.equal(think);
        });
        it("should create object of action and pass arguments when action called", () => {
            let word = {a:1,b:"c"};
            let args = [word,word.a,word.b];
            actions.createAsyncAction(think)(...args)
                .args.forEach((el,i) => el.should.equal(args[i]));
        });
    });
});

