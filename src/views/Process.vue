<template>
  <div>
    <div id="myCanvas1" style="height: 400px; width: 400px;"></div>
  </div>
</template>

<script>

import Vue from 'vue';
// import ElementUI from 'element-ui';
// Vue.use(ElementUI);
import { Progress } from 'element-ui';
Vue.use(Progress);

export default {
  name: "Index",
  components: {
  },
  data() {
    return {
      isMouseDownStop: false
    };
  },
  mounted() {
    const tipComponent = Vue.extend({
      render: (h) =>
        h('el-progress', {
          props: {
            strokeWidth: 3,
            percentage: 77,
            type: "circle",
            textInside: false,
            showText: false,
            width: 20
          }
        }),
      })
    // eslint-disable-next-line new-cap
    const component = new tipComponent().$mount()
    document.querySelector('#myCanvas1').appendChild(component.$el);
  },
  methods: {
  }
};
</script>
