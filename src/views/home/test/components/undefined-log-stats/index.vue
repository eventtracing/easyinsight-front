<template>
  <div class="log-list-wrapper">
    <p class="title">{{ title }}：</p>
    <div class="flex total">
      <div>
        共 <span class="blue">{{ data.eventNum }}</span> 类，<span
          class="blue"
          >{{ data.logNum }}</span
        >
        条日志
        <a-button size="small" type="primary" @click="handleShowAll"
          >显示全部</a-button
        >
      </div>
    </div>
    <ul class="stats-wrapper">
      <li
        v-for="item in data.details"
        :key="item.eventCode"
        class="stats-item"
        :class="selected === item.eventCode ? 'current' : ''"
        @click="handleClick(item)"
      >
        <span>{{ item.eventCode }} </span>
        <span>{{ item.logCount }}</span>
      </li>
    </ul>
    <a-divider style="margin: 24px 0 0 0"></a-divider>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "undefined-log-stats",
  props: {
    data: {
      type: Object,
      default: () => {},
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
      this.selected = item.eventCode;
      this.$emit("updateSearchType", item.eventCode, "undefined");
    },

    handleShowAll() {
      this.selected = "";
      this.$emit(
        "updateSearchType",
        this.data.details.map((d) => d.eventCode),
        "undefined"
      );
    },
  },
});
</script>

<style scoped="true" lang="less">
.log-list-wrapper {
  // border-top: 1px solid #e8e8f0;
  padding-top: 20px;
  // margin-bottm: 10px;

  .title {
    margin-bottom: 0;
    font-size: 16px;
    color: #000000;
  }

  .total {
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;

    .anticon {
      cursor: pointer;
    }
  }

  .stats-wrapper {
    list-style: none;

    .stats-item {
      padding: 2px 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:hover {
        cursor: pointer;
      }
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
