<template>
  <div class="c-point__code" :class="{ 'c-point__code--noborder': from === 'error' }">
    <PointCode :data="tracker" v-for="tracker in trackerArray" :key="tracker" v-bind="$attrs" />
    <p class="g-pl-12" v-if="checkResult === 3">
      1、检查日志中是否有spm，若无，请先补齐；若有，检查下一项；
      <br />
      2、检查规则校验扫码前是否选中需求，若无，请先勾选；若有，检查下一项；（按基线版本即线上埋点规则校验时可不选需求）
      <br />
      3、检查需求中对象树层级是否有多和漏等导致spm不匹配的情况，若无，请与平台反馈；若有，则与埋点方案设计者沟通修改和确认。
      <br />
      <br />
      提示：大多数情况下都是因为需求中对象树层级定义和spm不匹配。
    </p>
  </div>
</template>

<script lang="ts" setup>
import { markRaw, reactive, onMounted, onUpdated, watch } from 'vue'
import PointCode from './point-code.vue'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps<{
  data: Record<string, unknown>
  checkResult: number
}>()
const data = props.data
const checkResult = props.checkResult
const trackerArray = reactive([])
const priorityTracker = markRaw([
  '_elist',
  ' ',
  '_plist',
  ' ',
  '_spm',
  '_scm',
  ' ',
  '_hsrefer',
  '_mutlirefers',
  ' ',
  '_actseq',
  '_eventcode',
  ' ',
  '_sessid',
  '_sidrefer'
])
const priorityElsit = markRaw([
  '_oid',
  '_pos',
  ' ',
  's_cid',
  's_ctype',
  's_ctraceid',
  's_calg',
  ' ',
  '_addrefer'
])
const priorityPlist = markRaw([
  '_oid',
  '_pgstep',
  ' ',
  's_cid',
  's_ctype',
  's_ctraceid',
  ' ',
  '_pgrefer',
  '_psrefer'
])

function getPriority(tracker) {
  if (Object.prototype.toString.call(tracker) !== '[object Object]') return
  let eListIndex = 0
  let pListIndex = 0
  priorityTracker.forEach((prior) => {
    if (prior === ' ') {
      const lastItem = trackerArray.slice(-1)[0] || {}
      if (Object.keys(lastItem).includes('br')) return
      trackerArray.push({
        br: 'preline' + uuidv4(),
        abstract: true
      })
    } else {
      if (prior in tracker) {
        const value = tracker[prior]
        if (Array.isArray(value)) {
          // 上报日志的key的值是对象
          const arrayPrority: any = [] // traccerArray._elist = []
          arrayPrority.abstract = true
          trackerArray.push({
            [prior]: arrayPrority,
            abstract: true
          })
          value.slice(0).forEach((originObj) => {
            const obj = { ...originObj }
            // _elist: [{ s: 1 , b: 2}], obj => { s: 1, b: 2 }
            const currentTracker: any = [] // traccerArray._elist = [[{s: 1}, { b: 2 }]]
            arrayPrority.push(currentTracker)
            currentTracker.abtract = true
            if (prior === '_elist' || prior === '_plist') {
              const isElsit = prior === '_elist'
              const priorValueMap = isElsit ? priorityElsit : priorityPlist
              priorValueMap.forEach((elsit) => {
                if (elsit in obj) {
                  currentTracker.push({
                    [elsit]: obj[elsit],
                    abstract: true
                  })
                  obj[elsit] = undefined
                } else {
                  const lastItem = currentTracker.slice(-1)[0] || {}
                  if (!Object.keys(lastItem).includes('br')) {
                    currentTracker.push({
                      br: 'preline' + uuidv4(),
                      abstract: true
                    })
                  }
                  isElsit ? eListIndex++ : pListIndex++
                }
              })

              for (const key in obj) {
                const value = obj[key]
                if (value) {
                  currentTracker.push({
                    [key]: value,
                    abstract: true
                  })
                }
              }
            }
          })
        } else {
          trackerArray.push({
            [prior]: value,
            abstract: true
          })
        }
        tracker[prior] = undefined
      } else {
        const lastItem = trackerArray.slice(-1)[0] || {}
        if (Object.keys(lastItem).includes('br')) return
        trackerArray.push({
          br: 'preline' + uuidv4(),
          abstract: true
        })
      }
    }
  })

  for (const key in tracker) {
    const value = tracker[key]
    if (value) {
      trackerArray.push({
        [key]: value,
        abstract: true
      })
    }
  }
}

watch(
  () => props.data,
  (data) => {
    trackerArray.length = 0
    if (Array.isArray(data)) {
      data.forEach((tracker) => {
        getPriority({ ...tracker })
      })
    } else {
      getPriority({ ...data })
    }
  }
)

onMounted(() => {
  if (Array.isArray(data)) {
    data.forEach((tracker) => {
      getPriority({ ...tracker })
    })
  } else {
    getPriority({ ...data })
  }
})
</script>

<style lang="less" scoped>
.c-point__code {
  // border: 1px solid #e8e8f0;
  margin: 0 5px;
  padding-right: 1rem;
  &--noborder {
    border: none;
  }
}
</style>
