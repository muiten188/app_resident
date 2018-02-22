import React from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Loading, ErrorView, Touchable, TextView } from '../../component';
import { HttpClientHelper, SessionManager, Functions } from '../../libs';
import { User } from '../../models';
import * as Themes from '../../themes';
import ButtonService from './ButtonService';
import HTMLView from 'react-native-htmlview';

export default class FixedService extends React.Component {

  constructor (props) {
    super(props);
  }

  render () {
    let dichvunuoc = '', dichvudien = '', dichvunha = '';
    try {
      for (let i in SessionManager.getRegulation()) {
        let data = SessionManager.getRegulation()[i];
        if (data.dateType == 'BASE_SERVICE') {
          for (let j in data.data) {
            let content = data.data[j];
            if (content.regulationSubCategory == 'DICHVUDIEN') {
              dichvudien = content.content;
            } else if (content.regulationSubCategory == 'DICHVUNUOC') {
              dichvunuoc = content.content;
            } else if (content.regulationSubCategory == 'DICHVUTOANHA') {
              dichvunha = content.content;
            }
          }
          break;
        }
      }
    } catch (e) {}
    return (
      <View style={{flex: 1, padding: 20, backgroundColor: '#e0dfdf', alignItems: 'center'}}>
        <ButtonService icon="dien" text="Dịch vụ điện" onPress={() => {
          Functions.showModal({
            title: 'Dịch vụ điện',
            body: <HTMLView
              value={dichvudien}/>
          });
        }}/>
        <ButtonService icon="nuoc" text="Dịch vụ nước" onPress={() => {
          Functions.showModal({
            title: 'Dịch vụ nước',
            body: <HTMLView
              value={dichvunuoc}/>
          });
        }}/>
        <ButtonService icon="toanha" text="Dịch vụ tòa nhà" onPress={() => {
          Functions.showModal({
            title: 'Dịch vụ tòa nhà',
            body: <HTMLView
              value={dichvunha}/>
          });
        }}/>
      </View>
    );
  }
}


