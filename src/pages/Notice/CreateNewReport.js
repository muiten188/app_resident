import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import Navbar from '../../component/Navbar/index';
import I18n from '../../i18n/index';
import Card from '../../component/Card/index';
import Themes from '../../themes/index';
import Touchable from '../../component/Touchable/index';
import TextView from '../../component/TextView/index';
import { Icon } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import GradientButton from '../../component/GradientButton/index';
import { Actions } from 'react-native-router-flux';
import HttpClientHelper from '../../libs/HttpClientHelper';
import User from '../../models/User';
import * as Functions from '../../libs/Funtions';
import MessageHandler from '../../libs/MessageHandler';

export default class CreateNewReport extends React.Component {

  constructor () {
    super();
    this.state = {
      text: '',
      report_type: {value: 'Chọn'},
      loading: false
    };
  }

  data = [
    // {
    //   key: 'REPORT_SUACHUA',
    //   value: I18n.t('REPORT_SUACHUA'),
    // },
    // {
    //   key: 'REPORT_THANGMAY',
    //   value: I18n.t('REPORT_THANGMAY'),
    // },
    {
      key: 'REPORT_ANNINH',
      value: I18n.t('REPORT_ANNINH'),
    }, {
      key: 'REPORT_VESINH',
      value: I18n.t('REPORT_VESINH'),
    },
    // {
    //   key: 'REPORT_CHUNG',
    //   value: I18n.t('REPORT_CHUNG'),
    // },
    {
      key: 'REPORT_CHUYENNOISONG',
      value: I18n.t('REPORT_CHUYENNOISONG_SHORT'),
    },
  ];

  async _sendTextMsg () {
    if (this.state.text.trim() === '' || !this.state.report_type.key) {
      Functions.showModal({
        title: 'Chú ý',
        body: <TextView>Vui lòng nhập đầy đủ thông tin trước khi nhấn 'Gửi'</TextView>,
      });
      return;
    }
    this.setState({loading: true});
    let params = {
      'apartmentId': User.currentApartmentId,
      'content': this.state.text.trim(),
      'conversationType': this.state.report_type.key
    };
    HttpClientHelper.post('conversation', params, (err, res) => {
      this.setState({loading: false});
      if (!err) {
        Functions.showModal({
          title: 'Gửi phản ánh',
          body: <TextView>Cảm ơn bạn đã gửi phản ánh tới BQL. Chúng tôi sẽ trả lời trong thời gian nhanh nhất có
            thể</TextView>,
          mCallback: () => {
            Actions.pop();
            MessageHandler.notify('report');
          }
        });
      }
    });
  }

  render () {
    return <View style={{flex: 1, backgroundColor: Themes.Colors.background2}} key>
      <Navbar title={I18n.t('notice')}/>
      <View style={{flexDirection: 'row', padding: 16, alignItems: 'center'}}>
        <TextView style={{flex: 1, fontSize: 16}}>
          Chọn vấn đề phản ánh
        </TextView>
        <Dropdown
          onChangeText={(value, index, data) => {
            this.setState({report_type: data[index]});
          }}
          rippleOpacity={0}
          renderBase={() => {
            return <View style={{
              flexDirection: 'row', alignItems: 'center', height: 36, borderWidth: 1,
              borderColor: Themes.Colors.borderColor,
              borderRadius: 4,
              justifyContent: 'center',
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: '#fff',
            }}>
              <TextView numberOfLines={1} style={{flex: 1, fontSize: 13}}>{this.state.report_type.value}</TextView>
              <Icon name={'keyboard-arrow-down'} style={{width: 16, height: 16}} size={16}/>
            </View>;
          }}
          containerStyle={{
            width: 140,
            height: 36,
          }}
          data={this.data}/>
      </View>
      <Touchable activeOpacity={1} onPress={() => this.textView.focus()}>
        <Card
          containerStyle={{paddingTop: 0, paddingBottom: 0, margin: 16, padding: 10, minHeight: 100, maxHeight: 400}}>
          <TextInput ref={(ref) => this.textView = ref} multiple={true} onChangeText={(text) => this.setState({text})}
                     underlineColorAndroid={'transparent'}
                     value={this.state.text}
                     autoCorrect={false}
                     autoFocus={false}
                     blurOnSubmit={false}
                     multiline={true}
            // onSubmitEditing={() => {
            //   this.setState({text: this.state.text + '\n'})
            //   this.textView.focus()
            // }}
          />
        </Card>
      </Touchable>
      <GradientButton loading={this.state.loading} containerStyle={{width: 120, alignSelf: 'center'}}
                      onPress={() => this._sendTextMsg()} text={'Gửi'}/>
    </View>;
  }
}

const styles = StyleSheet.create({});