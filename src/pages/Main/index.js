import React from 'react';
import { View, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';

import * as Themes from '../../themes';
import { Avatar, TextView, HomeButton } from '../../component';
import I18n from '../../i18n';
import { HttpClientHelper, SessionManager } from '../../libs';
import User from '../../models/User';
import { Icon } from 'react-native-elements';
import Touchable from '../../component/Touchable/index';
import { FcmClient } from '../../libs';
import RealmHelper from '../../libs/RealmHelper';
import SyncManager from '../../libs/SyncManager';

class Main extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount () {
    FcmClient.registerFCM();
    RealmHelper.init(()=>{
      this.loadApartments();
      this.loadRegulation();
    });

  }

  componentWillUnmount () {
    FcmClient.unRegisterFCM();
    SyncManager.stopSync();
  }

  loadRegulation () {
    HttpClientHelper.get('regulation', {}, (err, res) => {
      console.log(res);
      if (!err) {
        SessionManager.setRegulation(res.data);
      }
    });
  }

  loadApartments () {
    this.setState({loading: true});
    let params = {
      url_params: {residentId: User.ressidentId}
    };
    HttpClientHelper.get('get_apartments', params, (err, res) => {
      if (!err) {
        if (res.length > 0) {
          if (User.currentApartmentId == '') {
            let a = res[0];
            User.currentApartmentId = a.apartmentId;
            User.currentApartmentCode = a.apartmentCode;
            User.residentType = a.residentType;
          }
          User.listApartment = res;
          SessionManager.saveUserInfo(User);
          SyncManager.startSync();
        }
      } else {
        if (err.status == 401) {
          SessionManager.logout()
        }
      }
      this.setState({loading: false});
    });
  }

  render () {
    return <View style={{flex: 1}}>
      <Image source={Themes.Resource.background2} style={{
        resizeMode: 'cover',
        width: Themes.Metrics.screenWidth,
        height: Themes.Metrics.screenHeight,
        position: 'absolute',
        top: 0,
        left: 0
      }}/>
      <View style={{
        width: Themes.Metrics.screenWidth,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Avatar size={160} style={{marginTop: 10}}/>
        <TextView
          style={{fontSize: 18, fontWeight: '100', marginTop: 15, color: '#104e8f'}}>{I18n.t('greeting')}</TextView>
        <TextView style={{fontSize: 20, fontWeight: '600', marginTop: 3, color: '#12579f'}}>{User.fullName}</TextView>
        <TextView style={{
          fontSize: 18,
          fontWeight: '600',
          marginTop: 3,
          color: '#12579f'
        }}>{User.currentApartmentCode}</TextView>
        <View style={{
          marginTop: 15,
          width: 280,
          height: 260,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Image source={Themes.Resource.line_h} style={{height: 0.5, width: 250, resizeMode: 'stretch'}}/>
          <View style={{
            flexDirection: 'row',
            width: 280,
            height: 260,
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0
          }}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <HomeButton icon='media' title={I18n.t('notice')} onPress={() => {
                Actions.notice({title: I18n.t('notice')});
              }}/>
              <HomeButton icon='finance' title={I18n.t('finance')} onPress={() => {
                Actions.finance({title: I18n.t('finance')});
              }}/>
            </View>
            <Image source={Themes.Resource.line_v} style={{width: 0.5, height: 250, resizeMode: 'stretch'}}/>
            <View style={{flex: 1, alignItems: 'center'}}>
              <HomeButton icon='service' title={I18n.t('service')} onPress={() => {
                Actions.service({title: I18n.t('service')});
              }}/>
              <HomeButton icon='account' title={I18n.t('account')} onPress={() => {
                Actions.account({title: I18n.t('account')});
              }}/>
            </View>
          </View>
        </View>
      </View>
      <Touchable style={{
        position: 'absolute', top: 0, right: 0,
        marginTop: Themes.Metrics.navbarPaddingTop,
        width: 50, height: 50,
        alignItems: 'center', justifyContent: 'center'
      }} onPress={() => {
        SessionManager.logout();
      }}>
        <Icon name='power-settings-new' color='#565656' size={30}/>
      </Touchable>
    </View>;
  }

}

export default Main;