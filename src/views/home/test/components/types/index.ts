export type deviceInfoDto = {
  appName: string
  appVer: string
  deviceName: string
  platform: string
  sysVer: string
}

export type statisticsDto = {
  eventStatistics: any[]
  logNum: number
  objTrackerNum: number
}

export type detailDto = {
  ruleCheck: any
  statistics: statisticsDto
}
