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
        <json-viewer :expand-depth="1" copyable boxed :value="jsonData"></json-viewer>
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
      jsonData: "暂无内容",
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
        this.jsonData = this.$store.state.flowData;
        this.isJsonView = true;
      }
    },
  },
  created() {
    this.$store.commit("setJspInit", jsp.jsPlumb.getInstance({ Container: "zll-index" }));
  },
  mounted() {
    this.jsonData = this.$store.state.flowData;
    this.resetViewSize()
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
        this.setJsonData(this.jsonData)
        this.toggleAutoLayout()
      }
    },
    handleCloseJsonView() {
      //  this.jsonData = this.$store.state.flowData;
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
    setJsonData(jsonData) {
      this.viewSizeIsInited = true
      this.nodeViewList = []
      this.lineViewList = []
      this.graphData.nodes = []
      this.graphData.lines = []
      this.graphData.nodes_map = {}
      this.graphData.lines_map = {}
      this.graphData.rootNode = null
      console.log('set jsonData::', jsonData)
      if (this.graphSetting.layouts && this.graphSetting.layouts.length > 0) {
        var _defaultLayoutSetting = this.graphSetting.layouts[0]
        this.graphSetting.layouter = SeeksRGLayouters.createLayout(_defaultLayoutSetting, this.graphSetting)
      } else {
        console.log('你需要设置layouts来指定当前图谱可以使用的布局器！')
      }
      this.loadGraphJsonData(jsonData)
      console.log('graphData:', this.graphData)
      this.graphData.rootNode = this.graphData.nodes[0]
      this.applyNewDataToCanvas()
      if (this.graphSetting.layouter && this.graphData.rootNode) {
        console.log('需要布局的节点数量：', this.graphData.nodes.length)
        this.graphSetting.layouter.placeNodes(this.graphData.nodes, this.graphData.rootNode, this.graphSetting)
      }
    },
    resetViewSize() {
      this.$nextTick(() => {
        this.graphSetting.viewSize.width = this.$refs.flowContent.$el.clientWidth
        this.graphSetting.viewSize.height = this.$refs.flowContent.$el.clientHeight
        this.graphSetting.canvasZoom = 100
      })
    },
    applyNewDataToCanvas() {
      this.graphData.nodes.forEach(thisNode => {
        if (thisNode.appended === false) {
          thisNode.appended = true
          this.nodeViewList.push(thisNode)
        }
      })
      this.graphData.nodes = this.nodeViewList
      this.jsonData.nodes = this.nodeViewList
      this.$store.state.flowData = this.nodeViewList
    },
    loadNodes(_nodes) {
      _nodes.forEach(thisNodeJson => {
        let thisNode = SeeksRGUtils.json2Node(thisNodeJson)
        let __isNew = false
        if (this.graphData.nodes_map[thisNode.id]) {
          thisNode = this.graphData.nodes_map[thisNode.id]
        } else {
          __isNew = true
        }
        if (__isNew) {
          this.graphData.nodes_map[thisNode.id] = thisNode
          this.graphData.nodes.push(thisNode)
          thisNode.seeks_id = this.seeksNodeIdIndex++
          thisNode.appended = false
        }
      })
    },
    loadGraphJsonData(jsonData) {
      // 兼容以前的配置
      var _nodes = []
      var _links = []
      this.flatNodeData(jsonData.nodes, null, _nodes, _links)
      this.loadNodes(_nodes)
      console.log('节点预处理完毕')
    },
    flatNodeData(orign_nodes, parentNode, nodes_collect, links_collect) {
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
          var _childs = thisOrignNode.childs || thisOrignNode.children
          if (_childs && _childs.length > 0) {
            this.flatNodeData(_childs, thisOrignNode, nodes_collect, links_collect)
          }
        }
      })
    },
    toggleAutoLayout() {
      this.graphSetting.autoLayouting = !this.graphSetting.autoLayouting
      if (this.graphSetting.autoLayouting) {
        if (!this.graphSetting.layouter.autoLayout) {
          console.log('当前布局不支持自动布局！')
        } else {
          console.log('自动布局功能入口...')
          this.graphSetting.layouter.autoLayout(true)
        }
      } else {
        if (!this.graphSetting.layouter.stop) {
          console.log('当前布局不支持自动布局stop！')
        } else {
          this.graphSetting.layouter.stop()
        }
      }
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
