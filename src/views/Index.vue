<template>
  <div
    class="index"
    id="zll-index"
    @mousemove.prevent="handleMousemove"
    @mouseup.prevent="handleMouseup"
  >
    <div class="flow-menu">
      <header>
        <h1>Vue Flow Topology</h1>
      </header>
      <div class="section">
        <FlowMenu @on-is-add-node="onIsAddNode" />
      </div>
    </div>
    <div class="middle">
      <header>
        <HeaderOperate ref="operate" />
      </header>
      <div class="section">
        <FlowContent ref="flowContent" @on-select-type="onSelectType" />
      </div>
    </div>
    <div class="flow-attr">
      <header>
        <header-attr />
      </header>
      <flow-attr />
    </div>
    <div class="modal-warp">
      <Modal
        v-model="isJsonView"
        footer-hide
        title="FlowData数据"
        width="600"
        :transfer="false"
        @on-cancel="handleCloseJsonView"
      >
        <json-viewer :expand-depth="1" copyable boxed :value="this.graphData"></json-viewer>
      </Modal>
    </div>
  </div>
</template>

<script>
import jsp from "jsplumb";
import HeaderOperate from "@/components/modules/HeaderOperate";
import HeaderAttr from "@/components/modules/HeaderAttr";
import FlowMenu from "@/components/FlowMenu";
import FlowAttr from "@/components/FlowAttr";
import FlowContent from "@/components/FlowContent";
import SeeksRGLayouters from "@/components/relation-graph/core4vue/SeeksRGLayouters"
import SeeksRGUtils from '@/components/relation-graph/core4vue/SeeksRGUtils'

export default {
  name: "Index",
  components: {
    HeaderOperate,
    HeaderAttr,
    FlowMenu,
    FlowContent,
    FlowAttr,
  },
  data() {
    return {
      isMouseDownStop: false,
      isJsonView: false,
      seeksNodeIdIndex: 1,
      jspInstance: null,
      graphSetting: {
        defaultNodeBorderWidth: 0,
        allowSwitchLineShape: true,
        allowSwitchJunctionPoint: true,
        defaultLineShape: 1,
        'layouts': [
          {
            'label': '自动布局',
            'layoutName': 'force',
            'layoutClassName': 'seeks-layout-force'
          }
        ],
        defaultJunctionPoint: 'border',
        // 这里可以参考"Graph 图谱"中的参数进行设置
        viewSize: {},
        canvasZoom: 100
      },
      graphData: {
        nodes: [],
        lines: [],
        rootNode: null,
        nodes_map: {},
        lines_map: {}
      }
    };
  },
  computed: {
    flowMenuObj() {
      return this.$store.state.flowMenuObj;
    },
  },
  watch: {
    flowMenuObj(newVal, oldVal) {
      if (newVal.type === "view-code") {
        this.graphData = this.$store.state.flowData;
        this.isJsonView = true;
      }
    },
  },
  created() {
    this.jspInstance = jsp.jsPlumb.getInstance({ Container: "zll-index" });
    this.$store.commit("setJspInit", this.jspInstance);
  },
  mounted() {
    this.init()
  },
  methods: {
    onIsAddNode() {
      this.$refs.flowContent.onIsAddNode();
    },
    onSelectType(type) {
      if (type === "drag-drop") {
        this.$refs.operate.handleMiddleMenu(type);
      } else if (type === "auto-layout") {
        console.log("自动布局...")
        this.toggleAutoLayout()
      }
    },
    handleCloseJsonView() {
      //  this.graphData = this.$store.state.flowData;
    },
    handleMouseup(e) {
      this.isMouseDownStop = false;
    },
    handleMousemove(e) {
      if (this.isMouseDownStop) {
        this.flowAttrVerticalWidth =
          this.flowAttrVerticalWidthDown + this.mouseDownOffset - e.x;
        if (this.flowAttrVerticalWidth < 450) {
          this.flowAttrVerticalWidth = 450;
        }
        if (this.flowAttrVerticalWidth > 1200) {
          this.flowAttrVerticalWidth = 1200;
        }
      }
    },
    // 自动布局相关逻辑
    init() {
      this.$nextTick(() => {
        this.graphSetting.viewSize.width = this.$refs.flowContent.$el.getBoundingClientRect().width * 10
        this.graphSetting.viewSize.height = this.$refs.flowContent.$el.getBoundingClientRect().height * 10
        this.graphSetting.canvasZoom = 100
        Object.assign(this.graphData, this.$store.state.flowData)
        console.log('graphData:', this.graphData)
        this.viewSizeIsInited = true
        if (this.graphSetting.layouts && this.graphSetting.layouts.length > 0) {
          var _defaultLayoutSetting = this.graphSetting.layouts[0]
          _defaultLayoutSetting.callback = (nodes) => {
            // 回调，更新
            this.$store.commit('setFlowData', { method: 'update-all-nodes', nodes: nodes});
            this.$refs.flowContent.updateCanvas();
          }
          this.graphSetting.layouter = SeeksRGLayouters.createLayout(_defaultLayoutSetting, this.graphSetting)
        } else {
          console.log('你需要设置layouts来指定当前图谱可以使用的布局器！')
        }
        this.loadGraphJsonData(this.graphData)
        if (this.graphSetting.layouter) {
          // this.graphSetting.layouter.placeNodes(this.graphData.nodes)
        }
      })
    },
    loadGraphJsonData() {
      // 兼容以前的配置
      var _nodes = []
      var _links = []
      let _map = []
      this.graphData.nodes.forEach(node => {
        _map[node.id] = node
      })
      this.flatNodeData(this.graphData.nodes, null, _nodes, _links, _map)
      this.graphData.nodes = this.loadNodes(_nodes)
      // this.graphData.lines = this.loadLinks(_links)
      console.log('节点和连接信息预处理完毕')
    },
    loadNodes(_nodes) {
      let result = []
      _nodes.forEach(thisNodeJson => {
        // 添加节点额外信息
        let thisNode = SeeksRGUtils.json2Node(thisNodeJson)
        let __isNew = false
        if (this.graphData.nodes_map[thisNode.id]) {
          thisNode = this.graphData.nodes_map[thisNode.id]
        } else {
          __isNew = true
        }
        if (__isNew) {
          thisNode.seeks_id = this.seeksNodeIdIndex++
          thisNode.appended = false
          this.graphData.nodes_map[thisNode.id] = thisNode
          result.push(thisNode)
        }
      })
      // 更新子节点信息
      result.forEach(node => {
        if (node.targetNodes && node.targetNodes.length > 0) {
          let childs = []
          node.targetNodes.forEach(child => {
            childs.push(this.graphData.nodes_map[child.id])
          })
          node.targetNodes = childs
        }
      })
      return result
    },
    flatNodeData(orign_nodes, parentNode, nodes_collect, links_collect, _map) {
      orign_nodes.forEach(thisOrignNode => {
        if (!thisOrignNode.flated) {
          thisOrignNode.flated = true
          nodes_collect.push(thisOrignNode)
          if (parentNode) {
            links_collect.push({
              from: parentNode.id,
              to: thisOrignNode.id,
            })
          }
          // 根据输入的数据进行预处理
          var _childs = thisOrignNode.childs || thisOrignNode.children
          if (!_childs) {
            _childs = []
            this.graphData.links.forEach(link => {
              if (link.sourceId === thisOrignNode.id) {
                let targetNode = _map[link.targetId]
                _childs.push(targetNode)
              }
            })
          }
          if (_childs && _childs.length > 0) {
            thisOrignNode.targetNodes = _childs
            this.flatNodeData(_childs, thisOrignNode, nodes_collect, links_collect, _map)
          } else {
            thisOrignNode.targetNodes = []
          }
        }
      })
    },
    toggleAutoLayout() {
      this.graphSetting.layouter.placeNodes(this.graphData.nodes)
      // this.graphSetting.autoLayouting = !this.graphSetting.autoLayouting
      // if (this.graphSetting.autoLayouting) {
      //   if (!this.graphSetting.layouter.autoLayout) {
      //     console.log('当前布局不支持自动布局！')
      //   } else {
      //     console.log('自动布局功能入口...')
      //     this.graphSetting.layouter.autoLayout(true)
      //   }
      // } else {
      //   if (!this.graphSetting.layouter.stop) {
      //     console.log('当前布局不支持自动布局stop！')
      //   } else {
      //     this.graphSetting.layouter.stop()
      //   }
      // }
    }
  },
};
</script>

<style lang="scss" scoped>
.index {
  display: flex;
  h1 {
    font-size: 18px;
  }
  > div {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .section {
    flex: 1;
  }
  header {
    height: 38px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    border-bottom: 1px solid #eee;
  }
  .flow-menu {
    width: 280px;
  }
  .middle {
    flex: 1;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }
  .flow-attr {
    width: 280px;
  }
  /deep/ .ivu-modal {
    margin-bottom: 50px;
    .jv-container.boxed:hover {
      box-shadow: none;
      border: 1px solid #eee;
      border-radius: 6px;
    }
  }
}
</style>
