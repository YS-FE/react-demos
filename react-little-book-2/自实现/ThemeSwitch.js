import React, { Component } from 'react'
import PropTypes from "prop-types"
import {connect} from "./my-react-redux.js";

class ThemeSwitch extends Component {
  static propTypes = {
    themeColor: PropTypes.string,
    onSwitchColor: PropTypes.func
  }

  handlerSwitchColor(color){
    if (this.props.onSwitchColor){
      this.props.onSwitchColor(color);
    }
  }

  render () {
    return (
      <div>
        <button onClick={this.handlerSwitchColor.bind(this, "red")} style={{"color": this.props.themeColor}}>Red</button>
        <button onClick={this.handlerSwitchColor.bind(this, "blue")} style={{"color": this.props.themeColor}}>Blue</button>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps)=>{
  return {
    "themeColor": state.themeColor
  }
};

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {
    onSwitchColor: (color)=>{
      dispatch({
        "type": "CHANGE_COLOR",
        "themeColor":color
      });
    }
  }
};

ThemeSwitch = connect(mapStateToProps, mapDispatchToProps)(ThemeSwitch);
export default ThemeSwitch
