<template>
  <div class="test-abstract-wrapper">
    <div class="left">
      <p class="title">测试摘要</p>
      <p :class="status" v-if="showAbstractResult" style="font-size: 15px">
        {{ statusTextMap[status] }}
      </p>
      <div v-for="item in tipTextList" :key="item" style="padding: 0px 4px">
        <p style="font-size: 12px; text-align: left">{{ item }}</p>
      </div>
    </div>
    <div class="right">
      <p>
        <span>当前测试需求：</span>
        <span style="color: #103ffa">{{ name }}</span>
      </p>
      <a-divider style="margin: 0px 0px 15px 0" />
      <a-row type="flex" :gutter="36">
        <a-col :span="12" style="border-right: 1px solid #f0f0f0">
          <p>
            <span class="uncover">
              积累摘要(包含重连前后，且不被清除日志干扰，最终测试记录保存以这份累计结果为准)
            </span>
          </p>
          <p v-if="taskId">
            <span class="desc-title"> 需求待测试 </span>
            <span>SPM {{ reqTestInfoStatistic.paramNum || 0 }}</span>
            <span>，</span>
            <span>Action {{ reqTestInfoStatistic.actionNum || 0 }}</span>
            <span>，</span>
            <span>参数枚举 {{ reqTestInfoStatistic.paramNum || 0 }}</span>
            <span>，</span>
            <span>待测试分支 {{ reqTestInfoStatistic.branchNum || 0 }}</span>
          </p>
          <p v-if="taskId">
            <span class="desc-title"> 需求测试分支 </span>
            <span class="success"
              >已通过 <a @click="handleSelectChange(1, taskPassNum)">{{ taskPassNum }}</a></span
            >
            <span>，</span>
            <span class="fail"
              >未通过
              <a @click="handleSelectChange(2, taskNotPassNum)">{{ taskNotPassNum }}</a></span
            >
            <span>，</span>
            <span class="uncover"
              >未覆盖
              <a @click="handleSelectChange(3, taskUncoverNum)">{{ taskUncoverNum }}</a></span
            >
          </p>
          <p>
            <span class="desc-title"> 全量测试分支 </span>
            <span class="success"
              >已通过
              <a @click="handleSelectChange(4, baseStatistic.passNum)">{{
                baseStatistic.passNum
              }}</a></span
            >
            <span>，</span>
            <span class="fail"
              >未通过
              <a @click="handleSelectChange(5, baseStatistic.failNum)">{{
                baseStatistic.failNum
              }}</a></span
            >
            <span>，</span>
            <span class="uncover">未匹配SPM {{ unMatchCount || 0 }}</span>
          </p>
        </a-col>
        <a-col :span="12">
          <p>
            <span class="uncover"> 即时摘要(上次连接或清空日志的统计结果，即时调试查看方便) </span>
          </p>
          <p v-if="taskId">
            <span class="desc-title" v-if="taskId"> 需求待测试 </span>
            <span>SPM {{ reqTestInfoStatistic.paramNum || 0 }}</span>
            <span>，</span>
            <span>Action {{ reqTestInfoStatistic.actionNum || 0 }}</span>
            <span>，</span>
            <span>参数枚举 {{ reqTestInfoStatistic.paramNum || 0 }}</span>
            <span>，</span>
            <span>待测试分支 {{ reqTestInfoStatistic.branchNum || 0 }}</span>
          </p>
          <p v-if="taskId">
            <span class="desc-title"> 需求测试分支 </span>
            <span class="success">已通过 {{ inTimeTaskStatistic.passNum }}</span>
            <span>，</span>
            <span class="fail">未通过 {{ inTimeTaskStatistic.disPassNum }}</span>
            <span>，</span>
            <span class="uncover">未覆盖 {{ inTimeTaskStatistic.unCoveredNum }}</span>
          </p>
          <p>
            <span class="desc-title"> 全量测试分支 </span>
            <span class="success">已通过 {{ inTimeBaseStatistic.passNum }}</span>
            <span>，</span>
            <span class="fail">未通过 {{ inTimeBaseStatistic.disPassNum }}</span>
            <span>，</span>
            <span class="uncover">未匹配 {{ inTimeBaseStatistic.unMatchCount }}</span>
          </p>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'test-abstract',
  components: {},
  props: {
    taskStatistic: {
      type: Object,
      default: () => {}
    },
    baseStatistic: {
      type: Object,
      default: () => {}
    },
    reqTestInfoStatistic: {
      type: Object,
      default: () => {}
    },
    testStatisticInfoParam: {
      type: Object,
      default: () => {}
    },
    eventData: {
      type: Array,
      default: () => []
    },
    unMatchTableData: {
      type: Array,
      default: () => []
    },
    taskName: {
      type: String,
      default: ''
    },
    reqTaskName: {
      type: String,
      default: ''
    },
    showAbstractResult: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      statusTextMap: {
        fail: '失败',
        part: '部分通过',
        success: '通过'
      }
    }
  },
  computed: {
    unMatchCount() {
      const count = this.unMatchTableData?.reduce((pre, cur) => {
        return pre + cur.num
      }, 0)
      return count
    },
    status() {
      const { waitTestNum, coverNum, failNum } = this.taskStatistic

      const unCoveredNum = waitTestNum - coverNum

      if (failNum !== 0 || unCoveredNum !== 0) {
        return 'fail'
      }

      if (this.baseStatistic.failNum !== 0) {
        return 'part'
      }

      return 'success'
    },
    inTimeTaskStatistic() {
      const reqCoverInfoDTO = this.testStatisticInfoParam?.reqCoverInfoDTO || {}
      const { passNum = 0, failNum = 0, waitTestNum = 0, coverNum = 0 } = this.taskStatistic

      return {
        passNum: passNum - (reqCoverInfoDTO.passNum || 0),
        disPassNum: failNum - (reqCoverInfoDTO.disPassNum || 0),
        unCoveredNum: waitTestNum - coverNum - (reqCoverInfoDTO.unCoveredNum || 0)
      }
    },
    inTimeBaseStatistic() {
      const baseCoverInfoDTO = this.testStatisticInfoParam?.baseCoverInfoDTO || {}
      const { passNum = 0, failNum = 0 } = this.baseStatistic

      return {
        passNum: passNum - (baseCoverInfoDTO.passNum || 0),
        disPassNum: failNum - (baseCoverInfoDTO.disPassNum || 0),
        unMatchCount: this.unMatchCount - (baseCoverInfoDTO.unMatchedSpmNum || 0)
      }
    },
    taskId() {
      return this.$route.query.taskId
    },
    name() {
      const { taskId } = this.$route.query

      if (taskId) {
        return this.reqTaskName || this.taskName
      }

      return '无需求，仅回归已上线埋点'
    },
    taskUncoverNum() {
      const { waitTestNum = 0, coverNum = 0 } = this.taskStatistic
      let sum = waitTestNum - coverNum

      this.eventData?.forEach((event) => {
        const { details = [] } = event

        const num = details.reduce((pre, cur) => {
          const { reqSum = 0, hitSum = 0 } = cur

          return pre + reqSum - hitSum
        }, 0)

        sum += num
      })

      return sum
    },
    taskPassNum() {
      const { passNum = 0 } = this.taskStatistic
      let sum = passNum

      this.eventData?.forEach((event) => {
        const { details = [] } = event

        const num = details.reduce((pre, cur) => {
          const { passSum = 0 } = cur

          return pre + passSum
        }, 0)

        sum += num
      })

      return sum
    },
    taskNotPassNum() {
      const { failNum = 0 } = this.taskStatistic
      let sum = failNum

      this.eventData?.forEach((event) => {
        const { details = [] } = event

        const num = details.reduce((pre, cur) => {
          const { failSum = 0 } = cur

          return pre + failSum
        }, 0)

        sum += num
      })

      return sum
    },
    tipTextList() {
      const result = []

      if (this.status === 'part') {
        result.push('需求外埋点存在验证失败')
      }

      if (this.status === 'fail') {
        if (this.taskUncoverNum) {
          result.push('需要覆盖所有spm链路上，对象的所有枚举分支')
        }

        if (this.taskNotPassNum) {
          result.push('存在埋点验证失败')
        }
      }

      return result
    }
  },
  methods: {
    handleSelectChange(type: number, number = 0) {
      this.$store.commit('setSelectShow', { type, number })
      this.$store.commit('setShowFail', true)
    }
  }
})
</script>

<style lang="less" scoped="true">
.test-abstract-wrapper {
  margin: 10px;
  border: 1px solid #f0f0f0;
  display: flex;

  .left {
    width: 150px;
    background-color: #f0f0f0;
    padding-top: 20px;

    p {
      text-align: center;
    }

    .title {
      font-size: 18px;
      color: rgb(16, 63, 250);
    }
  }

  .right {
    margin: 10px;
    flex: 1;
  }

  .desc-title {
    display: inline-block;
    width: 120px;
  }

  .fail {
    color: red;

    a {
      color: red;
      text-decoration: underline;
    }
  }
  .part {
    color: orange;
  }
  .success {
    color: green;

    a {
      color: green;
      text-decoration: underline;
    }
  }
  .uncover {
    color: #103ffa;

    a {
      color: 103ffa;
      text-decoration: underline;
    }
  }
}
</style>
