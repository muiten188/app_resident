import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Touchable } from '../../component';
import * as Themes from '../../themes';

export default class Navbar extends React.Component {
  render () {
    return <View>
      <View style={[styles.wrapper, this.props.style]}>
        <Touchable style={styles.button} onPress={() => {
          if (this.props.onPressBack)
            this.props.onPressBack();
          else
            Actions.pop();
        }}>
          <Image style={styles.icon} source={Themes.Resource.icon_back}/>
        </Touchable>
        <Text numberOfLines={1} style={styles.text}>{this.props.title}</Text>
        <Touchable style={styles.button} onPress={() => {
          if (((this.props.rightIcon || this.props.rightImageButton) && this.props.onPressRightButton)) {
            this.props.onPressRightButton();
          }
        }}>
          {this.props.rightIcon}
          {this.props.rightImageButton &&
          <Image source={this.props.rightImageButton} style={{width: 20, height: 20, resizeMode: 'contain', alignSelf: 'center'}}/>}
        </Touchable>
      </View>
      <View style={{height: 0.5, backgroundColor: Themes.Colors.divColor}}/>
    </View>;
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: Themes.Metrics.navbarPaddingTop,
    alignItems: 'center',
    backgroundColor: Themes.Colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: Themes.Metrics.navBarHeight,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Themes.Metrics.navBarHeight - Themes.Metrics.navbarPaddingTop,
    height: Themes.Metrics.navBarHeight - Themes.Metrics.navbarPaddingTop,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  text: {
    color: '#fff',
    fontSize: Themes.Fonts.size.title,
    textAlign: 'center',
    width: Themes.Metrics.screenWidth - (2 * Themes.Metrics.navBarHeight),
  }
});