<template>
  <div :style="{'margin-left':(graphSetting.viewELSize.width-350)+'px'}" class="c-mini-namefilter">
  </div>
</template>

<script>
export default {
  name: 'GraphMiniNameFilter',
  props: {
    graphSetting: {
      mustUseProp: true,
      default: () => { return {} },
      type: Object
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style scoped>
  .c-mini-namefilter{
    height:60px;
    position: absolute;
    margin-top:10px;
    z-index: 999;
  }
  .c-fixedLayout{
    position: fixed;
    top:145px;
  }
</style>
