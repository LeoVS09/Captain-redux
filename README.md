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
//in captain-redux all actions is functions which recive (state, ....args)
//args - it all parameters passed during dispath
let setCounter = createAction((state,counter) => ({ counter }));
//action reurns only changed field

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

Captain apply you control state of you app just write only business logic

CreateAction is easy way change state of you app
```js
//actions.js
import { createAction } from "captain-redux"

//action it function which recive state
//...and parameters puttet when action will be performed 
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
import initState from './state.js"

let { createStore } = captain(redux);

export default let store = createStore(initState);
```

It's all!
We can change state our app
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

But why we always write id of todo himself? Go add counter of todo in our state.
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
 
 It work, but we can do our state more logical. Let's just join todos and their count in one odject.
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
 
 And tell our action where him need change state
```js
  //actions.js
  import { createAction, define } from "captain-redux"
  import initState from "state.js"
  
  let addTodo = createAction((state, text) => ({
          countOfTodos: state.countOfTodos+1
          todos: [...state.todos, { state.countOfTodos+1, text }]
      })
  ); 
  
  //we can tell state where action can change him
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
 
###define
Receive one object with names of fields repeating state and values is actions which need process this fields.
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
    //date: setDate - it's not work, becouse date not object
    setDate // it action will be all state (default)
});
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