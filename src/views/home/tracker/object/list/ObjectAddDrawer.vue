<template>
  <u-drawer
    :title="id ? ' 复制对象' : '新建对象'"
    width="75vw"
    :visible="true"
    @handlerClose="handleClose"
  >
    <ObjectAddForm
      ref="object-add-form"
      :id="id"
      :reqPoolId="reqPoolId"
      :historyId="historyId"
      :parentIds="parentIds"
    />
    <drawer-footer @close="handleClose" @ok="handleOk" :loading="loading" />
  </u-drawer>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import ObjectAddForm from "./ObjectAddForm.vue";
export default defineComponent({
  name: "ObjectAddDrawer",
  components: {
    ObjectAddForm,
  },
  props: {
    id: {
      type: Number as PropType<number>,
    },
    historyId: {},
    parentIds: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    objectChangeForm() {
      const objectChangeForm: typeof ObjectAddForm =
        this.$refs["object-add-form"];

      return objectChangeForm;
    },
  },
  methods: {
    handleOk() {
      if (this.objectChangeForm) {
        this.loading = true;

        this.objectChangeForm
          .handleOk()
          .then(() => {
            this.$emit("ok");
          })
          .catch()
          .finally(() => {
            this.loading = false;
          });
      }
    },

    handleClose() {
      this.$emit("handlerClose");
    },
  },
});
</script>
