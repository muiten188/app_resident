import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-spinkit';
import * as Themes from '../../themes';

export default class GradientButton extends React.Component {

  render() {
    let height = 44;
    if (this.props.containerStyle) {
      if (this.props.containerStyle.height) {
        height = this.props.containerStyle.height;
      }
    }

    styles.linearGradient.borderRadius = parseInt(height / 2);

    if (this.props.loading) {
      return (
        <View style={{height: height, ...this.props.containerStyle, flexDirection: 'row', justifyContent: 'center'}}>
          <Spinner style={{width: height}} isVisible={this.props.loading} size={height} type="Wave"
                   color={Themes.Colors.background}/>
        </View>
      );
    } else {
      return (
        <TouchableOpacity activeOpacity={this.props.activeOpacity ? this.props.activeOpacity : 0.8}
                          style={{height: height, ...this.props.containerStyle, flexDirection: 'row'}}
                          onPress={this.props.onPress}>
          <LinearGradient
            start={{x: 0.0, y: 0}}
            end={{x: 1, y: 0}}
            locations={[0, 0.6, 1]}
            colors={['#005dac', '#1581d8', '#2196f3']}
            style={styles.linearGradient}>
            <Text style={[styles.buttonText, this.props.textStyle]}>
              {this.props.text}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
  }
}

// Later on in your styles..
const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 23,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});