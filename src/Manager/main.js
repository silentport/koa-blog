// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import Promise from 'promise-polyfill'
if (!window.Promise) {
  window.Promise = Promise;
}
import App from './App'
import router from './router' 
// import VueMoment from 'vue-moment'
import {request} from "../utils.js"
import 'iview/dist/styles/iview.css'
import {Message} from 'iview'
Vue.prototype.$Message = Message

import '../../static/reset.css'




Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use({
  install(Vue, options) {
    Vue.prototype.$request = request;
  }
})
// Vue.use(VueMoment)


// import store from './store.js';
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
