# Captain-redux
it redux without reducers.

Captain most simple and fastest for developing store container based on redux.

## How It Works

This library allows you use redux without constans.
Actions it's really actions, they do what you want and not need create functions which just return object acceptable for dispatching.

## Usage
Let's take a look at a simple example.

```js
import * as redux from "redux"
import captain from "captain-redux"

//bind captain and redux
let {createStore, createAction } = captain(redux);

//create store with initial state
let store = createStore({
    counter: 1,
    user: {
        post: "Capitan",
        firstName: "Jack",
        lastName: "Sparrow"
    }
});

//create reducers in actions
//in captain-redux all actions it's functions which recive (state, ....args)
//args - it all parameters which put when action dispath
let setCounter = createAction((state,counter) => ({ counter }));
//action reurn only changed field

store.dispatch(setCounter(3));

console.log(store.getState());
//{
//  counter: 3,
//  user: {
//      post: "Capitan",
//      firstName: "Jack",
//      lastName: "Sparrow"
//   }
//}

setFirstName = createAction((state,firstName) => ({ firstName }));

//define allow tell store what action can change
captain.define({
    user: setFirstName
});

store.dispatch(setFirstName("Bob"));

console.log(store.getState());
//{
//  counter: 3,
//  user: {
//      post: "Capitan",
//      firstName: "Bob",
//      lastName: "Sparrow"
//   }
//}
```

## Installation

```
npm install --save captain-redux
```