import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import CurrencyChart from './components/CurrencyChart.vue'

const routes = [
  { path: '/currencies', component: CurrencyChart },
  // { path: '/bar', component: Bar }
]

const router = new VueRouter({
  routes,
})

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
