import conf from './conf.js';
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
    const isEq = this.getDefBudget() == v
    wx.setStorageSync("defBudget", v)
    if (isSync && !isEq) this._changeConf()
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
  getTagsStr(): string {
    return wx.getStorageSync("tags")
  },
  getTags(def: any = null): any {
    try {
      return JSON.parse(this.getTagsStr())
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
    const isEq = this.getTagsStr() == v
    wx.setStorageSync("tags", v)
    if (isSync && !isEq) this._changeLastUpdateKey("tags")
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
  // 月数据
  monthDataHKey: "md-",
  getMonthDataStr(mdateStr: string,): string {
    return wx.getStorageSync(`${this.monthDataHKey}${mdateStr}`)
  },
  getMonthData(mdateStr: string, def: any = null): any {
    try {
      return JSON.parse(this.getMonthDataStr(mdateStr))
    } catch (error) {
      return def ? def : null
    }
  },
  setMonthData(mdateStr: string, v: any = null, isSync: boolean = true): any {
    const isEq = this.getMonthDataStr(mdateStr) == v
    const key = `${this.monthDataHKey}${mdateStr}`
    wx.setStorageSync(key, v)
    if (isSync && !isEq) this._changeLastUpdateKey(key)
  },
  removeMonthData(mdateStr: string) {
    wx.removeStorageSync(`${this.monthDataHKey}${mdateStr}`)
  },
  // 数据最后更新时间
  lastUpdate: <any>{
    // conf: 0,
    // tags: 0,
    // installment: 0,
    // 'md-*': 0
  },
  initLastUpdate() {
    this.lastUpdate = this.parseLastUpdate(wx.getStorageSync("lastUpdate"))
    this._initLastUpdateKey("conf")
    this._initLastUpdateKey("tags")
    this._initLastUpdateKey("installment")
    const keys = wx.getStorageInfoSync().keys
    let fKey = this.monthDataHKey
    keys.forEach(v => {
      if (v.indexOf(fKey) == -1) return
      this._initLastUpdateKey(v)
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
  _initLastUpdateKey(key: string, v: number = 0) {
    if (!isNaN(this.lastUpdate[key])) return
    this.lastUpdate[key] = v
  },
  _changeLastUpdateKey(key: string) {
    if(syncD.isSync) {
      this.lastUpdate[key] = new Date().getTime();
    }else {
      this._initLastUpdateKey(key)
    }
    // console.log(`_changeLastUpdateKey: ${key} ${this.lastUpdate[key]}`)
    this._saveLastUpdate()
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
    // console.log('getSyncData', key, wx.getStorageSync(key))
    return wx.getStorageSync(key)
  },
  // 同步方法更新本地数据
  setSyncData(key: string, v: string, t: number): boolean {
    // console.log('setSyncData', key, v, t)
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
    } else if (key.indexOf(this.monthDataHKey) == 0) {
      this.setMonthData(key.replace(this.monthDataHKey, ''), v, false)
    }
    this.lastUpdate[key] = t
    this._saveLastUpdate()
    return true
  }
}