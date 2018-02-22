import React, { Component } from 'react';

import { View, FlatList } from 'react-native';
import DateScroller from './DateScroller';
import { TextView, Touchable } from '../../component';
import * as Themes from '../../themes';
import { Functions } from '../../libs';
import Card from '../../component/Card/index';
import HttpClientHelper from '../../libs/HttpClientHelper';
import User from '../../models/User';
import numeral from 'numeral';
import I18n from '../../i18n/index';

class FinanceHistory extends Component {

  data = null;

  constructor (props) {
    super(props);
    this.state = {
      reload: false,
      month: '',
    };
  }

  reload () {
    this.setState({reload: !this.state.reload});
  }

  loadData () {
    let params = {
      apartmentId: User.currentApartmentId,
      month: this.state.month
    };
    HttpClientHelper.get('payment', params, (err, res) => {
      console.log(res);
      if (!err) {
        this.data = res.data;
        this.reload();
      } else {
        this.data = [];
        this.reload();
      }
    }, 1);

    // this.data = [
    //   {
    //     'key': 0,
    //     'currency': 'VND',
    //     'price': '1.000.000',
    //     'description': 'Nội dung gì đó',
    //     'date': '2017-11-21',
    //     'title': 'Thông báo'
    //   },
    //   {
    //     'key': 1,
    //     'currency': 'VND',
    //     'price': '1.000.000',
    //     'description': 'Nội dung gì đó',
    //     'date': '2017-11-21',
    //     'title': 'Thông báo'
    //   },
    //   {
    //     'key': 2,
    //     'currency': 'VND',
    //     'price': '1.000.000',
    //     'description': 'Nội dung gì đó',
    //     'date': '2017-11-21',
    //     'title': 'Thông báo'
    //   },
    //   {
    //     'key': 3,
    //     'currency': 'VND',
    //     'price': '1.000.000',
    //     'description': 'Nội dung gì đó',
    //     'date': '2017-11-21',
    //     'title': 'Thông báo'
    //   }
    // ];
    // this.reload();
  }

  renderBillItem (item) {

    let bottomStyle = null;
    if (item.key == 3) {
      bottomStyle = {
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8
      };
    }

    return <View style={{backgroundColor: item.key % 2 == 0 ? '#ffffff' : '#d5f6fe', ...bottomStyle}}>
      <Touchable onPress={() => {
        Functions.showModal({
          title: 'Thông tin chi tiết',
          date: item.paymentDate,
          body: <TextView style={{color: '#4e5a5e', lineHeight: 30}}>
            {'Dịch vụ: ' + I18n.t(item.serviceName) + '\nKỳ hóa đơn: ' + item.invoiceMonth + '\nSố tiền: ' + numeral(item.paymentAmount).format('0,0') + ' VND\nTrạng thái: ' + item.paymentStatus}
          </TextView>
        });
      }}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 15,
          paddingRight: 15,
          height: 40,
        }}>
          <TextView style={{
            flex: 1,
            fontSize: Themes.Fonts.size.medium,
            color: '#333333',
          }}>{item.paymentDate}</TextView>
          <View style={{width: 1, backgroundColor: '#dddddd', height: 40}}/>
          <TextView
            style={{
              textAlign: 'right',
              color: '#333333',
              fontWeight: 'bold',
              flex: 1,
            }}>{numeral(item.paymentAmount).format('0,0')} VND</TextView>
        </View>
      </Touchable>
    </View>;
  }

  handleOnChange (month) {
    this.setState({
      month: month
    }, () => {
      this.loadData();
    });
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: Themes.Colors.backgroundGray}}>
        {/* Date scrollerView */}
        <DateScroller onChange={this.handleOnChange.bind(this)}/>
        {/* Content view */}
        <Card containerStyle={{margin: 15, marginTop: 20}}>
          <View style={[styles.cardHeader, {backgroundColor: '#1c8de8'}]}>
            <TextView
              style={{flex: 1, textAlign: 'center', color: '#fff'}}>Ngày</TextView>
            <View style={{width: 1, height: 34, backgroundColor: '#dddddd'}}/>
            <TextView style={{flex: 1, textAlign: 'center', color: '#fff'}}>Tiền đã đóng</TextView>
          </View>
          <View style={{height: 0.5, backgroundColor: '#ccc'}}/>
          <FlatList
            style={{backgroundColor: 'transparent'}}
            data={this.data}
            keyExtractor={(item, index) => index}
            renderItem={({item}) => this.renderBillItem(item)}
          />
        </Card>
      </View>
    );
  };
}

const styles = {

  content: {
    flex: 1,
    backgroundColor: 'transparent',
    margin: 15
  },
  cardHeader: {
    height: 34,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
};

export default FinanceHistory;