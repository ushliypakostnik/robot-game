import Vue from 'vue';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import VueI18Next from '@panter/vue-i18next';

import {
  LANGUAGES,
  LOCALES,
  AUTO_LANG,
} from '@/utils/constants';
import store from '../store'; // eslint-disable-line import/no-cycle

const detectorOptions = {
  order: ['navigator'],
  lookupLocalStorage: 'language',
};

Vue.use(VueI18Next);

i18next
  .use(LanguageDetector)
  .init({
    fallbackLng: [LANGUAGES[0].name, LANGUAGES[1].name],
    detection: detectorOptions,
    resources: {
      [LANGUAGES[0].name]: { translation: LOCALES[LANGUAGES[0].name] },
      [LANGUAGES[1].name]: { translation: LOCALES[LANGUAGES[1].name] },
    },
  }).then(() => {
    const { language } = i18next;
    const l = language.substr(0, 2);

    if (!AUTO_LANG) {
      if ([LANGUAGES[0].name, LANGUAGES[1].name].includes(l)) {
        store.dispatch('layout/changeLanguage', l);
      } else {
        store.dispatch('layout/changeLanguage', LANGUAGES[0].name);
      }
    } else {
      store.dispatch('layout/changeLanguage', AUTO_LANG);
    }
  });

const i18n = new VueI18Next(i18next);

export default i18n;
