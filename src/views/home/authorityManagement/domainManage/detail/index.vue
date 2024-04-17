<template>
  <div>
    <div>域信息</div>
    <div class="m-gap"></div>
    <div class="c-label__item flex" v-for="(label, index) in labels" :key="label">
      <span class="c-labe__name g-mr-24">{{ label }}</span>
      <div v-html="values[index] || ''"></div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { defineComponent } from 'vue'
import { getDomainDetail } from '@/services/authority.service'
const labels = ['域ID', '域名称', '域负责人', '域管理员', '创建人', '创建时间']
export default defineComponent({
  name: 'DomainManageDetail',

  setup() {
    const _labels: string[] = labels
    return {
      labels: _labels
    }
  },

  data() {
    const _values: string[] = []
    return {
      values: _values
    }
  },

  mounted() {
    getDomainDetail({
      id: localStorage.domainId
    }).then((res) => {
      this.values[0] = res.code
      this.values[1] = res.name
      this.values[2] = `${res.owner?.userName}(${res.owner?.email || ''})`
      this.values[3] = (res.admins || [])
        .map((admin) => `<div class="g-mb-8">${admin?.userName}(${admin?.email || ''})</div>`)
        .join('')
      this.values[4] = `${res.creator?.userName}(${res.creator?.email || ''})`
      this.values[5] = moment(res.createTime).format('YYYY-MM-DD HH:mm:ss')
      this.$forceUpdate()
    })
  }
})
</script>

<style scoped="true" lang="less">
.m-gap {
  width: 100%;
  height: 1px;
  background: #e8e8e8;
  margin: 17px 0;
}
.c-labe__name {
  width: 80px;
  flex: none;
  color: #102048;
}
.c-label__item {
  color: #7880a0;
  margin-bottom: 16px;
}
</style>
