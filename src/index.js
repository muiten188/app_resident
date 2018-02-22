/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  StatusBar,
  Modal,
  ScrollView,
  Platform
} from 'react-native';
import HTMLView from 'react-native-htmlview';

import { Router, Scene, Stack, Reducer } from 'react-native-router-flux';

import { Login, Splash, Main, Notice, Service, Account, Finance, RegisterNewService } from './pages';
import TestValidate from './pages/Service/TestValidate';
import { TextView, GradientButton } from './component';
import ReportConversation from './pages/Notice/ReportConversation';
import Themes from './themes/index';
import FcmClient from './libs/FcmClient';

class MainRouter extends Component {
  render () {
    return (
      <Router>
        <Stack key="root" hideNavBar={true}>
          <Scene key="splash" component={Splash}/>
          <Scene key="login" component={Login}/>
          <Scene key="main" component={Main}/>
          <Scene key="notice" component={Notice}/>
          <Scene key="service" component={Service}/>
          <Scene key="listService" component={Service.ListService}/>
          <Scene key="registerService" component={Service.RegisterNewService}/>
          <Scene key="account" title="Profile" component={Account} initial={false}/>
          <Scene key="finance" component={Finance}/>
          <Scene key="reportConversation" component={Notice.ReportConversation}/>
          <Scene key="test" component={TestValidate} initial={false}/>
          <Scene key="RegisterNewService" component={Service.RegisterNewService} initial={false}/>
          <Scene key="CreateNewReport" component={Notice.CreateNewReport} initial={false}/>
          <Scene key="ChangePassword" component={Account.ChangePassword} initial={false}/>
          <Scene key="ResetPassword" component={Login.ResetPassword} initial={false}/>
        </Stack>
      </Router>
    );
  }
}

export default class App extends Component {

  static instance;
  modalContent = {};

  constructor (props) {
    super(props);
    callback = null;
    this.state = {
      show_modal: false
    };
    App.instance = this;
  }

  static getInstance () {
    return App.instance;
  }

  hideModal () {
    this.setState({show_modal: false});
  }

  showModal (modalContent) {
    this.modalContent = modalContent;
    this.setState({show_modal: true});
  }

  render () {

    if (this.main == null) {
      this.main = <MainRouter/>;
    }

    return (
      <View style={{flex: 1}}>
        {Platform.OS == 'ios' && <StatusBar
          backgroundColor="white"
          barStyle="light-content"
        />}
        {this.main}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.show_modal}
          onRequestClose={() => {
            this.hideModal();
          }}
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)'}}>
            <View style={{width: 320}}>
              <View style={{paddingBottom: 23}}>
                {this.modalContent.contentOnly != true && <View style={{backgroundColor: '#fff', borderRadius: 5}}>
                  <TextView
                    style={{
                      padding: 20,
                      paddingBottom: 0,
                      fontSize: 19,
                      fontWeight: '500',
                      color: '#39484d'
                    }}>{this.modalContent && this.modalContent.title ? this.modalContent.title : 'Hapulico'}</TextView>
                  {this.modalContent && this.modalContent.date && <TextView style={{
                    color: '#4997da', paddingLeft: 20,
                  }}>{this.modalContent.date}</TextView>}
                  <View style={{height: 0.5, backgroundColor: '#ccc', marginLeft: 15, marginRight: 15, marginTop: 8}}/>
                  <ScrollView
                    style={{
                      minHeight: 100,
                      maxHeight: (Themes.Metrics.screenHeight > 400 ? 400 : (Themes.Metrics.screenHeight - 10)),
                      padding: 20,
                      paddingTop: 12,
                      paddingBottom: 40
                    }}>
                    {this.modalContent.body}
                  </ScrollView>
                </View>}
                {this.modalContent.contentOnly == true && this.modalContent.body}
              </View>
              <View style={{bottom: 0, position: 'absolute', zIndex: 1000, flexDirection: 'row', justifyContent: 'center', width: 320}}>
                <GradientButton
                  activeOpacity={1}
                  containerStyle={{width: 100}}
                  text={(this.modalContent.buttonText ? this.modalContent.buttonText : 'Đóng')}
                  onPress={() => {
                    this.hideModal();
                    if (this.modalContent && this.modalContent.mCallback)
                      this.modalContent.mCallback.call(this);
                  }}/>
                {!(!this.modalContent.buttonText2) && <GradientButton
                  activeOpacity={1}
                  containerStyle={{width: 100, marginLeft: 5}}
                  text={(this.modalContent.buttonText2 ? this.modalContent.buttonText2 : 'Đóng')}
                  onPress={() => {
                    this.hideModal();
                    if (this.modalContent && this.modalContent.mCallbac2k)
                      this.modalContent.mCallback2.call(this);
                  }}/>}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

