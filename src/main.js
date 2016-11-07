import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import Heatmap from './heatmap/Heatmap.vue'
import Player from './Player.vue'
import About from './About.vue'
import Home from './Home.vue'

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/', component: App,
      children: [
        { path: '', component: Home },
        { path: 'heatmap', redirect: { name: 'heatmap', params: { subset: 'test', target: 'vocals', metric: 'sdr' } } },
        { path: 'heatmap/:subset/:target/:metric', name: 'heatmap', component: Heatmap },
        { path: 'player/:id/', name: 'player', component: Player },
        { path: 'about', component: About },
      ]
    },
  ]
})


const app = new Vue({
  router
}).$mount('#app')