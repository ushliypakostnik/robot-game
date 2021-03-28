import { LOCALSTORAGE } from '@/utils/constants';

import i18n from './i18n'; // eslint-disable-line import/no-cycle

export default ({
  rememberLanguage: (language) => {
    i18n.i18next.changeLanguage(language);
  },

  rememberLevel: (level) => {
    localStorage.setItem(LOCALSTORAGE.LEVEL, level);
  },
});
