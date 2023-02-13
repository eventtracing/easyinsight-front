<template>
  <div class="fill">
    <UPage404></UPage404>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { UPage404 } from "@/ndsc-vue3/exception-page/lib";

export default defineComponent({
  name: "Page404",
  components: { UPage404 },
});
</script>
