import React from 'react';
import { Platform } from 'react-native';
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from 'react-native-fcm';

import { Actions, ActionConst } from 'react-native-router-flux';

import StorageHelper from './StorageHelper';
import I18n from '../i18n/index';
import HttpClientHelper from './HttpClientHelper';
import User from '../models/User';
import RealmHelper from './RealmHelper';
import * as Functions from './Funtions';
import moment from 'moment';
import Themes from '../themes/index';
import HTMLView from 'react-native-htmlview/HTMLView';
import SessionManager from './SessionManager';

class FcmClient {

  device_token = null;

  registerFCM () {
    FCM.requestPermissions().then(() => console.log('fcm granted')).catch(() => console.log('notification permission rejected'));
    try {
      FCM.setBadgeNumber(0);
    } catch (e) {
      console.log(e);
    }
    FCM.getFCMToken().then(token => {
      if (token) {
        this.device_token = token;
        this.updateFcmToken(token);
      }
      setTimeout(() => {
        FCM.getInitialNotification().then((notif) => {
          if (notif) {
            notif.opened_from_tray = true;
          }
          this.processNotification(notif);
        });
      }, 1500);
    });

    this.notificationListener = FCM.on(FCMEvent.Notification, (notify) => {
      this.processNotification(notify);
    });

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
      if (token) {
        this.device_token = token;
        this.updateFcmToken(token);
      }
    });
  };

  expireMsg (time, title, body) {
    FCM.scheduleLocalNotification({
      fire_date: new Date(Date.now() + (time * 1000)).getTime(),
      id: 'expire',
      title: title,
      body: body,
      show_in_foreground: true,
      priority: 'high'
    });
  }

  scheduleMsg (time, title, body) {
    FCM.scheduleLocalNotification({
      fire_date: new Date(time).getTime(),
      id: 'schedule',
      title: title,
      body: body,
      show_in_foreground: true,
      priority: 'high'
    });
  }

  updateFcmToken (token) {
    this.initSubscribe();
  }

  async processNotification (notif) {
    if (notif == undefined) return;
    try {
      if (notif != undefined) {
        if (!notif.local_notification && !notif.opened_from_tray) {
          if (Platform.OS == 'android') {
            let message_id = null;
            if (!message_id) {
              message_id = notif['gcm.message_id'];
            }
            if (!message_id) {
              message_id = notif['google.message_id'];
            }
            if (!message_id && notif) {
              message_id = notif['message_id'];
            }
            let title = notif.title || (notif.fcm && notif.fcm.title);
            let body = notif.body || (notif.fcm && notif.fcm.body);
            let hapuType = notif.hapuType || (notif.fcm && notif.fcm.hapuType);
            let objectId = notif.objectId || (notif.fcm && notif.fcm.objectId);
            let apartmentId = notif.apartmentId || (notif.fcm && notif.fcm.apartmentId) || (User && User.currentApartmentId);
            let apartmentCode = notif.apartmentCode || (notif.fcm && notif.fcm.apartmentCode) || (User && User.currentApartmentCode);
            this.showLocalMsg('message', title, body, notif.image_link, message_id, hapuType, objectId, apartmentId, apartmentCode);
          }
        }
      }
      if (notif.opened_from_tray) {
        let message_id = null;
        if (!message_id) {
          message_id = notif['gcm.message_id'];
        }
        if (!message_id) {
          message_id = notif['google.message_id'];
        }
        if (!message_id && notif) {
          message_id = notif['message_id'];
        }
        let last_message_id = await StorageHelper.get('message_id');
        let image_link = null;
        if (!image_link) {
          image_link = notif['gcm.notification.image_link'];
        }
        if (!image_link) {
          image_link = notif['image_link'];
        }
        if (message_id != last_message_id && notif.body != '' && notif.body != undefined) {
          StorageHelper.set('message_id', message_id);
          try {
            console.log('notif', notif);
            let hapuType = notif.hapuType;
            if (hapuType === 'NOTIFY_COMMON' || hapuType === 'NOTIFY_INDIVIDUAL') {
              HttpClientHelper.post('updateMsgStatus', {
                apartmentId: parseInt(notif.apartmentId),
                hapuType: notif.hapuType,
                objectId: parseInt(notif.objectId)
              }, (err, res) => {});
              if (User.currentApartmentId == parseInt(notif.apartmentId)) {
                Actions.notice({hapuType: hapuType, title: I18n.t('notice')});
              }
              HttpClientHelper.get('loadById', {objectId: parseInt(notif.objectId)}, (err, item) => {
                if (!err && item) {
                  item.apartmentId = parseInt(notif.apartmentId);
                  item.isRead = 1;
                  let date = moment();
                  try {
                    date = moment.unix((item.issueDate ? item.issueDate : null) / 1000);
                  } catch (e) {}
                  RealmHelper.write(() => {
                    RealmHelper.getInstance().create(hapuType === 'NOTIFY_COMMON' ? 'GeneralMessage' : 'IndividualMessage', item, true);
                  });

                  if (User.currentApartmentId != parseInt(notif.apartmentId)) {
                    User.currentApartmentId = parseInt(notif.apartmentId);
                    User.currentApartmentCode = notif.apartmentCode;
                    SessionManager.saveUserInfo(User);
                    Actions.splash({type: ActionConst.RESET});
                    setTimeout(() => {
                      Actions.notice({hapuType: hapuType, title: I18n.t('notice')});
                      try {
                        Functions.showModal({
                          title: item.title,
                          date: date.format('DD-MM-YYYY'),
                          body: <HTMLView value={item.content}/>
                        });
                      } catch (e) {}
                    }, 1500);
                  } else {
                    try {
                      Functions.showModal({
                        title: item.title,
                        date: date.format('DD-MM-YYYY'),
                        body: <HTMLView value={item.content}/>
                      });
                    } catch (e) {}
                  }
                }
              });
            }
            if (hapuType === 'INBOX') {
              Actions.reportConversation({item: {conversationId: notif.objectId}});
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
      // await someAsyncCall();

      if (Platform.OS === 'ios') {
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData); //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All); //other types available: WillPresentNotificationResult.None
            break;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  showLocalMsg (type, title, body, image_link, message_id, hapuType, objectId, apartmentId, apartmentCode) {
    FCM.presentLocalNotification({
      id: message_id,//"UNIQ_ID_STRING",                               // (optional for instant notification)
      message_id: message_id,
      title: title,                     // as FCM payload
      body: body,                    // as FCM payload (required)
      sound: 'default',                                   // as FCM payload
      priority: 'high',                                   // as FCM payload
      click_action: 'fcm.click',                             // as FCM payload
      hapuType: hapuType,
      objectId: objectId,
      apartmentId: apartmentId,
      apartmentCode: apartmentCode,
      badge: 1,                                          // as FCM payload IOS only, set 0 to clear badges
      number: 0,                                         // Android only
      ticker: title,                   // Android only
      auto_cancel: true,                                  // Android only (default true)
      large_icon: 'ic_launcher',                           // Android only
      icon: 'ic_notify',                                // as FCM payload, you can relace this with custom icon you put in mipmap
      // big_text: body,     // Android only
      sub_text: body,                      // Android only
      color: Themes.Colors.profileText,                                       // Android only
      vibrate: 300,                                       // Android only default: 300, no vibration if you pass null
      tag: 'some_tag',                                    // Android only
      group: 'group',                                     // Android only
      image_link: image_link,
      // picture: "https://google.png",                      // Android only bigPicture style
      // my_custom_data:'my_custom_field_value',             // extra data you want to throw
      lights: true,                                       // Android only, LED blinking (default false)
      show_in_foreground: true                                  // notification when app is in foreground (local & remote)
    });

  }

  initSubscribe () {
    setTimeout(async () => {
      try {
        let userInfo = await StorageHelper.getUserInfo();
        console.log('fcm', userInfo);
        let new_group = userInfo.topics;
        for (let i in new_group) {
          if (new_group[i]) {
            FCM.subscribeToTopic(new_group[i]);
          }
        }
      } catch (e) {
        console.log('initSubscribe', e);
      }
    }, 500);
  }

  unRegisterFCM () {
    this.notificationListener.remove();
    this.refreshTokenListener.remove();
  }
}

export default new FcmClient();