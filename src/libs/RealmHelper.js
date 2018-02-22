import Realm from 'realm';
import md5 from 'js-md5';

const CachedSchema = {
  name: 'Cached',
  primaryKey: 'id',
  properties: {
    id: {type: 'string'},
    data: {type: 'string'},
  }
};

const GeneralMessageSchema = {
  name: 'GeneralMessage',
  primaryKey: 'apartMessageId',
  properties: {
    apartMessageId: {type: 'int', default: 0},
    apartmentId: {type: 'int', default: 0},
    title: {type: 'string'},
    content: {type: 'string'},
    issueDate: {type: 'int', default: 0},
    isRead: {type: 'int', default: 0},
  }
};

const IndividualMessageSchema = {
  name: 'IndividualMessage',
  primaryKey: 'apartMessageId',
  properties: {
    apartMessageId: {type: 'int', default: 0},
    apartmentId: {type: 'int', default: 0},
    title: {type: 'string'},
    content: {type: 'string'},
    issueDate: {type: 'int', default: 0},
    isRead: {type: 'int', default: 0},
  }
};

const ConversationSchema = {
  name: 'Conversation',
  primaryKey: 'conversationId',
  properties: {
    conversationId: {type: 'int', default: 0},
    apartmentId: {type: 'int', default: 0},
    conversationType: {type: 'string'},
    conversationStart: {type: 'int', default: 0},
    conversationStatus: {type: 'string'},
    conversationContent: {type: 'string'},
    isRead: {type: 'int', default: 0},
    updateTime: {type: 'int', default: 0}
  }
};

const ConversationDetailSchema = {
  name: 'ConversationDetail',
  primaryKey: 'conversationDetailId',
  properties: {
    conversationId: {type: 'int', default: 0},
    conversationDetailId: {type: 'int', default: 0},
    conversationDetailSender: {type: 'int', default: 0},
    conversationDetailContent: {type: 'string'},
    conversationDetailSend: {type: 'int', default: 0},
    conversationDetailRead: {type: 'int', default: 0},
    conversationSentFrom: {type: 'string'},
  }
};

class RealmHelper {
  init (callback) {
    this.realm = new Realm({
      schema: [CachedSchema, GeneralMessageSchema, IndividualMessageSchema, ConversationSchema, ConversationDetailSchema],
      schemaVersion: 7
    });
    if (this.realm && callback) {
      callback();
    }
  }

  genId () {
    let randomNumber = Math.floor(Math.random() * 99999999999);
    let time = new Date().getTime();
    return md5(randomNumber + '_' + time);
  }

  getInstance () {
    return this.realm;
  }

  write (callback) {
    this.realm.write(callback);
  }
}

export default new RealmHelper();
