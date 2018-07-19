import React, { Component} from 'react'
import PropTypes from "prop-types"
import ThemeSwitch from './ThemeSwitch'

class Content extends Component {
  static contextTypes = {
    store: PropTypes.object
  }

  constructor(props){
    super(props);
    this.state = {"themeColor": ""};
  }

  componentWillMount(){
    const {store} = this.context;
    this._updateThemeColor();
    store.subscribe(()=>{
      this._updateThemeColor();
    });
  }

  _updateThemeColor(){
    const {store} = this.context;
    this.setState({"themeColor": store.getState().themeColor});
  }

  render () {
    return (
      <div>
        <p style={{"color": this.state.themeColor}}>React.js 小书内容</p>
        <ThemeSwitch />
      </div>
    )
  }
}

export default Content
