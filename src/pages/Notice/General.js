import React from 'react';
import { View, FlatList, AppState, Image } from 'react-native';
import { Loading, ErrorView, Touchable, TextView } from '../../component';
import { User } from '../../models';
import * as Themes from '../../themes';
import moment from 'moment';
import { RealmHelper, SyncManager, MessageHandler, Functions } from '../../libs/';
import HTMLView from 'react-native-htmlview/HTMLView';

var striptags = require('striptags');

export default class General extends React.Component {

  data = null;

  constructor (props) {
    super(props);
    this.state = {
      reload: false,
      error: '',
      appState: AppState.currentState
    };
    this.loadData = this.loadData.bind(this);
    this.collection = 'GeneralMessage';
    if (props._type !== 'general_notice') {
      this.collection = 'IndividualMessage';
    }
  }

  reload () {
    this.setState({reload: !this.state.reload});
  }

  loadData () {
    // let params = {
    //   apartmentId: User.currentApartmentId,
    //   // lastTimeSync: "12/12/2017 14:08:02"
    // };
    // HttpClientHelper.get(this.props._type, params, (err, res) => {
    //   if (!err) {
    //     console.log(res);
    //     this.data = res.data;
    //     this.reload();
    //   } else {
    //     this.setState({error: err});
    //   }
    // });
    try {
      this.data = RealmHelper.getInstance().objects(this.collection).filtered('apartmentId=' + (User.currentApartmentId && User.currentApartmentId !== '' ? User.currentApartmentId : '0')).sorted('issueDate', true);
      this.reload();
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount () {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.loadData();
    SyncManager.syncMessage(this.props._type);
    RealmHelper.getInstance().addListener('change', this.loadData);
  }

  componentWillUnmount () {
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
    let date = moment();
    try {
      date = moment.unix((item.issueDate ? item.issueDate : null) / 1000);
    } catch (e) {}

    return <View style={{paddingTop: 4, paddingBottom: 4}}>
      <Touchable onPress={() => {
        RealmHelper.write(() => {
          RealmHelper.getInstance().create(this.collection, {apartMessageId: item.apartMessageId, isRead: 1}, true);
        });
        Functions.showModal({
          title: item.title,
          date: date.format('DD-MM-YYYY'),
          body: <HTMLView value={item.content}/>
        });
      }}>
        <View style={{height: 0.5, backgroundColor: '#d1d1d1'}}/>
        <View style={{flexDirection: 'row', backgroundColor: '#fff', padding: 15, alignItems: 'center'}}>
          <Image source={item.isRead == 1 ? Themes.Resource.notice_icon_read : Themes.Resource.notice_icon_unread}
                 style={{height: 50, width: 50}}/>
          <View style={{flex: 1, marginLeft: 10}}>
            <View>
              <TextView style={{
                fontSize: Themes.Fonts.size.regular,
                fontWeight: 'bold',
                color: '#39484d',
              }}>{item.title}</TextView>
              <TextView style={{textAlign: 'left', color: '#0752a4', width: 100}}>{date.format('DD-MM-YYYY')}</TextView>
            </View>
            <TextView numberOfLines={2} style={{marginTop: 6, color: '#9aa1a6'}}>{striptags(item.content)}</TextView>
          </View>
        </View>
        <View style={{height: 0.5, backgroundColor: '#d1d1d1'}}/>
      </Touchable>
    </View>;
  }

  render () {
    if (this.data == null) {
      return <Loading/>;
    }
    return (
      <View style={{flex: 1}}>
        <FlatList
          style={{paddingTop: 10, paddingBottom: 10, backgroundColor: '#e0dfdf'}}
          data={this.data}
          keyExtractor={(item, index) => item.apartMessageId}
          renderItem={({item}) => this.renderNoticeItem(item)}
        />
      </View>
    );
  }
}