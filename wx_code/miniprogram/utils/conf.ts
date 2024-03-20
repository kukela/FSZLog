import dateU from './date.js';

export default {
  // 0 正式环境
  env: 1,
  // 当前数据版本号
  currentDataVer: 2,
  // 月数据key开头
  monthDataKey: "md-",

  // 本地数据版本
  getDataVer(): number {
    const v = parseInt(wx.getStorageSync("dataVer"))
    return isNaN(v) ? 0 : v
  },
  saveDataVer() {
    wx.setStorageSync("dataVer", this.currentDataVer)
  },
  // 获取当前选择的年
  getDefYear(): string {
    const defYear = wx.getStorageSync("defYear")
    if (defYear == undefined || defYear.length == 0) {
      return dateU.getCurrentYear()
    }
    return defYear
  },
  // 设置当前选择的年
  setDefYear(v: string) {
    wx.setStorageSync("defYear", v)
  },
  // 获取预算
  getDefBudget(): number {
    let v = wx.getStorageSync("defBudget")
    if (v == undefined || v <= 0 || isNaN(v) || v == null) {
      v = 3000
      this.setDefBudget(v)
    }
    return v
  },
  // 设置预算
  setDefBudget(v: number) {
    wx.setStorageSync("defBudget", v)
  },
  // 获取年数据key
  getMonthDataKey(month: string): string {
    return `${this.monthDataKey}${month}`
  },

}