import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import VueRouter from 'vue-router'
Vue.use(VueRouter)

import CurrencyChart from './components/CurrencyChart.vue'
import CovidPage from './components/CovidPage.vue'

const routes = [
  { path: '/currencies', component: CurrencyChart },
  { path: '/covid', component: CovidPage }
]

const router = new VueRouter({
  routes,
  // mode: 'history',
})

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
