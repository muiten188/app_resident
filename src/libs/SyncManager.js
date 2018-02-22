import HttpClientHelper from './HttpClientHelper';
import StorageHelper from './StorageHelper';
import User from '../models/User';
import RealmHelper from './RealmHelper';

class SyncManager {

  startSync () {
    this.syncMessage('general_notice');
    this.syncMessage('private_notice');
    this.syncConversation();
    if (this.sync) {
      clearTimeout(this.sync);
      this.sync = null;
    }
    this.sync = setTimeout(() => {
      this.startSync();
    }, 30000);
  }

  stopSync () {
    clearTimeout(this.sync);
    this.sync = null;
  }

  async syncConversation () {
    let lastTimeSync = await StorageHelper.get('lastTimeSync_message_conversation_' + User.username, '');
    console.log('syncConversation', lastTimeSync);
    let params = {
      apartmentId: User.currentApartmentId,
    };
    if (lastTimeSync && lastTimeSync != '') {
      params['lastTimeSync'] = lastTimeSync;
    }
    HttpClientHelper.get('conversation', params, (err, res) => {
      if (!err) {
        console.log(res);
        let _lastTimeSync = '' + res.lastUpdate;
        StorageHelper.set('lastTimeSync_message_conversation', _lastTimeSync);
        let data = res.data;
        RealmHelper.write(() => {
          for (let i in data) {
            let item = data[i];
            let conversation = {
              conversationId: item.conversationId,
              apartmentId: User.currentApartmentId,
              conversationType: item.conversationType,
              conversationStart: item.conversationStart,
              conversationStatus: item.conversationStatus,
              conversationContent: item.conversationContent,
              isRead: 0
            };
            RealmHelper.getInstance().create('Conversation', conversation, true);
            let listConversationDetail = item.listConversationDetail;
            for (let j in listConversationDetail) {
              let conversationDetail = listConversationDetail[j];
              conversationDetail.conversationId = item.conversationId;
              console.log('conversationDetail.conversationDetailId', conversationDetail.conversationDetailId);
              if (!conversationDetail.conversationDetailRead || conversationDetail.conversationDetailRead === null || conversationDetail.conversationDetailRead === '' || conversationDetail.conversationDetailRead == 0)
                conversationDetail.conversationDetailRead = 0;
              else
                conversationDetail.conversationDetailRead = 1;
              RealmHelper.getInstance().create('ConversationDetail', conversationDetail, true);
            }
          }
        });
      }
    });
  }

  async syncMessage (_type) {
    let lastTimeSync = await StorageHelper.get('lastTimeSync_message_' + _type + '_' + User.username, '');
    console.log('syncMessage', lastTimeSync);
    let params = {
      apartmentId: User.currentApartmentId,
    };
    if (lastTimeSync && lastTimeSync != '') {
      params['lastTimeSync'] = lastTimeSync;
    }
    HttpClientHelper.get(_type, params, (err, res) => {
      if (!err) {
        console.log(res);
        let _lastTimeSync = '' + res.lastUpdate;
        StorageHelper.set('lastTimeSync_message_' + _type, _lastTimeSync);
        let data = res.data;
        let collection = 'GeneralMessage';
        if (_type !== 'general_notice') {
          collection = 'IndividualMessage';
        }
        RealmHelper.write(() => {
          for (let i in data) {
            let item = data[i];
            item.apartmentId = User.currentApartmentId;
            RealmHelper.getInstance().create(collection, item, true);
          }
        });
      }
    });
  }
}

export default new SyncManager();