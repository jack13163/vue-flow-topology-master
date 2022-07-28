import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Process from '../views/Process.vue'
import Demo4Graph from '../components/relation-graph/demo/Demo4Graph.vue'
import Demo4LayoutTree from '../components/relation-graph/demo/Demo4LayoutTree.vue'
import Demo4LayoutTree2 from '../components/relation-graph/demo/Demo4LayoutTree2.vue'
import Demo4LayoutForce from '../components/relation-graph/demo/Demo4LayoutForce.vue'
import Demo4LayoutCenter from '../components/relation-graph/demo/Demo4LayoutCenter.vue'

import Demo4AdvDataFilter from '../components/relation-graph/demo/Demo4AdvDataFilter.vue'
import Demo4AdvDynamicData from '../components/relation-graph/demo/Demo4AdvDynamicData.vue'
import Demo4AdvMultiLayout from '../components/relation-graph/demo/Demo4AdvMultiLayout.vue'
import Demo4AdvNodeTips from '../components/relation-graph/demo/Demo4AdvNodeTips.vue'
import Demo4AdvSlot from '../components/relation-graph/demo/Demo4AdvSlot.vue'
import Demo4Arrow from '../components/relation-graph/demo/Demo4Arrow.vue'
import Demo4BothwayTree from '../components/relation-graph/demo/Demo4BothwayTree.vue'
import Demo4CenterDistanceCoefficient from '../components/relation-graph/demo/Demo4CenterDistanceCoefficient.vue'
import Demo4Expand from '../components/relation-graph/demo/Demo4Expand.vue'
import Demo4ExpandGradually from '../components/relation-graph/demo/Demo4ExpandGradually.vue'
import Demo4GraphResize from '../components/relation-graph/demo/Demo4GraphResize.vue'
import Demo4Hide2Show from '../components/relation-graph/demo/Demo4Hide2Show.vue'
import Demo4SceneCompany from '../components/relation-graph/demo/Demo4SceneCompany.vue'
import Demo4SceneGroup from '../components/relation-graph/demo/Demo4SceneGroup.vue'
import Demo4SceneNetwork from '../components/relation-graph/demo/Demo4SceneNetwork.vue'
import Demo4SceneOrg from '../components/relation-graph/demo/Demo4SceneOrg.vue'
import Demo4SceneRelationship from '../components/relation-graph/demo/Demo4SceneRelationship.vue'

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
  },
  {
    path: '/demo/adv/data/filter',
    name: 'Demo4AdvDataFilter',
    component: Demo4AdvDataFilter
  },
  {
    path: '/demo/adv/dynamic/data',
    name: 'Demo4AdvDynamicData',
    component: Demo4AdvDynamicData
  },
  {
    path: '/demo/adv/multi/layout',
    name: 'Demo4AdvMultiLayout',
    component: Demo4AdvMultiLayout
  },
  {
    path: '/demo/adv/nodetips',
    name: 'Demo4AdvNodeTips',
    component: Demo4AdvNodeTips
  },
  {
    path: '/demo/adv/slot',
    name: 'Demo4AdvSlot',
    component: Demo4AdvSlot
  },
  {
    path: '/demo/arrow',
    name: 'Demo4Arrow',
    component: Demo4Arrow
  },
  {
    path: '/demo/bothway/tree',
    name: 'Demo4BothwayTree',
    component: Demo4BothwayTree
  },
  {
    path: '/demo/center/distance',
    name: 'Demo4CenterDistanceCoefficient',
    component: Demo4CenterDistanceCoefficient
  },
  {
    path: '/demo/expand',
    name: 'Demo4Expand',
    component: Demo4Expand
  },
  {
    path: '/demo/expand/gradually',
    name: 'Demo4ExpandGradually',
    component: Demo4ExpandGradually
  },
  {
    path: '/demo/graph/resize',
    name: 'Demo4GraphResize',
    component: Demo4GraphResize
  },
  {
    path: '/demo/hide/show',
    name: 'Demo4Hide2Show',
    component: Demo4Hide2Show
  },
  {
    path: '/demo/scene/company',
    name: 'Demo4SceneCompany',
    component: Demo4SceneCompany
  },
  {
    path: '/demo/scene/group',
    name: 'Demo4SceneGroup',
    component: Demo4SceneGroup
  },
  {
    path: '/demo/scene/network',
    name: 'Demo4SceneNetwork',
    component: Demo4SceneNetwork
  },
  {
    path: '/demo/scene/org',
    name: 'Demo4SceneOrg',
    component: Demo4SceneOrg
  },
  {
    path: '/demo/scene/relationship',
    name: 'Demo4SceneRelationship',
    component: Demo4SceneRelationship
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
