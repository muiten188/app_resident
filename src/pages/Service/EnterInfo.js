import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Card } from '../../component';
import Themes from '../../themes/index';
import TextView from '../../component/TextView/index';
import GradientButton from '../../component/GradientButton/index';
import { Actions } from 'react-native-router-flux';
import * as Functions from '../../libs/Funtions';
import EnterInfoItem from './EnterInfoItem';
import OptionItem from './OptionItem';
import RegisterService from '../../models/RegisterService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HttpClientHelper from '../../libs/HttpClientHelper';
import MessageHandler from '../../libs/MessageHandler';

export default class EnterInfo extends React.Component {

  groups = [
    {title: 'Biển số', placeholder: 'Nhập biển số', name: 'vehiclePlate'},
    {title: 'Người sử dụng', placeholder: 'Nhập tên người sử dụng', name: 'vehicleOwnerName'},
    {title: 'Hãng xe', placeholder: 'VD: Honda', name: 'vehicleBrand'},
    {title: 'Mẫu xe', placeholder: 'VD: Lead', name: 'vehicleModel'},
    {title: 'Màu xe', placeholder: 'Nhập màu xe', name: 'vehicleColor'},
  ];

  constructor (props) {
    super(props);
    this.state = {
      reload: false
    };
  }

  reload () {
    this.setState({
      reload: !this.state.reload
    });
  }

  registerService () {
    HttpClientHelper.post('registration', RegisterService, (err, res) => {
      if (!err) {
        Functions.showModal({
          title: 'BQL Hapulico',
          mCallback: () => {
            Actions.pop();
          },
          body: <TextView style={{color: '#4e5a5e'}}>
            {'Cảm ơn quý khách đã gửi thông tin.\n' +
            'BQL sẽ tiến hành xác mình và hồi đáp quý khách trong thời gian sớm nhất,\n' +
            'Trân trọng cảm ơn,\n' +
            'BQL Hapulico'}
          </TextView>
        });
      } else {
        Functions.showModal({
          title: 'BQL Hapulico',
          body: <TextView style={{color: '#4e5a5e'}}>
            {'Đăng ký thất bại'}
          </TextView>
        });
      }
      MessageHandler.notify('new_service');
    });

  }

  render () {
    let gc = [];
    for (let i in this.groups) {
      let group = this.groups[i];
      gc.push(<EnterInfoItem value={this.state[group.name]} onChangeText={(text) => {
        this.setState({
          [group.name]: text
        });
        RegisterService[group.name] = text;
      }} key={'label_' + i} style={{marginTop: 10, fontSize: 13}} placeholder={group.placeholder}
                             label={group.title}/>);
    }
    return (
      <KeyboardAwareScrollView style={{flex: 1}} keyboardShouldPersistTaps={'always'}>
        <View style={{}}>
          <Card containerStyle={{width: 340, padding: 15, alignSelf: 'center', marginTop: 20}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={Themes.Resource[this.props.icon]}
                     style={{width: 80, height: 80, resizeMode: 'contain'}}/>
              <View style={{alignItems: 'flex-start', marginLeft: 10, alignItems: 'center'}}>
                <TextView style={{color: Themes.Colors.background, fontSize: 16}}>
                  Vai trò
                </TextView>
                <TextView style={{color: Themes.Colors.background, fontWeight: 'bold', fontSize: 18}}>
                  Người thuê nhà
                </TextView>
              </View>
            </View>
            <TextView style={{fontWeight: 'bold', marginTop: 10}}>Đề nghị quý khách cung cấp thông tin</TextView>
            <View style={{height: 1, backgroundColor: '#ccc', marginTop: 4}}/>
            <View style={{marginLeft: 10}}>
              <OptionItem selected={RegisterService.vehicleOwner == 'YES'} onPress={() => {
                RegisterService.vehicleOwner = (RegisterService.vehicleOwner == 'YES' ? 'NO' : 'YES');
                this.reload();
              }} text={'Đăng ký chính chủ'}/>
              <OptionItem selected={RegisterService.vehicleCompany == 'YES'} onPress={() => {
                RegisterService.vehicleCompany = (RegisterService.vehicleCompany == 'YES' ? 'NO' : 'YES');
                this.reload();
              }} text={'Đăng ký đứng tên doanh nghiệp'}/>
              {gc}
            </View>
          </Card>
          <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 15}}>
            <GradientButton textStyle={{fontSize: 16}} containerStyle={{width: 120}}
                            text={'Trở lại'} onPress={() => {
              this.props.setCurrentPage(0);
            }}/>
            <GradientButton textStyle={{fontSize: 16}}
                            containerStyle={{width: 120, marginLeft: 8}}
                            text={'Hoàn tất'} onPress={() => {
              this.registerService();
            }}/>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({});