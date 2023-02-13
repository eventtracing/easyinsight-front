<template>
  <div class="container flex">
    <!-- <ObjectList
      :taskId="taskId"
      :activeId="activeId"
      @active="onActive"
    ></ObjectList> -->
    <div class="c-padding">
      <ObjectViewDrawer
        class="flex-1"
        :id="activeTrackerObjId"
        :trackerId="activeId"
        :requireId="requireId"
        :key="activeTrackerObjId"
        v-if="activeTrackerObjId"
      ></ObjectViewDrawer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import ObjectList from "./ObjectList.vue";
import ObjectViewDrawer from "./ObjectViewDrawer.vue";
export default defineComponent({
  name: "TaskObject",
  components: {
    // ObjectList,
    ObjectViewDrawer,
  },
  props: {
    taskId: {},
    requireId: {},
  },

  data() {
    const _activeId = null;
    const _activeTrackerObjId = null;

    return {
      activeId: _activeId,
      activeTrackerObjId: _activeTrackerObjId,
    };
  },

  methods: {
    onActive(trackerId: number, objId: number) {
      this.activeId = trackerId;
      this.activeTrackerObjId = objId;
    },
  },
});
</script>

<style lang="less" scoped="true">
.container {
  max-height: 600px;
  border: 1px solid #dee2e9;
}
.c-padding {
  padding: 20px;
  height: 600px;
  overflow-y: auto;
}
</style>
