<template>
  <div class="log-list-wrapper">
    <p class="title">{{ title }}：</p>
    <div class="flex total">
      <div>
        共 <span class="blue">{{ data.objTrackerNum }}</span> 个埋点，<span class="blue">{{
          data.logNum
        }}</span>
        条日志
        <a-button size="small" type="primary" @click="handleShowAll">显示全部</a-button>
      </div>
    </div>
    <div>
      <a-collapse :bordered="false" :activeKey="activeKey" @change="changeActivekey">
        <a-collapse-panel
          v-for="item in data.eventStatistics"
          :key="item.eventCode"
          :header="`${item.eventCode} ${item.eventName ? `(${item.eventName})` : ''}：${
            item.objTrackerNum
          } 个，${item.logNum} 条`"
        >
          <p
            class="flex list-item-content"
            v-for="(spm, spmIndex) in item.spmStatistics"
            :key="spmIndex"
          >
            <a-tooltip>
              <template #title>
                <span>{{ spm.spm }}</span>
              </template>
              <span class="text-ellipsis">{{ spm.spm }}</span>
            </a-tooltip>
            <span>{{ spm.num }}</span>
          </p>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'log-list',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    }
  },

  data() {
    const _activeKey = []
    return {
      activeKey: _activeKey
    }
  },

  methods: {
    changeActivekey(key) {
      const keyList = key.filter((item) => item !== this.activeKey[0])
      this.activeKey = keyList
      this.$emit('updateSearchType', keyList[0])
    },

    handleShowAll() {
      this.activeKey = []
      this.$emit('updateSearchType', '')
    }
  }
})
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

  .list-item-content {
    justify-content: space-between;
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
}
</style>
