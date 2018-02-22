import StorageHelper from './StorageHelper';
import HttpClientHelper from './HttpClientHelper';
import User from '../models/User';
import { Actions } from 'react-native-router-flux';
import FCM from 'react-native-fcm';

class SessionManager {
  token = null;
  regulation = null;

  constructor () {

  }

  setToken (token) {
    this.token = token;
    StorageHelper.setToken(token);
  }

  getRegulation () {
    return this.regulation;
  }

  setRegulation (regulation) {
    this.regulation = regulation;
    StorageHelper.set('regulation', JSON.stringify(regulation));
  }

  logout () {
    for (let i in User) {
      if (i != 'getAvatar' && i != 'topics')
        User[i] = '';
    }
    User.listApartment = [];
    for (let i in User.topics) {
      console.log('logout', User.topics[i]);
      try {
        if (User.topics[i])
          FCM.unsubscribeFromTopic('' + User.topics[i]);
      } catch (e) {}
    }
    User.topics = [];
    HttpClientHelper.authorization = null;
    this.token = undefined;
    StorageHelper.removeToken();
    StorageHelper.removeUserInfo();
    HttpClientHelper.put('logout', {});
    setTimeout(() => {
      Actions.reset('splash');
    }, 300);
  }

  async getToken () {
    if (!this.token) {
      this.token = await StorageHelper.getToken();
    }
    return this.token;
  }

  saveUserInfo (data) {
    try {
      for (let i in User) {
        if (data[i] != undefined && i != 'getAvatar')
          User[i] = data[i];
      }
      this.token = User['jSessionId'];
      StorageHelper.setUserInfo(User);
      StorageHelper.setToken(User.jSessionId);
      this.topics = data.topics;
    } catch (e) {
      console.log(e);
    }
  }

  async init () {
    let data = await StorageHelper.getUserInfo();
    if (data != null)
      for (let i in User) {
        if (data[i] != undefined && i != 'getAvatar')
          User[i] = data[i];
      }
    this.token = User.jSessionId;
    try {
      this.regulation = JSON.parse(StorageHelper.get('regulation'));
    } catch (e) {
      console.log(e);
    }
  }

  isLoggedIn () {
    if (this.token)
      return true;
    return false;
  }
}

export default new SessionManager();
