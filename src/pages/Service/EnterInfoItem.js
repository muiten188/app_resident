import React from 'react'

import {
  View,
  TextInput
} from 'react-native'

import {TextView} from '../../component'
import * as Themes from '../../themes'

export default class EnterInfoItem extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TextView style={styles.label}>{this.props.label + ":"}</TextView>
        <TextInput {...this.props} underlineColorAndroid='rgba(0,0,0,0)' style={styles.text} value={this.props.value} onChangeText={this.props.onChangeText} placeholderTextColor='#ccc' placeholder={this.props.placeholder}/>
      </View>
    )
  }
}

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  label: {
    color: '#404f53',
    fontSize: 13,
  },
  text: {
    color: '#404f53',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 10,
    height: 20,
    padding: 0,
    lineHeight: 20,
    flex: 1
  }
}

