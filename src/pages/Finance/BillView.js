import React, { Component } from 'react';

import { View, FlatList } from 'react-native';
import DateScroller from './DateScroller';
import { TextView, Touchable, Card } from '../../component';
import * as Themes from '../../themes';
import { Functions } from '../../libs';
import I18n from '../../i18n/index';
import numeral from 'numeral';
import HttpClientHelper from '../../libs/HttpClientHelper';
import User from '../../models/User';

class BillView extends Component {

  data = null;
  balance = 0;

  constructor (props) {
    super(props);
    this.state = {
      reload: false,
      page: 1
    };
  }

  componentDidMount () {
    this.loadData();
    this.loadBalance();
  }

  reload () {
    this.setState({reload: !this.state.reload});
  }

  loadBalance () {
    let params = {
      url_params: {
        apartmentId: User.currentApartmentId && User.currentApartmentId != '' ? User.currentApartmentId : 1,
      }
    };
    HttpClientHelper.get('balance', params, (err, res) => {
      if (!err) {
        if (res.accountBalance) {
          this.balance = res.accountBalance;
        }
      }
    }, 1);
  }

  loadData () {
    let params = {
      apartmentId: User.currentApartmentId && User.currentApartmentId != '' ? User.currentApartmentId : 1,
      currentPage: this.state.page,
      pageSize: 20
    };
    HttpClientHelper.get('invoice', params, (err, res) => {
      if (!err) {
        this.data = res.data;
        this.reload();
      }
    }, 1);
    // this.data = [
    //   {
    //     'key': 0,
    //     'currency': 'VND',
    //     'month': 8,
    //     'paid': 0,
    //     'fee': [
    //       {title: 'Hóa đơn điện', amount: 300000},
    //       {title: 'Hóa đơn nước', amount: 120000},
    //       {title: 'Phí dịch vụ', amount: 150000},
    //       {title: 'Phí xe máy', amount: 80000}
    //     ]
    //   },
    //   {
    //     'key': 1,
    //     'currency': 'VND',
    //     'month': 7,
    //     'paid': 1,
    //     'fee': [
    //       {title: 'Hóa đơn điện', amount: 200000},
    //       {title: 'Hóa đơn nước', amount: 100000},
    //       {title: 'Phí dịch vụ', amount: 150000},
    //       {title: 'Phí xe máy', amount: 80000}
    //     ]
    //   }
    // ];
    // this.reload();
  }

  renderBillItem (item) {
    let cmp = [];
    let listInvoiceDetail = item.listInvoiceDetail;
    let total = 0;
    for (let i in listInvoiceDetail) {
      let item = listInvoiceDetail[i];
      total += item.invoiceDetailAmount;
      cmp.push(
        <View key={'bill_' + i}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 13,
            paddingBottom: 13
          }}>
            <TextView
              style={{marginLeft: 15}}>{I18n.t(item.serviceName) + ((item.vehiclePlate && item.vehiclePlate != 'null' && item.vehiclePlate != '') ? ' - ' + item.vehiclePlate : '')}</TextView>
            <TextView style={{
              textAlign: 'right',
              paddingRight: 15,
              fontWeight: 'bold'
            }}>{numeral(item.invoiceDetailAmount).format('0,0')}</TextView>
          </View>
          <View style={{backgroundColor: '#ccc', height: 0.5, marginLeft: 15, marginRight: 15}}/>
        </View>
      );
    }

    cmp.push(
      <View key={'bill_total'} style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10
      }}>
        <TextView style={{marginLeft: 15, fontWeight: '600'}}>{'Tổng tiền'}</TextView>
        <TextView
          style={{textAlign: 'right', paddingRight: 15, fontWeight: '600'}}>{numeral(total).format('0,0')}</TextView>
      </View>
    );

    return <Card containerStyle={{marginTop: 8, paddingBottom: 10, marginBottom: 8}}>
      <View style={[styles.cardHeader, {backgroundColor: item.invoiceStatus == 'COMPLETE' ? '#bdf1fe' : '#fff2c5'}]}>
        <TextView
          style={[styles.cardHeaderText]}>
          {'Hóa đơn tháng ' + item.invoiceMonth}
        </TextView>
        <TextView
          style={[styles.cardHeaderText2]}>
          {item.invoiceStatus == 'COMPLETE' ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </TextView>
      </View>
      <View style={{height: 0.5, backgroundColor: '#ccc'}}/>
      {cmp}
    </Card>;
  }

  renderHeader () {
    return <View
      style={{paddingLeft: 5, paddingTop: 10, paddingBottom: 10, flexDirection: 'row', alignItems: 'center'}}>
      <TextView style={{fontWeight: 'bold', fontSize: 15}}>Số dư: </TextView>
      <TextView style={{fontSize: 16}}>{numeral(this.balance).format('0,0')} VND</TextView>
    </View>;
  }

  render () {
    return (
      <View style={{flex: 1, backgroundColor: Themes.Colors.backgroundGray}}>
        <View style={styles.content}>
          <FlatList
            style={{
              backgroundColor: 'transparent', paddingBottom: 8, paddingTop: 8, paddingRight: 16,
            }}
            data={this.data}
            keyExtractor={(item, index) => index}
            renderItem={({item}) => this.renderBillItem(item)}
            ListHeaderComponent={() => this.renderHeader()}
            ListFooterComponent={() => <View style={{height: 16, backgroundColor: 'transparent'}}/>}
          />
        </View>
      </View>
    );
  };
}

const styles = {
  content: {
    backgroundColor: 'transparent',
    paddingLeft: 16,
    overflow: 'hidden'
  },
  cardHeader: {
    paddingTop: 14,
    paddingBottom: 14,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHeaderText: {
    marginLeft: 15,
    fontSize: 15,
    color: '#39484d',
    fontWeight: '600'
  },
  cardHeaderText2: {
    marginRight: 15,
    fontSize: 13,
    color: '#4997da'
  },
};

export default BillView;