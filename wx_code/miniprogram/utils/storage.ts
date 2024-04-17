import syncD from './syncData.js';

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
  setDefBudget(v: number, isSync: boolean = true) {
    wx.setStorageSync("defBudget", v)
    if (isSync) this._changeConf()
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
      this.setTagsStr(JSON.stringify(v))
      return true
    } catch (error) {
      return false
    }
  },
  setTagsStr(v: string, isSync: boolean = true) {
    wx.setStorageSync("tags", v)
    if (isSync) this._changeLastUpdateKey("tags")
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
  setInstallment(v: string, isSync: boolean = true) {
    const isEq = this.getInstallmentStr() == v
    wx.setStorageSync("installment", v)
    if (isSync && !isEq) this._changeLastUpdateKey("installment")
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
  setInstallmentC(v: string, isSync: boolean = true) {
    const isEq = this.getInstallmentCStr() == v
    wx.setStorageSync("installmentC", v)
    if (isSync && !isEq) this._changeLastUpdateKey("installmentC")
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
  setMonthData(mdateStr: string, v: any = null, isSync: boolean = true): any {
    const key = `${this.monthDataHKey}${mdateStr}`
    wx.setStorageSync(key, v)
    if (isSync) this._changeLastUpdateKey(key)
  },
  removeMonthData(mdateStr: string) {
    wx.removeStorageSync(`${this.monthDataHKey}${mdateStr}`)
  },
  // 数据最后更新时间
  lastUpdate: <any>{
    // conf: 0,
    // tags: 0,
    // installment: 0,
    // installmentC: 0,
    // 'md-*': 0
  },
  initLastUpdate() {
    this.lastUpdate = this.parseLastUpdate(wx.getStorageSync("lastUpdate"))
    this._checkLastUpdateKey("conf")
    this._checkLastUpdateKey("tags")
    this._checkLastUpdateKey("installment")
    this._checkLastUpdateKey("installmentC")
    const keys = wx.getStorageInfoSync().keys
    let fKey = this.monthDataHKey
    keys.forEach(v => {
      if (v.indexOf(fKey) == -1) return
      this._checkLastUpdateKey(v)
    })
    this._saveLastUpdate()
  },
  parseLastUpdate(v: string): any {
    try {
      return JSON.parse(v)
    } catch (error) {
      return {}
    }
  },
  _checkLastUpdateKey(key: string) {
    if (isNaN(this.lastUpdate[key])) {
      this._changeLastUpdateKey(key)
    }
  },
  _changeLastUpdateKey(key: string) {
    this.lastUpdate[key] = new Date().getTime();
    // console.log(`sync: ${key}`)
    syncD.startSync()
  },
  _saveLastUpdate() {
    try {
      wx.setStorageSync("lastUpdate", JSON.stringify(this.lastUpdate))
    } catch (error) {
    }
  },
  _changeConf() {
    this._changeLastUpdateKey("conf")
  },
  // 同步方法从本地获取数据
  getSyncData(key: string): string {
    if (key == 'conf') {
      const conf = {
        defBudget: wx.getStorageSync('defBudget'),
      }
      return JSON.stringify(conf)
    }
    return wx.getStorageSync(key)
  },
  // 同步方法更新本地数据
  setSyncData(key: string, v: string): boolean {
    if (key == "conf") {
      try {
        let conf = JSON.parse(v)
        let defBudget = parseFloat(conf.defBudget)
        if (isNaN(defBudget)) return false
        this.setDefBudget(defBudget, false)
      } catch (error) {
        return false
      }
    } else if (key == "tags") {
      this.setTagsStr(v, false)
    } else if (key == "installment") {
      this.setInstallment(v, false)
    } else if (key == "installmentC") {
      this.setInstallmentC(v, false)
    } else if (key.indexOf(this.monthDataHKey) == 0) {
      this.setMonthData(key.replace(this.monthDataHKey, ''), v, false)
    }
    return true
  }
}