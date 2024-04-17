import { MutationTree } from 'vuex'
export interface LiveTestState {
  currentRecord: {
    spm: string
  }
  currentEventRecord?: {
    eventCode: string
  }
  timeModeEventId: string
  realTimeEventId: string
  oldEventId: string
  errorEventId: string
  exceptionLogNum: number
  oldLogUpdateNum: number
  logUpdateNum: number
  clearLog: number // 0：不传给后端；1： 清空日志；2：显式全部
  selectShow: {
    type: number // 需求测试分支 已通过: 1, 未通过2，未覆盖：3 全量测试分支 已通过: 4, 未通过5
    number: number
  }
  showFail: boolean
  extraRecords: any[]
  shouldCoverData: any[]
}

const state: LiveTestState = {
  currentRecord: { spm: '' },
  currentEventRecord: { eventCode: '' },
  timeModeEventId: '',
  realTimeEventId: '',
  oldEventId: '',
  errorEventId: '',
  exceptionLogNum: 0,
  oldLogUpdateNum: 0,
  logUpdateNum: 0,
  clearLog: 0,
  selectShow: {
    type: 1,
    number: 0
  },
  showFail: false,
  extraRecords: [],
  shouldCoverData: []
}

const mutations: MutationTree<LiveTestState> = {
  setCurrentRecord(state, value) {
    state.currentRecord = value
  },
  setCurrentEventRecord(state, value) {
    state.currentEventRecord = value
  },
  setTimeModeEventId(state, value) {
    state.timeModeEventId = value
  },
  setRealTimeEventId(state, value) {
    state.realTimeEventId = value
  },
  setOldEventId(state, value) {
    state.oldEventId = value
  },
  setErrorEventId(state, value) {
    state.errorEventId = value
  },
  setUpdateNum(state, value) {
    const { type, num = 0 } = value
    state[type] = num
  },
  setClearLog(state, value) {
    state.clearLog = value
  },
  setSelectShow(state, value) {
    state.selectShow = value
  },
  setShowFail(state, value) {
    state.showFail = value
  },
  setExtraRecords(state, { extraRecords, shouldCoverData }) {
    state.extraRecords = extraRecords
    state.shouldCoverData = shouldCoverData
  }
}

const LiveTestModule = {
  state,
  mutations
}

export default LiveTestModule
