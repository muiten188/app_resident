import React from 'react';
import { Image, View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { Actions } from 'react-native-router-flux';

import { Navbar, TabBarView } from '../../component';
import General from './General';
import I18n from '../../i18n';
import Report from './Report';
import Rule from './Rule';
import ReportConversation from './ReportConversation';
import Touchable from '../../component/Touchable/index';
import Themes from '../../themes/index';
import CreateNewReport from './CreateNewReport';

class Notice extends React.Component {
  render () {
    return (
      <View style={{flex: 1}}>
        <Navbar title={this.props.title} rightImageButton={Themes.Resource.icon_new} onPressRightButton={() => {
          Actions.CreateNewReport();
        }}/>
        <ScrollableTabView ref={(ref) => {
          this.tab = ref;
        }} renderTabBar={() => <TabBarView/>}>
          <General key="0" _type={'general_notice'} tabLabel={I18n.t('general_notice')}/>
          <General key="1" _type={'private_notice'} tabLabel={I18n.t('private_notice')}/>
          <Report key="2" tabLabel={I18n.t('report_notice')}/>
          {/*<Rule key="3" tabLabel={I18n.t('rule_notice')}/>*/}
        </ScrollableTabView>
      </View>
    );
  }

  componentDidMount () {
    setTimeout(() => {
      if (this.tab) {
        this.tab.goToPage(this.props.hapuType === 'NOTIFY_COMMON' ? 0 : (this.props.hapuType === 'NOTIFY_INDIVIDUAL' ? 1 : (this.props.hapuType === 'INBOX' ? 2 : 0)));
      }
    }, 300);
  }
}

Notice.ReportConversation = ReportConversation;
Notice.CreateNewReport = CreateNewReport;

export default Notice;