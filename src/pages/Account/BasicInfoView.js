import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  Image
} from 'react-native';

import { Avatar, Touchable, TextView, GradientButton } from '../../component';
import * as Themes from '../../themes';
import Card from './Card';
import I18n from '../../i18n';
import InfoItem from './InfoItem';
import { User } from '../../models';
import { Icon } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import { Actions, ActionConst } from 'react-native-router-flux';
import SessionManager from '../../libs/SessionManager';
import moment from 'moment';

class BasicInfoView extends Component {

  state = {
    reload: false
  };

  render () {
    const {container, header, headerBigText, headerText, headerFlagContainer, headerFlag, cardHeader, cardEditButton, cardHeaderText} = styles;
    console.log(User.listApartment);
    this.data = [];
    for (let i in User.listApartment) {
      this.data.push({value: User.listApartment[i]['apartmentCode']});
    }
    return (
      <ScrollView style={container}>
        {/* header view */}
        <View style={header}>
          <Avatar canEdit={true} style={{marginLeft: 10, marginRight: 10}} size={130}/>
          <View style={{alignItems: 'flex-start'}}>
            <Dropdown
              onChangeText={(value, index, data) => {
                console.log(data[index]);
                let selected = User.listApartment[index];
                if (selected.apartmentId == User.currentApartmentId) {
                  return;
                }
                User.currentApartmentId = selected.apartmentId;
                User.currentApartmentCode = selected.apartmentCode;
                SessionManager.saveUserInfo(User);
                Actions.splash({type: ActionConst.RESET});
              }}
              rippleOpacity={0}
              renderBase={() => {
                return (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextView style={headerBigText}>
                      {'Căn hộ ' + User.currentApartmentCode}{' '}
                    </TextView>
                    <Icon name={'repeat'} color={Themes.Colors.profileText} size={22}/>
                  </View>
                );
              }}
              containerStyle={{
                width: 200,
                height: 36
              }}
              data={this.data}/>
            <TextView style={headerText}>
              {I18n.t(User.residentType)}
            </TextView>
          </View>
          {false && <Touchable style={headerFlagContainer} onPress={() => {
            alert('change language');
          }}>
            <View style={headerFlag}></View>
          </Touchable>}
        </View>
        {/* body: card view */}
        <Card>
          {/* card headerview */}
          <View style={cardHeader}>
            <TextView style={cardHeaderText}>{I18n.t('contact_info')}</TextView>
            {false && <Touchable onPress={() => {
              alert('on edit button');
            }}>
              <Image source={Themes.Resource.btn_edit}
                     style={{width: 30, height: 30, resizeMode: 'contain', marginRight: 15}}/>
            </Touchable>}
          </View>
          {/* card mid line */}
          <View style={{marginLeft: 20, marginRight: 20, height: 1, backgroundColor: '#ddd', marginBottom: 5}}></View>
          {/* card body */}
          <InfoItem label="Họ và tên" text={User.fullName}/>
          <InfoItem label="Ngày sinh"
                    text={User.birthDay != '' ? moment.unix(parseInt(User.birthDay / 1000)).format('DD-MM-YYYY') : ''}/>
          <InfoItem label="Giới tính" text={I18n.t(User.gender)}/>
          <InfoItem label="CMND/HC" text={User.identification}/>
          <InfoItem label="Số điện thoại" text={User.phoneNumber}/>
          {User.subPhoneNumber != null && User.subPhoneNumber != undefined && User.subPhoneNumber != '' &&
          <InfoItem label="Số điện thoại 2" text={User.subPhoneNumber ? User.subPhoneNumber : ''}/>}
          <InfoItem label="Email" text={User.email ? User.email : 'Chưa cập nhật'}/>
        </Card>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {/*<GradientButton textStyle={{fontSize: 16}} containerStyle={{width: 150, alignSelf: 'center', marginTop: 15}}*/}
          {/*text={"Yêu cầu sửa"}/>*/}
          <GradientButton textStyle={{fontSize: 16}}
                          containerStyle={{width: 150, alignSelf: 'center', marginTop: 15, marginLeft: 8}}
                          text={'Đổi mật khẩu'} onPress={() => {
            Actions.ChangePassword();
          }}/>
        </View>
        <View style={{height: 40}}>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 40
  },
  header: {
    height: 150,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  headerBigText: {
    fontWeight: '600',
    fontSize: 18,
    color: Themes.Colors.profileText
  },
  headerText: {
    fontSize: 15,
    color: Themes.Colors.profileText
  },
  headerFlagContainer: {
    width: 52,
    top: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'absolute'
  },
  headerFlag: {
    backgroundColor: 'red',
    width: 32,
    height: 22,
    margin: 10
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  cardHeaderText: {
    marginLeft: 20,
    fontSize: 15,
    color: '#39484d',
    fontWeight: 'bold'
  },
  cardEditButton: {
    width: 40,
    height: 40,
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: Themes.Colors.profileText
  }
});

export default BasicInfoView;