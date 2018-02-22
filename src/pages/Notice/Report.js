import React from 'react';
import { View, FlatList, StyleSheet, AppState } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Loading, ErrorView, Touchable, TextView } from '../../component';
import * as Themes from '../../themes';
import I18n from '../../i18n/index';
import moment from 'moment';
import { RealmHelper, SyncManager, MessageHandler } from '../../libs/';
import User from '../../models/User';

export default class Report extends React.Component {

  data = null;

  constructor (props) {
    super(props);
    this.state = {
      reload: false,
      error: '',
      appState: AppState.currentState
    };
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
    this.messageHandler = this.messageHandler.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  reload () {
    this.setState({reload: !this.state.reload});
  }

  loadData () {
    // let params = {
    //   apartmentId: User.currentApartmentId,
    // };
    // HttpClientHelper.get('conversation', params, (err, res) => {
    //   if (!err) {
    //     console.log(res);
    //     this.data = res.data;
    //     this.reload();
    //   } else {
    //     this.setState({error: err});
    //   }
    // });
    try {
      this.data = RealmHelper.getInstance().objects('Conversation').filtered('apartmentId=' + (User.currentApartmentId && User.currentApartmentId !== '' ? User.currentApartmentId : '0')).sorted('updateTime', true);
      this.reload();
    } catch (e) {
    }
  }

  messageHandler () {
    SyncManager.syncConversation();
    // this.loadData();
  }

  componentDidMount () {
    AppState.addEventListener('change', this._handleAppStateChange);
    MessageHandler.register('report', this.messageHandler);
    SyncManager.syncConversation();
    this.loadData();
    RealmHelper.getInstance().addListener('change', this.loadData);
  }

  componentWillUnmount () {
    MessageHandler.remove('report', this.messageHandler);
    AppState.removeEventListener('change', this._handleAppStateChange);
    RealmHelper.getInstance().removeListener('change', this.loadData);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      this.loadData();
    }
    this.setState({appState: nextAppState});
  };

  renderNoticeItem (item) {

    let backgroundColor = '#fff';
    if (item.conversationStatus == 'NEW') {
      backgroundColor = '#bdf1fe';
      status = I18n.t('REPORT_NEW');
    }

    if (item.conversationStatus == 'ACCEPT') {
      backgroundColor = '#fff2c5';
      status = I18n.t('REPORT_ACCEPT');
    }

    if (item.conversationStatus == 'DONE') {
      status = I18n.t('REPORT_DONE');
    }

    let date = moment();
    try {
      date = moment.unix((item.conversationStart ? item.conversationStart : null) / 1000);
    } catch (e) {}

    return <View style={{padding: 4}}>
      <Touchable onPress={() => {
        Actions.reportConversation({item: item});
      }}>
        <View style={{
          backgroundColor: backgroundColor, paddingLeft: 15, paddingRight: 15, paddingTop: 10,
          paddingBottom: 15
        }}>
          <View style={{flexDirection: 'row'}}>
            <TextView style={{
              fontSize: Themes.Fonts.size.regular,
              fontWeight: 'bold',
              color: '#39484d',
              flex: 1
            }}>{I18n.t('REPORT')}{I18n.t(item.conversationType)}</TextView>
            <TextView style={{
              width: 100,
              textAlign: 'right',
              color: '#4997da',
              fontSize: Themes.Fonts.size.small
            }}>{status}</TextView>
          </View>
          <View style={{flexDirection: 'row'}}><TextView
            style={{
              textAlign: 'left',
              color: '#4997da',
              flex: 1
            }}>{date.format('DD-MM-YYYY')}</TextView>{item.isRead == 0 && <View
            style={{
              backgroundColor: 'green',
              width: 10,
              height: 10,
              borderRadius: 5,
              marginRight: 10,
              marginLeft: 5
            }}/>}</View>
          <View style={{height: 0.5, backgroundColor: '#ccc', marginTop: 10}}/>
          <TextView ellipsizeMode='tail' numberOfLines={2} style={{
            marginTop: 10,
            color: '#39484d'
          }}>{item.conversationContent}</TextView>
        </View>
      </Touchable>
    </View>;
  }

  renderSeparator () {
    return (
      <View style={{height: 10, backgroundColor: 'transparent'}}/>
    );
  }

  render () {
    if (this.data == null && this.state.error == '') {
      return <Loading/>;
    }
    if (this.state.error != '') {
      return <ErrorView message={this.state.error}/>;
    }
    return (
      <View style={{flex: 1}}>
        <FlatList
          style={{paddingLeft: 10, paddingRight: 10, flex: 1, backgroundColor: '#e0dfdf'}}
          data={this.data}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => this.renderNoticeItem(item)}
          // ItemSeparatorComponent={this.renderSeparator()}
          ListFooterComponent={this.renderSeparator()}
          ListHeaderComponent={this.renderSeparator()}
        />
      </View>
    );
  }
}

// Later on in your styles..
const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 25,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});