import React from 'react';
import {View, Image} from 'react-native';
import {ActionConst, Actions} from 'react-native-router-flux';
import {SessionManager} from '../../libs';
import * as Themes from '../../themes';

class Splash extends React.Component {


  async checkLogin() {
    await SessionManager.init();
    if(SessionManager.isLoggedIn()) {
      Actions.reset("main");
    } else {
      Actions.reset("login");
    }
  }

  componentWillMount() {
    setTimeout(() => {
      this.checkLogin();
    }, 1000)
  }

  render() {
    return <View style={{backgroundColor: '#ffffff', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image source={Themes.Resource.splash_logo}
             style={{width: 100, resizeMode: 'contain'}}/>
    </View>
  }
}

export default Splash;