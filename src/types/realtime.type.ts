interface SpmStatistic {
  num: number
  spm: string
}

interface EventStatistics {
  eventCode: string
  eventName: string
  logNum: number
  objTrackerNum: number
  spmStatistics: SpmStatistic[]
}

interface Details {
  eventCode: string
  failSum: number
  num: number
  passSum: number
}

interface Page {
  size: number
  cursor: number
  [x: string]: any
}

export interface OldVersionStatistics {
  eventStatistics: EventStatistics
  logNum: number
  objTrackerNum: number
}

export interface StatisticsDto {
  appStatus: boolean
  logUpdateNum: number
  oldLogUpdateNum: number
  eventStatistic: any
  exceptionLogNum: number
  oldVersionStatistics: OldVersionStatistics
  statistics: OldVersionStatistics
  treeModeStatistic: {
    details: Details
    spm: string
  }
  undefinedStatistics: {
    details: Details[]
    eventNum: number
    logNum: number
    eventCode: string
    logCount: number
  }
  unMatchSpmStatistic: {
    num: number
    spm: string
    spmName: string
  }
  errorStatistic: any[]
  reqTestInfoStatistic: {
    spmNum: number
    actionNum: number
    paramNum: number
    branchNum: number
  }
  testStatisticInfoParam: {
    reqTestInfoDTO: any
    reqCoverInfoDTO: any
    baseCoverInfoDTO: any
  }
}

interface CommonRule {
  denominator: number
  focus: boolean
  numerator: number
  ratio: number
}

interface LogInfoRecord {
  index: number
  type: string
  ruleCheck: {
    checkResult: number
    detectionIndicator: {
      privateParamCompletion: CommonRule
      privateParamNullRate: CommonRule
      privateParamSuitability: CommonRule
      publicParamCompletion: CommonRule
      publicParamNullRate: CommonRule
      publicParamSuitability: CommonRule
    }
  }
  eventCode: string
  eventName: string
  firstObjName: string
  firstObjOid: string
  log: {
    [x: string]: any
  }
  rule: {
    _plist: any[]
    _elist: any[]
    spm: string
    trackerId: number
  }
  oldVersionLog: {
    [x: string]: any
  }
}

export interface LogInfoDto {
  records: LogInfoRecord[]
  page: Page
  extraRecords: any[]
  shouldCoverData: any[]
}
