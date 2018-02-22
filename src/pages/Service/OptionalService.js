import React from 'react';
import {View, FlatList, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Loading, ErrorView, Touchable, TextView} from '../../component';
import {HttpClientHelper, SessionManager, Functions} from '../../libs'
import {User} from '../../models';
import * as Themes from '../../themes';
import ButtonService from "./ButtonService";
import {Actions} from 'react-native-router-flux';
import I18n from "../../i18n/index";

export default class OptionalService extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1, padding: 20, backgroundColor: '#e0dfdf', alignItems: 'center'}}>
        <ButtonService icon="xe_may" text={I18n.t('motor_service')} onPress={() => {
          Actions.listService({service_type: 'motor'})
        }}/>
        <ButtonService icon="oto" text={I18n.t('car_service')} onPress={() => {
          Actions.listService({service_type: 'car'})
        }}/>
      </View>
    )
  }
}