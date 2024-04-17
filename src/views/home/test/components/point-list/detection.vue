<template>
  <div class="detection-wrapper">
    <div class="flex detection-item" v-for="(value, name, index) in data" :key="index">
      <span class="text-ellipsis">{{ textMap[name] }}</span>
      <span class="mr3 ml3"> : </span>
      <span v-if="value.numerator === 0 && value.denominator === 0">0</span>
      <span v-else>
        <span>{{ `${value.numerator} / ${value.denominator} = ` }}</span>
        <span :class="value.focus ? 'red' : ''">
          {{ `${value.ratio.toFixed(2)}%` }}
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  name: 'detection',

  setup() {
    const _textMap = reactive({
      privateParamCompletion: '私参完整度',
      privateParamSuitability: '私参匹配度',
      privateParamNullRate: '私参空值率',
      publicParamCompletion: '公参完整度',
      publicParamSuitability: '公参匹配度',
      publicParamNullRate: '公参空值率'
    })

    return {
      textMap: _textMap
    }
  },

  props: {
    data: {},
    type: {}
  }
})
</script>

<style scoped="true" lang="less">
.detection-wrapper {
  .detection-item {
    margin-bottom: 5px;
    color: #a4a8b7;

    .red {
      color: red;
    }

    .mr3 {
      margin-right: 3px;
    }
    .ml3 {
      margin-left: 3px;
    }
  }
}
</style>
