import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Process from '../views/Process.vue'
import RelationGraph from '../components/relation-graph/demo/Demo4Graph.vue'
import Demo4LayoutTree from '../components/relation-graph/demo/Demo4LayoutTree.vue'
import Demo4LayoutTree2 from '../components/relation-graph/demo/Demo4LayoutTree2.vue'
import Demo4LayoutForce from '../components/relation-graph/demo/Demo4LayoutForce.vue'
import Demo4LayoutCenter from '../components/relation-graph/demo/Demo4LayoutCenter.vue'

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
  },
  {
    path: '/graph/center',
    name: 'RelationGraph',
    component: RelationGraph
  },
  {
    path: '/graph/force',
    name: 'Demo4LayoutForce',
    component: Demo4LayoutForce
  },
  {
    path: '/graph/center',
    name: 'Demo4LayoutCenter',
    component: Demo4LayoutCenter
  },
  {
    path: '/graph/tree',
    name: 'Demo4LayoutTree',
    component: Demo4LayoutTree
  },
  {
    path: '/graph/tree2',
    name: 'Demo4LayoutTree2',
    component: Demo4LayoutTree2
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
