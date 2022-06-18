<template>
  <div>
    <div :class="[$parent.isNeedFixedTools?'c-fixedLayout':'']" class="c-setting-panel-button" @click="toggleSettingPanel">
      <i class="el-icon-setting" />
    </div>
    <div v-if="showSettingPanel" :class="[$parent.isNeedFixedTools?'c-fixedLayout':'']" class="c-setting-panel">
    </div>
  </div>
</template>

<script>
import SeeksRGLayouters from './core4vue/SeeksRGLayouters'
export default {
  name: 'GraphSettingPanel',
  props: {
    graphSetting: {
      mustUseProp: true,
      default: () => { return {} },
      type: Object
    }
  },
  data() {
    return {
      search_text: '',
      showSettingPanel: false,
      currentLayoutName: ''
    }
  },
  methods: {
    toggleSettingPanel() {
      this.showSettingPanel = !this.showSettingPanel
    },
    toggleAutoLayout() {
      if (this.graphSetting.autoLayouting) {
        if (!this.graphSetting.layouter.autoLayout) {
          console.log('当前布局不支持自动布局！')
        } else {
          this.graphSetting.layouter.autoLayout(true)
        }
      } else {
        if (!this.graphSetting.layouter.stop) {
          console.log('当前布局不支持自动布局stop！')
        } else {
          this.graphSetting.layouter.stop()
        }
      }
    },
    switchLayout() {
      if (window.SeeksGraphDebug) console.log('change layout:', this.currentLayoutName)
      SeeksRGLayouters.switchLayout(this.currentLayoutName, this.graphSetting)
      this.refresh()
    },
    refresh() {
      this.$parent.refresh()
    }
  }
}
</script>

<style scoped>
  .c-setting-panel{
    --height:500px;
    --width:500px;
    width:500px;
    height:500px;
    position: absolute;
    margin-left:10px;
    margin-top:5px;
    font-size: 12px;
    color: rgb(58, 91, 178);
    padding:10px;
    overflow: hidden;
    box-shadow: 0px 0px 5px rgb(58, 91, 178);
    border-radius: 5px;
    z-index: 1000;
    background-color: #ffffff;
    border: rgb(58, 91, 178) solid 1px;
    padding-top:60px;
  }
  .c-setting-panel-button{
    height:45px;
    width:45px;
    font-size: 20px;
    line-height: 45px;
    text-align: center;
    border-radius: 50%;
    position: absolute;
    margin-left:25px;
    margin-top:20px;
    background-color: rgb(58, 91, 178);
    color: #ffffff;
    cursor: pointer;
    z-index: 1001;
    box-shadow: 0px 0px 8px rgb(46, 78, 143);
  }
  .c-setting-panel-button:hover{
    box-shadow: 0px 0px 20px #FFA20A;
    border:#ffffff solid 1px;
    color: #FFA20A;
    -moz-transform: rotate(-89deg) translateX(-190px);
    animation-timing-function:linear;
    animation: flashButton 2s infinite;
  }
  .c-fixedLayout{
    position: fixed;
    top: 125px
  }
  @keyframes flashButton {
    from {
      box-shadow: 0px 0px 8px rgb(46, 78, 143);
    }
    30% {
      box-shadow: 0px 0px 20px #FFA20A;
    }
    to {
      box-shadow: 0px 0px 8px rgb(46, 78, 143);
    }
  }
</style>
