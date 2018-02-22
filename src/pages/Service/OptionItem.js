import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'react-native-elements';

import {Touchable, TextView} from '../../component';
import {Functions} from '../../libs';
import Themes from '../../themes';

const OptionItem = (props) => {
  return (
    <Touchable
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        width: 300,
        flexDirection: 'row',
        alignItems: 'center'
      }}
      onPress={props.onPress}>
      <View style={{
        borderWidth: 1,
        borderColor: Themes.Colors.borderColor,
        borderRadius: 5,
        padding: 5,
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {props.selected && <Icon name='done'/>}
      </View>
      <TextView style={{flex: 1, paddingTop: 5, paddingBottom: 5, marginLeft: 10}}>{props.text}</TextView>
    </Touchable>
  );
}
export default OptionItem;
// Later on in your styles..
const styles = StyleSheet.create({});