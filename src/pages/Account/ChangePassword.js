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

export default class ChangePassword extends React.Component {

  state = {
    old_pass: '',
    new_pass: '',
    confirm_pass: ''
  };

  changepass () {
    if (this.state.old_pass == '') {
      Functions.showModal({
        title: 'Cảnh báo',
        body: <TextView>Bạn cần nhập mật khẩu cũ</TextView>
      });
      return;
    }
    if (this.state.new_pass == '') {
      Functions.showModal({
        title: 'Cảnh báo',
        body: <TextView>Bạn cần nhập mật khẩu mới</TextView>
      });
      return;
    }
    if (this.state.new_pass == this.state.old_pass) {
      Functions.showModal({
        title: 'Cảnh báo',
        body: <TextView>Mật khẩu cũ và mới phải khác nhau</TextView>
      });
      return;
    }
    if (this.state.confirm_pass != this.state.new_pass) {
      Functions.showModal({
        title: 'Cảnh báo',
        body: <TextView>Mật khẩu mới phải trùng nhau</TextView>
      });
      return;
    }

    let params = {
      newPassword: this.state.new_pass,
      oldPassword: this.state.old_pass,
      userName: User.username
    };

    HttpClientHelper.put('changePassword', params, (err, res) => {
      if (!err) {
        Functions.showModal({
          title: 'Thông báo',
          body: <TextView>Thay đổi mật khẩu thành công. Vui lòng đăng nhập lại hệ thống!</TextView>,
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
        <Navbar title={'Đổi mật khẩu'}/>
        <View style={{padding: 20}}>
          <EnterInfoItem secureTextEntry={true} label={'Mật khẩu cũ'} placeholder={'Nhập mật khẩu cũ'}
                         onChangeText={(old_pass) => {
                           this.setState({old_pass: old_pass});
                         }}/>
          <EnterInfoItem secureTextEntry={true} label={'Mật khẩu mới'} placeholder={'Nhập mật khẩu mới'}
                         onChangeText={(new_pass) => {
                           this.setState({new_pass: new_pass});
                         }}/>
          <EnterInfoItem secureTextEntry={true} label={'Nhập lại mật khẩu'} placeholder={'Nhập lại mật khẩu mới'}
                         onChangeText={(confirm_pass) => {
                           this.setState({confirm_pass: confirm_pass});
                         }}/>

        </View>

        <GradientButton textStyle={{fontSize: 16}}
                        containerStyle={{width: 150, alignSelf: 'center', marginTop: 15, marginLeft: 8}}
                        text={'Đổi mật khẩu'} onPress={() => {
          this.changepass();
        }}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({});