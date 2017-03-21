// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

/*import and use lodash*/
import lodash from 'lodash'
Vue.use(lodash);

/*import third party filter for vue2.x*/
import filter from 'vue-filter'
Vue.use(filter);

/*import and use element-ui*/
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI);

Vue.config.productionTip = false;

/*import momentjs*/
import moment from 'moment';
Vue.prototype.moment = moment;

/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
