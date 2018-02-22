import React from 'react';
import { View } from 'react-native';
import { TextView, Touchable } from '../../component';

const MonthCard = (props) => {
  return (
    <View style={{flexDirection: 'row', width: 80,}}>
      {props.selected == true && <View style={{width: 1, backgroundColor: '#ddd', height: 34}}/>}
      <Touchable style={
        [props.style, styles.container]}
                 onPress={props.onPress}>

        <TextView
          style={[styles.text, {
            color: (props.selected == true ? '#404f53' : '#9aa1a6'),
            fontWeight: (props.selected == true ? 'bold' : 'normal')
          }]}>{props.text}</TextView>
      </Touchable>
      {props.selected == true && <View style={{width: 1, backgroundColor: '#ddd', height: 34}}/>}
    </View>
  );
};

const styles = {
  container: {
    width: 80,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 13,
    color: '#9aa1a6'
  }
};

export default MonthCard;