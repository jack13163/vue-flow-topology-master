import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Process from '../views/Process.vue'
import Demo4Graph from '../components/relation-graph/demo/Demo4Graph.vue'
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
  {
    path: '/graph',
    name: 'Demo4Graph',
    component: Demo4Graph
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
  },
  {
    path: '/demo/layout-tree',
    name: 'Demo4LayoutTree',
    component: Demo4LayoutTree
  },
  {
    path: '/demo/layout-tree2',
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
