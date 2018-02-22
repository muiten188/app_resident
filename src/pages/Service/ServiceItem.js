import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'react-native-elements';

import {Touchable, TextView} from '../../component';
import {Functions} from '../../libs';
import Themes from '../../themes';

export default class ServiceItemRegistered extends React.Component {
  render() {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          width: 300,
          flexDirection: 'row',
          alignItems: 'center'
        }}>
        <TextView style={{flex: 1, paddingTop: 5, paddingBottom: 5}}>{this.props.license_plate}</TextView>
        <View style={{
          borderWidth: 1,
          borderColor: Themes.Colors.borderColor,
          borderRadius: 5,
          padding: 5,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <TextView style={{color: '#404f53', textAlign: 'center'}}>{this.props.status}</TextView>
        </View>
        <View style={{flex: 1, flexDirection: 'row', paddingLeft: 10, alignItems: 'center'}}>
          <Touchable
            onPress={this.props.onPressDelete}
            style={{
              borderWidth: 1,
              borderColor: this.props.canDelete ? Themes.Colors.borderColor : '#f1f1f1',
              borderRadius: 5,
              padding: 2
            }}>
            <Icon name="delete" color={this.props.canDelete ? "#667174" : '#f1f1f1'}/>
          </Touchable>
          <Touchable
            onPress={this.props.onPressEdit}
            style={{
              borderWidth: 1,
              borderColor: this.props.canEdit ? Themes.Colors.borderColor : '#f1f1f1',
              borderRadius: 5,
              padding: 2,
              marginLeft: 5
            }}>
            <Icon name="mode-edit" color={this.props.canEdit ? "#667174" : '#f1f1f1'}/>
          </Touchable>
        </View>
      </View>
    );
  }
}

// Later on in your styles..
const styles = StyleSheet.create({});