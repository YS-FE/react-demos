import React, {Component} from "react";
import PropTypes from "prop-types";

/**
 * 高阶组件
 * @param {Function} mapStateToProps 
 * @param {Function | Object} mapDispatchToProps 
 */
export const connect = (mapStateToProps, mapDispatchToProps) => {
  return (NeedComponent) => {

    class WrappedComponent extends Component {

      static contextTypes = {
        store: PropTypes.object
      }

      constructor(props){
        super(props);
        this.state = {allProps: {}};
      }

      componentWillMount(){
        const {store} = this.context;
        this._updateProps();
        store.subscribe(()=>{
          this._updateProps();
        });
      }

      _updateProps(){
        const {store} = this.context;
        let stateProps = {}, dispatchProps = {};

        stateProps = mapStateToProps ?  mapStateToProps(store.getState(), this.props): {};

        if (mapDispatchToProps){
          /**
           * mapDispatchToProps 为Function
           */
          if (typeof mapDispatchToProps === 'function'){
            dispatchProps = mapDispatchToProps(store.dispatch, this.props);
          } else if (typeof mapDispatchToProps === 'object'){
            /**
             * mapDispatchToProps 为 Object
             * 1. action = actionCreator(arg)
             * 2. store.dispatch(action)
             * 当调用时，直接产生action，并且直接dispatch.
             */
            let keys = Object.keys(mapDispatchToProps);
            keys.forEach(key => {
              dispatchProps[key] = function(value){
                let action = mapDispatchToProps[key](value);
                store.dispatch(action);
              }
            });
          }
        } else {
          dispatchProps = {};
        }


        this.setState({
          allProps: {
            ...stateProps,
            ...dispatchProps,
            ...this.props
          }
        });


      }

      render(){
        return <NeedComponent {...this.state.allProps}/>;
      }
    }
    return WrappedComponent;
  };
};



/**
 * Provider组件，通过context将store进行传递
 */
export class Provider extends Component {
  static propTypes = {
    store: PropTypes.object,
    children: PropTypes.any
  }

  static childContextTypes={
    store: PropTypes.object
  }

  getChildContext(){
    return {store: this.props.store};
  }

  render(){
    return <div>{this.props.children}</div>;
  }
};

