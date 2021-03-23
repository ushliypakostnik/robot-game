import Vue from 'vue';

import App from '@/App.vue';
import store from '@/store';
import '@/registerServiceWorker';

import i18n from '@/utils/i18n';

Vue.config.productionTip = false;

Vue.prototype.$eventHub = new Vue();

// Vue.config.devtools = true;

/* eslint-disable no-new */
new Vue({
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
