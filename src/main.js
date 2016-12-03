import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import Heatmap from './heatmap/Heatmap.vue'
import Player from './Player.vue'
import About from './About.vue'
import Home from './Home.vue'

import Icon from 'vue-awesome/components/Icon.vue'

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/', component: App,
      children: [
        { path: '', component: Home },
        { path: 'heatmap', redirect: { name: 'heatmap', params: { subset: '0', target: '0', metric: '0' } } },
        { path: 'heatmap/:subset/:target/:metric', name: 'heatmap', component: Heatmap },
        { path: 'player/:trackid/', redirect: { name: 'player', params: { method: 'Reference' } } },
        { path: 'player/:trackid/:method', name: 'player', component: Player },
        { path: 'about', component: About },
      ]
    },
  ]
})


const app = new Vue({
  router
}).$mount('#app')
