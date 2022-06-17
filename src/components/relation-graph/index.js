import RelationGraph from './index.vue'

const comment = {
    install: function (Vue) {
        Vue.component('relation-graph', RelationGraph);
        Vue.component('seeks-relation-graph', RelationGraph);
    }
}
export default comment
