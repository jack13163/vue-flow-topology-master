<template>
    <!-- @click.stop="handleSelectNode(node)" -->
  <div
    class="node-warp"
    @contextmenu.prevent.stop="$emit('context-menu', $event)"
    @mousedown="handlerMousedown(node)"
    @click.stop="handlerMouseUp(node)"
  >
    <div v-if="node.type === 'start-node'" class="item-node menu-start-node">
      {{ node.name }}
    </div>
    <div v-else-if="node.type === 'end-node'" class="item-node menu-end-node">
      {{ node.name }}
    </div>
    <div v-else-if="node.type === 'in-node'" class="item-node menu-in-node">
      {{ node.name }}
    </div>
    <div v-else-if="node.type === 'out-node'" class="item-node menu-out-node">
      {{ node.name }}
    </div>
    <div v-else-if="node.type === 'cog-node'" class="item-node menu-cog-node">
      <div>
        <Icon :type="node.icon" />
        <span> {{ node.name }}</span>
      </div>
      <p>相关配置内容</p>
    </div>
    <div v-else-if="node.type === 'codepen-node'" class="item-node menu-codepen-node">
      <div>
        <Icon :type="node.icon" />
        <span> {{ node.name }}</span>
      </div>
      <p>相关配置内容</p>
    </div>
    <div v-else-if="node.type === 'pulse-node'" class="item-node menu-pulse-node">
      <div>
        <div>
          <Icon :type="node.icon" /> <span> {{ node.name }}</span>
        </div>
        <Icon type="md-power" />
      </div>
      <p>
        <span>执行状态：正在监听...</span>
        <span>96%</span>
      </p>
    </div>
    <div v-else>此节点无效</div>
  </div>
</template>
<script>
export default {
  name: "menu-node",
  props: ["node"],
  mounted() {
    let jspInit = this.$store.state.jspInit;
    this.$nextTick(() => {
      jspInit.draggable(this.node.id);
    });
  },
  methods: {
    handlerMouseUp(node) {
      let nodeEle = document.getElementById(node.id);
      let { top, left } = nodeEle.style;
      let x = left.slice(0, left.length - 2) * 1;
      let y = top.slice(0, top.length - 2) * 1;
      if (node.x !== x && node.y !== y) {
        let flowData = this.$store.state.flowData;
        flowData.nodes.forEach((item) => {
          if (item.id === node.id) {
            item.x = x;
            item.y = y;
          }
        });
        this.$store.commit("setFlowStepData", flowData);
      }
    },
    handlerMousedown(node) {
      if (this.$store.state.flowMenuObj.type === "drag-drop") {
        document.getElementsByClassName("item-node").forEach((ele) => {
          ele.classList.remove("active");
        });
        let nodeEle = document.getElementById(node.id);
        nodeEle.getElementsByClassName("item-node")[0].classList.add("active");
        this.$store.commit("setSelectContent", { type: "node", data: node });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.node-warp {
  position: absolute;
  user-select: none;
  > div {
    background: #abc7ff31;
    border: 1px solid #abc7ff;
  }
  .active {
    border: 1px dashed #409eff;
  }
  i {
    font-size: 16px;
  }
}
.menu-start-node {
  width: 100px;
  padding: 12px 18px;
  border-radius: 30px;
  text-align: center;
}
.menu-end-node {
  width: 100px;
  padding: 12px 18px;
  text-align: center;
}
.menu-in-node {
  padding: 0;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
}
.menu-out-node {
  padding: 0;
  width: 65px;
  height: 65px;
  border-radius: 100%;
  line-height: 60px;
  text-align: center;
}

.menu-cog-node {
  padding: 5px 10px;
  width: 240px;
  > div {
    font-size: 14px;
  }
  > p {
    font-size: 12px;
    margin-top: 2px;
    color: #999;
  }
}
.menu-codepen-node {
  width: 240px;
  > div {
    font-size: 14px;
    padding: 8px;
    background: cornflowerblue;
    color: cornsilk;
  }
  > p {
    padding: 10px;
    font-size: 12px;
    margin-top: 2px;
    color: #999;
  }
}
.menu-pulse-node {
  width: 240px;

  > div {
    font-size: 14px;
    padding: 8px;
    background: cornflowerblue;
    color: cornsilk;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  > p {
    padding: 10px;
    font-size: 12px;
    margin-top: 2px;
    color: #999;
    display: flex;
    justify-content: space-between;
  }
}
</style>
