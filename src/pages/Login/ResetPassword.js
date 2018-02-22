import React from 'react';
import { View, StyleSheet } from 'react-native';
import Themes from '../../themes/index';
import Navbar from '../../component/Navbar/index';
import EnterInfoItem from '../Service/EnterInfoItem';
import GradientButton from '../../component/GradientButton/index';
import { Functions } from '../../libs';
import TextView from '../../component/TextView/index';
import HttpClientHelper from '../../libs/HttpClientHelper';
import User from '../../models/User';
import SessionManager from '../../libs/SessionManager';

export default class ResetPassword extends React.Component {

  state = {
    username: '',
  };

  changepass () {
    if (this.state.username == '') {
      Functions.showModal({
        title: 'Cảnh báo',
        body: <TextView>Bạn cần nhập email hoặc username</TextView>
      });
      return;
    }

    let params = {
      username: this.state.username,
    };

    HttpClientHelper.put('resetPassword', params, (err, res) => {
      if (!err) {
        Functions.showModal({
          title: 'Thông báo',
          body: <TextView>Yêu cầu thay đổi mật khẩu thành công. Vui lòng kiểm tra email!</TextView>,
          mCallback: () => {
            SessionManager.logout();
          }
        });
      } else {
        Functions.showModal({
          title: 'Thông báo',
          body: <TextView>Có lỗi phát sinh khi đổi mật khẩu. Vui lòng thử lại!</TextView>,
        });
      }
    });
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: Themes.Colors.backgroundGray}}>
        <Navbar title={'Quên mật khẩu'}/>
        <View style={{padding: 20}}>
          <EnterInfoItem secureTextEntry={true} label={'Email'} placeholder={'Nhập Email'}
                         onChangeText={(username) => {
                           this.setState({username: username});
                         }}/>

        </View>

        <GradientButton textStyle={{fontSize: 16}}
                        containerStyle={{width: 150, alignSelf: 'center', marginTop: 15, marginLeft: 8}}
                        text={'Lấy mật khẩu'} onPress={() => {
          this.changepass();
        }}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({});