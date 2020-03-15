import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueGoogleCharts from 'vue-google-charts'

import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
 
Vue.use(VueAxios, axios, VueGoogleCharts)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
