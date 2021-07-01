qunee-min.js and qunee-es.js are the same content, you can use any one of them in the web page as follows:

1. global load, use qunee-min.js
<div style="position: absolute; width: 100%; top: 0px; bottom: 0px;" id="canvas" ></div>
<script src="./lib/qunee-min.js"></script>
<script>
<script>
    var graph = new Q.Graph('canvas');
    var hello = graph.createNode("Hello");
</script>

2. load by 'import', use qunee-es.js
<div style="position: absolute; width: 100%; top: 0px; bottom: 0px;" id="canvas" ></div>
<script type="module">
    import Q from "./lib/qunee-es.js";
    var graph = new Q.Graph('canvas');
    var hello = graph.createNode("Hello");
</script>

Custom component in Vue.js
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

3. load qunee-module.js by requirejs
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