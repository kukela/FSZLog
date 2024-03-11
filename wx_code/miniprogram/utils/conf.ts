import dateU from './date.js';

export default {
  // 年数据key开头
  yearDataKey: "ydata-",

  // 获取当前选择的年
  getDefYear(): string {
    var defYear = wx.getStorageSync("defYear")
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
  getYearDataKey(year: string): string {
    return `${this.yearDataKey}${year}`
  },

}