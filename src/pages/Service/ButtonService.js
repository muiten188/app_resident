import React from 'react';
import {Image, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Touchable, TextView} from '../../component';
import {Functions} from '../../libs';
import * as Themes from '../../themes';

export default class ServiceItem extends React.Component {
  render() {
    return (
      <Touchable
        activeOpacity={0.95}
        style={{justifyContent: 'center', alignItems: 'center', height: 80, width: 300, marginTop: 10}}
        onPress={this.props.onPress}>
        <LinearGradient
          start={{x: 0.0, y: 0}}
          end={{x: 1, y: 0}}
          locations={[0, 0.6, 1]}
          colors={['#005dac', '#1581d8', '#2196f3']}
          style={styles.linearGradient}>
          <TextView style={styles.buttonText}>
            {this.props.text}
          </TextView>
        </LinearGradient>
        <Image source={Themes.Resource[this.props.icon]}
               style={{position: 'absolute', left: 0, top: 0, width: 80, height: 80, resizeMode: 'cover'}}/>
      </Touchable>
    );
  }
}

// Later on in your styles..
const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'center',
    height: 44,
    backgroundColor: '#f5f5f5',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#bbb',
    margin: 5
  },
  linearGradient: {
    paddingLeft: 40,
    paddingRight: 15,
    borderRadius: 23,
    width: 300,
    justifyContent: 'center',
    height: 44,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});