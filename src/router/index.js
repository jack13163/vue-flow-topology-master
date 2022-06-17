import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Process from '../views/Process.vue'
import RelationGraph from '../components/relation-graph/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/process',
    name: 'Process',
    component: Process
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
  {
    path: '/graph',
    name: 'RelationGraph',
    component: RelationGraph
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
