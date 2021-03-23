import { LOCALSTORAGE } from '@/utils/constants';

import i18n from './i18n';

export default ({
  // Utils

  rememberLanguage: (language) => {
    i18n.i18next.changeLanguage(language);
  },
});
