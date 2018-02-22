import React from 'react';
import {View} from 'react-native';
import TextView from '../TextView'

export default class ErrorView extends React.Component {
  render() {
    return (
      <View style={{flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center'}}>
        <TextView style={{color: 'red'}}>{JSON.stringify(this.props.message)}</TextView>
      </View>
    );
  }
}