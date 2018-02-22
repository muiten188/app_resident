import React from 'react';
import { View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import I18n from '../../i18n';

import { Navbar, TabBarView } from '../../component';
import FixedService from './FixedService';
import OptionalService from './OptionalService';
import ListService from './ListService';
import RegisterNewService from './RegisterNewService';

class Service extends React.Component {
  render () {
    return (
      <View style={{flex: 1}}>
        <Navbar title={this.props.title}/>
        <ScrollableTabView renderTabBar={() => <TabBarView/>}>
          <OptionalService key="1" tabLabel={I18n.t('optional_service')}/>
          <FixedService key="0" tabLabel={I18n.t('fixed_service')}/>
        </ScrollableTabView>
      </View>
    );
  }
}

Service.ListService = ListService;
Service.RegisterNewService = RegisterNewService;

export default Service;