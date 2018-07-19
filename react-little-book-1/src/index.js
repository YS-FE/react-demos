
/*
手动实现了redux的createStore和相关方法!!!!
*/

function createStore(reducer){
  let state = null;
  var listeners = [];
  var subscribe = (listener)=>{
    listeners.push(listener);
  };

  var getState = ()=>state;
  var dispatch = (action)=>{
    state = reducer(state,action);
    listeners.forEach((listener)=>{
      listener();
    });
  };

  dispatch({});
  return {getState,dispatch,subscribe};
}

function titleReducer(state,action){
  if (!state){
    return {
      "title":{
        "text": "平凡的世界",
        "color": "red"
      },
      "content": {
        "text": "平凡的世界内容",
        "color": "green"
      }
    };
  }
  switch (action.type){
    case "up_title_text":
    return {
      ...state,
      "title": {
        ...state.title,
        "text": action.text
      }
    };
    case "up_title_color":
    return {
      ...state,
      "title": {
        ...state.title,
        "color": action.color
      }
    };
    default:
    return state;
  }
}

function renderApp (nowState, oldState = {}) {
  if (nowState === oldState) return;
  renderTitle(nowState.title)
  renderContent(nowState.content)
}

function renderTitle (title) {
  const titleDOM = document.getElementById('title')
  titleDOM.innerHTML = title.text
  titleDOM.style.color = title.color
}

function renderContent (content) {
  const contentDOM = document.getElementById('content')
  contentDOM.innerHTML = content.text
  contentDOM.style.color = content.color
}


var store = createStore(titleReducer);
var oldState = store.getState();
renderApp(oldState);

store.subscribe(function(){
  var nowState = store.getState();
  renderApp(nowState, oldState);
  oldState = nowState;
});


setTimeout(() => {
store.dispatch({"type": "up_title_color", "color": "pink"});
}, 3000);
