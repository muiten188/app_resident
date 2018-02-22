import React from 'react';
import { TouchableOpacity } from 'react-native';

export default class Touchable extends React.Component {
  render () {
    return <TouchableOpacity style={this.props.style}
                             activeOpacity={this.props.activeOpacity ? this.props.activeOpacity : 0.7} onPress={() => {
      if (this.props.delay) {
        setTimeout(() => {
          if (this.props.onPress)
            this.props.onPress();
        }, this.props.delay);
      } else {
        if (this.props.onPress)
          this.props.onPress();
      }
    }}>
      {this.props.children}
    </TouchableOpacity>;
  }
}