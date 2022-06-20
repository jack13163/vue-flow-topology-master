import { deepClone } from "@/utils";
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
let storeData = {
  state: {
    jspInit: null,
    flowMenuObj: {
      type: 'drag-drop',
      connector: 'Bezier'
    },
    flowData: {
      "offsetX": -2993,
      "offsetY": -2991,
      "nodes": [
        {
          "name": "起始节点",
          "type": "start-node",
          "id": "05f37229-0dba-0159",
          "x": 3211,
          "y": 3051
        },
        {
          "name": "终止节点",
          "type": "end-node",
          "id": "ac4d923e-bbe4-185d",
          "x": 3250,
          "y": 3347
        },
        {
          "name": "输入",
          "type": "in-node",
          "id": "be6c9ba8-9af5-0f8a",
          "x": 3241,
          "y": 3259
        },
        {
          "name": "输出",
          "type": "out-node",
          "id": "184da231-be5a-11fe",
          "x": 3144,
          "y": 3243
        }
      ],
      "links": [
        {
          "id": "5d1fb8a2-4800-fbce",
          "connector": "Bezier",
          "sourceId": "05f37229-0dba-0159",
          "targetId": "be6c9ba8-9af5-0f8a",
          "type": null
        },
        {
          "id": "db5cf093-ca83-e978",
          "connector": "Bezier",
          "sourceId": "be6c9ba8-9af5-0f8a",
          "targetId": "184da231-be5a-11fe",
          "type": null
        },
        {
          "id": "33584429-9419-b3be",
          "connector": "Bezier",
          "sourceId": "184da231-be5a-11fe",
          "targetId": "ac4d923e-bbe4-185d",
          "type": null
        }
      ]
    },
    // 添加新节点
    newNode: {
      state: false,
      node: {}
    },
    //选中的节点、连线数据
    selectContent: {
      type: "",
      data: {}
    },
    //步骤缓存
    flowStepData: [],
    stepIndex: 0,
  },
  mutations: {
    setSelectContent(state, data) {
      state.selectContent = {
        type: data.type ? data.type : '',
        data: data.data ? data.data : ''
      };
    },
    setJspInit(state, data) {
      state.jspInit = data;
    },
    setFlowData(state, dataObj) {
      let data = deepClone(dataObj)
      if (data.method) {
        if (data.method === "add-node") {
          state.flowData.nodes.push(data.node);
          storeData.mutations.setFlowStepData(state, state.flowData);
        } else if (data.method === "delete-node") {
          let nodes = state.flowData.nodes.filter(node => data.node.id !== node.id)
          let links = state.flowData.links.filter(link => {
            if (link.sourceId === data.node.id || link.targetId === data.node.id) {
              return false
            }
            return true
          });
          state.flowData = { ...state.flowData, ...{ nodes, links } };
          storeData.mutations.setFlowStepData(state, state.flowData);
        } else if (data.method === "add-link") {
          state.flowData.links.push(data.link);
          storeData.mutations.setFlowStepData(state, state.flowData);
        } else if (data.method === "delete-link") {
          state.flowData.links = state.flowData.links.filter(item => {
            if (((item.sourceId === data.link.sourceId) && (item.targetId === data.link.targetId)) || ((item.sourceId === data.link.targetId) && (item.targetId === data.link.sourceId))) {
              return false
            }
            return true;
          })
          storeData.mutations.setFlowStepData(state, state.flowData);
        } else if (data.method === "all-update") {
          state.flowData = data.data
          state.flowStepData = [];
          state.stepIndex = 0;
          storeData.mutations.setFlowStepData(state, state.flowData);
        }
      } else {
        state.flowData = { ...state.flowData, ...data };
      }

      sessionStorage.setItem("flowData", JSON.stringify(state.flowData));
      console.log(state.flowData);
    },
    setFlowMenuObj(state, data) {
      state.flowMenuObj = {
        type: data.type,
        connector: data.connector
      };
    },
    setNewNode(state, data) {
      if (data.state) {
        state.newNode.state = data.state;
      } else {
        state.newNode.state = false
      }
      if (data.node) {
        state.newNode.node = data.node;
      }
    },
    // 缓存flow步骤
    setFlowStepData(state, data) {
      if (!data) {
        state.flowStepData = [];
        state.stepIndex = 0;
      } else {
        let newArr = deepClone(state.flowStepData.slice(0, state.stepIndex + 1))
        newArr.push(deepClone(data));
        state.flowStepData = newArr;
        state.stepIndex = newArr.length - 1
      }
    },
    setStepIndex(state, i) {
      state.stepIndex = i;
    },
  },
  actions: {
  },
  modules: {
  }
};

export default new Vuex.Store(storeData);
