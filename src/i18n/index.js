import RnI18n from 'react-native-i18n';
import en from './locales/en';
import vi from './locales/vi';
import StorageHelper from '../libs/StorageHelper';

RnI18n.fallbacks = true;

RnI18n.translations = {
  vi,
  en
};

class I18n {

  static async init (locale = null) {
    if (locale) {
      RnI18n.locale = locale;
    } else {
      RnI18n.locale = await StorageHelper.get('current_language', 'vi');
    }
  }

  static t (text) {
    return RnI18n.t(text);
  }

  static t (text, locale) {
    return RnI18n.t(text, locale);
  }
}

export default I18n;