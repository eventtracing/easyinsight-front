<template>
  <div style="height: 280px">
    <Graph :nodes="nodes" :edges="edges" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Graph from "./graph/index.vue";
import G6 from "@antv/g6";
import { TerminalVersionStatusEnum } from "@/types/terminalVersion.type";

export default defineComponent({
  name: "VersionTree",
  components: { Graph },
  props: {
    terminalId: {},
  },
  computed: {
    nodes() {
      return this.terminalVersionNodes.map((n) => {
        const flag = n.status === TerminalVersionStatusEnum.ONLINE;
        const length = G6.Util.getTextSize(n.name, 14)[0];
        const isEnd = this.terminalVersionEdges.every((e) => e.from !== n.id);

        return {
          id: n.id.toString(),
          label: n.name,
          style: {
            stroke: flag ? "#26bd71" : "#999",
            fill: flag ? "#e9f8f1" : "#eee",
          },
          size: [length, 32],
          canSetMainVersion: isEnd && flag,
        };
      });
    },

    edges() {
      return this.terminalVersionEdges.map((e) => {
        return {
          source: e.from.toString(),
          target: e.to.toString(),
          style: {
            stroke: e.isMaster ? "#26bd71" : "#999",
          },
        };
      });
    },
  },
  data() {
    return {
      terminalVersionNodes: [],
      terminalVersionEdges: [],
    };
  },
});
</script>
