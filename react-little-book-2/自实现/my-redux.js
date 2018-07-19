
/**
 * 根据reducer 创建store
 * @param {Function} reducerFn 
 * @param {Function} enchancer 引入中间件
 * 
 */
function createStore (reducerFn, enhancer) {

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    return enhancer(createStore)(reducerFn);
  }


  let state = null;
  let listeners = [];
  let subscribe = (listener) => listeners.push(listener);
  let getState = () => state;
  let dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  }

  // 初始化 state
  dispatch({}); 
  return { getState, dispatch, subscribe };
}


/**
 * 中间件添加
 * @param {Array} midddlewares 
 */
function applyMiddleware(...midddlewares){

  return createStore => (...arg) => {
    const store = createStore(...arg);

    midddlewares.reverse();

    let dispatch = store.dispatch;

    midddlewares.forEach(middleware => {
      dispatch = middleware(store)(dispatch);
    });

    return {...store, dispatch};
  }
}



/**
 * 对reducer进行合并
 * @param {Object}} reducers 
 * @return {Function}
 */
function combineReducers(reducers){
  let reducerKeys = Object.keys(reducers);
  let finalReducers = {};
  let finalReducersKeys = [];

  /*
  对传入的reducer进行判断，确保都是函数
  */
  for (var i = 0; i < reducerKeys.length; i++){
    let key = reducerKeys[i];
    if (typeof reducers[key] === 'undefined'){
      console.error(reducers[key] + " not provide ");
    }
    if (typeof reducers[key] === 'function'){
      finalReducers[key] = reducers[key];
    }
  }

  finalReducersKeys = Object.keys(finalReducers);

  // 返回一个整体的reducer函数
  return function(){
    /*
    接收state, action两个参数
    */
    let state = ((arguments.length > 0) && (arguments[0] !== undefined)) ? arguments[0] : {};
    let action = arguments[1];

    // nextState是将来改变之后的新的State
    let nextState = {};
    let hasChaged = false;

    //使用每个reducer处理不同的state
    for (let _i = 0; _i < finalReducersKeys.length; _i++){
      let _key =  finalReducersKeys[i];
      let reducer = finalReducers[_key];
      let oldStateForKey = state[_key];
      let nextStateForKey = reducer(oldStateForKey, action);

      //将当前reducer返回的state补充到 新的sate中
      nextState[_key] =  nextStateForKey;
      hasChaged = hasChaged || (nextStateForKey !== oldStateForKey ? true : false);
    }

    //返回更改之后的state
    return hasChaged ? nextState  : state;
  };
}


export {createStore, combineReducers, applyMiddleware};


 /**
  * 
  * 模拟redux-thunk中间件
  */
 const thunk = store => next => action => {
  return  typeof action == 'function' ? action(store.dispatch, store.getState())  : next(action);
}