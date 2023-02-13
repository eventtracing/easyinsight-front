<template>
  <div class="g-p-lr-24 g-mt-16">
    <a-tabs class="c-realtime__lists" :default-active-key="activeKey" @change="callback">
      <a-tab-pane :key="term.id" :tab="term.name" v-for="term in terminal">
        <Content
          ref="content-list"
          :terminal="term.id"
          :terminalName="term.name"
          :config="configMap"
        />
      </a-tab-pane>
      <template #tabBarExtraContent>
        <a-button @click="handleClick">实时日志</a-button>
      </template>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import { getTerminalList } from '@/services/terminal.service'
import { getTaskOptions } from '@/services/requirement.service'
import { configDto } from './types/content'
import { getAllUsers } from '@/services/app.service'
export default defineComponent({
  name: 'RealTime',

  components: {
    Content: defineAsyncComponent(() => import('./content.vue'))
  },

  setup() {
    const _activeKey = ref('Android')
    return {
      activeKey: _activeKey
    }
  },

  computed: {
    terminal() {
      return this.configMap.terminal || []
    }
  },

  data() {
    const _configMap: configDto | any = {}
    return {
      configMap: _configMap
    }
  },

  mounted() {
    getTaskOptions().then((res) => {
      this.configMap.requirementIds = res.reqKeys.map((v) => ({
        key: v,
        value: v
      }))
      this.configMap.requirementNames = res.reqName.map((v) => ({
        key: v,
        value: v
      }))
      this.configMap.interators = res.sprints.map((v) => ({
        key: v,
        value: v ?? 'null'
      }))
      this.configMap.versions = res.termnialVersions.map((v) => ({
        key: v,
        value: v || (v === '' ? '空字符串' : 'null')
      }))
    })
    getTerminalList({
      currentPage: 1,
      pageSize: 50,
      search: ''
    }).then((result) => {
      this.configMap.terminal = result.list
    })
    getAllUsers().then((res) => {
      this.configMap.users = res.map((v) => ({
        key: v.email,
        value: v.userName
      }))
    })
  },

  methods: {
    callback() {},
    handleClick(ev) {
      const ref = this.$refs['content-list'][0]

      ref.getRealTimeLog(ev)
    }
  }
})
</script>

<style scoped="true" lang="less">
.g-mt-16 {
  :deep(.ant-tabs) {
    overflow: unset;
  }
}
</style>
