import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_HOME, ROUTE_TV_OUTPUT } from './constants'

import Home from './pages/Home.vue'
import TvOutput from './pages/TvOutput.vue'

const routes = [
  { path: ROUTE_HOME, component: Home, props: true },
  { path: ROUTE_TV_OUTPUT, component: TvOutput, props: true },
  {
    path: '/generator',
    beforeEnter() { location.href = '/fip/generator/index.html' }
  }
]


export default createRouter({
  history: createWebHistory('/fip/'),
  routes,
});
