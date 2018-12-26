// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import Promise from 'promise-polyfill'
if (!window.Promise) {
  window.Promise = Promise;
}
import App from './App'
import router from './router/index'
// import Marked from "marked"; 
// import VueMoment from 'vue-moment'
import {request} from "../utils.js"
Vue.config.productionTip = false

Vue.use({
  install(Vue, options) {
    // Vue.prototype.$marked = Marked;
    Vue.prototype.$request = request;
  }
})

import '../../static/reset.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/agate.css' //样式文件

Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
    hljs.highlightBlock(block)
  })
})

import store from './store.js';


router.afterEach((to,from,next) => {
  if (app && app.scrollTo) {
      app.scrollTo(0, 0);
  }
})


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
