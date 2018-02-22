import React from 'react';
import {Text} from 'react-native';

class TextView extends React.Component {
  render() {
    let props = {};
    for (let i in this.props) {
      if (i != 'style')
        props[i] = this.props[i];
    }
    return <Text {...props} style={[{backgroundColor: 'transparent'}, this.props.style]}>{this.props.children}</Text>
  }
}

export default TextView;