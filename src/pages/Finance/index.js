import React from 'react';
import {View} from 'react-native';

import { Navbar, TabBarView } from '../../component';
import I18n from '../../i18n'

import ScrollableTabView from 'react-native-scrollable-tab-view'

import BillView from './BillView'
import FinenceHistory from './FinanceHistory'

class Finance extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <Navbar title={this.props.title}/>
        <ScrollableTabView
          renderTabBar={() => <TabBarView />}>
          <BillView tabLabel={I18n.t("bills")} />
          <FinenceHistory tabLabel={I18n.t("payment_histories")} />
        </ScrollableTabView>
      </View>
    );
  }
}

export default Finance;