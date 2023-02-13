<template>
  <div>
    <div class="flex flex-ac device-detail-item">
      <span>终端：</span>
      <span>{{ terminal || '' }}</span>
    </div>
    <div class="flex flex-ac device-detail-item">
      <span>当前用户：</span>
      <span>{{ deviceInfo.anonymous ? deviceInfo.userid : deviceInfo.username }}</span>
    </div>
    <div class="flex flex-ac device-detail-item">
      <span>当前设备：</span>
      <span>{{ deviceInfo.deviceName || '' }}</span>
    </div>
    <div class="flex flex-ac device-detail-item">
      <span>当前设备品牌：</span>
      <span>{{ deviceInfo.channel || '' }}</span>
    </div>
    <div class="flex flex-ac device-detail-item">
      <span>当前设备型号：</span>
      <span>{{ deviceInfo.deviceName || '' }} </span>
    </div>
    <div class="flex flex-ac device-detail-item">
      <span>测试人：</span>
      <span>{{ deviceInfo.tester || '' }} </span>
    </div>
    <div class="flex flex-ac device-detail-item">
      <span>测试基线版本：</span>
      <span>{{ deviceInfo.baseLineName || '' }} </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'device-detail',
  components: {},

  data() {
    const _terminal = this.$route.query.terminal
    return {
      terminal: _terminal
    }
  },

  props: {
    deviceInfo: {
      type: Object,
      default: () => {}
    }
  }
})
</script>

<style lang="less" scoped="true">
.device-detail-item {
  margin-bottom: 10px;
}
.red {
  color: red;
}
</style>
