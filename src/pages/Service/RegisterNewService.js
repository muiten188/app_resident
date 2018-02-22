import React from 'react';
import { View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import I18n from '../../i18n';

import { Navbar } from '../../component';
import UploadDocument from './UploadDocument';
import EnterInfo from './EnterInfo';

class RegisterNewService extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      page: 0
    };
    this.setCurrentPage = this.setCurrentPage.bind(this);
  }

  setCurrentPage (page) {
    this.setState({page});
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <Navbar title={this.props.title}/>
        <ScrollableTabView initialPage={0} page={this.state.page} renderTabBar={() => <View style={{height: 0}}/>}>
          <UploadDocument key="0" icon={this.props.icon}
                          title={this.props.title} setCurrentPage={this.setCurrentPage}/>
          <EnterInfo key="1" icon={this.props.icon} title={this.props.title}
                     setCurrentPage={this.setCurrentPage}/>
        </ScrollableTabView>
      </View>
    );
  }
}

export default RegisterNewService;