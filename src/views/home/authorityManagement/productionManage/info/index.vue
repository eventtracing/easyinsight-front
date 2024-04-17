<template>
  <div class="production-info-wrapper">
    <div>产品信息</div>
    <div class="m-gap"></div>
    <div class="flex mb20">
      <div class="left">产品名称</div>
      <div>{{ info.name }}</div>
    </div>
    <div class="flex mb20">
      <div class="left">管理员</div>
      <ul>
        <li class="manager-item" v-for="item in info.admins" :key="item.id">
          {{ `${item.userName} (${item.email})` }}
        </li>
      </ul>
    </div>
    <div class="flex mb20">
      <div class="left">创建人</div>
      <div>{{ `${info.creator.userName}(${info.creator.email})` }}</div>
    </div>
    <div class="flex mb20">
      <div class="left">创建时间</div>
      <div>{{ formatTime(info.createTime) }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getAppInfo } from '@/services/auth.service'
import { getTimeStringFromTimestamp } from '@/ndsc-vue3/utils/lib'
export default defineComponent({
  name: 'ProductionManageInfo',

  data() {
    const _appId = localStorage.getItem('appId')

    const _domainId = localStorage.getItem('domainId')

    const _info = {
      admins: [],
      creator: {}
    }
    return {
      appId: _appId,
      domainId: _domainId,
      info: _info
    }
  },

  created() {
    this.fetchInfo()
  },

  methods: {
    fetchInfo() {
      getAppInfo({
        domainId: this.domainId,
        id: this.appId
      }).then((res) => {
        this.info = res
      })
    },

    formatTime(num: number) {
      return getTimeStringFromTimestamp(num)
    }
  }
})
</script>

<style scoped="true" lang="less">
.production-info-wrapper {
  padding: 15px;
  padding-top: 13px;

  .m-gap {
    width: 100%;
    height: 1px;
    background: #e8e8e8;
    margin: 17px 0;
  }
  .left {
    width: 100px;
    color: #000000;
  }

  .manager-item {
    margin-bottom: 8px;
  }

  .mb20 {
    margin-bottom: 20px;
  }
}
</style>
