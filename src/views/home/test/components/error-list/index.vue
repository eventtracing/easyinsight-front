<template>
  <div class="error-list-wrapper">
    <p class="title">
      {{ title }}
      <a-button size="small" type="primary" @click="handleShowAll"
        >显示全部</a-button
      >
    </p>
    <p
      class="flex list-item-content"
      v-for="item in data"
      :key="item.code"
      :class="selected === item.code ? 'current' : ''"
      @click="handleClick(item)"
    >
      <a-tooltip>
        <template #title>
          <span>{{ item.category }}</span>
        </template>
        <span class="text-ellipsis">{{ item.category }}</span>
      </a-tooltip>
      <span>{{ item.count }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "error-list",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
  },

  data() {
    const _selected = "";
    return {
      selected: _selected,
    };
  },

  methods: {
    handleClick(item) {
      this.selected = item.code;
      this.$emit("updateErrorCode", item.code);
    },

    handleShowAll() {
      this.selected = "";
      this.$emit("updateErrorCode", "");
    },
  },
});
</script>

<style scoped="true" lang="less">
.error-list-wrapper {
  padding-top: 20px;
  padding-bottom: 20px;

  .title {
    margin-bottom: 12px;
    font-size: 16px;
    color: #000000;
  }

  .list-item-content {
    justify-content: space-between;
    margin-bottom: 0;
    padding: 5px 5px;
    margin: 3px 0;

    &:hover {
      cursor: pointer;
      background-color: rgb(221, 240, 254);
    }
  }

  .total {
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;

    .anticon {
      cursor: pointer;
    }
  }

  .blue {
    color: #103ffa;
  }

  .current {
    background-color: rgb(231, 240, 254);
  }
}
</style>
