import React from 'react';
import { View } from 'react-native';

import { Navbar, TabBarView } from '../../component';
import I18n from '../../i18n';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import BasicInfoView from './BasicInfoView';
import TextView from '../../component/TextView/index';
import ChangePassword from './ChangePassword';
import Family from './Family';

class Account extends React.Component {
  render () {
    return (
      <View style={{flex: 1}}>
        <Navbar title={this.props.title}/>
        <ScrollableTabView
          renderTabBar={() => <TabBarView/>}>
          <BasicInfoView tabLabel={I18n.t('basic_info')}/>
          <Family tabLabel={I18n.t('dependant')}/>
        </ScrollableTabView>
      </View>
    );
  }
}

Account.ChangePassword = ChangePassword;

export default Account;