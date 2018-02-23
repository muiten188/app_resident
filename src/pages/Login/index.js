import React from 'react';
import { View, Image, Text } from 'react-native';
import { FormInput, FormValidationMessage, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

import * as Themes from '../../themes';
import { GradientButton, TextView } from '../../component';
import I18n from '../../i18n';
import { HttpClientHelper, SessionManager, Functions } from '../../libs';
import StorageHelper from '../../libs/StorageHelper';
import ResetPassword from './ResetPassword';
import Touchable from '../../component/Touchable/index';

class Login extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: false,
      language: 'vi',
      reload: true,
    };
  }

  reload () {
    this.setState({
      reload: !this.state.reload
    });
  }

  async init () {
    let user = await StorageHelper.get('username', '');
    this.setState({username: user});
  }

  componentWillMount () {
    this.loadLang();
    I18n.init();
    this.init();
  }

  async loadLang () {
    let language = await StorageHelper.get('current_language', 'vi');
    this.setState({language});
  }

  changeLang () {
    if (this.state.language == 'vi') {
      StorageHelper.set('current_language', 'en');
      I18n.init('en');
      this.setState({
        language: 'en'
      });
    } else {
      StorageHelper.set('current_language', 'vi');
      I18n.init('vi');
      this.setState({
        language: 'vi'
      });
    }
  }

  pressButtonLogin () {
    this.setState({loading: true});
    let params = {
      username: this.state.username,
      password: this.state.password
    };
    HttpClientHelper.post('login', params, (err, res) => {
      // setTimeout(()=>{
      console.log('login', res)
      this.setState({loading: false});
      if (!err) {
        StorageHelper.set('username', this.state.username);
        SessionManager.saveUserInfo(res);
        Actions.reset('main');
      } else {
        alert('Username hoặc password không chính xác. Vui lòng thử lại!');
      }
      // }, 1000)
    });
  }

  render () {
    return <View style={{flex: 1}}>
      <Image source={Themes.Resource.background} style={{
        resizeMode: 'cover',
        width: Themes.Metrics.screenWidth,
        height: Themes.Metrics.screenHeight,
        position: 'absolute',
        top: 0,
        left: 0
      }}/>
      <View style={{
        width: Themes.Metrics.screenWidth,
        height: Themes.Metrics.screenHeight,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View style={{width: 284}}>
          <Image source={Themes.Resource.bg_login_top} style={{resizeMode: 'stretch', width: 284, height: 86}}/>
          <View style={{width: 284, height: 220}}>
            <Image source={Themes.Resource.bg_login_middle}
                   style={{resizeMode: 'stretch', width: 284, height: 220, position: 'absolute', top: 0, left: 0}}/>
            <View style={{width: 284, flexDirection: 'row', marginTop: 10}}>
              <FormInput placeholder={I18n.t('username')} value={this.state.username} con={{name: 'home'}}
                         autoCorrect={false}
                         autoCapitalize="none"
                         containerStyle={{paddingLeft: 30, height: 40, flex: 1}}
                         onChangeText={(username) => {
                           this.setState({username});
                         }}/>
              <Icon color='#9aa1a6'
                    containerStyle={{width: 36, height: 36, marginLeft: 10, position: 'absolute'}}
                    name='person-outline'/>
            </View>

            <View style={{width: 284, flexDirection: 'row', marginTop: 20}}>
              <FormInput placeholder={I18n.t('password')} value={this.state.password} con={{name: 'home'}}
                         containerStyle={{paddingLeft: 30, height: 40, flex: 1}}
                         secureTextEntry={true}
                         onChangeText={(password) => {
                           this.setState({password});
                         }}/>
              <Icon color='#9aa1a6' containerStyle={{width: 36, height: 36, marginLeft: 10, position: 'absolute'}}
                    name='lock-outline'/>
            </View>
            <Touchable onPress={() => {
              Actions.ResetPassword();
            }}><Text style={{
              color: '#8cade9',
              backgroundColor: 'transparent',
              alignSelf: 'flex-end',
              marginRight: 20,
              marginTop: 8,
              fontSize: 15
            }}>{I18n.t('forgot_password')}</Text>
            </Touchable>
            <GradientButton text={I18n.t('login')} loading={this.state.loading}
                            containerStyle={{marginTop: 30, width: 200, alignSelf: 'center'}}
                            onPress={this.pressButtonLogin.bind(this)}/>
          </View>
          <Image source={Themes.Resource.bg_login_bottom} style={{resizeMode: 'stretch', width: 284, height: 34}}/>
        </View>
      </View>
      <Text style={{
        fontStyle: 'italic',
        position: 'absolute',
        bottom: 10,
        width: Themes.Metrics.screenWidth,
        left: 0,
        textAlign: 'center',
        color: '#fff',
        fontSize: 14,
        padding: 5,
        backgroundColor: 'transparent'
      }} onPress={() => {
        Functions.showModal({
          title: I18n.t('sign_up'),
          body: <TextView style={{color: '#4e5a5e'}}>
            {I18n.t('register_message')}
          </TextView>
        });
      }}>{I18n.t('no_account')}{' '}<Text
        style={{fontStyle: 'normal', textDecorationLine: 'underline'}}>{I18n.t('sign_up')}</Text></Text>
      <View style={{
        flexDirection: 'row',
        position: 'absolute',
        width: 100,
        top: (Themes.Metrics.navbarPaddingTop + 5),
        right: 10,
        opacity: 0,
        alignItems: 'center'
      }}>
        <Image source={Themes.Resource.language} style={{width: 20, height: 20, tintColor: '#fff'}}/>
        <TextView style={{textAlign: 'left', padding: 5, fontSize: 15, color: '#fff'}} onPress={() => {
          this.changeLang();
        }}>{this.state.language == 'vi' ? 'English' : 'Tiếng Việt'}</TextView>
      </View>
    </View>;
  }

}

Login.ResetPassword = ResetPassword;

export default Login;