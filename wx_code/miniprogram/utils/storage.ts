export default {

  // 本地数据版本
  getDataVer(): number {
    return parseInt(wx.getStorageSync("dataVer"))
  },
  setDataVer(v: number) {
    wx.setStorageSync("dataVer", v)
  },
  // 当前选择的年
  getDefYear(): string {
    return wx.getStorageSync("defYear")
  },
  setDefYear(v: string) {
    wx.setStorageSync("defYear", v)
  },
  // 月预算
  getDefBudget(): number {
    return parseFloat(wx.getStorageSync("defBudget"))
  },
  setDefBudget(v: number) {
    wx.setStorageSync("defBudget", v)
  },
  // 是否启用同步
  setIsSync(v: boolean) {
    wx.setStorageSync("isSync", v)
  },
  getIsSync(): boolean {
    return wx.getStorageSync("isSync")
  },
  // 同步账号ID
  setUserID(v: string) {
    wx.setStorageSync("userID", v)
  },
  getUserID(): string {
    return wx.getStorageSync("userID")
  },
  // 同步数据密码
  setDataPW(v: string) {
    wx.setStorageSync("dataPW", v)
  },
  getDataPW(): string {
    return wx.getStorageSync("dataPW")
  },
  // 用户输入标签数据
  getTags(def: any = null): any {
    try {
      return JSON.parse(wx.getStorageSync("tags"))
    } catch (error) {
      return def ? def : null
    }
  },
  setTags(v: JSON): boolean {
    try {
      wx.setStorageSync("tags", JSON.stringify(v))
      return true
    } catch (error) {
      return false
    }
  },
  // 分期数据
  getInstallmentStr(): string {
    return wx.getStorageSync("installment")
  },
  getInstallment(): [] {
    let sList = <any>[]
    try {
      const s = this.getInstallmentStr()
      if (s) sList = s.split("\n")
    } catch (error) {
    }
    return sList
  },
  setInstallment(v: string) {
    wx.setStorageSync("installment", v)
  },
  // 已完成分期数据
  getInstallmentCStr(): string {
    return wx.getStorageSync("installmentC")
  },
  getInstallmentC(): [] {
    let sList = <any>[]
    try {
      sList = this.getInstallmentCStr().split("\n")
    } catch (error) {
    }
    return sList
  },
  setInstallmentC(v: string) {
    wx.setStorageSync("installmentC", v)
  },
  // 月数据
  monthDataHKey: "md-",
  getMonthData(mdateStr: string, def: any = null): any {
    try {
      return JSON.parse(wx.getStorageSync(`${this.monthDataHKey}${mdateStr}`))
    } catch (error) {
      return def ? def : null
    }
  },
  setMonthData(mdateStr: string, v: any = null): any {
    wx.setStorageSync(`${this.monthDataHKey}${mdateStr}`, v)
  },
  removeMonthData(mdateStr: string) {
    wx.removeStorageSync(`${this.monthDataHKey}${mdateStr}`)
  },

}