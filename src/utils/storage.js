import { LOCALSTORAGE } from '@/utils/constants';

import i18n from './i18n'; // eslint-disable-line import/no-cycle

export default ({
  rememberLanguage: (language) => {
    i18n.i18next.changeLanguage(language);
  },

  rememberLevel: (level, levelFrom) => {
    localStorage.setItem(LOCALSTORAGE.LEVEL, level);
    if (levelFrom) localStorage.setItem(LOCALSTORAGE.LEVELFROM, levelFrom);
  },

  rememberDirection: (x, y, z) => {
    localStorage.setItem(LOCALSTORAGE.DIRECTIONX, x);
    localStorage.setItem(LOCALSTORAGE.DIRECTIONY, y);
    localStorage.setItem(LOCALSTORAGE.DIRECTIONZ, z);
  },
});
