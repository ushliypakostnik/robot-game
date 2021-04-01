import Vue from 'vue';
import Vuex from 'vuex';

import preloader from './modules/preloader';
import layout from './modules/layout';
import hero from './modules/hero';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    preloader,
    layout,
    hero,
  },
  strict: debug,
});
