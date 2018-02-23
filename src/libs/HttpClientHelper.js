import { Platform } from 'react-native';
import SessionManager from './SessionManager';

import base64 from 'base-64';
import utf8 from 'utf8';
import md5 from 'js-md5';
import StorageHelper from './StorageHelper';
import RealmHelper from './RealmHelper';

const BASE_URL = 'http://innorm.easylink.vn/hapulico-api/mobile';
const IMAGE_URL = 'http://innorm.easylink.vn/hapulico-api';
//const BASE_URL = 'http://113.171.23.144/hapulico-api/mobile';
//const IMAGE_URL = 'http://113.171.23.144/hapulico-api';
// const BASE_URL = 'https://50de02ba.ngrok.io/mobile';
// const IMAGE_URL = 'https://50de02ba.ngrok.io';

const API_URL = {
  login: BASE_URL + '/authen/login',
  logout: BASE_URL + '/authen/logout',
  general_notice: BASE_URL + '/aparment-msg/general',
  private_notice: BASE_URL + '/aparment-msg/individual',
  get_apartments: BASE_URL + '/apartment/findByResidentId/{residentId}',
  regulation: BASE_URL + '/regulation/',
  conversation: BASE_URL + '/conversation/',
  registration: BASE_URL + '/registration-service/',
  upload_service: BASE_URL + '/registration-service/upload',
  upload: BASE_URL + '/upload/',
  invoice: BASE_URL + '/invoice/',
  balance: BASE_URL + '/invoice/apartment/{apartmentId}/account-balance/',
  payment: BASE_URL + '/payment/',
  resident: BASE_URL + '/resident/',
  changePassword: BASE_URL + '/authen/change-password',
  family: BASE_URL + '/resident/family/{apartmentId}',
  loadById: BASE_URL + '/aparment-msg/loadById',
  updateMsgStatus: BASE_URL + '/aparment-msg/updateMsgStatus',
};

class HttpClientHelper {

  static mHeaders = {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  };
  static authorization = null;

  static async sendRequest (type, params, method, headers, callback, cached = 0) {
    let response = null;
    if (!(type in API_URL)) {
      if (callback != undefined)
        callback('No API for type: ' + type, null);
      return {error: 'No API for type: ' + type};
    }
    let url = '';
    let key_for_cache = md5(md5(type) + md5(JSON.stringify(params)));
    console.log('key_for_cache', key_for_cache);
    try {
      url = API_URL[type];
      if (headers == null || headers == undefined) headers = {};
      for (let i in HttpClientHelper.mHeaders) {
        headers[i] = HttpClientHelper.mHeaders[i];
      }

      if (params != null && params.url_params != undefined) {
        let url_params = params.url_params;
        for (let i in url_params) {
          url = url.replace('{' + i + '}', url_params[i]);
        }
        delete params.url_params;
      }

      try {
        if (HttpClientHelper.authorization == null || HttpClientHelper.authorization == '') {
          let token = await SessionManager.getToken();
          if (token && token != '')
            HttpClientHelper.authorization = token;
        }
        if (HttpClientHelper.authorization)
          headers['JSESSIONID'] = HttpClientHelper.authorization;
      } catch (e) {
        console.log(e);
      }

      // opts
      let opts = {
        method: method,
        headers: headers
      };

      try {
        console.log('--->', url);
        console.log('params', JSON.stringify(params));
      } catch (e) {
      }

      // Method GET
      if (method == 'GET') {
        if (params != null && Object.keys(params).length) url += '?' + Object.keys(params).map((k) => k + '=' + encodeURIComponent(params[k])).join('&');
      } else { // Method POST
        let formData = new FormData();
        if (headers != null && headers['Content-Type'] == 'application/json') {
          if (params)
            opts.body = JSON.stringify(params);
        } else {
          for (let i in params) {
            formData.append(i, params[i]);
          }
          opts.body = formData;
        }
      }
      console.log(opts);
      console.log(url);
      response = await fetch(url, opts);
      try {
        console.log('<---', url);
        console.log('status', response.status);
      } catch (e) {
      }
      if (type == 'conversation') {
        // console.log(response);
      }
      let responseJson = null;

      if (cached == 1 && (!response || response.status == 0)) {
        let cache_data;
        let caches = RealmHelper.getInstance().objects('Cached').filtered('id="' + key_for_cache + '"');
        for (let i in caches) {
          cache_data = caches[i]['data'];
          break;
        }
        console.log('cache_data1', cache_data);
        if (cache_data && cache_data != '') {
          let responseJson = JSON.parse(cache_data);
          if (callback != undefined) {
            callback(null, responseJson);
          }
          return responseJson;
        } else {
          console.log('HttpError', url);
          console.log('HttpError', params);
          if (callback != undefined) {
            callback({error: 'Cannot get data'}, null);
          }
          return {error: 'Cannot get data'};
        }
      } else if (response.status >= 200 && response.status <= 299) {
        try {
          responseJson = await response.json();
          if (cached == 1) {
            console.log('key_for_cached', 1);
            RealmHelper.write(() => {
              RealmHelper.getInstance().create('Cached', {id: key_for_cache, data: JSON.stringify(responseJson)});
            });
          }
        } catch (e) {
          console.log(e);
        }
        if (callback != undefined) {
          callback(null, responseJson);
        }
      } else {
        console.warn(response.status);
        if (callback != undefined) {
          try {
            let responseJson = await response.json();
            responseJson.status = response.status;
            callback(responseJson, null);
          } catch (e) {
            console.log(e);
          }
        }
        console.warn('HttpError', response);
      }
      return responseJson;
    } catch (e) {
      if (response) {
        e.status = response.status;
      }

      if (cached == 1 && (!response || response.status == 0)) {
        let cache_data;
        let caches = RealmHelper.getInstance().objects('Cached').filtered('id="' + key_for_cache + '"');
        for (let i in caches) {
          cache_data = caches[i]['data'];
          break;
        }
        console.log('cache_data2', cache_data);
        if (cache_data && cache_data != '') {
          let responseJson = JSON.parse(cache_data);
          if (callback != undefined) {
            callback(null, responseJson);
          }
          return responseJson;
        } else {
          console.log('HttpError', url);
          console.log('HttpError', params);
          if (callback != undefined) {
            callback({error: 'Cannot get data'}, null);
          }
          return {error: 'Cannot get data'};
        }
      }
      console.warn('HttpError', e);
      console.log('HttpError', url);
      console.log('HttpError', params);
      if (callback != undefined) {
        callback(e, null);
      }
      return {error: e};
    }
  }

  static async post (type, params, callback, cached = 0) {
    let headers = null;
    if (params != null && params.headers != undefined) {
      headers = params.headers;
      delete params.headers;
    }
    return await HttpClientHelper.sendRequest(type, params, 'POST', headers, callback, cached);
  }

  static async get (type, params, callback, cached = 0) {
    let headers = null;
    if (params != null && params.headers != undefined) {
      headers = params.headers;
      delete params.headers;
    }
    return await HttpClientHelper.sendRequest(type, params, 'GET', headers, callback, cached);
  }

  static async put (type, params, callback, cached = 0) {
    let headers = null;
    if (params != null && params.headers != undefined) {
      headers = params.headers;
      delete params.headers;
    }
    return await HttpClientHelper.sendRequest(type, params, 'PUT', headers, callback, cached);
  }

  static async delete (type, params, callback, cached = 0) {
    let headers = null;
    if (params != null && params.headers != undefined) {
      headers = params.headers;
      delete params.headers;
    }
    return await HttpClientHelper.sendRequest(type, params, 'DELETE', headers, callback, cached);
  }

  static async login (params, callback, cached = 0) {
    const {email, password} = params;
    return await HttpClientHelper.sendRequest('login', null, 'POST', null, callback, cached);
  }

  static genBasicAuth (user, password) {
    try {
      var utf8str = user + ':' + password;
      return base64.encode(utf8str);
    } catch (e) {
      console.log(e);
    }
    return null;
  }
}

HttpClientHelper.BASE_URL = BASE_URL;
HttpClientHelper.API_URL = API_URL;
HttpClientHelper.IMAGE_URL = IMAGE_URL;

export default HttpClientHelper;
