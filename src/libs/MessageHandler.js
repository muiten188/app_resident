class MessageHandler {

  constructor () {
    this.mCallback = {};
    this.lastId = 0;
  }

  notify (type, data = null) {
    let callbacks = this.mCallback[type];
    if (!callbacks) callbacks = {};
    for (let i in callbacks) {
      let callback = callbacks[i];
      callback.call(this, data);
    }
  }

  notifyOne (type, callbackId, data = null) {
    let callbacks = this.mCallback[type];
    if (!callbacks) callbacks = {};
    for (let i in callbacks) {
      let callback = callbacks[i];
      if (callbackId === callback.callbackId)
        callback.call(this, data);
    }
  }

  register (type, callback) {
    if (callback.callbackId == null || callback.callbackId == undefined) {
      callback.callbackId = 'callback_' + this.lastId;
      this.lastId++;
    }
    let callbacks = this.mCallback[type];
    if (!callbacks) callbacks = {};
    callbacks[callback.callbackId] = callback;
    this.mCallback[type] = callbacks;
  }

  remove (type, callback) {
    let callbacks = this.mCallback[type];
    if (!callbacks) callbacks = {};
    try {
      delete this.callbacks[callback.callbackId];
      this.mCallback[type] = callbacks;
    } catch (e) {}
  }
}

export default new MessageHandler();