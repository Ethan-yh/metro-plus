qunee-min.js，qunee-module.js和qunee-es.js 三者为相同内容，可以根据需要选择任意一个
1. 如果是全局加载，可以引入qunee-min.js
<div style="position: absolute; width: 100%; top: 0px; bottom: 0px;" id="canvas" ></div>
<script src="./lib/qunee-min.js"></script>
<script>
<script>
    var graph = new Q.Graph('canvas');
    var hello = graph.createNode("Hello");
</script>

2. 如果通过'import'方式引入，可以使用qunee-es.js
<div style="position: absolute; width: 100%; top: 0px; bottom: 0px;" id="canvas" ></div>
<script type="module">
    import Q from "./lib/qunee-es.js";
    var graph = new Q.Graph('canvas');
    var hello = graph.createNode("Hello");
</script>

在Vue中自定义组件
QGraph.vue
<template>
  <div ref="canvas" style="background-color: #F00; width: 700px; height: 500px;"></div>
</template>
<script>
  import Q from './lib/qunee-es.js';
  console.log('Q.version', Q.version)
  export default {
    mounted(){
      var graph = new Q.Graph(this.$refs.canvas);
      graph.createNode('Hello on mounted', 100, 100);
    }
  }
</script>

3. 如果通过第三方模块化加载组件加载（比如requirejs），可以使用qunee-module.js
<div style="position: absolute; width: 100%; top: 0px; bottom: 0px;" id="canvas" ></div>
<script src="lib/require.js"></script>
<script>
    require.config({
        paths: {
            Q: './lib/qunee-module'
        }
    });
    require(['Q'],
            function (Q) {
                var graph = new Q.Graph('canvas');
                var hello = graph.createNode("Hello");
            });
</script>