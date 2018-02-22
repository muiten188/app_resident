import React from 'react';
import {View} from 'react-native';
import Spinner from "react-native-spinkit";
import * as Themes from '../../themes'

export default class Loading extends React.Component {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 0}}>
        <Spinner style={{width: 50}} size={50} type="Wave" color={Themes.Colors.background}/>
      </View>
    )
  }
}