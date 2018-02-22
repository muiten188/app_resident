import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Loading, ErrorView, Touchable, TextView } from '../../component';
import { HttpClientHelper, SessionManager, Functions } from '../../libs';
import { User } from '../../models';
import * as Themes from '../../themes';
import HTMLView from 'react-native-htmlview/HTMLView';

export default class Rule extends React.Component {

  constructor (props) {
    super(props);
  }

  render () {
    let noiquychung = '', noiquyanninh = '', noiquytaichinh = '';
    try {
      noiquychung = SessionManager.getRegulation()[0]['data'][0]['content'];
    } catch (e) {
      console.warn(e);
    }
    try {
      noiquyanninh = SessionManager.getRegulation()[0]['data'][1]['content'];
    } catch (e) {
      console.warn(e);
    }
    try {
      noiquytaichinh = SessionManager.getRegulation()[0]['data'][2]['content'];
    } catch (e) {
      console.warn(e);
    }
    return (
      <View style={{flex: 1, padding: 20, backgroundColor: '#e0dfdf'}}>
        <Touchable onPress={() => {
          Functions.showModal({
            title: 'Nội quy chung',
            body: <HTMLView
              value={noiquychung}/>
          });
        }}>
          <View
            style={styles.wrapper}>
            <TextView style={styles.buttonText}>Nội quy chung</TextView>
          </View>
        </Touchable>
        <Touchable onPress={() => {
          Functions.showModal({
            title: 'Nội quy an ninh',
            body: <HTMLView
              value={noiquyanninh}/>
          });
        }}>
          <View
            style={styles.wrapper}>
            <TextView style={styles.buttonText}>Nội quy an ninh</TextView>
          </View>
        </Touchable>
        <Touchable onPress={() => {
          Functions.showModal({
            title: 'Nội quy tài chính',
            body: <HTMLView
              value={noiquytaichinh}/>
          });
        }}>
          <View
            style={styles.wrapper}>
            <TextView style={styles.buttonText}>Nội quy tài chính</TextView>
          </View>
        </Touchable>
      </View>
    );
  }
}

// Later on in your styles..
const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'center',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#bbb',
    margin: 5
  },
  buttonText: {
    fontSize: Themes.Fonts.size.regular,
    textAlign: 'center',
    color: '#455357',
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
});