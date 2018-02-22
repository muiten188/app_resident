import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {TextView} from '../';

import * as Themes from '../../themes';

class HomeButton extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={()=>{
        this.props.onPress();
      }} activeOpacity={0.8}
                        style={{width: 160, alignItems: 'center', padding: 20, ...this.props.containerStyle}}>
        <Image style={{width: 80, height: 80, resizeMode: 'cover'}} source={Themes.Resource[this.props.icon]}/>
        <TextView numberOfLines={1} style={{marginTop: 5, color: '#39484d', fontSize: 16}}>{this.props.title}</TextView>
      </TouchableOpacity>
    );
  }
}

export default HomeButton;