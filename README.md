# Captain-redux
It's redux without reducers.

Captain is simplest and fastest for developing store container based on redux.

## How It Works

This library allows you to use redux without constans.
Actions it's really actions, they do what you want and not need to create functions which just return object acceptable for dispatching.

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
//in captain-redux all actions is functions which recive (state, ....args)
//args - it all parameters passed during dispath
let setCounter = createAction((state,counter) => ({ counter }));
//action returns only changed field

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

//define tell to store what action can change the specified property
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

## Tutorial

Captain allows you to control state of you app just by writing only business logic

CreateAction is easiest way to change state of you app
```js
//actions.js
import { createAction } from "captain-redux"

//action it is function which recive state
//...and parameters put when action will be performed 
export let addTodo = createAction((state, id, text) => ({
        todos: [...state.todos, { id, text }]
    })
);
//action return only changed part of state

```

Let's write default state
```js
//state.js

export default const initState = {
    nameApp: "Todo list",
    todos: [
        {
            id: 1,
            text: "understand captain"
        }
     ]
};
```

And create store
```js
//store.js
import * as redux from 'redux'
import captain from "captain-redux"
import initState from './state.js'

let { createStore } = captain(redux);

export default let store = createStore(initState);
```

It's all!
We can change state of your app
```js
//index.js
import store from './store.js'
import { addTodo } from './actions.js'

store.dispatch(addTodo(2,"drink rum"));

console.log(store.getState());
//{
//    nameApp: "Todo list",
//    todos: [
//        {
//            id: 1,
//            text: "understand captain"
//        },
//        {
//            id: 2,
//            text: "drink rum"
//        }
//     ]
//}
```

But why we always write id of todo himself? Lets add counter of todo in your state.
```js
//state.js

export default const initState = {
    nameApp: "Todo list",
    countOfTodos: 1,
    todos: [
        {
            id: 1,
            text: "understand captain"
        }
     ]
};
```

And change action
```js
 //actions.js
 //...
 export let addTodo = createAction((state, text) => ({
         countOfTodos: state.countOfTodos+1
         todos: [...state.todos, { state.countOfTodos+1, text }]
     })
 ); 
 ```
 
 It's work, but we can do your state more logical. Let's just merge todos and their count in one object.
```js
//state.js

export default const initState = {
     nameApp: "Todo list",
     data: {
        countOfTodos: 1,
        todos: [
            {
                id: 1,
                text: "understand captain"
            }
        ]
     }
};
```
 
 And tell to your action where state must be changed
```js
  //actions.js
  import { createAction, define } from "captain-redux"
  import initState from "state.js"
  
  let addTodo = createAction((state, text) => ({
          countOfTodos: state.countOfTodos+1
          todos: [...state.todos, { state.countOfTodos+1, text }]
      })
  ); 
  
  // Here we defines that
  define(initState,{
    data: addTodo
  });
  
  export addTodo;
  ```
  
 Let's see how it will work
```js
 //index.js
 import store from './store.js'
 import { addTodo } from './actions.js'
 
 store.dispatch(addTodo("drink more rum"));
 
 console.log(store.getState());
 //{
 //    nameApp: "Todo list",
 //    todos: [
 //        {
 //            id: 1,
 //            text: "understand captain"
 //        },
 //        {
 //            id: 2,
 //            text: "drink more rum"
 //        }
 //     ]
 //}
 ```
 
## API
 
###define(object)
Receives object with keys indentical to your state's keys and values that are actions which processes this fields.
Example
```js
import {define} from 'captain-redux'
import {setDate, addUser, buy, sell} from './actions.js'
import initState from './state.js'
console.log(initState);
//{   
//    users: {
//        count: 42,
//        base: [ {name: "Jack" }, ...]
//    },
//    goods:{
//        count: 150,
//        base: [ {name: "phone", price: 300 }, ...]
//    },
//    date: '14.11.17',
//    money: "1 million"
//}

define(initState,{   
    users: addUser,
    goods: [buy, sell],
    //date: setDate - it's not work, because date is not object
    setDate // its action will be get all state (default)
});
```


###createAsyncAction
Synchronous actions not enough in real app, but you can create asynchronous actions.
```js
//actions.js
import { createAction, createAsyncAction } from "captain-redux"

let changeState = createAction(state => ({ data: state.data + 1 });

//asynchonous actions are creating like synchronous, but first argument gives a dispatch to your function
export const doSomthingAsync = createAsyncAction(({ dispatch },num) =>{
    for(let i = 0; i < num; i++)
        setTimeout(() => dispatch(changeState()), 500);
});
```

And we can use this action like synchronous
```js
//index.js
import redix from "redux"
import captain from 'captain-redux'
import { doSomethingAsync } from './actions.js'

captain(redux);

let store = captain.createStore({
    data: 1
});

store.dispatch(doSomethingAsync(3));

setTimeout(() => 
    console.log(store.getState())
    , 2000);
//{
//    data: 4
//}
```

Also createAsyncAction recieves <b>getState</b> in first passed parameter
```js
//actions.js
import { createAsyncAction } from "captain-redux"

//asynchonous actions are creating like synchronous, but first argument gives a dispatch to your function
export const doSomthingAsync = createAsyncAction(({ dispatch, getState },num) =>{
    for(let i = 0; i < num; i++)
        setTimeout(() => console.log(getState()), 500;
});
``` 

And then you can return a promise from your action to continue use it in current code context
```js
//actions.js
import { createAsyncAction } from "captain-redux"

// asynchonous actions are creating like synchronous, but first argument gives a dispatch to your function
export const doAsync = createAsyncAction(({ dispatch, getState },num) => new Promise(resolve => {
    //do something... 
    resolve();
}));
``` 

```js
//index.js
import redix from "redux"
import captain from 'captain-redux'
import { doAsync } from './actions.js'

captain(redux);

let store = captain.createStore({
    //...
});

store.dispatch(doAsync())
    .then(() => console.log("successfully completed"));
//...
//successfully completed
```

##Migration guide
From redux to captain

Just replace it
```js
import {creteStore, applyMiddleware, compose} from 'redux'
...
```

...on it
```js
import * as redux from 'redux'
import captain from 'captain-redux'

let {creteStore, applyMiddleware, compose} = captain(redux)
...
```
